import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import TrainingError from "../../exception/TrainingError";
import TrainingRegistrationRepository from "../../../infrastructure/repository/TrainingRegistrationRepository";
import TrainingPaginationAthlete from "../../../domain/training/TrainingPaginationAthlete";
import TrainingRegistration from "../../../domain/training/TrainingRegistration";
import AccountDTO from "../../../interface/dto/account/AccountDTO";
import TrainingDTO from "../../../interface/dto/TrainingDTO";
import TrainingUtil from "../../../infrastructure/util/TrainingUtil";
import AdvisorDTO from "../../../interface/dto/account/AdvisorDTO";

export default class TrainingRegistrationUseCase {
    private logger: LoggerComponent;
    private repository: TrainingRegistrationRepository;

    constructor() {
        this.logger = new LoggerComponent(TrainingRegistrationUseCase.name);
        this.repository = new TrainingRegistrationRepository();
    }

    public async getTrainingsOfAthlete(athleteUuid:any, isActive:boolean=true, size:any=10, page:any=1):Promise<TrainingPaginationAthlete>{
        try {
            if(size == 0) size = 1
            const result:TrainingRegistration[] = await this.repository.getTrainingsOfAthlete(athleteUuid, TrainingUtil.putDateFilters(isActive));
            const pagination = TrainingUtil.paginate(result, page, size);

            const trainingRegistrationPopulate =  pagination.map((registration:TrainingRegistration)=>{
                const object:any = {
                    _id: registration._id,
                    advisor: new AdvisorDTO(registration.advisorUuid),
                    training: new TrainingDTO(registration.trainingUuid)
                }
                return object;
            });
            return {
                pages: Math.floor(result.length / size),
                trainings: trainingRegistrationPopulate
            }

        }catch (error) {
            this.logger.error("getTrainingsOfAthlete with error", error);
            throw new TrainingError(error.message);
        }
    }

}