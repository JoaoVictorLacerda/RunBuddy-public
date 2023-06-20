import Account from "../../../domain/account/Account";

export default class AthleteDTO{
    name: string;
    email:string;
    imageLink:string;

    constructor(account: Account) {
        this.name = account.name;
        this.email = account.email;
        this.imageLink = account.imageLink;
    }
}