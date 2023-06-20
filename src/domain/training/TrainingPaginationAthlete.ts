import TrainingDTO from "../../interface/dto/TrainingDTO";
import AdvisorDTO from "../../interface/dto/account/AdvisorDTO";

class TrainingRegistrationPopulate{
    _id?:string;
    advisor: AdvisorDTO;
    training:TrainingDTO;
}

export default abstract class TrainingPaginationAthlete {
    pages:number;
    trainings: TrainingRegistrationPopulate[]
}