import Account from "../../../../src/domain/account/Account";
import AccountBasicOperationsUseCase from "../../../../src/application/useCase/account/AccountBasicOperationsUseCase";
import MongoODM from "../../../../src/infrastructure/odm/MongoODM";
import DotenvComponent from "../../../../src/infrastructure/components/DotenvComponent";
import AccountError from "../../../../src/application/exception/AccountError";

describe("Basic operations of Account",()=>{

    const useCase=new AccountBasicOperationsUseCase();
    let uuid="";

    beforeAll(async ()=>{
        await MongoODM.connect(DotenvComponent.API_DATABASE_URL);
    })

    test("Should be call create with correct params", async () =>{

        const newAccount:Account = {
            name:"teste",
            type:"ADVISOR",
            telephone:"teste",
            imageLink:"teste",
            cep:"teste",
            city:"teste",
            state:"teste",
            password:"teste",
            email:"teste",
            birthDate:"teste"
        };

        const result = await useCase.create(newAccount);
        expect(result).not.toBeUndefined();

        uuid = result._id
    });

    test("Should be call create with incorrect params", async () =>{

        const newAccount:Account = {
            name:"teste",
            type:"teste",
            telephone:"teste",
            imageLink:"teste",
            cep:"teste",
            city:"teste",
            state:"teste",
            password:"teste",
            email:"teste",
            birthDate:"teste"
        };
        await expect(useCase.create(newAccount)).rejects.toThrow(AccountError);
    });

    test("Should be call read with correct params", async () =>{
        const response = await useCase.read();
        expect(response).not.toBeUndefined();

    });

    test("Should be call update with correct params", async () =>{
        const newObject ={
            name:"teste2",
            cep:"teste2",
            city:"teste2",
            state:"teste2",
            telephone:"teste2"
        }
        const result = await useCase.update(uuid,newObject);
        expect(result).not.toBeUndefined();

    });

    test("Should be call delete with correct params", async () =>{
        const result = await useCase.delete(uuid);
        expect(result).toEqual(1)

    });
})