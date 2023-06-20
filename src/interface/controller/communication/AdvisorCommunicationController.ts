import {Body, Controller, Post, StatusResponse} from "express-swagger-autoconfigure";
import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import AuthorizationUserTypeMiddleware from "../../middleware/AuthorizationUserTypeMiddleware";
import AuthorizationTokenMiddleware from "../../middleware/AuthorizationTokenMiddleware";
import ParamtersValidationComponent from "../../../infrastructure/components/ParamtersValidationComponent";
import {Request, Response} from "express";
import AdvisorCommunicationUseCase from "../../../application/useCase/communication/AdvisorCommunicationUseCase";

const authorization = new AuthorizationTokenMiddleware();
const authorizationAdvisor = new AuthorizationUserTypeMiddleware()
const logger = new LoggerComponent("TrainingSpecificOperationsController");
const useCase = new AdvisorCommunicationUseCase();

@Controller("/advisor-communication")
export default class AdvisorCommunicationController{

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Body({
        message: "mensagem do email",
        trainingUuid: "uuid do treino (pegará todos os atletas inscritos)",
        advisorUuid:"Uuid do advisor"
    })
    @Post("/send-email-suitecase", authorization.permitUserRule(["CREATE", "READ"]),authorizationAdvisor.permitUserRule("ADVISOR") )
    public async sendEmailSuitecase(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["message","trainingUuid","advisorUuid"]
            ParamtersValidationComponent.allParamtersRequired(request.body, desirableParameters);
            const {message, trainingUuid, advisorUuid} = request.body;
            const result = await useCase.sendEmailSuitecase(message, trainingUuid, advisorUuid);
            return response.status(200).json(result);
        }catch (error) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Body({
        message: "mensagem do email",
        advisorUuid:"Uuid do advisor",
        athleteEmail: "Email do atleta inscrito no treino",
        trainingUuid: "uuid do treino",
    })
    @Post("/send-email-direct", authorization.permitUserRule(["CREATE", "READ"]),authorizationAdvisor.permitUserRule("ADVISOR") )
    public async sendEmailDirect (request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["message","advisorUuid","athleteEmail", "trainingUuid"]
            ParamtersValidationComponent.allParamtersRequired(request.body, desirableParameters);
            const {message,advisorUuid,athleteEmail, trainingUuid} = request.body;
            const result = await useCase.sendEmailDirect(message,advisorUuid,athleteEmail, trainingUuid);
            return response.status(200).json(result);
        }catch (error) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }
}