
import AccountRecoverPasswordUseCase from "../../../src/application/useCase/account/AccountRecoverPasswordUseCase";

describe("Recorver password",()=>{
    const useCase=new AccountRecoverPasswordUseCase();

    test("Should call sendEmail with correct params",async ()=>{

        jest.spyOn(useCase,"sendEmail").mockImplementation();

        await useCase.sendEmail("email teste", "123456");
        expect(useCase.sendEmail).toHaveBeenCalledWith("email teste", "123456");

        await useCase.sendEmail(undefined, undefined);
        expect(useCase.sendEmail).toHaveBeenCalledWith(undefined, undefined);

        await useCase.sendEmail(null, null);
        expect(useCase.sendEmail).toHaveBeenCalledWith(null, null);
    })

    test("Should call updatePassword with correct params",async ()=>{

        jest.spyOn(useCase,"updatePassword").mockImplementation();

        await useCase.updatePassword("email teste", "new pass");
        expect(useCase.updatePassword).toHaveBeenCalledWith("email teste", "new pass");

        await useCase.updatePassword(undefined, undefined);
        expect(useCase.updatePassword).toHaveBeenCalledWith(undefined, undefined);

        await useCase.updatePassword(null, null);
        expect(useCase.updatePassword).toHaveBeenCalledWith(null, null);
    })

    test("Should call isCodeOfEmail with correct params",async ()=>{

        jest.spyOn(useCase,"isCodeOfEmail").mockImplementation();

        await useCase.isCodeOfEmail("email teste", "123456");
        expect(useCase.isCodeOfEmail).toHaveBeenCalledWith("email teste", "123456");

        await useCase.isCodeOfEmail(undefined, undefined);
        expect(useCase.isCodeOfEmail).toHaveBeenCalledWith(undefined, undefined);

        await useCase.isCodeOfEmail(null, null);
        expect(useCase.isCodeOfEmail).toHaveBeenCalledWith(null, null);
    })

    test("Should call saveCodeIntoAccount with correct params",async ()=>{

        jest.spyOn(useCase,"saveCodeIntoAccount").mockImplementation();

        await useCase.saveCodeIntoAccount("email teste");
        expect(useCase.saveCodeIntoAccount).toHaveBeenCalledWith("email teste");

        await useCase.saveCodeIntoAccount(undefined);
        expect(useCase.saveCodeIntoAccount).toHaveBeenCalledWith(undefined);

        await useCase.saveCodeIntoAccount(null);
        expect(useCase.saveCodeIntoAccount).toHaveBeenCalledWith(null);
    })
})