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
    trainingUuid:{
        type: String,
        required: true,
        ref:"Training"
    },
    isActive:{
        type: Boolean,
        required: true,
        default: true
    },
    expiresOn: {
        type: Date,
        required: true,
    }
});
const TrainingRegistrationSchema = mongoose.model("Training_Registration", schema);
export default TrainingRegistrationSchema;