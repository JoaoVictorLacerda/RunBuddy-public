import DotenvComponent from "../components/DotenvComponent";
import LoggerComponent from "../components/LoggerComponent";
import mongoose from "mongoose";
import ApplicationError from "../../application/exception/ApplicationError";

export default class MongoODM {

    public static async connect(urlDatabase:string) {

        const logger = new LoggerComponent(MongoODM.name);
        try {
            mongoose.set("strictQuery", true);
            await mongoose.connect(urlDatabase);
            logger.info("Database connect successfully");
            return "OK";
        } catch (error) {
            logger.error("Database connect unsuccessfully",error , error.message);
            throw new ApplicationError(error.message);
        }
    }
}