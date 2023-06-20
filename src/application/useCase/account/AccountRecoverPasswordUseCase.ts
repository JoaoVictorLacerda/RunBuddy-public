import Account from "../../../domain/account/Account";
import AccountError from "../../exception/AccountError";
import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import AccountRepository from "../../../infrastructure/repository/AccountRepository";
import EmailSenderComponent from "../../../infrastructure/components/EmailSenderComponent";
import CryptographyComponent from "../../../infrastructure/components/CryptographyComponent";
import JWtComponent from "../../../infrastructure/components/JWTComponent";
import Login from "../../../domain/account/Login";


export default class AccountRecoverPasswordUseCase {
    private logger: LoggerComponent;
    private repository: AccountRepository;
    private emailSenderComponent: EmailSenderComponent;

    constructor(){
        this.logger = new LoggerComponent(AccountRecoverPasswordUseCase.name);
        this.repository = new AccountRepository();
        this.emailSenderComponent = new EmailSenderComponent();
    }
    public async saveCodeIntoAccount(email: string): Promise<string> {
        try {
            const account:Account = await this.repository.findByEmail(email);
            const code = this.generateCode();
            account.recoverPassCode = code;
            await this.repository.update(account);
            return code;
        }catch (error) {
            this.logger.error("Failure to recover password. Verify email", error);
            throw new AccountError(error.message);
        }
    }

    public async isCodeOfEmail(email: string, code: string): Promise<Account> {
        try{
            const account:Account = await this.repository.findByEmail(email);
            if(account.recoverPassCode === code) return account;
            return undefined;
        }catch (error) {
            this.logger.error("Failure to check isCodeOfEmail. Verify email", error);
            throw new AccountError(error.message);
        }
    }
    public async updatePassword(email: string, newPassword: string):Promise<Login>{
        try{
            const account: Account = await this.repository.findByEmail(email);
            account.password = CryptographyComponent.encrypt(newPassword);
            account.recoverPassCode = undefined
            await this.repository.update(account);
            return {
                token: JWtComponent.generateToken(account),
                account: account
            };
        }catch (error) {
            this.logger.error("Failure to update password.", error);
            throw new AccountError(error.message);
        }

    }

    public async sendEmail(email: string, code: string): Promise<boolean>{
        try {
            const result = await this.emailSenderComponent
                .sender(email,
                    "Verificar sua conta no RunBuddy",
                    `<p>Olá, aqui está seu código de recuração de senha: <h3>${code}</h3>
                            </p>`);

            this.logger.info("Email sent:  "+result);
            return result;
        }catch (error) {
            this.logger.error("Failure to send email", error);
            throw new AccountError("Failure to send email");
        }
    }

    private generateCode(): string{
        let code = '';
        const size = 6;
        for (let i = 0; i < size; i++) {
            code += Math.floor(Math.random() * 10);
        }
        return code;
    }
}