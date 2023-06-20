import TrainingPaginationAthlete from "../../domain/training/TrainingPaginationAthlete";

export default class TrainingPaginationAthleteDTO {

    pages:number
    trainings: any;

    constructor(trainingPagination: TrainingPaginationAthlete) {
        this.pages = trainingPagination.pages===0 ? 1 : trainingPagination.pages;
        this.trainings = trainingPagination.trainings
    }

}

