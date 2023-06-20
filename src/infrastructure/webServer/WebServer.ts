import { Express } from "express";
import os from "os";
import DotenvComponent from "../components/DotenvComponent";
import LoggerComponent from "../components/LoggerComponent";
import App from "./AppWebServer";
import MongoODM from "../odm/MongoODM";
import AccountRepository from "../repository/AccountRepository";
import CryptographyComponent from "../components/CryptographyComponent";
import Account from "../../domain/account/Account";
import AthleteSignUpTrainingJob from "../job/training/AthleteSignUpTrainingJob";
const logger = new LoggerComponent("Server");

class Server {

    private server: Express;

    constructor (){
        const app = new App();
        this.server = app.getApp();
    }
    public async startServer():Promise<void> {
        await MongoODM.connect(DotenvComponent.API_DATABASE_URL);
        await Server.createUserAdm();
        this.startJobs();
        this.server.listen(DotenvComponent.PORT, Server.showTheSystemInformation);
    }

    private static showTheSystemInformation():void {
        const arch = os.arch();
        const plataform = os.platform();
        const type = os.type();
        const mem = os.totalmem();
        const cpus = os.cpus();


        logger.info(`SERVICE RUNNING ON PORT: ${DotenvComponent.PORT}`);
        logger.info(`SO: ${type} ${plataform} ${arch}`);
        logger.info(`RAM: ${Math.floor(mem * (10 ** -9))} GB`);
        logger.info(`CORES: ${cpus.length}`);
        logger.info(`CPU: ${cpus[0].model}`);
    }
    private static async createUserAdm(): Promise<void>{
        const accountRepository = new AccountRepository()
        const userAdm:Account = {
            birthDate:"13/09/2001",
            password: CryptographyComponent.encrypt(DotenvComponent.USER_AMD_PASSWORD),
            rules: ["READ", "CREATE", "UPDATE", "DELETE", "ADM"],
            name: "User Adm",
            email: "user.adm@example.com.br",
            cep:"00000000",
            city:"--",
            state:"--",
            type:"ADVISOR",
            telephone:"--",

        }
        if(!await accountRepository.findByEmail(userAdm.email)){
            await accountRepository.create(userAdm);
        }
    }

    private startJobs(){
        new AthleteSignUpTrainingJob().startWork();
        logger.info("Jobs started successfully");
    }
}

new Server().startServer();