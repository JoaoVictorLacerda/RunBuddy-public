import RepositoryTemplate from "./template/RepositoryTemplate";
import TrainingRegistrationSchema from "../schemas/TrainingRegistrationSchema";
import TrainingRegistration from "../../domain/training/TrainingRegistration";

export default class TrainingRegistrationRepository extends RepositoryTemplate{

    constructor() {
        super( TrainingRegistrationSchema )
    }

    public async getAthletesOfTraining(trainingUuid:string):Promise<TrainingRegistration[]>{
        return await this.mongoModel.find({trainingUuid, isActive:true}).populate(["athleteUuid"])
    }
    public async getTrainingsOfAthlete(athleteUuid:string,filterDate:any={ $gte: new Date() }):Promise<TrainingRegistration[]>{
        return await this.mongoModel.find({athleteUuid, isActive:true,expiresOn:filterDate}).populate(["trainingUuid", "advisorUuid"])
    }

    public async getTrainingsByAthlete(athleteUuid:string):Promise<TrainingRegistration[]>{
        return await this.mongoModel.find({athleteUuid, isActive:true}).populate(["advisorUuid"])
    }

    public async getTrainingsOfAdvisor(advisorUuid:string,filterDate:any={ $gte: new Date() }):Promise<TrainingRegistration[]>{
        return await this.mongoModel.find({advisorUuid, isActive:true,expiresOn:filterDate}).populate(["trainingUuid","athleteUuid"])
    }

    public async isAthleteSignUp(trainingUuid:string, athleteUuid:string):Promise<TrainingRegistration>{
        return await this.mongoModel.findOne({trainingUuid,athleteUuid})
    }

    public async deleteByAdvisor(advisorUuid:string){
        return await this.mongoModel.deleteMany({advisorUuid})
    }

    public async deleteByAthlete(athleteUuid:string){
        return await this.mongoModel.deleteMany({athleteUuid})
    }

}