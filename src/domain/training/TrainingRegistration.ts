import Account from "../account/Account";
import Training from "./Training";

export default abstract class TrainingRegistration {
    _id:string;
    advisorUuid:Account;
    athleteUuid:Account;
    trainingUuid:Training;
    isActive:boolean;
    expiresOn:string;
    expiresHour:string;
}