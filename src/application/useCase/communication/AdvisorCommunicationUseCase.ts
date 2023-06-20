import TrainingRegistrationRepository from "../../../infrastructure/repository/TrainingRegistrationRepository";
import EmailSenderComponent from "../../../infrastructure/components/EmailSenderComponent";
import AdvisorCommunicationError from "../../exception/AdvisorCommunicationError";
import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import AccountRepository from "../../../infrastructure/repository/AccountRepository";

export default class AdvisorCommunicationUseCase {
    private trainingRegistrationRepository: TrainingRegistrationRepository;
    private emailSenderComponent:EmailSenderComponent;
    private logger:LoggerComponent;
    private accountRepository:AccountRepository;
    constructor() {
        this.trainingRegistrationRepository = new TrainingRegistrationRepository();
        this.emailSenderComponent = new EmailSenderComponent();
        this.logger = new LoggerComponent(AdvisorCommunicationUseCase.name);
        this.accountRepository = new AccountRepository();
    }
    public async sendEmailSuitecase(message:string,trainingUuid:string, advisorUuid:string){
        try{
            const [trainingRegistrationList, advisor]= await Promise.all([
                this.trainingRegistrationRepository.getAthletesOfTraining(trainingUuid),
                this.accountRepository.findByUuid(advisorUuid)
            ])
            const emails = this.getEmails(trainingRegistrationList);
            this.sendEmail(emails,message, advisor.name);
            this.logger.info("emails send successfully")
            return true;
        }catch (error) {
            this.logger.info("emails send unsuccessfully")
            throw new AdvisorCommunicationError(error.message);
        }
    }

    public async sendEmailDirect(message:string,advisorUuid:string,athleteEmail:string, trainingUuid:string){
        try{
            const athlete = await this.accountRepository.findByEmail(athleteEmail);

            const [trainingRegistration, advisor]= await Promise.all([
                this.trainingRegistrationRepository.isAthleteSignUp(trainingUuid,athlete._id),
                this.accountRepository.findByUuid(advisorUuid)
            ])
            const advisorOfTraining:any = trainingRegistration.advisorUuid
            if(advisorOfTraining != advisorUuid) throw new AdvisorCommunicationError("The training is not from the advisor");
            const emails = [athleteEmail]
            this.sendEmail(emails,message, advisor.name);
            this.logger.info("emails send successfully")
            return true;
        }catch (error) {
            this.logger.info("emails send unsuccessfully")
            throw new AdvisorCommunicationError(error.message);
        }
    }

    private getEmails(trainingRegistrationList:any[]){
        const emailList:any = []
        trainingRegistrationList.forEach((element)=>{
            const email = element.athleteUuid.email;
            emailList.push(email);
        })
        return emailList;
    }
    private sendEmail(emails:string[], message:string, advisorName:string){
        emails.forEach((email)=>{
            this.emailSenderComponent.sender(email,`RunBuddy: ${advisorName.charAt(0).toUpperCase() + advisorName.slice(1)} está mandando uma mensagem`,message);
        })
    }
}