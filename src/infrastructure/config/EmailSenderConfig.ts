import DotenvComponent from "../components/DotenvComponent";
import sgMail from "@sendgrid/mail";

export default class EmailSenderConfig{
    private transporter: any;

    constructor() {
        this.transporter = sgMail.setApiKey(DotenvComponent.TWILIO_EMAIL_API_KEY);
    }

    public getTransporter():any{
        return this.transporter;
    }
}