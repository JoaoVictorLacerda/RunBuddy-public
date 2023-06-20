import TrainingDTO from "../../interface/dto/TrainingDTO";

class TrainingRegistrationPopulate{
    training:TrainingDTO;
}

export default abstract class TrainingPaginationAdvisor {
    pages:number;
    trainings: TrainingRegistrationPopulate[]
}