import { Queue, Worker, Job } from "bullmq";
import BullMqConfig from "../../config/BullMqConfig";
import { JobInterface } from "../JobInterface";
import LoggerComponent from "../../components/LoggerComponent";
import TrainingRepository from "../../repository/TrainingRepository";

import AccountRepository from "../../repository/AccountRepository";
import TrainingRegistrationRepository from "../../repository/TrainingRegistrationRepository";
import AthleteSignUpTrainingJobUtil from "./AthleteSignUpTrainingJobUtil";
import TrainingError from "../../../application/exception/TrainingError";

const config = new BullMqConfig().getConfig();
const repository = new TrainingRepository();
const accountRepository = new AccountRepository();
const trainingAthleteRepository = new TrainingRegistrationRepository();
const logger = new LoggerComponent("AthleteSignUpTrainingJob");
const jobUtils = new AthleteSignUpTrainingJobUtil();

export default class AthleteSignUpTrainingJob implements JobInterface{


    public startWork(): void {
        const worker = new Worker("AthleteSignUp", this.process, config);

        worker.on('completed', (job) => {
            logger.debug(`Task completed: ${job.id}`);
          });
          
        worker.on('failed', (job, error) => {
            logger.error(`Task failed: ${job.id} - ${error.message}`, error.message);
        });
    }

    async process(job:Job): Promise<string> {

        const { trainingUuid, athleteUuid } = job.data;
        const [trainingData, athleteData]= await Promise.all([
            repository.findByUuid(trainingUuid),
            accountRepository.findByUuid(athleteUuid)
        ]);

        try{

            await jobUtils.trainingIsFull(trainingData,athleteData) // is training is full throw erro
            await AthleteSignUpTrainingJob
                .registerAthlete(
                    athleteData._id,trainingData._id,trainingData.advisorUuid,
                    trainingData.startDate, trainingData.startHour,
                    trainingData.trainingStatus != "SUSPENDED");

            trainingData.vacancies = trainingData.vacancies - 1;
            await repository.update(trainingData);
            await jobUtils.sendEmailTrainingConfirmedRegistration(athleteData.email, athleteData, trainingData);
            return job.id

        }catch(error){
            logger.error(error.message, error.message);
            await jobUtils.sendEmailTrainingProblem(athleteData.email, athleteData, trainingData);
            throw new TrainingError(error.message);
        }
        
    }

    private static async registerAthlete(athleteUuid:string, trainingUuid:string, advisorUuid:string, expiresOn:string, expiresHour:string , isActive:boolean){
        try{
            const trainingAthlete: any = {
                athleteUuid,
                trainingUuid,
                advisorUuid,
                expiresOn,
                isActive
            }
            await trainingAthleteRepository.create(trainingAthlete)

        }catch (error) {
            logger.error("Error to consume data", error.message)
            throw new TrainingError(error.message);
        }
    }

}
