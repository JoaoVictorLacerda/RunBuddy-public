import { Request, Response } from "express";
import LoggerComponent from "../../infrastructure/components/LoggerComponent";
import {Controller, Get, StatusResponse} from "express-swagger-autoconfigure";

const logger = new LoggerComponent("HealthCheckController");

@Controller("/health-check")
export default class HealthCheckController {

    @StatusResponse(200)
    @StatusResponse(400)
    @Get()
    public async check(request: Request, response: Response): Promise<Response> {

        try {
            logger.info("Health check ok");
            return response.status(200).json("OK");
        } catch (error: any) {
            logger.error("Health check not ok", error);
            return response.status(400).json(error.message);   
        }

    }
}