import EmailSenderConfig from "../config/EmailSenderConfig";
import DotenvComponent from "./DotenvComponent";

export default class EmailSenderComponent{
    private emailSenderConfig: EmailSenderConfig;
    constructor() {
        this.emailSenderConfig=new EmailSenderConfig();
    }

    public async sender(to: string, subject: string,message:string): Promise<boolean>{
        const mailOptions = {
            from: DotenvComponent.EMAIL,
            to: to,
            subject: subject,
            html: message
        };
        try{
            await this.emailSenderConfig.getTransporter().send(mailOptions)
            return true
        }catch (error) {
            throw error;
        }
    }
}