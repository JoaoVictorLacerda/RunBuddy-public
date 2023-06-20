import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import AccountRepository from "../../../infrastructure/repository/AccountRepository";
import EmailSenderComponent from "../../../infrastructure/components/EmailSenderComponent";
import Account from "../../../domain/account/Account";
import JWtComponent from "../../../infrastructure/components/JWTComponent";
import DotenvComponent from "../../../infrastructure/components/DotenvComponent";
import AccountError from "../../exception/AccountError";

export default class AccountEmailVerifyUseCase {

    private logger: LoggerComponent;
    private repository: AccountRepository;
    private emailSenderComponent: EmailSenderComponent;

    constructor(){
        this.logger = new LoggerComponent(AccountEmailVerifyUseCase.name);
        this.repository = new AccountRepository();
        this.emailSenderComponent = new EmailSenderComponent();
    }

    public async sendEmail(account:Account){
        try {
            const link = this.generateLink(account);
            const result = await this.emailSenderComponent
                .sender(account.email,
                    "Verificar sua conta no RunBuddy",
                    `<p>Olá, <a href="${link}">clique aqui </a> 
                                 para ativar a sua conta no aplicativo RunBuddy.
                            </p>`);

            this.logger.info("Email sent:  "+result);
            return result;
        }catch (error) {
            this.logger.error("Failure to send email", error);
            throw new AccountError("Failure to send email");
        }
    }

    public async verify(token:string):Promise<Account> {
        try {
            const data = await JWtComponent.decodeToken(token, DotenvComponent.API_JWT_KEY_ACCOUNT_VERIFY);
            const account = await this.repository.findByUuid(data._id);
            if(account.checked){
                throw new AccountError("Account is already active")
            }
            await this.updateChecked(account);

            this.logger.debug("verified");
            return account;
        }catch (error) {

            this.logger.error("Verified not ok", error);
            throw new AccountError(error.message)
        }
    }


    public async isVerified(uuid: string):Promise<Account> {
        try {
            const account = await this.repository.findByUuid(uuid);
            this.logger.debug("verified");
            return account;
        }catch (error) {
            this.logger.error("Verified not ok", error);
            throw new AccountError(error.message)
        }
    }

    public async updateChecked(account: Account): Promise<Account> {
        try{
            this.logger.debug("Create Advisor on MondoDB")
            account.checked = true;
            await this.repository.update(account);
            return account;
        }catch (error: any){
            this.logger.error("Failure to create account", error);
            throw new AccountError("Failure to create account");
        }
    }

    public async accountActivate(account: Account): Promise<Account> {
        try{
            this.logger.debug("Create Advisor on MondoDB")
            account.checked = undefined;
            await this.repository.update(account);
            return account;
        }catch (error: any){
            this.logger.error("Failure to create account", error);
            throw new AccountError("Failure to create account");
        }
    }

    private generateLink(account: Account):string {
        try {

            this.logger.debug("Generate link from user", account);
            const token = JWtComponent.generateToken(account,"10m", DotenvComponent.API_JWT_KEY_ACCOUNT_VERIFY);
            const baseUrl = DotenvComponent.BASE_URL+"/account-verify/"+token;
            return baseUrl;
        }catch (error) {
            this.logger.error("Generate link from user with error", error);
            throw new AccountError(error.message)
        }
    }
}