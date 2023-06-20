import AdvisorTrainingBasicOperationsUseCase
    from "../../../../../src/application/useCase/training/advisor/AdvisorTrainingBasicOperationsUseCase";
import Training from "../../../../../src/domain/training/Training";
import MongoODM from "../../../../../src/infrastructure/odm/MongoODM";
import DotenvComponent from "../../../../../src/infrastructure/components/DotenvComponent";
import TrainingError from "../../../../../src/application/exception/TrainingError";

describe("Shold be test all operations of AdvisorTraining use case", ()=>{

    const useCase = new AdvisorTrainingBasicOperationsUseCase()
    beforeAll(async ()=>{
        await MongoODM.connect(DotenvComponent.API_DATABASE_URL);
    })

    test("Should be create Training and throw error",async ()=>{

        const training:Training ={
            advisorUuid: "",
            description: "",
            finishAddress: undefined,
            limitDateRegistration: undefined,
            name: "",
            startAddress: undefined,
            startDate: undefined,
            startHour: "",
            suportPoints: [],
            trainingStatus: "",
            vacancies: 0

        }

        try {
            expect(await useCase.create(training)).rejects.toThrow(TrainingError);
            throw new Error('A TrainingError deve ser lançada');
        }catch (error) {
            expect(error instanceof TrainingError).toBe(true);
        }
    })

    test("Should be update Training and throw error",async ()=>{

        const training:Training ={
            advisorUuid: "",
            description: "",
            finishAddress: undefined,
            limitDateRegistration: undefined,
            name: "",
            startAddress: undefined,
            startDate: undefined,
            startHour: "",
            suportPoints: [],
            trainingStatus: "",
            vacancies: 0

        }
        try {
            expect(await useCase.updateTraining(training,"","")).rejects.toThrow(TrainingError);
            throw new Error('A TrainingError deve ser lançada');
        }catch (error) {
            expect(error instanceof TrainingError).toBe(true);
        }

    })

    test("Should be read Training",async ()=>{

        await expect(await useCase.read()).toEqual([])
    })
})