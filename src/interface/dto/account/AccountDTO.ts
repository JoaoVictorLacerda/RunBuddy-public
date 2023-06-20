import Account from "../../../domain/account/Account";


export default class AccountDTO {
    uuid: string;
    name: string;
    email: string;
    birthDate: string;
    type: string;
    rules: string[];
    checked: boolean;
    recoverPassCode: string;
    telephone: string;
    cep: string;
    city: string;
    state: string;
    imageLink: string;

    constructor(account: Account) {
        this.uuid = account._id;
        this.name = account.name;
        this.email = account.email;
        this.birthDate = account.birthDate;
        this.type = account.type
        this.rules = account.rules;
        this.checked = account.checked;
        this.recoverPassCode = account.recoverPassCode;
        this.telephone = account.telephone;
        this.cep = account.cep;
        this.city = account.city;
        this.state = account.state;
        this.imageLink = account.imageLink;
    }

    public static converter(AccountList: Account[]): AccountDTO[] {
        if (AccountList.length != 0) {
            return AccountList.map((item) => new AccountDTO(item));
        }
        return undefined;
    }
}