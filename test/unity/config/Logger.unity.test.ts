import {LoggerConfig} from "../../../src/infrastructure/config/LoggerConfig";


describe("check cloudinary",()=>{
    test("call the cloudinary config", ()=>{
        const logger = new LoggerConfig();
        const result  = logger.createLogger("")
        expect(result).not.toBeUndefined()
    })
})