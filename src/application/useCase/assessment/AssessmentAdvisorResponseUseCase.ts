import AssessmentRepository from "../../../infrastructure/repository/AssessmentRepository";
import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import AccountRepository from "../../../infrastructure/repository/AccountRepository";
import Assessment from "../../../domain/assessment/Assessment";
import AssessmentError from "../../exception/AssessmentError";
import TrainingRegistrationRepository from "../../../infrastructure/repository/TrainingRegistrationRepository";
import TrainingRegistration from "../../../domain/training/TrainingRegistration";

export default class AssessmentAdvisorResponseUseCase {
    private repository: AssessmentRepository;
    private logger:LoggerComponent;
    private accountRepository:AccountRepository;
    private trainingRegistrationRepository: TrainingRegistrationRepository;

    constructor() {
        this.repository = new AssessmentRepository();
        this.logger = new LoggerComponent(AssessmentAdvisorResponseUseCase.name);
        this.accountRepository = new AccountRepository();
        this.trainingRegistrationRepository = new TrainingRegistrationRepository();
    }

    public async responseAssessment(advisorUuid:string, assessmentUuid:string, response:string):Promise<Assessment>{
        try{
            const [account, assessment] = await Promise.all([
                this.accountRepository.findByUuid(advisorUuid),
                this.repository.findByAdvisorUuidAndAssessment(advisorUuid,assessmentUuid)
            ]);
            if(!account) throw new AssessmentError("Advisor not found");
            if(advisorUuid != assessment.advisorUuid._id) throw new AssessmentError("Assessment is not from the advisor");
            if(!assessment.athleteCanComment) throw new AssessmentError("Assessment is deleted. Nothing to response")

            assessment.advisorResponseComment = response;
            await this.repository.update(assessment);
            this.logger.info("Response registered successfully",assessment);
            return assessment;
        }catch (error) {
            this.logger.error("Response registered unsuccessfully",error.message);
            throw new AssessmentError(error.message);
        }
    }

    public async deleteAthleteComment(advisorUuid:string, assessmentUuid:string):Promise<Assessment>{
        try {
            const [account, assessment] = await Promise.all([
                this.accountRepository.findByUuid(advisorUuid),
                this.repository.findByAdvisorUuidAndAssessment(advisorUuid,assessmentUuid)
            ]);
            if(!account) throw new AssessmentError("Advisor not found");
            if(advisorUuid != assessment.advisorUuid._id) throw new AssessmentError("Assessment is not from the advisor");

            assessment.comment = undefined;
            assessment.athleteCanComment = false
            this.logger.info("AthleteComment deleted successfully",assessment);
            await this.repository.update(assessment);
            return assessment
        }catch (error){
            this.logger.error("AthleteComment deleteAthleteComment unsuccessfully",error.message);
            throw new AssessmentError(error.message);
        }
    }
}