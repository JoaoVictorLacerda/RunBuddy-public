import AccountRepository from "../../../infrastructure/repository/AccountRepository";
import CloudinaryComponent from "../../../infrastructure/components/CloudinaryComponent";
import AssessmentRepository from "../../../infrastructure/repository/AssessmentRepository";
import TrainingRegistrationRepository from "../../../infrastructure/repository/TrainingRegistrationRepository";
import Account from "../../../domain/account/Account";
import AccountError from "../../exception/AccountError";
import AccountSpecificOperationsUseCase from "./AccountSpecificOperationsUseCase";
import EmailSenderComponent from "../../../infrastructure/components/EmailSenderComponent";
import TrainingRepository from "../../../infrastructure/repository/TrainingRepository";

export default class AccountDeleteCascadeUseCase{
    private accountRepository: AccountRepository;
    private cloudinaryComponent: CloudinaryComponent;
    private assessmentRepository: AssessmentRepository;
    private trainingRepository:TrainingRepository;
    private trainingRegistrationRepository: TrainingRegistrationRepository;
    private accountSpecificOperationsUseCase:AccountSpecificOperationsUseCase;
    private emailSenderComponent:EmailSenderComponent;

    constructor() {
        this.accountRepository = new AccountRepository();
        this.cloudinaryComponent = new CloudinaryComponent();
        this.assessmentRepository = new AssessmentRepository();
        this.trainingRegistrationRepository = new TrainingRegistrationRepository();
        this.accountSpecificOperationsUseCase = new AccountSpecificOperationsUseCase();
        this.emailSenderComponent = new EmailSenderComponent();
        this.trainingRepository = new TrainingRepository();
    }

    public async deleteCascade(email:string, password:string){
        try{
            const login = await this.accountSpecificOperationsUseCase.login(email, password);
            const account = login.account;
            let response ;
            if(account.type == "ADVISOR"){
                response= await this.deleteAdvisor(account);
            }else{
                response = await this.deleteAthlete(account);
            }
            this.emailSenderComponent.sender(email,"Atualização de status",`
            Caro senhor(a) ${account.name}, sentimos em dizer que sua conta e todos os dados ligado a ela foram deletados 💔
            <br>
            Caso queira voltar a ser um #RunBudder, basta refazer o cadastro. 😉😉
            <br>
            <i> Cordialmente, equipe RunBuddy </i>
            `)
            return response;
        }catch (error) {
            throw new AccountError(error.message)
        }
    }


    private async deleteAdvisor(advisor:Account){
        try{
            await Promise.all([
                this.cloudinaryComponent.deleteImage(`profile/${advisor._id}`),
                this.cloudinaryComponent.deleteFolder(`training/${advisor._id}`),
                this.assessmentRepository.deleteByAdvisor(advisor._id),
                this.trainingRegistrationRepository.deleteByAdvisor(advisor._id),
                this.trainingRepository.deleteByAdvisor(advisor._id)
            ])
            await this.accountRepository.delete(advisor._id);
            return advisor;
        }catch (error) {
            throw new AccountError(error.message);
        }
    }
    private async deleteAthlete(athlete:Account){
        try{

            await Promise.all([
                this.cloudinaryComponent.deleteImage(`profile/${athlete._id}`),
                this.assessmentRepository.deleteByAthlete(athlete._id),
                this.trainingRegistrationRepository.deleteByAthlete(athlete._id)
            ])
            await this.accountRepository.delete(athlete._id);
            return athlete;
        }catch (error) {
            throw new AccountError(error.message);
        }
    }
}