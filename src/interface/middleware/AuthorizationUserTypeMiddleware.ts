import LoggerComponent from "../../infrastructure/components/LoggerComponent";
import { NextFunction, Request, Response } from "express";
import JWtComponent from "../../infrastructure/components/JWTComponent";
import AccountSpecificOperationsUseCase from "../../application/useCase/account/AccountSpecificOperationsUseCase";
import Account from "../../domain/account/Account";

export default class AuthorizationUserTypeMiddleware {

    private logger: LoggerComponent;
    private specificOperationsAccountUseCase: AccountSpecificOperationsUseCase

    constructor() {
        this.logger = new LoggerComponent(AuthorizationUserTypeMiddleware.name);
        this.specificOperationsAccountUseCase = new AccountSpecificOperationsUseCase();
    }

    public permitUserRule(userType: string){

        const isAllowed = ( type: string): boolean  =>{
            return type === userType;
        };

        return async (request: Request, response:Response, next: NextFunction) => {
            const bearerToken = request.headers["authorization"];
            try {
                const token = bearerToken.split("Bearer ")[1];
                const accountDecoded = await JWtComponent.decodeToken(token);
                const account: Account = await this.findAccount(accountDecoded._id);

                if(token !== undefined && isAllowed(account.type)){
                    this.logger.info("Authorization. Request authorized. Call the next function");
                    return next();
                }
                this.logger.warn("Not authorized.");
                return response.status(401).json("Unauthorized request. You are not a "+userType);
            } catch (error: any) {
                this.logger.error("Not authorized.", error);
                return response.status(403).json("Unauthorized request. Error: Please enter a valid token");
            }
        };
    }

    private async findAccount(uuid: string){
        return await this.specificOperationsAccountUseCase.findByUuid(uuid);
    }
}