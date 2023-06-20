import AssessmentRepository from "../../../infrastructure/repository/AssessmentRepository";
import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import AccountRepository from "../../../infrastructure/repository/AccountRepository";
import Assessment from "../../../domain/assessment/Assessment";
import AssessmentError from "../../exception/AssessmentError";
import TrainingRegistrationRepository from "../../../infrastructure/repository/TrainingRegistrationRepository";
import TrainingRegistration from "../../../domain/training/TrainingRegistration";

export default class AssessmentUseCase {
    private repository: AssessmentRepository;
    private logger:LoggerComponent;
    private accountRepository:AccountRepository;
    private trainingRegistrationRepository: TrainingRegistrationRepository;

    constructor() {
        this.repository = new AssessmentRepository();
        this.logger = new LoggerComponent(AssessmentUseCase.name);
        this.accountRepository = new AccountRepository();
        this.trainingRegistrationRepository = new TrainingRegistrationRepository();
    }

    public async create(advisorAssessment:Assessment){
        try {
            if(advisorAssessment.stars > 5)throw new AssessmentError("The max of star is 5")

            const [advisor, athlete, trainingRegistration, assessment] = await Promise.all([
                this.accountRepository.findByUuid(advisorAssessment.advisorUuid),
                this.accountRepository.findByUuid(advisorAssessment.athleteUuid),
                this.trainingRegistrationRepository.getTrainingsByAthlete(advisorAssessment.athleteUuid),
                this.repository.findByAthleteAndAdvisorUuid(advisorAssessment.athleteUuid, advisorAssessment.advisorUuid)
            ]);
            if(assessment){
                this.logger.warn("The athlete has already rated the advisor");
                throw new AssessmentError("The athlete has already rated the advisor")
            }
            if(!advisor || !athlete){
                this.logger.warn("Advisor or athlete not found");
                throw new AssessmentError("Advisor or athlete not found")
            }
            advisorAssessment.athleteCanComment = true;
            this.athleteCanCreateAssessment(trainingRegistration, advisorAssessment.advisorUuid);
            await this.repository.create(advisorAssessment);
            this.logger.info("Assessment create successfully",advisorAssessment);
            return "OK"

        }catch (error) {
            this.logger.error("Assessment create unsuccessfully",error.message);
            throw new AssessmentError(error.message);
        }
    }

    public async update(assessmentUuid:string, athleteUuid:string, newAdvisorAssessment:any){
        try {
            const result = await this.isAssessmentLegit(assessmentUuid, athleteUuid)

            if(result.athleteCanComment != undefined && result.athleteCanComment){
                this.logger.warn("Athlete cannot comment. Comment deleted by advisor");
                result.comment = newAdvisorAssessment.comment ? newAdvisorAssessment.comment : result.comment;
            }
            result.stars = newAdvisorAssessment.stars ? newAdvisorAssessment.stars : result.stars;

            if(result.stars > 5)throw new AssessmentError("The max of star is 5")

            await this.repository.update(result);
            this.logger.info("Assessment update successfully",result);
            return result
        }catch (error) {
            this.logger.error("Assessment update unsuccessfully",error.message);
            throw new AssessmentError(error.message);
        }
    }
    public async delete(assessmentUuid:string, athleteUuid:string){
        try {
            const result = await this.isAssessmentLegit(assessmentUuid, athleteUuid)

            await this.repository.delete(assessmentUuid);
            this.logger.info("Assessment update successfully",result);
            return "OK"
        }catch (error) {
            this.logger.error("Assessment update unsuccessfully",error.message);
            throw new AssessmentError(error.message);
        }
    }

    public async getCommentsAndStarsForAdvisor(advisorUuid:string){
        try {
            const result = await this.repository.findByAdvisorUuid(advisorUuid);
            this.logger.info("Assessment getAssessmentForAdvisor successfully",result);
            return result
        }catch (error) {
            this.logger.error("Assessment getAssessmentForAdvisor unsuccessfully",error.message);
            throw new AssessmentError(error.message);
        }
    }

    public async getAssessmentForAdvisor(advisorUuid:string):Promise<number>{
        try {
            const result:any[] = await this.repository.findByAdvisorUuid(advisorUuid);
            this.logger.info("Assessment getAssessmentForAdvisor successfully",result);
            return this.calculateStarts(result)

        }catch (error) {
            this.logger.error("Assessment getAssessmentForAdvisor unsuccessfully",error.message);
            throw new AssessmentError(error.message);
        }
    }
    public async getByAthleteAndAdvisorUuid(athleteUuid:string, advisorUuid:string):Promise<Assessment>{
        try{
            const assessment = await this.repository.findByAthleteAndAdvisorUuid(athleteUuid, advisorUuid);
            if(!assessment) throw new AssessmentError("Assessment not found");
            this.logger.info("Assessment getByAthleteAndAdvisorUuid successfully",assessment);
            return assessment;
        }catch (error){
            this.logger.error("Assessment getByAthleteAndAdvisorUuid unsuccessfully",error.message);
            throw new AssessmentError(error.message);
        }
    }

    private calculateStarts(advisorAssessmentList:Assessment[]):number{

        let sumOfStars = 0;
        advisorAssessmentList.forEach((element)=>{
            sumOfStars += element.stars;
        })
        return sumOfStars === 0 ? sumOfStars : (sumOfStars / advisorAssessmentList.length);
    }

    private athleteCanCreateAssessment(trainingRegistration:TrainingRegistration[], advisorUuid:any){
        for (let i = 0; i < trainingRegistration.length; i++) {
            const element:any = trainingRegistration[i];
            if(element.advisorUuid._id == advisorUuid){
                return true
            }
        }
        throw new AssessmentError("The athlete is not a student of the advisor")
    }

    private async isAssessmentLegit(assessmentUuid:string, athleteUuid:string){
        const result:Assessment = await this.repository.findByUuid(assessmentUuid);
        if(!result || result.athleteUuid != athleteUuid) throw new AssessmentError("The assessment is not from the athlete");

        return result;
    }
}