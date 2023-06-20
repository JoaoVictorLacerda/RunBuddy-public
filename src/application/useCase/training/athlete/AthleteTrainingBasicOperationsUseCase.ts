import LoggerComponent from "../../../../infrastructure/components/LoggerComponent";
import TrainingRepository from "../../../../infrastructure/repository/TrainingRepository";
import AccountRepository from "../../../../infrastructure/repository/AccountRepository";
import TrainingError from "../../../exception/TrainingError";
import Training from "../../../../domain/training/Training";
import TrainingRegistrationRepository from "../../../../infrastructure/repository/TrainingRegistrationRepository";
import AthleteSignUpTrainingQueue from "../../../../infrastructure/job/training/AthleteSignUpTrainingJobQueue";
import TrainingSize from "../../../../domain/training/TrainingPaginationAthlete";
import TrainingUtil from "../../../../infrastructure/util/TrainingUtil";
import TrainingRegistration from "../../../../domain/training/TrainingRegistration";
import AdvisorDTO from "../../../../interface/dto/account/AdvisorDTO";
import TrainingDTO from "../../../../interface/dto/TrainingDTO";
import TrainingPaginationAthlete from "../../../../domain/training/TrainingPaginationAthlete";
import Account from "../../../../domain/account/Account";

export default class AthleteTrainingBasicOperationsUseCase{

    private logger: LoggerComponent;
    private repository: TrainingRepository;
    private accountRepository:AccountRepository;
    private trainingAthleteRepository:TrainingRegistrationRepository;
    private queue:AthleteSignUpTrainingQueue;

    constructor() {
        this.logger = new LoggerComponent(AthleteTrainingBasicOperationsUseCase.name);
        this.repository = new TrainingRepository();
        this.accountRepository=new AccountRepository();
        this.trainingAthleteRepository = new TrainingRegistrationRepository();
        this.queue = AthleteSignUpTrainingQueue.getInstance();
    }

    public async signUp(trainingUuid:string, athleteUuid:string):Promise<string>{
        try {
            await this.canSignUp(trainingUuid, athleteUuid); // if cant sign up the method thrpw error
            return await this.dispatchToBullMQ(trainingUuid, athleteUuid);
            return ""

        } catch (error) {
            this.logger.error("signUp with error", error);
            throw new TrainingError(error.message);
        }  
    }
    public async readTrainings(filter:any, size:any=10, page:any=1):Promise<TrainingPaginationAthlete>{
        try {
            const query = this.putFilters(filter);
            const result:any[] = await this.repository.findByLocation(query);
            const pagination = TrainingUtil.paginate(result, page, size);

            const trainingPopulate =  pagination.map((training:Training)=>{
                const advisor:any = training.advisorUuid;
                training.advisorUuid = advisor._id;
                const object:any = {
                    _id: training._id,
                    advisor: new AdvisorDTO(advisor),
                    training: new TrainingDTO(training)
                }
                return object;
            });
            return {
                pages: Math.floor(result.length / size),
                trainings: trainingPopulate
            }
        }catch (error) {
            this.logger.error("readTrainings with error", error);
            throw new TrainingError(error.message);
        }
    }

    private putFilters(filter:any){
        const query:any = {
            $or:[],
            startDate:{ $gte: new Date() }
        }
        if(filter.city) query["$or"].push({"startAddress.city": {$regex: new RegExp(filter.city, "i")}});
        if(filter.cep) query["$or"].push({"startAddress.cep": filter.cep});
        if(query["$or"].length === 0) return {startDate:{ $gte: new Date() }};

        return query;
    }

    private async dispatchToBullMQ(trainingUuid:string, athleteUuid:string){
        const queue = this.queue.getQueue()
        const data:any = { trainingUuid, athleteUuid }
        const job = await queue.add("AthleteSignUp",data);
        return job.id;
    }

    private async canSignUp(trainingUuid:string, athleteUuid:string){

        const training:Training = await this.repository.findByUuid(trainingUuid);
        const isAthleteSignUp = await this.trainingAthleteRepository.isAthleteSignUp(trainingUuid, athleteUuid);
        const limitDateRegistration = training.limitDateRegistration

        if(new Date() > limitDateRegistration) throw new TrainingError("The training is expired");
        if(!training.isActive) throw new TrainingError("Training is suspended");
        if(isAthleteSignUp) throw new TrainingError("Athlete is already enrolled in training");
        if(training.vacancies === 0) throw new TrainingError("Traning is full");
        if(!training) throw new TrainingError("training not found");

        return "OK"
    }
}