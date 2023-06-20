import AccountPhotoUploadUseCase from "../../../src/application/useCase/account/AccountPhotoUploadUseCase";

describe("Email Verify of Account", ()=>{

    const useCase=new AccountPhotoUploadUseCase();

    test("Should be call uploadPhoto with correct params", async () =>{
        const buffer:Buffer = Buffer.from("teste");

        jest.spyOn(useCase,"uploadPhoto").mockImplementation();

        await useCase.uploadPhoto(buffer,"uuid");
        expect(useCase.uploadPhoto).toHaveBeenCalledWith(buffer,"uuid");

        await useCase.uploadPhoto(undefined, undefined);
        expect(useCase.uploadPhoto).toHaveBeenCalledWith(undefined, undefined);

        await useCase.uploadPhoto(null, null);
        expect(useCase.uploadPhoto).toHaveBeenCalledWith(null, null);
    });

})