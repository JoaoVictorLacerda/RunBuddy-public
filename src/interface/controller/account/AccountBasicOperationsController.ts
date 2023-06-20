import {Body, Controller, Delete, Get, ParamPath, Patch, Post, StatusResponse} from "express-swagger-autoconfigure";
import {Request, Response} from "express";
import ParamtersValidationComponent from "../../../infrastructure/components/ParamtersValidationComponent";
import Account from "../../../domain/account/Account";
import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import AuthorizationTokenMiddleware from "../../middleware/AuthorizationTokenMiddleware";
import AccountEmailVerifyUseCase from "../../../application/useCase/account/AccountEmailVerifyUseCase";
import AccountBasicOperationsUseCase from "../../../application/useCase/account/AccountBasicOperationsUseCase";
import AccountError from "../../../application/exception/AccountError";
import AccountDTO from "../../dto/account/AccountDTO";

const logger = new LoggerComponent("AccountBasicOperationsController");
const basicOperaionsAccountUseCase = new AccountBasicOperationsUseCase();
const emailVerifyAccountUseCase= new AccountEmailVerifyUseCase()
const authorization = new AuthorizationTokenMiddleware();

@Controller("/account")
export default class AccountBasicOperationsController {

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Get("/", authorization.permitUserRule(["READ"]))
    public async read(request: Request, response: Response): Promise<Response> {
        try{

            const result = await basicOperaionsAccountUseCase.read();
            return response.status(200).json( AccountDTO.converter(result) );
        }catch (error: any) {
            logger.error("Not ok", error);
            return response.status(400).json(error.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(500, "Server erro")
    @Body({
        name : "full name",
        email : "fullname@example.com",
        password: "123456a",
        cep: "58580000",
        city: "Serra Branca",
        state: "PB",
        birthDate : "2005-03-11",
        type : "ADVISOR OR ATHLETE",
        telephone: "(99) 99999-9999"
    })
    @Post()
    public async create(request: Request, response: Response): Promise<Response> {
        try{
            logger.debug("Requested endpoint - POST /account ");
            const accountReceived: Account = request.body;

            const desirableParameters = ["name","email","password","telephone","cep", "city", "state", "birthDate", "type"];
            ParamtersValidationComponent.allParamtersRequired(accountReceived, desirableParameters);
            const result: Account = await basicOperaionsAccountUseCase.create(accountReceived);
            try{
                await emailVerifyAccountUseCase.sendEmail(result);
            }catch (e) {
                await basicOperaionsAccountUseCase.delete(result._id);
                throw e;
            }
            logger.info("Requested endpoint - POST /account - Successfully");
            return response.status(200).json(result._id);
        }catch (e: any) {
            logger.error("Requested endpoint - POST /account - Unsuccessfully", e);
            return response.status(400).json(e.message);
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @ParamPath({uuid: "string"})
    @Body({
        name:"new name",
        cep: "new cep",
        city: "new city",
        state: "new state",
        telephone: "new telephone"
    })
    @Patch("/{uuid}",authorization.permitUserRule(["UPDATE"]))
    public async update(request: Request, response: Response): Promise<Response> {
        try{
            const desirableParameters = ["uuid"];
            ParamtersValidationComponent.allParamtersRequired(request.params, desirableParameters);
            const desirableBody = ["name","cep","city","state","telephone"];
            ParamtersValidationComponent.allParamtersRequired(request.body, desirableBody);
            const account = await basicOperaionsAccountUseCase.update(request.params.uuid, request.body);
            return response.status(200).json(new AccountDTO(account));
        }catch (e: any) {
            logger.error("Requested endpoint - UPDATE /account/:uuid   - Unsuccessfully", e);
            return response.status(400).json(e.message);
        }
    }
}