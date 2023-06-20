import {
    Controller,
    StatusResponse,
    Body,
    Post, Get, Query, Header
} from "express-swagger-autoconfigure";
import LoggerComponent from "../../../../infrastructure/components/LoggerComponent";
import {Request, Response} from "express";
import AuthorizationTokenMiddleware from "../../../middleware/AuthorizationTokenMiddleware";
import AuthorizationUserTypeMiddleware from "../../../middleware/AuthorizationUserTypeMiddleware";
import TrainingRegistrationUseCase from "../../../../application/useCase/training/TrainingRegistrationUseCase";
import ParamtersValidationComponent from "../../../../infrastructure/components/ParamtersValidationComponent";
import TrainingPaginationDTO from "../../../dto/TrainingPaginationAthleteDTO";


const useCase = new TrainingRegistrationUseCase();
const authorization = new AuthorizationTokenMiddleware();
const authorizationAthlete = new AuthorizationUserTypeMiddleware()
const logger = new LoggerComponent("TrainingSpecificOperationsController");

@Controller("/athlete-training")
export default class AthleteTrainingSpecifcOperationsController{


    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Query({
        athleteUuid: "uuid do atleta",
        size: "Quantidade de documentos por vez",
        page: "Página que quer acessar"
    })
    @Header({is_active:"boolean"})
    @Get("/get-trainings-of-athletes", authorization.permitUserRule(["READ"]),authorizationAthlete.permitUserRule("ATHLETE") )
    public async getTrainingsOfAthlete(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["athleteUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.query, desirableParameters);
            const { athleteUuid, size, page }= request.query;
            const { is_active } = request.headers;
            const result = await useCase.getTrainingsOfAthlete(athleteUuid,eval(String(is_active)), size, page); // returns in the correct format
            return response.status(200).json(new TrainingPaginationDTO(result));
        }catch (error) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }

}