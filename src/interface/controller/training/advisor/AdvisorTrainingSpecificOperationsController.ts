import {
    Controller,
    FormData,
    FormDataTypes, Get,
    ParamPath,
    Post, Header,
    StatusResponse, Query, Put, Patch
} from "express-swagger-autoconfigure";
import multer from "multer";
import LoggerComponent from "../../../../infrastructure/components/LoggerComponent";
import {Request, Response} from "express";
import ParamtersValidationComponent from "../../../../infrastructure/components/ParamtersValidationComponent";
import TrainingDTO from "../../../dto/TrainingDTO";
import AuthorizationTokenMiddleware from "../../../middleware/AuthorizationTokenMiddleware";
import AuthorizationUserTypeMiddleware from "../../../middleware/AuthorizationUserTypeMiddleware";
import AdvisorTrainingSpecificOperationsUseCase from "../../../../application/useCase/training/advisor/AdvisorTrainingSpecificOperationsUseCase";
import AccountDTO from "../../../dto/account/AccountDTO";
import TrainingPaginationAdvisorDTO from "../../../dto/TrainingPaginationAdvisorDTO";

const useCase = new AdvisorTrainingSpecificOperationsUseCase();
const authorization = new AuthorizationTokenMiddleware();
const authorizationAdvisor = new AuthorizationUserTypeMiddleware()
const photo = multer();
const logger = new LoggerComponent("TrainingSpecificOperationsController");

@Controller("/advisor-training")
export default class AdvisorTrainingSpecificOperationsController{

    // find training active and inactive of advisor
    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Query({
        advisorUuid: "uuid do assessor",
        size: "Quantidade de documentos por vez",
        page: "Página que quer acessar"
    })
    @Header({is_active:"boolean",})
    @Get("/find-by-advisor-uuid",authorization.permitUserRule(["READ"]), authorizationAdvisor.permitUserRule("ADVISOR"))
    public async findTrainingsActiveByAdvisor(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["advisorUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.query, desirableParameters);

            const {advisorUuid, size,page} = request.query;
            const {is_active} = request.headers;
            const result = await useCase.findByAdvisor(advisorUuid, eval(String(is_active)), size, page);
            return response.status(200).json(new TrainingPaginationAdvisorDTO(result));
        }catch (error: any) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }

    // find athletes enrolled in training
    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({trainingUuid:"string"})
    @Get("/find-athletes-enrolled-in-training/{trainingUuid}",authorization.permitUserRule(["READ"]), authorizationAdvisor.permitUserRule("ADVISOR"))
    public async findAthletesIntoTraining(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["trainingUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);
            const {trainingUuid} = request.params;
            const result = await useCase.findAthletesIntoTraining(trainingUuid);
            return response.status(200).json( AccountDTO.converter(result) );
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
    @FormData({
        img: FormDataTypes.FILE
    })
    @Post("/photo-upload/{advisorUuid}/{trainingUuid}",authorization.permitUserRule(["UPDATE"]), authorizationAdvisor.permitUserRule("ADVISOR"), photo.single("img"))
    public async photoUpload(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["advisorUuid", "trainingUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);
            const {advisorUuid, trainingUuid} = request.params
            const { buffer } = request.file;
            const result = await useCase.photoUpload(buffer,advisorUuid,trainingUuid);
            return response.status(200).json( new TrainingDTO(result) );
        }catch (error) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({
        trainingUuid:"uuid do treino que será suspenso",
        advisorUuid: "uuid que quer suspender o treino"
    })
    @Patch("/suspended-training/{trainingUuid}/{advisorUuid}",authorization.permitUserRule(["UPDATE"]), authorizationAdvisor.permitUserRule("ADVISOR"))
    public async suspendedTraining(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["trainingUuid", "advisorUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);
            const {trainingUuid,advisorUuid} = request.params
            const result = await useCase.suspendedOrReactivateTraining(trainingUuid,advisorUuid, false);
            return response.status(200).json( new TrainingDTO(result) );
        }catch (error) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({
        trainingUuid:"uuid do treino que será suspenso",
        advisorUuid: "uuid que quer suspender o treino"
    })
    @Patch("/reactivate-training/{trainingUuid}/{advisorUuid}",authorization.permitUserRule(["UPDATE"]), authorizationAdvisor.permitUserRule("ADVISOR"))
    public async reactivateTraining(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["trainingUuid", "advisorUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);
            const {trainingUuid,advisorUuid} = request.params
            const result = await useCase.suspendedOrReactivateTraining(trainingUuid,advisorUuid,true)
            return response.status(200).json( new TrainingDTO(result) );
        }catch (error) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }

}