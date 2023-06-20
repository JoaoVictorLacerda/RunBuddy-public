import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import AccountRepository from "../../../infrastructure/repository/AccountRepository";
import EmailSenderComponent from "../../../infrastructure/components/EmailSenderComponent";
import Account from "../../../domain/account/Account";
import AccountError from "../../exception/AccountError";
import Login from "../../../domain/account/Login";
import CryptographyComponent from "../../../infrastructure/components/CryptographyComponent";
import JWtComponent from "../../../infrastructure/components/JWTComponent";
import DotenvComponent from "../../../infrastructure/components/DotenvComponent";

export default class AccountSpecificOperationsUseCase {
    private logger: LoggerComponent;
    private repository: AccountRepository;
    private emailSenderComponent: EmailSenderComponent;

    constructor(){
        this.logger = new LoggerComponent(AccountSpecificOperationsUseCase.name);
        this.repository = new AccountRepository();
        this.emailSenderComponent = new EmailSenderComponent();
    }

    public async findByUuid(uuid: string): Promise<Account> {
        try{
            this.logger.debug("Find Account by uuid on MondoDB")
            const account: Account = await this.repository.findByUuid(uuid);
            this.logger.info("Success in find Account by uuid", { uuid } );
            return account;
        }catch (e: any){
            this.logger.error("Failure to find Account by uuid", e);
            throw new AccountError("Failure to find Account by uuid");
        }
    }

    public async findByEmail(email: string): Promise<Account> {
        try{
            this.logger.debug("Find Account by email on MondoDB")
            const account: Account = await this.repository.findByEmail(email);
            this.logger.info("Success in find Account by email", { email } );
            return account;
        }catch (e: any){
            this.logger.error("Failure to find Account by email", e);
            throw new AccountError("Failure to find Account by email");
        }
    }

    public async findByAccountType(type: string): Promise<Account[]> {

        try{
            if(type === "ADVISOR" || type === "ATHLETE"){

                this.logger.info("Success in find Account by type", { type } );
                return await this.repository.findByAccountType(type);

            }else{
                throw new AccountError("Failure to find account. Sent a valid type");
            }
        }catch (e) {
            this.logger.error("Failure to find Account by email", e);
            throw new AccountError(e.message);
        }
    }

    public async login(email: string, password: string):Promise<Login>{
        try{
            this.logger.debug("Making login to advisor");
            return await this.authenticate(email, password)
        }catch (error: any) {
            this.logger.error("Login to advisor with error", error);
            throw new AccountError("Login not found")
        }
    }

    private async authenticate(email: string, password: string):Promise<Login>{
        try{
            const account = await this.findByEmail(email);

            if(account){
                const validatePass = CryptographyComponent.decrypt(account.password);
                if( password === validatePass){

                    return {
                        token: JWtComponent.generateToken(account),
                        account: account
                    };
                }
            }
            throw new Error("Login not found");
        }catch (error: any) {
            this.logger.error("Login with error", error);
            throw error;
        }
    }

    public async accountDesative(uuid:string):Promise<boolean>{
        try {
            const account: Account = await this.repository.findByUuid(uuid);
            account.deletedAt = new Date();
            await this.repository.update(account);
            return true;
        }catch (error) {
            throw new AccountError(error.message);
        }
    }

    public async refreshToken(accountUuid:string, refreshToken:string):Promise<Login>{
        try{

            const [token, account] = await Promise.all([
                JWtComponent.decodeToken(refreshToken, DotenvComponent.REFRESH_TOKEN_KEY),
                this.repository.findByUuid(accountUuid)
            ])
            if(!token || !account) throw new AccountError("Not authorized");
            return {
                token: JWtComponent.generateToken(account),
                account: account
            };
        }catch (error) {
            this.logger.error("Refresh token with error", error);
            throw new AccountError(error.message)
        }
    }

}