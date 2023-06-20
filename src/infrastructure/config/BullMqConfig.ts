import DotenvComponent from "../components/DotenvComponent";

export default class BullMqConfig{
    private config:any;

    constructor(){
        this.config = {
            connection: {
                host: DotenvComponent.REDIS_HOST,
                port: DotenvComponent.REDIS_PORT,
                password: DotenvComponent.REDIS_PASSWORD,
              },
              limiter: {
                max: 10,
                duration: 1000,
              },
              defaultJobOptions: {
                attempts: 3,
                backoff: {
                  type: "exponential",
                  delay: 100,
                },
              },
        }
    }

    public getConfig(){
        return this.config;
    }
}