import AccountSpecificOperationsUseCase
    from "../../../../src/application/useCase/account/AccountSpecificOperationsUseCase";
import AccountBasicOperationsUseCase from "../../../../src/application/useCase/account/AccountBasicOperationsUseCase";
import MongoODM from "../../../../src/infrastructure/odm/MongoODM";
import DotenvComponent from "../../../../src/infrastructure/components/DotenvComponent";
import Account from "../../../../src/domain/account/Account";

describe("Specifc operations account", ()=> {

    const basicUseCase=new AccountBasicOperationsUseCase();
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
            email:"teste22",
            birthDate:"teste"
        };

        const result = await basicUseCase.create(newAccount);
        expect(result).not.toBeUndefined();

        uuid = result._id
    });

    const useCase = new AccountSpecificOperationsUseCase();

    test("Should call findByUuid with correct params", async () => {
        const result = await useCase.findByUuid(uuid);
        expect(result).not.toBeUndefined();
    })


    test("Should call findByEmail with correct params", async () => {

        const result = await useCase.findByEmail("teste22");
        expect(result).not.toBeUndefined();
    })


    test("Should call findByAccountType with correct params", async () => {

        const result = await useCase.findByAccountType("ADVISOR");
        expect(result).not.toBeUndefined();
    })


    test("Should call login with correct params", async () => {

        const result = await useCase.login("teste22","teste");
        expect(result).not.toBeUndefined();
    })
    test("Should call delete Account", async () => {

        const result = await basicUseCase.delete(uuid);
        expect(result).toEqual(1)
    })
})