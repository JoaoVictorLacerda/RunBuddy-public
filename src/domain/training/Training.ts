class Address{
    cep:string;
    city:string;
    street:string;
    neighborhood: string;
    number:number;
}
export default abstract class Training{
    _id?:string;
    advisorUuid:string;
    name:string;
    imgLink?:string
    description:string;
    limitDateRegistration:any;
    startDate:any;
    startHour:string;
    vacancies:number
    trainingStatus:string;
    startAddress:Address;
    suportPoints:Address[];
    finishAddress:Address;
    isActive?: boolean;
}