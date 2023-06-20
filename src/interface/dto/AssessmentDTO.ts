import Assessment from "../../domain/assessment/Assessment";
import AdvisorDTO from "./account/AdvisorDTO";
import AthleteDTO from "./account/AthleteDTO";

export default class AssessmentDTO {
    uuid:string
    athlete:any;
    advisor:any;
    comment:string;
    stars:number;
    athleteCanComment:boolean;
    advisorResponseComment:string;


    constructor(assessment: Assessment) {
        this.uuid=assessment._id;
        this.athlete = assessment.athleteUuid ? new AthleteDTO(assessment.athleteUuid) : undefined;
        this.advisor = assessment.advisorUuid ? new AdvisorDTO(assessment.advisorUuid) : undefined;
        this.comment = assessment.comment;
        this.stars = assessment.stars;
        this.athleteCanComment = assessment.athleteCanComment;
        this.advisorResponseComment = assessment.advisorResponseComment
    }
    public static converter(assessmentList: Assessment[]): AssessmentDTO[] {
        if (assessmentList.length != 0) {
            return assessmentList.map((item) => new AssessmentDTO(item));
        }
        return undefined;
    }
}