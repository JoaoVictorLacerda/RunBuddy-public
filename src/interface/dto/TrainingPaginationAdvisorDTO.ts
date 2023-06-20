import TrainingPaginationAdvisor from "../../domain/training/TrainingPaginationAdvisor";

export default class TrainingPaginationAdvisorDTO {
    pages:number
    trainings: any;

    constructor(trainingPagination: TrainingPaginationAdvisor) {
        this.pages = trainingPagination.pages===0 ? 1 : trainingPagination.pages;
        this.trainings = trainingPagination.trainings
    }

}

