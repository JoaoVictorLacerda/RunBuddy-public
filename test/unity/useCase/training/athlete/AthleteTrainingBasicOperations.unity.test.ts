import MongoODM from "../../../../../src/infrastructure/odm/MongoODM";
import DotenvComponent from "../../../../../src/infrastructure/components/DotenvComponent";
import AthleteTrainingBasicOperationsUseCase
    from "../../../../../src/application/useCase/training/athlete/AthleteTrainingBasicOperationsUseCase";
import TrainingError from "../../../../../src/application/exception/TrainingError";

describe("Shold be test all operations of AdvisorTraining use case", ()=>{

    const useCase = new AthleteTrainingBasicOperationsUseCase();
    beforeAll(async ()=>{
        await MongoODM.connect(DotenvComponent.API_DATABASE_URL);
    })

    test("Should be read trainings of athlete",async ()=>{

        expect(await useCase.readTrainings({})).toEqual({"pages": 0, "trainings": []})
    })

    test("Should be try signUp in training",async ()=>{


        try {
            await useCase.signUp("","")
            throw new Error('A TrainingError deve ser lançada');
        }catch (error) {
            expect(error instanceof TrainingError).toBe(true);
        }

    })

})