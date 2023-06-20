import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import AccountError from "../../exception/AccountError";
import AccountRepository from "../../../infrastructure/repository/AccountRepository";
import Account from "../../../domain/account/Account";
import CloudinaryComponent from "../../../infrastructure/components/CloudinaryComponent";

export default class AccountPhotoUploadUseCase {
    private logger: LoggerComponent;
    private repository: AccountRepository;
    private cloudinaryComponent: CloudinaryComponent;

    constructor(){
        this.logger = new LoggerComponent(AccountPhotoUploadUseCase.name);
        this.repository = new AccountRepository();
        this.cloudinaryComponent = new CloudinaryComponent();

    }

    public async uploadPhoto(buffer: Buffer, accountUuid:string): Promise<Account>{
        try{

            const [account, imageLink] = await Promise.all([
                this.repository.findByUuid(accountUuid),
                await this.cloudinaryComponent.uploadImage(buffer, "profile/"+accountUuid)
            ])
            account.imageLink = imageLink;
            await this.repository.update(account);
            return account;
        }catch (error) {
            this.logger.error("Failure to add image", error.message);
            throw new AccountError(error.message);
        }
    }



}