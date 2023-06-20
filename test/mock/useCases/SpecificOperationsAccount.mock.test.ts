import AccountSpecificOperationsUseCase
    from "../../../src/application/useCase/account/AccountSpecificOperationsUseCase";

describe("Specifc operations account", ()=> {
    const useCase = new AccountSpecificOperationsUseCase();

    test("Should call findByUuid with correct params", async () => {

        jest.spyOn(useCase, "findByUuid").mockImplementation();

        await useCase.findByUuid("uuid teste");
        expect(useCase.findByUuid).toHaveBeenCalledWith("uuid teste");

        await useCase.findByUuid(undefined);
        expect(useCase.findByUuid).toHaveBeenCalledWith(undefined);

        await useCase.findByUuid(null);
        expect(useCase.findByUuid).toHaveBeenCalledWith(null);
    })


    test("Should call findByEmail with correct params", async () => {

        jest.spyOn(useCase, "findByEmail").mockImplementation();

        await useCase.findByEmail("email teste");
        expect(useCase.findByEmail).toHaveBeenCalledWith("email teste");

        await useCase.findByEmail(undefined);
        expect(useCase.findByEmail).toHaveBeenCalledWith(undefined);

        await useCase.findByEmail(null);
        expect(useCase.findByEmail).toHaveBeenCalledWith(null);
    })


    test("Should call findByAccountType with correct params", async () => {

        jest.spyOn(useCase, "findByAccountType").mockImplementation();

        await useCase.findByAccountType("type teste");
        expect(useCase.findByAccountType).toHaveBeenCalledWith("type teste");

        await useCase.findByAccountType(undefined);
        expect(useCase.findByAccountType).toHaveBeenCalledWith(undefined);

        await useCase.findByAccountType(null);
        expect(useCase.findByAccountType).toHaveBeenCalledWith(null);
    })


    test("Should call login with correct params", async () => {

        jest.spyOn(useCase, "login").mockImplementation();

        await useCase.login("email","pass");
        expect(useCase.login).toHaveBeenCalledWith("email","pass");

        await useCase.login(undefined, undefined);
        expect(useCase.login).toHaveBeenCalledWith(undefined, undefined);

        await useCase.login(null, null);
        expect(useCase.login).toHaveBeenCalledWith(null, null);
    })
})