import mongoose from "mongoose";

const schema = new mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    advisorUuid:{
        type: String,
        required: true,
        ref:"Account"
    },
    athleteUuid:{
        type: String,
        required: true,
        ref:"Account"
    },
    comment:{
        type: String,
        required: false,
    },
    stars:{
        type:Number,
        required: true,
    },
    advisorResponseComment:{
        type:String,
        required: false,
    },
    athleteCanComment:{
        type:Boolean,
        required: true,
        default: true
    }
});
const AssessmentSchema = mongoose.model("Assessment", schema);
export default AssessmentSchema;