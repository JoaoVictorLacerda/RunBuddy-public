import Account from "../../../domain/account/Account";
import Training from "../../../domain/training/Training";
import EmailSenderComponent from "../../components/EmailSenderComponent";
import TrainingError from "../../../application/exception/TrainingError";

export default class AthleteSignUpTrainingJobUtil {
    private emailSender:EmailSenderComponent;

    constructor() {
        this.emailSender = new EmailSenderComponent();
    }


    public async trainingIsFull(trainingData:Training, athleteData:Account){

        const vacacies = trainingData.vacancies;
        if(vacacies === 0){
            trainingData.trainingStatus = "FULL"
            await this.sendEmailTrainingIsFull(athleteData.email, athleteData, trainingData);
            throw new TrainingError("Training is full")
        }
    }

    public async sendEmailTrainingProblem(athleteEmail: string, athleteData: Account, trainingData:Training){
        await this.sendEmail(athleteEmail,
            `<h3>Caro senhor(a) ${athleteData.name}, houve um problema na sua inscrição para o treino: <i>${trainingData.name}</i>.</h3>
                     <br>
                     Tente novamente mais tarde. 😉`
        )
    }

    public async sendEmailTrainingConfirmedRegistration(athleteEmail: string, athleteData: Account, trainingData:Training){
        await this.sendEmail(athleteEmail,
            `<h3>Caro senhor(a) ${athleteData.name}, sua inscrição para o treino <i>${trainingData.name}</i> foi confirmada 😉 </h3>`
        )
    }

    private async sendEmailTrainingIsFull(athleteEmail: string, athleteData: Account, trainingData:Training){
        await this.sendEmail(athleteEmail,
            `
                        <h3>Caro senhor(a) ${athleteData.name} , o treino <i>${trainingData.name}</i> está cheio no momento 😢.</h3>
                        <br>
                        A qualquer momento pode surgir novas vagas para o treino. Fique ligado 😉`
        )
    }
    private async sendEmail(athleteEmail: string, message:string){
        const subject = "RunBuddy: Inscrição de treino";
        await this.emailSender.sender(athleteEmail,subject, message);
    }
}