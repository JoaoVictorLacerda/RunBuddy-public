import MongoODM from "../../../../../src/infrastructure/odm/MongoODM";
import DotenvComponent from "../../../../../src/infrastructure/components/DotenvComponent";
import AdvisorTrainingSpecificOperationsUseCase
    from "../../../../../src/application/useCase/training/advisor/AdvisorTrainingSpecificOperationsUseCase";
import TrainingError from "../../../../../src/application/exception/TrainingError";

describe("Shold be test all operations of AdvisorTraining use case", ()=>{

    const useCase = new AdvisorTrainingSpecificOperationsUseCase()
    beforeAll(async ()=>{
        await MongoODM.connect(DotenvComponent.API_DATABASE_URL);
    })

    test("Should be findAthletesIntoTraining Training and throw error",async ()=>{

        expect(await useCase.findAthletesIntoTraining("")).toEqual([])
    })

    test("Should be update Training and throw error",async ()=>{


        expect(await useCase.findByAdvisor("",true)).toEqual({"pages": 0, "trainings": []})
    })

    test("Should be read Training", async () => {
        try {

            await useCase.suspendedOrReactivateTraining("", "", true);
            // Se a função não lançar um erro, o teste falhará
            throw new Error('A TrainingError deve ser lançada');
        } catch (error) {
            expect(error instanceof TrainingError).toBe(true);
        }
    });
})