import {
    Controller,
    StatusResponse,
    Body,
    Post, Get, Query
} from "express-swagger-autoconfigure";
import LoggerComponent from "../../../../infrastructure/components/LoggerComponent";
import {Request, Response} from "express";
import ParamtersValidationComponent from "../../../../infrastructure/components/ParamtersValidationComponent";
import AuthorizationTokenMiddleware from "../../../middleware/AuthorizationTokenMiddleware";
import AuthorizationUserTypeMiddleware from "../../../middleware/AuthorizationUserTypeMiddleware";
import AthleteTrainingBasicOperationsUseCase from "../../../../application/useCase/training/athlete/AthleteTrainingBasicOperationsUseCase";
import TrainingSize from "../../../../domain/training/TrainingPaginationAthlete";
import TrainingPaginationAthleteDTO from "../../../dto/TrainingPaginationAthleteDTO";



const useCase = new AthleteTrainingBasicOperationsUseCase();
const authorization = new AuthorizationTokenMiddleware();
const authorizationAdvisor = new AuthorizationUserTypeMiddleware()
const logger = new LoggerComponent("TrainingSpecificOperationsController");

@Controller("/athlete-training")
export default class AthleteTrainingBasicOperationsController{

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Body({
        trainingUuid:"uuid do treino",
        athleteUuid: "uuid do atleta"
    })
    @Post("/sign-up",authorization.permitUserRule(["CREATE"]), authorizationAdvisor.permitUserRule("ATHLETE"))
    public async signUpAthlete(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["trainingUuid","athleteUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.body, desirableParameters);

            const {trainingUuid, athleteUuid} = request.body;
            
            const result = await useCase.signUp(trainingUuid, athleteUuid);
            logger.info(`Scheduled participation. JobID: ${result}`)
            return response.status(200).json(`Scheduled participation`);
        }catch (error: any) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Query({
        city: "A cidade do usuário",
        cep: "O cep do usuário",
        size: "Quantidade de documentos por vez",
        page: "Página que quer acessar"
    })
    @Get("/filter",authorization.permitUserRule(["READ"]), authorizationAdvisor.permitUserRule("ATHLETE"))
    public async readTrainings(request: Request, response: Response): Promise<Response> {
        try{
            const query = request.query;
            const {size, page} =request.query
            const result = await useCase.readTrainings(query, size, page);
            return response.status(200).json(new TrainingPaginationAthleteDTO(result));
        }catch (error) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }

}