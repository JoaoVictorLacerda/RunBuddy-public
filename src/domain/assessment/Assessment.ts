export default abstract class Assessment {
    _id?:string;
    advisorUuid:any;
    athleteUuid:any;
    comment:string;
    stars:number;
    advisorResponseComment?:string;
    athleteCanComment?:boolean;
}