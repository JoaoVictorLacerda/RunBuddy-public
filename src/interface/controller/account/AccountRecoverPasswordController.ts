import {Body, Controller, Patch, Post, StatusResponse} from "express-swagger-autoconfigure";
import {Request, Response} from "express";
import AccountRecoverPasswordUseCase from "../../../application/useCase/account/AccountRecoverPasswordUseCase";
import LoggerComponent from "../../../infrastructure/components/LoggerComponent";
import LoginDTO from "../../dto/LoginDTO";
import JWtComponent from "../../../infrastructure/components/JWTComponent";
import AuthorizationTokenMiddleware from "../../middleware/AuthorizationTokenMiddleware";

const recoverPassword = new AccountRecoverPasswordUseCase();
const logger = new LoggerComponent("AccountRecoverPasswordController");
const authorization = new AuthorizationTokenMiddleware();

@Controller("/account")
export default class AccountRecoverPasswordController {

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(500, "Server erro")
    @Body({email : "email@example.com"})
    @Post("/send-recover-pass")
    public async recoverPassword(request: Request, response: Response): Promise<Response> {
        try{
            const { email } = request.body;
            const code = await recoverPassword.saveCodeIntoAccount(email);
            await recoverPassword.sendEmail(email,code);
            logger.info("Email sent");
            return response.status(200).json("OK");
        }catch (error) {
            logger.error("Email not sent", error);
            return response.status(400).json("Email not sent");
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(500, "Server erro")
    @Body({email : "email@example.com", code:"123456"})
    @Post("/is-code-of-email")
    public async isCodeOfEmail(request: Request, response: Response): Promise<Response> {

        try{
            const {email, code} =  request.body;
            const account = await recoverPassword.isCodeOfEmail(email, code);
            logger.info("The code belongs to the user");
            return response
                .status(account !== undefined? 200 : 400)
                .json(JWtComponent.generateToken(account, "5m"));
        }catch (error) {
            logger.info("The code is not from the user");
            return response.status(400).json("The code is not from the user");
        }
    }

    @StatusResponse(200,"Deu tudo certo com a requisição")
    @StatusResponse(400, "Houve um problema com a requisição")
    @StatusResponse(401, "Não autorizado, entre com um token válido")
    @StatusResponse(500, "Server erro")
    @Body({email: "email@example.com", newPassword : "new password"})
    @Post("/update-password", authorization.permitUserRule(["UPDATE"]))
    public async updatePassword(request: Request, response: Response): Promise<Response> {

        try{
            const {email, newPassword} =  request.body;
            const result = await recoverPassword.updatePassword(email, newPassword);
            logger.info("Update password ok");
            return response.status(result ? 200 : 400).json( new LoginDTO(result) );
        }catch (error) {
            logger.info("The code is not from the user");
            return response.status(400).json("The code is not from the user");
        }
    }
}