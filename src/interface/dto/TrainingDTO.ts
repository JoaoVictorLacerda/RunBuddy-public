import Training from "../../domain/training/Training";

export default class TrainingDTO {
    uuid: string;
    advisorUuid:string;
    name:string;
    imgLink:string
    description:string;
    limitDateRegistration:string;
    startDate:string;
    startHour:string;
    vacancies: number;
    trainingStatus:string;
    startAddress:any;
    suportPoints:any[];
    finishAddress:any;
    isActive:boolean;

    constructor(training: Training) {
        this.uuid = training._id;
        this.advisorUuid = training.advisorUuid;
        this.name = training.name;
        this.imgLink=training.imgLink;
        this.description=training.description;
        this.limitDateRegistration=this.transformDate(training.limitDateRegistration);
        this.startDate=this.transformDate(training.startDate);
        this.startHour=training.startHour;
        this.vacancies = training.vacancies;
        this.startAddress=training.startAddress;
        this.suportPoints=training.suportPoints;
        this.finishAddress=training.finishAddress;
        this.trainingStatus = training.trainingStatus;
        this.isActive = training.isActive;
    }

    public static converter(AccountList: Training[]): TrainingDTO[] {
        if (AccountList.length != 0) {
            return AccountList.map((item) => new TrainingDTO(item));
        }
        return undefined;
    }
    private transformDate(date:Date){
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return day + '/' + month + '/' + year;
    }
}