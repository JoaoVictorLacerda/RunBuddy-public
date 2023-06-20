export default abstract class Account {
    _id?: string;
    name: string;
    birthDate: string;
    telephone: string;
    email: string;
    password: string;
    type: string;
    cep: string;
    city: string;
    state: string;
    refreshToken?: string;
    rules?: string[];
    deletedAt?: Date;
    checked?: boolean;
    recoverPassCode?: string;
    imageLink?:string;
}

