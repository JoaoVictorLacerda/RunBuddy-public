import { Request, Response } from "express";
import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import {Body, Controller, Delete, Get, ParamPath, Patch, Post, StatusResponse} from "express-swagger-autoconfigure";
import AuthorizationTokenMiddleware from "../../middleware/AuthorizationTokenMiddleware";
import AuthorizationUserTypeMiddleware from "../../middleware/AuthorizationUserTypeMiddleware";
import ParamtersValidationComponent from "../../../infrastructure/components/ParamtersValidationComponent";
import AssessmentUseCase from "../../../application/useCase/assessment/AssessmentUseCase";
import AssessmentDTO from "../../dto/AssessmentDTO";

const useCase = new AssessmentUseCase();
const authorization = new AuthorizationTokenMiddleware();
const authorizationAthlete = new AuthorizationUserTypeMiddleware()
const logger = new LoggerComponent("AssessmentController");

@Controller("/assessment")
export default class AssessmentController {

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Body({
        advisorUuid:"uuid do advisor",
        athleteUuid:"uuid do athlete",
        comment:"comentário opcional na avaliação",
        stars:"número de estrelas"
    })
    @Post("/",authorization.permitUserRule(["CREATE"]), authorizationAthlete.permitUserRule("ATHLETE"))
    public async createAssessment(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["advisorUuid","athleteUuid","stars"];
            ParamtersValidationComponent.allParamtersRequired(request.body, desirableParameters);
            const result = await useCase.create(request.body);
            return response.status(201).json(result);
        }catch (error) {
            logger.error("Error when called createAssessment", error.message);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({
        advisorUuid:"uuid do advisor"
    })
    @Get("/get-stars/{advisorUuid}",authorization.permitUserRule(["READ"]))
    public async getAssessmentForAdvisor(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["advisorUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);
            const {advisorUuid} = request.params;
            const result = await useCase.getAssessmentForAdvisor(advisorUuid);
            return response.status(200).json(result);
        }catch (error) {
            logger.error("Error when called getAssessmentForAdvisor", error.message);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({
        advisorUuid:"uuid do advisor"
    })
    @Get("/get-comments-and-stars/{advisorUuid}",authorization.permitUserRule(["READ"]))
    public async getCommentsAndStarsForAdvisor(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["advisorUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);
            const {advisorUuid} = request.params;
            const result:any = await useCase.getCommentsAndStarsForAdvisor(advisorUuid);
            return response.status(200).json(AssessmentDTO.converter(result));
        }catch (error) {
            logger.error("Error when called getCommentsAndStarsForAdvisor", error.message);
            return response.status(400).json(error.message);
        }
    }


    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Body({
        stars:"Nova quantidade de estrelas",
        comment:"Novo comentário"
    })
    @ParamPath({
        assessmentUuid:"uuid da avaliação",
        athleteUuid:"uuid do athlete"
    })
    @Patch("/update/{assessmentUuid}/{athleteUuid}",authorization.permitUserRule(["READ"]), authorizationAthlete.permitUserRule("ATHLETE"))
    public async update(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["assessmentUuid","athleteUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);
            const {assessmentUuid, athleteUuid} = request.params;
            const result = await useCase.update(assessmentUuid,athleteUuid, request.body);
            return response.status(200).json(new AssessmentDTO(result));
        }catch (error) {
            logger.error("Error when called update", error.message);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({
        assessmentUuid:"uuid da avaliação",
        athleteUuid:"uuid do athlete"
    })
    @Delete("/{assessmentUuid}/{athleteUuid}",authorization.permitUserRule(["READ"]), authorizationAthlete.permitUserRule("ATHLETE"))
    public async delete(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["assessmentUuid","athleteUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);
            const {assessmentUuid, athleteUuid} = request.params;
            const result = await useCase.delete(assessmentUuid,athleteUuid);
            return response.status(200).json(result);
        }catch (error) {
            logger.error("Error when called update", error.message);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({
        advisorUuid:"uuid da assessoria",
        athleteUuid:"uuid do athlete"
    })
    @Get("/get-by-athlete-and-advisor/{advisorUuid}/{athleteUuid}",authorization.permitUserRule(["READ"]), authorizationAthlete.permitUserRule("ATHLETE"))
    public async getByAthleteAndAdvisorUuid(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["advisorUuid","athleteUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);
            const {advisorUuid, athleteUuid} = request.params;
            const result = await useCase.getByAthleteAndAdvisorUuid(athleteUuid,advisorUuid);
            return response.status(200).json(new AssessmentDTO(result));
        }catch (error) {
            logger.error("Error when called getByAthleteAndAdvisorUuid", error.message);
            return response.status(400).json(error.message);
        }
    }
}