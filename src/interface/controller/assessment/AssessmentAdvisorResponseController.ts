import { Request, Response } from "express";
import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import {Body, Controller, Delete, Get, ParamPath, Patch, Post, StatusResponse} from "express-swagger-autoconfigure";
import AuthorizationTokenMiddleware from "../../middleware/AuthorizationTokenMiddleware";
import AuthorizationUserTypeMiddleware from "../../middleware/AuthorizationUserTypeMiddleware";
import ParamtersValidationComponent from "../../../infrastructure/components/ParamtersValidationComponent";
import AssessmentUseCase from "../../../application/useCase/assessment/AssessmentUseCase";
import AssessmentDTO from "../../dto/AssessmentDTO";
import AssessmentAdvisorResponseUseCase from "../../../application/useCase/assessment/AssessmentAdvisorResponseUseCase";

const useCase = new AssessmentAdvisorResponseUseCase();
const authorization = new AuthorizationTokenMiddleware();
const authorizationAthlete = new AuthorizationUserTypeMiddleware()
const logger = new LoggerComponent("AssessmentController");

@Controller("/assessment-advisor")
export default class AssessmentAdvisorResponseController {


    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Body({
        advisorUuid:"Advisor uuid",
        assessmentUuid: "Assessment uuid",
        response: "The response from advisor"
    })
    @Post("/create-or-update-response-assessment")
    public async responseAssessment(request: Request, response: Response): Promise<Response> {
        try {
            const desirableParameters = ["advisorUuid","assessmentUuid","response"];
            ParamtersValidationComponent.allParamtersRequired(request.body, desirableParameters);

            const result = await AssessmentAdvisorResponseController
                .createOrUpdateOrDeleteResponseAssessment(request, request.body.response);

            return response.status(200).json(new AssessmentDTO(result));
            logger.info("responseAssessment successfully");
        }catch (error) {
            logger.error("Error when called responseAssessment", error.message);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Body({
        advisorUuid:"Advisor uuid",
        assessmentUuid: "Assessment uuid",
    })
    @Delete("/delete-response-assessment")
    public async deleteResponseAssessment(request: Request, response: Response): Promise<Response> {
        try {
            const desirableParameters = ["advisorUuid","assessmentUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.body, desirableParameters);

            const result = await AssessmentAdvisorResponseController
                .createOrUpdateOrDeleteResponseAssessment(request, undefined);

            return response.status(200).json(new AssessmentDTO(result));
            logger.info("deleteResponseAssessment successfully");
        }catch (error) {
            logger.error("Error when called deleteResponseAssessment", error.message);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Body({
        advisorUuid:"Advisor uuid",
        assessmentUuid: "Assessment uuid",
    })
    @Delete("/delete-athlete-comment")
    public async deleteAthleteComment(request: Request, response: Response): Promise<Response> {
        try {
            const desirableParameters = ["advisorUuid","assessmentUuid"];
            ParamtersValidationComponent.allParamtersRequired(request.body, desirableParameters);
            const {advisorUuid,assessmentUuid} = request.body;
            const result = await useCase.deleteAthleteComment(advisorUuid, assessmentUuid)
            return response.status(200).json(new AssessmentDTO(result));
            logger.info("deleteAthleteComment successfully");
        }catch (error) {
            logger.error("Error when called deleteResponseAssessment", error.message);
            return response.status(400).json(error.message);
        }
    }


    private static async createOrUpdateOrDeleteResponseAssessment(request: Request, response:string){
        const {advisorUuid,assessmentUuid} = request.body;
        const result = await useCase.responseAssessment(advisorUuid,assessmentUuid,response);
        return result;
    }


}