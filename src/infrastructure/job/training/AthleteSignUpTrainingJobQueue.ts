import {Queue} from "bullmq";
import BullMqConfig from "../../config/BullMqConfig";

export default class AthleteSignUpTrainingQueue{
    private queue:Queue;
    private constructor(){
        this.queue = new Queue("AthleteSignUp",new BullMqConfig().getConfig());
    }

    private static instance:AthleteSignUpTrainingQueue;
    public static getInstance(){
        if(!AthleteSignUpTrainingQueue.instance){
            AthleteSignUpTrainingQueue.instance = new AthleteSignUpTrainingQueue();
        }
        return AthleteSignUpTrainingQueue.instance;
    }

    public getQueue():Queue{
        return this.queue;
    }
}