import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import { Request, Response } from "express";
import {Controller, Get, ParamPath, Put, StatusResponse} from "express-swagger-autoconfigure";
import JWtComponent from "../../../infrastructure/components/JWTComponent";
import Account from "../../../domain/account/Account";
import AccountEmailVerifyUseCase from "../../../application/useCase/account/AccountEmailVerifyUseCase";
import AccountSpecificOperationsUseCase from "../../../application/useCase/account/AccountSpecificOperationsUseCase";
import AccountDTO from "../../dto/account/AccountDTO";


const logger = new LoggerComponent("AccountEmailVerifyController");
const emailVerifyAccountUseCase= new AccountEmailVerifyUseCase()
const specificOperationsAccountUseCase = new AccountSpecificOperationsUseCase();

@Controller("/account-verify")
export default class AccountEmailVerifyController {

    @StatusResponse(202,"Aceito com sucesso")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(500, "Server erro")
    @ParamPath({token: "string"})
    @Get("/{token}")
    public async listenLink( request: Request, response: Response): Promise<Response> {
        try{
            const { token } = request.params;
            await emailVerifyAccountUseCase.verify(token);
            logger.info("verified");
            return response.status(202).json("OK");
        }catch (error: any) {
            logger.error("Verified not ok", error);
            return response.status(400).json("Expired token");
        }
    }
    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(500, "Server erro")
    @ParamPath({uuid: "string"})
    @Put("/resend-link/{uuid}")
    public async resendLink(request: Request, response: Response): Promise<Response>{
        try{
            const {uuid} = request.params;
            const result:Account = await specificOperationsAccountUseCase.findByUuid(uuid);
            if(result.checked || result.checked === undefined){
                return response.status(200).json("Account is already verified");
            }
            await emailVerifyAccountUseCase.sendEmail(result);

            logger.info("Requested endpoint - PUT /send-link/:uuid - Successfully");
            return response.status(200).json("OK");
        }catch (e) {
            return response.status(400).json(" PUT /send-link/:uuid - NOT OK");
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(500, "Server erro")
    @ParamPath({uuid: "string"})
    @Get("/is-verified/{uuid}")
    public async isVerified(request: Request, response: Response): Promise<Response> {
        try{

            const {uuid} = request.params;
            const account: Account = await emailVerifyAccountUseCase.isVerified(uuid);
            return await AccountEmailVerifyController.buildResponseIsVerified(account, response);

        }catch (error) {
            logger.error("Requested endpoint - POST /is-verified/:uuid - Unsuccessfully", error);
            return response.status(500).json(error.message);
        }
    }

    private static async buildResponseIsVerified(account: Account, response: Response):Promise<Response>{
        if(account.checked === undefined){
            return response.status(401)
                .json("Account is already active");
        }

        const status = account.checked ? 200: 400
        const body = {
            token: JWtComponent.generateToken(account),
            refreshToken: account.refreshToken,
            account: new AccountDTO(account)
        };
        const result = response.status(status)
            .json(account.checked ? body: "NOT VERIFIED");

        if(account.checked){
            await emailVerifyAccountUseCase.accountActivate(account)
        }
        return result;
    }

}