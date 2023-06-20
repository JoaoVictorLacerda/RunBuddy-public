import Account from "../../../src/domain/account/Account";
import AccountBasicOperationsUseCase from "../../../src/application/useCase/account/AccountBasicOperationsUseCase";
import AccountEmailVerifyUseCase from "../../../src/application/useCase/account/AccountEmailVerifyUseCase";

describe("Email Verify of Account", ()=>{

    const useCase=new AccountEmailVerifyUseCase();

    test("Should be call generateLink with correct params", async () =>{
        const newAccount:Account = {
            name:"teste",
            type:"teste",
            telephone:"teste",
            imageLink:"teste",
            cep:"teste",
            rules:["1","2"],
            city:"teste",
            state:"teste",
            password:"teste",
            email:"teste",
            birthDate:"teste"
        };

        jest.spyOn(useCase,"sendEmail").mockImplementation();

        await useCase.sendEmail(newAccount);
        expect(useCase.sendEmail).toHaveBeenCalledWith(newAccount);

        await useCase.sendEmail(undefined);
        expect(useCase.sendEmail).toHaveBeenCalledWith(undefined);

        await useCase.sendEmail(null);
        expect(useCase.sendEmail).toHaveBeenCalledWith(null);
    });

    test("Should be call verify with correct params", async () =>{

        jest.spyOn(useCase,"verify").mockImplementation();

        await useCase.verify("token");
        expect(useCase.verify).toHaveBeenCalledWith("token");

        await useCase.verify(undefined);
        expect(useCase.verify).toHaveBeenCalledWith(undefined);

        await useCase.verify(null);
        expect(useCase.verify).toHaveBeenCalledWith(null);
    });

    test("Should be call isVerified with correct params", async () =>{

        jest.spyOn(useCase,"isVerified").mockImplementation();

        await useCase.isVerified("uuid");
        expect(useCase.isVerified).toHaveBeenCalledWith("uuid");

        await useCase.isVerified(undefined);
        expect(useCase.isVerified).toHaveBeenCalledWith(undefined);

        await useCase.isVerified(null);
        expect(useCase.isVerified).toHaveBeenCalledWith(null);

    });

    test("Should be call updateChecked with correct params", async () =>{

        const account:Account = {
            name:"teste",
            type:"teste",
            telephone:"teste",
            imageLink:"teste",
            cep:"teste",
            rules:["1","2"],
            city:"teste",
            state:"teste",
            password:"teste",
            email:"teste",
            birthDate:"teste"
        };
        jest.spyOn(useCase,"updateChecked").mockImplementation();

        await useCase.updateChecked(account);
        expect(useCase.updateChecked).toHaveBeenCalledWith(account);

        await useCase.updateChecked(undefined);
        expect(useCase.updateChecked).toHaveBeenCalledWith(undefined);

        await useCase.updateChecked(null);
        expect(useCase.updateChecked).toHaveBeenCalledWith(null);
    });

    test("Should be call accountActivate with correct params", async () =>{

        const account:Account = {
            name:"teste",
            type:"teste",
            telephone:"teste",
            imageLink:"teste",
            cep:"teste",
            rules:["1","2"],
            city:"teste",
            state:"teste",
            password:"teste",
            email:"teste",
            birthDate:"teste"
        };
        jest.spyOn(useCase,"accountActivate").mockImplementation();

        await useCase.accountActivate(account);
        expect(useCase.accountActivate).toHaveBeenCalledWith(account);

        await useCase.accountActivate(undefined);
        expect(useCase.accountActivate).toHaveBeenCalledWith(undefined);

        await useCase.accountActivate(null);
        expect(useCase.accountActivate).toHaveBeenCalledWith(null);

    });
})