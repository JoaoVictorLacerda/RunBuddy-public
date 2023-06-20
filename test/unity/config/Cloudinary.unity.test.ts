import CloudinaryConfig from "../../../src/infrastructure/config/CloudinaryConfig";

describe("check cloudinary",()=>{
    test("call the cloudinary config", ()=>{
        const cloudinary = new CloudinaryConfig();
        const result  = cloudinary.config();
        expect(result).not.toBeUndefined()
    })
})