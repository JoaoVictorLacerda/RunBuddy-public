import RepositoryTemplate from "./template/RepositoryTemplate";
import AccountSchema from "../schemas/AccountSchema";

export default class AccountRepository extends RepositoryTemplate{
    constructor() {
        super( AccountSchema );
    }

    public async findByEmail(email: string){
        return await this.mongoModel.findOne({ email: email, deletedAt: undefined });
    }
    public async findByAccountType(type: string){
        return await this.mongoModel.find({ type:type, deletedAt: undefined });
    }
}