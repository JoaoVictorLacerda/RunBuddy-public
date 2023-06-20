import Login from "../../domain/account/Login";
import AccountDTO from "./account/AccountDTO";

export default class LoginDTO {
    token: string;
    refreshToken:string;
    account: AccountDTO

    constructor(login: Login) {
        this.token = login.token;
        this.refreshToken = login.account.refreshToken;
        this.account = new AccountDTO(login.account);

    }
    public static converter(loginList: Login[]): LoginDTO[] {
        if (loginList.length != 0) {
            return loginList.map((item) => new LoginDTO(item));
        }
        return undefined;
    }
}