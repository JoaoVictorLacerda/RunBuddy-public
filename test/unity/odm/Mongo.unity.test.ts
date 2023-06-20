import MongoODM from "../../../src/infrastructure/odm/MongoODM";
import ApplicationError from "../../../src/application/exception/ApplicationError";
import DotenvComponent from "../../../src/infrastructure/components/DotenvComponent";

describe("Check ODM mongoDB", () => {
    test("Should be call MongoORM and Throw ApplicationError",async ()=>{
        await expect(MongoODM.connect("teste")).rejects.toThrow(ApplicationError);
    });

    test("Should be call MongoODM",async ()=>{
        const result = await MongoODM.connect(DotenvComponent.API_DATABASE_URL);
        expect(result).toEqual("OK")
    });
})