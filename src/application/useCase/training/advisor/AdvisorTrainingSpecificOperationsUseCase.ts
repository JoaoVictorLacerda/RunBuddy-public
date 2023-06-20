import LoggerComponent from "../../../../infrastructure/components/LoggerComponent";
import TrainingRepository from "../../../../infrastructure/repository/TrainingRepository";
import CloudinaryComponent from "../../../../infrastructure/components/CloudinaryComponent";
import Training from "../../../../domain/training/Training";
import TrainingError from "../../../exception/TrainingError";
import Account from "../../../../domain/account/Account";
import TrainingRegistrationRepository from "../../../../infrastructure/repository/TrainingRegistrationRepository";

import TrainingUtil from "../../../../infrastructure/util/TrainingUtil";
import TrainingDTO from "../../../../interface/dto/TrainingDTO";
import TrainingPaginationAdvisor from "../../../../domain/training/TrainingPaginationAdvisor";

export default class AdvisorTrainingSpecificOperationsUseCase {
    private logger: LoggerComponent;
    private repository: TrainingRepository;
    private cloudinaryComponent: CloudinaryComponent;
    private trainingAthleteRepository: TrainingRegistrationRepository;

    constructor() {
        this.logger = new LoggerComponent(AdvisorTrainingSpecificOperationsUseCase.name);
        this.repository = new TrainingRepository();
        this.cloudinaryComponent = new CloudinaryComponent();
        this.trainingAthleteRepository = new TrainingRegistrationRepository();
    }

    public async findAthletesIntoTraining(trainingUuid:string):Promise<Account[]>{
        try{
            const result = await this.trainingAthleteRepository.getAthletesOfTraining(trainingUuid);
            return result.map((athlete) => athlete.athleteUuid);
        }catch (error) {
            this.logger.error("findByAdvisorUuid with error", error.message);
            throw new TrainingError(error.message);
        }
    }

    public async findByAdvisor(uuid:any, isActive:boolean=true, size:any=10, page:any=1):Promise<TrainingPaginationAdvisor>{
        try{
            this.logger.debug("Getting all trainings of advisor");
            const filter = TrainingUtil.putDateFilters(isActive);
            const result: Training[] = await this.repository.findByAdvisorUuid(uuid,filter);

            const pagination = TrainingUtil.paginate(result, page, size);
            const trainingRegistrationPopulate =  pagination.map((training:Training)=>{
                const object:any = {
                    training: new TrainingDTO(training)
                }
                return object;
            });
            return {
                pages: Math.floor(result.length / size),
                trainings: trainingRegistrationPopulate
            }
        }catch (error) {
            this.logger.error("findByAdvisorUuid with error", error.message);
            throw new TrainingError(error.message);
        }
    }

    public async photoUpload(buffer:Buffer,advisorUuid:string,trainingUuid:string):Promise<Training>{
        try{
            const training:Training = await this.repository.findByAdvisorAndTrainingUuid(advisorUuid,trainingUuid);
            if(!training) throw new TrainingError("Not Found")
            const link:string = await this.cloudinaryComponent.uploadImage(buffer, `training/${advisorUuid}/${trainingUuid}`);
            training.imgLink = link;
            await this.repository.update(training)
            return training;
        }catch (error) {
            this.logger.error("upload photo with error", error.message);
            await this.cloudinaryComponent.deleteImage(`training/${advisorUuid}/${trainingUuid}`)
            throw new TrainingError(error.message);
        }
    }


    public async suspendedOrReactivateTraining(trainingUuid:string,advisorUuid:string, isActive:boolean):Promise<Training>{
        try {
            const training:Training = await this.repository.findByAdvisorAndTrainingUuid(advisorUuid,trainingUuid);
            if(!training) throw new TrainingError("Training not Found");
            training.isActive = isActive;
            training.trainingStatus = isActive ?"ACTIVE" : "SUSPENDED";
            await this.repository.update(training);
            return training;
        }catch (error) {
            this.logger.error("suspendedTraining with error", error.message);
            throw new TrainingError(error.message);
        }
    }


}