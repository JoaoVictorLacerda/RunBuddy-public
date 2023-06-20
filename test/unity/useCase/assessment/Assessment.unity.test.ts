import MongoODM from "../../../../src/infrastructure/odm/MongoODM";
import DotenvComponent from "../../../../src/infrastructure/components/DotenvComponent";
import AssessmentUseCase from "../../../../src/application/useCase/assessment/AssessmentUseCase";
import Assessment from "../../../../src/domain/assessment/Assessment"
import AssessmentError from "../../../../src/application/exception/AssessmentError";


describe("Shold be test all operations of AdvisorTraining use case", ()=>{

    const useCase = new AssessmentUseCase();
    beforeAll(async ()=>{
        await MongoODM.connect(DotenvComponent.API_DATABASE_URL);
    })

    test("Should be create a assessment with error",async ()=>{
        const assesment:Assessment={
            advisorUuid: "",
            athleteUuid: "",
            comment: "test",
            stars: 5

        }
        try {
            await useCase.create(assesment)

            throw Error("test");
        }catch (error) {

            expect(error instanceof AssessmentError).toBe(true);
        }

    })


    test("Should be update a assessment with error",async ()=>{

        try {
            await useCase.update("","",{})

            throw Error("test");
        }catch (error) {

            expect(error instanceof AssessmentError).toBe(true);
        }

    })

    test("Should be call getCommentsAndStarsForAdvisor",async ()=>{

        expect(await useCase.getCommentsAndStarsForAdvisor("")).toEqual([])

    })


    test("Should be call getAssessmentForAdvisor",async ()=>{

        expect(await useCase.getAssessmentForAdvisor("")).toEqual(0)

    })

    test("Should be call getByAthleteAndAdvisorUuid",async ()=>{
        try {
            await useCase.getByAthleteAndAdvisorUuid("", "")

            throw Error("test");
        }catch (error) {

            expect(error instanceof AssessmentError).toBe(true);
        }

    })

})