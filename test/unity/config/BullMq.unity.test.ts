import BullMqConfig from "../../../src/infrastructure/config/BullMqConfig";

describe("check cloudinary",()=>{
    test("call the cloudinary config", ()=>{
        const bullMqConfig = new BullMqConfig();
        const result  = bullMqConfig.getConfig()
        expect(result).not.toBeUndefined()
    })
})