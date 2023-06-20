import RepositoryTemplate from "./template/RepositoryTemplate";
import TrainingSchema from "../schemas/TrainingSchema";

export default class TrainingRepository extends RepositoryTemplate{

    constructor() {
        super( TrainingSchema )
    }

    public async findByAdvisorUuid(advisorUuid:string,filterDate:any={ $gte: new Date() }){
        return await this.mongoModel.find({advisorUuid,startDate:filterDate});
    }

    public async findByAdvisorAndTrainingUuid(advisorUuid:string, trainingUuid:string) {
        return await this.mongoModel.findOne({_id: trainingUuid, advisorUuid:advisorUuid});
    }

    public async findByLocation(filter:any){
        return await this.mongoModel.find(filter).populate(["advisorUuid"]);
    }
    public async deleteByAdvisor(advisorUuid:string){
        return await this.mongoModel.deleteMany({advisorUuid})
    }
}