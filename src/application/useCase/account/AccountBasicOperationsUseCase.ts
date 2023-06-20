import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import AccountRepository from "../../../infrastructure/repository/AccountRepository";
import Account from "../../../domain/account/Account";
import AccountError from "../../exception/AccountError";
import CryptographyComponent from "../../../infrastructure/components/CryptographyComponent";
import {v4} from "uuid";
import JWtComponent from "../../../infrastructure/components/JWTComponent";
import DotenvComponent from "../../../infrastructure/components/DotenvComponent";

export default class AccountBasicOperationsUseCase {
    private logger: LoggerComponent;
    private repository: AccountRepository;


    constructor(){
        this.logger = new LoggerComponent(AccountBasicOperationsUseCase.name);
        this.repository = new AccountRepository();
    }


    public async read(): Promise<Account[]> {

        try{

            this.logger.debug("Reading accounts");
            return await this.repository.read();
        }catch (error: any) {
            this.logger.error("Read with error", error);
            throw new AccountError(error.message)
        }
    }


    public async create(account: Account): Promise<Account> {
        try{
            this.logger.debug("Create Advisor on MondoDB")

            account.password = CryptographyComponent.encrypt(account.password);
            account.rules = ["READ", "CREATE", "UPDATE", "DELETE"];
            account.type = account.type.toUpperCase();
            account.checked = false;
            account.refreshToken = JWtComponent.generateToken(account, "365d", DotenvComponent.REFRESH_TOKEN_KEY)

            if(account.type === "ADVISOR" || account.type === "ATHLETE"){

                const uuid: string = await this.repository.create(account);
                if(uuid === undefined) {
                    throw new AccountError("Failure to create account");
                }
                this.logger.info("Success in create the account", { uuid } );
                return account;

            }else{
                throw new AccountError("Failure to create account. Sent a valid type");
            }
        }catch (e: any){
            this.logger.error("Failure to create account", e);
            throw new AccountError(e.message);
        }
    }

    public async delete(uuid: string): Promise<number> {
        try{
            this.logger.debug("Delete Account by uuid on MondoDB")
            const result = await this.repository.delete(uuid);
            this.logger.info("Success in Delete Account by uuid", { uuid } );
            return result.deletedCount;
        }catch (e: any){
            this.logger.error("Failure to Delete Account by uuid", e);
            throw new AccountError("Failure to Delete Account by uuid");
        }
    }

    public async update(uuid: string, newObject: any){
        try{
            const account:Account = await this.repository.findByUuid(uuid);
            account.name = newObject.name;
            account.cep = newObject.cep;
            account.city = newObject.city;
            account.state = newObject.state;
            account.telephone = newObject.telephone;
            await this.repository.update(account);

            return account;

        }catch (error) {
            throw new AccountError("Failure to update Account");
        }
    }

}