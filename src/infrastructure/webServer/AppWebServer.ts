import  { Express } from "express";
import cors from "cors";

import HealthCheckController from "../../interface/controller/HealthCheckController";
import {
    BearerTokenJWT,
    Description,
    ExpressInitializer, SwaggerEndpoint,
    SwaggerInitializer, Theme, ThemesType,
    Title,
    Version
} from "express-swagger-autoconfigure";
import AccountEmailVerifyController from "../../interface/controller/account/AccountEmailVerifyController";
import AccountBasicOperationsController from "../../interface/controller/account/AccountBasicOperationsController";
import AccountSpecificOperationsAccountController from "../../interface/controller/account/AccountSpecificOperationsAccountController";
import AccountRecoverPasswordController from "../../interface/controller/account/AccountRecoverPasswordController";
import rateLimit from "express-rate-limit";
import AdvisorTrainingBasicOperationsController from "../../interface/controller/training/advisor/AdvisorTrainingBasicOperationsController";
import AdvisorTrainingSpecificOperationsController from "../../interface/controller/training/advisor/AdvisorTrainingSpecificOperationsController";
import AthleteTrainingBasicOperationsController from "../../interface/controller/training/athlete/AthleteTrainingBasicOperationsController";
import AthleteTrainingSpecifcOperationsController
    from "../../interface/controller/training/athlete/AthleteTraingSpecificOperationsController";
import AssessmentController from "../../interface/controller/assessment/AssessmentController";
import AssessmentAdvisorResponseController
    from "../../interface/controller/assessment/AssessmentAdvisorResponseController";
import AdvisorCommunicationController from "../../interface/controller/communication/AdvisorCommunicationController";

@SwaggerInitializer
@SwaggerEndpoint("/doc")
@Description("Essa api é responsável pela estrutura backend do projeto RunBuddy")
@Title("RunBuddy")
@Version("1.0.0")
@BearerTokenJWT(true)
@Theme(ThemesType.MATERIAL)
export default class App {

    @ExpressInitializer
    private app: Express;

    constructor () {
        this.configApp();
        this.initControllers();
    }

    private configApp():void {
        this.app.use( cors() );

        const limiterDDOS = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 300, // limit each IP to 300 requests per windowMs
            message: "Too many requests, please try again later"
        })
        this.app.use(limiterDDOS)
    }

    private initControllers(){
        this.initAccountControllers();
        this.initTraningControllers();
        new HealthCheckController();
        new AssessmentController();
        new AssessmentAdvisorResponseController();
        new AdvisorCommunicationController();
    }
    private initAccountControllers(){
        new AccountBasicOperationsController();
        new AccountRecoverPasswordController();
        new AccountSpecificOperationsAccountController();
        new AccountEmailVerifyController();
    }

    private initTraningControllers(){
        new AdvisorTrainingBasicOperationsController();
        new AdvisorTrainingSpecificOperationsController();
        new AthleteTrainingBasicOperationsController();
        new AthleteTrainingSpecifcOperationsController();
    }

    public getApp(): Express {
        return this.app;
    }
}