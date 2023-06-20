import {
    Body,
    Controller,
    Delete,
    Get,
    ParamPath,
    FormData,
    Post,
    StatusResponse,
    FormDataTypes,
    Header
} from "express-swagger-autoconfigure";
import {Request, Response} from "express";
import ParamtersValidationComponent from "../../../infrastructure/components/ParamtersValidationComponent";
import LoginDTO from "../../dto/LoginDTO";
import Account from "../../../domain/account/Account";
import AccountEmailVerifyController from "./AccountEmailVerifyController";
import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import AuthorizationTokenMiddleware from "../../middleware/AuthorizationTokenMiddleware";
import AccountSpecificOperationsUseCase from "../../../application/useCase/account/AccountSpecificOperationsUseCase";
import multer from "multer";
import AccountPhotoUploadUseCase from "../../../application/useCase/account/AccountPhotoUploadUseCase";
import AccountDTO from "../../dto/account/AccountDTO";
import Login from "../../../domain/account/Login";
import AccountDeleteCascadeUseCase from "../../../application/useCase/account/AccountDeleteCascadeUseCase";

const logger = new LoggerComponent("AccountSpecificOperationsAccountController");
const specificOperationsAccountUseCase = new AccountSpecificOperationsUseCase();
const deleteCascadeUseCase = new AccountDeleteCascadeUseCase();
const authorization = new AuthorizationTokenMiddleware();
const accountVerifyController = new AccountEmailVerifyController()
const photo = multer()
const photoUploadUseCase = new AccountPhotoUploadUseCase();

@Controller("/account")
export default class AccountSpecificOperationsAccountController {

    @StatusResponse(202, "Aceito com sucesso")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(500, "Server erro")
    @Body({email:"string", password:"string"})
    @Post("/login")
    public async login( request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["email","password"];
            ParamtersValidationComponent.allParamtersRequired(request.body, desirableParameters);
            const {email, password} = request.body;
            const login = await specificOperationsAccountUseCase.login(email, password);
            if(login.account.checked === undefined){
                logger.info("Login ok");
                return response.status(202).json(new LoginDTO(login));
            }
            if(login.account.checked){
                request.params.uuid=login.account._id
                return await accountVerifyController.isVerified(request, response);
            }
            logger.warn("Login not ok");
            return response.status(403).json(login.account._id);
        }catch (error: any) {
            logger.error("Login not ok", error);
            return response.status(400).json(error.message);
        }
    }


    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({uuid:"string"})
    @Delete("/deactivate/{uuid}", authorization.permitUserRule(["UPDATE"]))
    public async deactivate( request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["uuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);
            const { uuid } =request.params;
            const result = await specificOperationsAccountUseCase.accountDesative(uuid);

            return response.status(result ? 200 : 400).json(result ? "OK": "NOT OK");
        }catch (error: any) {
            logger.error("Account not deactivate", error.message);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Body({email:"string", password:"string"})
    @Delete("/delete-cascade", authorization.permitUserRule(["UPDATE","DELETE"]))
    public async deleteCascade( request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["email","password"];
            ParamtersValidationComponent.allParamtersRequired(request.body, desirableParameters);
            const {email, password} = request.body;
            const result = await deleteCascadeUseCase.deleteCascade(email,password);
            return response.status(result ? 200 : 400).json(result ? "OK": "NOT OK");
        }catch (error: any) {
            logger.error("Account not deactivate", error.message);
            return response.status(400).json(error.message);
        }
    }


    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({ uuid: "string"})
    @FormData({
        img: FormDataTypes.FILE
    })
    @Post("/photo-upload/{uuid}", authorization.permitUserRule(["UPDATE"]),photo.single("img"))
    public async uploadPhoto(request: Request, response: Response): Promise<Response> {
        try {
            const { buffer } = request.file; // não mudar nome das constantes
            const { uuid } =request.params;
            const accountResult = await photoUploadUseCase.uploadPhoto(buffer,uuid);
            logger.info(`${accountResult}`);
            return response.status(200).json(new AccountDTO(accountResult));
        }catch (error) {
            logger.error("Upload photo not ok", error.message);
            return response.status(400).json(error);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({type: "string"})
    @Get("/find-by-account-type/{type}",authorization.permitUserRule(["READ"]))
    public async findByAccountType(request: Request, response: Response): Promise<Response> {
        try{
            logger.debug("Requested endpoint - GET /account/:type ");
            const desirableParameters = ["type"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);

            const { type } = request.params;
            const result: Account[] = await specificOperationsAccountUseCase.findByAccountType(type);
            logger.info("Requested endpoint - GET /account/find-by-account-type/:uuid  - Successfully");
            return response.status(200).json(AccountDTO.converter(result));
        }catch (e: any) {
            logger.error("Requested endpoint - GET /account/find-by-account-type/:uuid  - Unsuccessfully", e);
            return response.status(400).json(e.message);
        }
    }
    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({uuid: "string"})
    @Get("/find-by-uuid/{uuid}", authorization.permitUserRule(["READ"]))
    public async findByUuid(request: Request, response: Response): Promise<Response> {
        try{
            logger.debug("Requested endpoint - GET /account/findByUuid/:uuid ");

            const desirableParameters = ["uuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);

            const { uuid } = request.params;
            const result: Account = await specificOperationsAccountUseCase.findByUuid(uuid);
            if(!result){
                throw new Error("Not Found")
            }
            logger.info("Requested endpoint - GET /account/find-by-uuid/:uuid  - Successfully");
            return response.status(200).json(new AccountDTO(result));
        }catch (e: any) {
            logger.error("Requested endpoint - GET /account/find-by-uuid/:uuid  - Unsuccessfully", e);
            return response.status(400).json(e.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Body({
        accountUuid: "Id da conta",
        refreshToken: "Token de atualização"
    })
    @Post("/refresh-token")
    public async refreshToken(request: Request, response: Response): Promise<Response> {
        try{
            logger.debug("Requested endpoint - GET /account/findByUuid/:uuid ");

            const desirableParameters = ["accountUuid", "refreshToken"];
            ParamtersValidationComponent.allParamtersRequired(request.body, desirableParameters);

            const { accountUuid, refreshToken } = request.body;
            const result: Login = await specificOperationsAccountUseCase.refreshToken(accountUuid, refreshToken);

            logger.info("Requested endpoint - GET /account/refresh-token - Successfully");
            return response.status(200).json(new LoginDTO(result));
        }catch (e: any) {
            logger.error("Requested endpoint - GET /account/refresh-token  - Unsuccessfully", e);
            return response.status(400).json(e.message);
        }
    }


}