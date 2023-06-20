import { Job, Queue } from "bullmq"

export interface JobInterface{
    startWork():void
    process(job:Job):Promise<any>
}