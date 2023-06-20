import EmailSenderConfig from "../../../src/infrastructure/config/EmailSenderConfig";


describe("check cloudinary",()=>{
    test("call the cloudinary config", ()=>{
        const emailSender = new EmailSenderConfig();
        const result  = emailSender.getTransporter();
        expect(result).not.toBeUndefined()
    })
})