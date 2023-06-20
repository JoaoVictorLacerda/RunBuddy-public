import TrainingRegistrationUseCase from "../../../../src/application/useCase/training/TrainingRegistrationUseCase";
import MongoODM from "../../../../src/infrastructure/odm/MongoODM";
import DotenvComponent from "../../../../src/infrastructure/components/DotenvComponent";


describe("Shold be test all operations of AdvisorTraining use case", ()=>{

    const useCase = new TrainingRegistrationUseCase();
    beforeAll(async ()=>{
        await MongoODM.connect(DotenvComponent.API_DATABASE_URL);
    })

    test("Should be read trainings of athlete of athlete",async ()=>{


        expect(await useCase.getTrainingsOfAthlete("", true)).toEqual({"pages": 0, "trainings": []})

    })

})