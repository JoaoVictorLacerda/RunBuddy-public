import {Body, Controller, Get, ParamPath, Post, Put, StatusResponse} from "express-swagger-autoconfigure";
import {Request, Response} from "express";
import TrainingDTO from "../../../dto/TrainingDTO";
import Training from "../../../../domain/training/Training";
import ParamtersValidationComponent from "../../../../infrastructure/components/ParamtersValidationComponent";
import LoggerComponent from "../../../../infrastructure/components/LoggerComponent";
import AuthorizationTokenMiddleware from "../../../middleware/AuthorizationTokenMiddleware";
import AuthorizationUserTypeMiddleware from "../../../middleware/AuthorizationUserTypeMiddleware";
import AdvisorTrainingBasicOperationsUseCase from "../../../../application/useCase/training/advisor/AdvisorTrainingBasicOperationsUseCase";


const useCase = new AdvisorTrainingBasicOperationsUseCase();
const logger = new LoggerComponent("TrainingBasicOperationsController");
const authorization = new AuthorizationTokenMiddleware();
const authorizationAdvisor = new AuthorizationUserTypeMiddleware()

@Controller("/advisor-training")
export default class AdvisorTrainingBasicOperationsController{

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Get("/", authorization.permitUserRule(["READ", "ADM"]))
    public async read(request: Request, response: Response): Promise<Response> {
        try{

            const result = await useCase.read();
            return response.status(200).json( TrainingDTO.converter(result) );
        }catch (error: any) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }
    
    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Body({
        name:"string",
        advisorUuid:"string",
        vacancies: "52",
        description:"string",
        limitDateRegistration:"01/05/2023",
        startDate:"29/05/2023",
        startHour:"09:30",
        startAddress:{"cep":"58580000","city":"Serra Branca","street":"Rua onildo Ribeiro de assis","neighborhood":"Alto da Conceição","number":"843"},
        suportPoints:[
            {cep:"58580000",city:"Serra Branca",street:"Rua onildo Ribeiro de assis",neighborhood:"Alto da Conceição",number:"843"},
            {cep:"58580000",city:"Serra Branca",street:"Rua onildo Ribeiro de assis",neighborhood:"Alto da Conceição",number:"843"}
        ],
        finishAddress:{"cep":"58580000","city":"Serra Branca","street":"Rua onildo Ribeiro de assis","neighborhood":"Alto da Conceição","number":"843"}

    })
    @Post("/", authorization.permitUserRule(["CREATE"]),authorizationAdvisor.permitUserRule("ADVISOR"))
    public async create(request: Request, response: Response): Promise<Response> {
        try{
            const trainingReceived: Training = request.body;
            const desirableParameters = ["vacancies","advisorUuid","name","description","limitDateRegistration", "startDate", "startHour", "startAddress", "suportPoints","finishAddress"];
            ParamtersValidationComponent.allParamtersRequired(trainingReceived, desirableParameters);
            const result = await useCase.create(trainingReceived);
            return response.status(200).json( new TrainingDTO(result) );
        }catch (error: any) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({advisorUuid:"string", trainingUuid:"string"})
    @Body({
        name:"string",
        vacancies: "52",
        description:"string",
        limitDateRegistration:"01/05/2023",
        startDate:"29/05/2023",
        startHour:"09:30",
        startAddress:{"cep":"58580000","city":"Serra Branca","street":"Rua onildo Ribeiro de assis","neighborhood":"Alto da Conceição","number":"843"},
        suportPoints:[
            {cep:"58580000",city:"Serra Branca",street:"Rua onildo Ribeiro de assis",neighborhood:"Alto da Conceição",number:"843"},
            {cep:"58580000",city:"Serra Branca",street:"Rua onildo Ribeiro de assis",neighborhood:"Alto da Conceição",number:"843"}
        ],
        finishAddress:{"cep":"58580000","city":"Serra Branca","street":"Rua onildo Ribeiro de assis","neighborhood":"Alto da Conceição","number":"843"}

    })
    @Put("/update/{advisorUuid}/{trainingUuid}", authorization.permitUserRule(["UPDATE"]),authorizationAdvisor.permitUserRule("ADVISOR"))
    public async updateTraining(request: Request, response: Response):Promise<Response> {
        try {
            const desirableParameters = ["advisorUuid", "trainingUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);
            const {advisorUuid, trainingUuid} = request.params
            const training:Training = request.body;
            const result = await useCase.updateTraining(training, advisorUuid, trainingUuid);
            return response.status(200).json( new TrainingDTO(result) );
        }catch (error) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }
}