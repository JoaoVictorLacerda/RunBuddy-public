import LoggerComponent from "../../infrastructure/components/LoggerComponent";
import { NextFunction, Request, Response } from "express";
import JWtComponent from "../../infrastructure/components/JWTComponent";
import AccountSpecificOperationsUseCase from "../../application/useCase/account/AccountSpecificOperationsUseCase";

export default class AuthorizationTokenMiddleware {

    private logger: LoggerComponent;
    private specificOperationsAccountUseCase: AccountSpecificOperationsUseCase

    constructor() {
        this.logger = new LoggerComponent(AuthorizationTokenMiddleware.name);
        this.specificOperationsAccountUseCase = new AccountSpecificOperationsUseCase();
    }

    public permitUserRule(rulesAllowed: string[]){


        if(rulesAllowed.length === 0){
            rulesAllowed.push("READ");
            rulesAllowed.push("CREATE");
        }
        const isAllowed = ( rulesUser: string[]): boolean  =>{

            for (let i = 0; i < rulesAllowed.length; i++) {
                const rule = rulesAllowed[i];
                if(rulesUser.indexOf( rule ) == -1){
                    return false;
                }
            }
            return true;
        };

        return async (request: Request, response:Response, next: NextFunction) => {
            const bearerToken = request.headers["authorization"];

            try {
                const token = bearerToken.split("Bearer ")[1];

                const accountDecoded = await JWtComponent.decodeToken(token);

                const account: any = await this.findAccount(accountDecoded._id);

                if(token !== undefined && isAllowed(account.rules)){
                    this.logger.info("Authorization. Request authorized. Call the next function");
                    next();
                    return;
                }

                this.logger.warn("Not authorized.");
                return response.status(401).json("Unauthorized request");
            } catch (error: any) {
                this.logger.error("Not authorized.", error);
                return response.status(401).json("Unauthorized request. Error: Please enter a valid token");
            }
        };
    }

    private async findAccount(uuid: string){
        return await this.specificOperationsAccountUseCase.findByUuid(uuid);
    }
}