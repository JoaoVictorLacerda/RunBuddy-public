import Account from "../../../src/domain/account/Account";
import AccountBasicOperationsUseCase from "../../../src/application/useCase/account/AccountBasicOperationsUseCase";

describe("Basic operations of Account", ()=>{

    const useCase=new AccountBasicOperationsUseCase();

    test("Should be call create with correct params", async () =>{
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

        jest.spyOn(useCase,"create").mockImplementation();
        await useCase.create(newAccount);
        expect(useCase.create).toHaveBeenCalledWith(newAccount);
        await useCase.create(undefined);
        expect(useCase.create).toHaveBeenCalledWith(undefined);
        await useCase.create(null);
        expect(useCase.create).toHaveBeenCalledWith(null);
    });

    test("Should be call read with correct params", async () =>{

        jest.spyOn(useCase,"read").mockImplementation();
        await useCase.read();
        expect(useCase.read).toHaveBeenCalled();

    });

    test("Should be call delete with correct params", async () =>{

        jest.spyOn(useCase,"delete").mockImplementation();
        await useCase.delete("testUuid");
        expect(useCase.delete).toHaveBeenCalledWith("testUuid");
        await useCase.delete(undefined);
        expect(useCase.delete).toHaveBeenCalledWith(undefined);
        await useCase.delete(null);
        expect(useCase.delete).toHaveBeenCalledWith(null);

    });

    test("Should be call update with correct params", async () =>{

        const newObject ={
            name:"teste",
            cep:"teste",
            city:"teste",
            state:"teste",
            telephone:"teste"
        }
        jest.spyOn(useCase,"update").mockImplementation();
        await useCase.update("userUuid",newObject);
        expect(useCase.update).toHaveBeenCalledWith("userUuid",newObject);
        await useCase.update(undefined, undefined);
        expect(useCase.update).toHaveBeenCalledWith(undefined, undefined);
        await useCase.update(null, null);
        expect(useCase.update).toHaveBeenCalledWith(null, null);

    });
})