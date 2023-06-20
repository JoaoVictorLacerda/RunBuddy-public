import RepositoryTemplate from "./template/RepositoryTemplate";
import AssessmentSchema from "../schemas/AssessmentSchema";

export default class AssessmentRepository extends RepositoryTemplate{

    constructor() {
        super( AssessmentSchema )
    }

    public async findByAthleteAndAdvisorUuid(athleteUuid:string,advisorUuid:string ){
        return await this.mongoModel.findOne({athleteUuid,advisorUuid}).populate(["athleteUuid","advisorUuid"]);
    }
    public async findByAdvisorUuid(advisorUuid:string){
        return await this.mongoModel.find({advisorUuid}).populate(["athleteUuid","advisorUuid"]);
    }

    public async findByAdvisorUuidAndAssessment(advisorUuid:string, assessmentUuid:string){
        return await this.mongoModel.findOne({_id: assessmentUuid, advisorUuid: advisorUuid}).populate(["athleteUuid","advisorUuid"]);
    }

    public async deleteByAdvisor(advisorUuid:string){
        return await this.mongoModel.deleteMany({advisorUuid})
    }
    public async deleteByAthlete(athleteUuid:string){
        return await this.mongoModel.deleteMany({athleteUuid})
    }

}