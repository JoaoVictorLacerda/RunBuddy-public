import LoggerComponent from "../../../../infrastructure/components/LoggerComponent";
import TrainingRepository from "../../../../infrastructure/repository/TrainingRepository";
import Training from "../../../../domain/training/Training";
import TrainingError from "../../../exception/TrainingError";
import AccountRepository from "../../../../infrastructure/repository/AccountRepository";

export default class AdvisorTrainingBasicOperationsUseCase{
    private logger: LoggerComponent;
    private repository: TrainingRepository;
    private accountRepository:AccountRepository;

    constructor() {
        this.logger = new LoggerComponent(AdvisorTrainingBasicOperationsUseCase.name);
        this.repository = new TrainingRepository();
        this.accountRepository=new AccountRepository();
    }

    public async read(): Promise<Training[]> {
        try{
            this.logger.debug("Reading training");
            return await this.repository.read();
        }catch (error) {
            this.logger.error("Read with error", error);
            throw new TrainingError(error.message);
        }
    }

    public async create(training:Training): Promise<Training> {
        try{
            this.logger.debug("Create training");
            const account = await this.accountRepository.findByUuid(training.advisorUuid);
            if(!account){
                throw new TrainingError("Advisor not found")
            }
            const dateLimitDate = training.limitDateRegistration.split("/");
            const dateStartDate = training.startDate.split("/");

            training.limitDateRegistration = new Date(`${dateLimitDate[2]}-${dateLimitDate[1]}-${dateLimitDate[0]}T${training.startHour}:00`)
            training.startDate = new Date(`${dateStartDate[2]}-${dateStartDate[1]}-${dateStartDate[0]}T${training.startHour}:00`)
            training.isActive = true;

            const result = await this.repository.create(training);
            this.logger.debug("Successfully in create training", {result});
            return training;
        }catch (error) {
            this.logger.error("Create with error", error);
            throw new TrainingError(error.message);
        }
    }

    public async updateTraining(training:Training, advisorUuid:string, trainingUuid:string):Promise<Training> {
        try{
            const dateLimitDate = training.limitDateRegistration.split("/");
            const dateStartDate = training.startDate.split("/");
            const result:Training = await this.repository.findByAdvisorAndTrainingUuid(advisorUuid,trainingUuid);
            if(!result) throw new TrainingError("Not Found")
            result.name = training.name
            result.vacancies = training.vacancies
            result.description=training.description
            result.limitDateRegistration=training.limitDateRegistration;
            result.startDate=training.startDate;
            result.startHour=training.startHour;
            result.limitDateRegistration = new Date(`${dateLimitDate[2]}-${dateLimitDate[1]}-${dateLimitDate[0]}T${training.startHour}:00`)
            result.startDate = new Date(`${dateStartDate[2]}-${dateStartDate[1]}-${dateStartDate[0]}T${training.startHour}:00`)

            await this.repository.update(result);
            return result;
        }catch (error) {
            this.logger.error("Update with error", error);
            throw new TrainingError(error.message);
        }
    }



}