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
    name:{
        type: String,
        required: true
    },
    imgLink:{
        type:String,
        required: false
    },
    description:{
        type: String,
        required: true
    },
    // participation information
    limitDateRegistration:{
        type: Date,
        required: true
    },
    startDate:{
        type: Date,
        required: true
    },
    startHour:{
        type: String,
        required: true
    },
    vacancies:{
        type: Number,
        required: true,
        default: 0
    },
    trainingStatus:{
        type: String,
        enum:["ACTIVE","INACTIVE","FULL"],
        required: true,
        default: "ACTIVE"
    },
    // address information
    startAddress:{
    },
    suportPoints:{
        type: Array,
        required: true,
        default: []
    },
    finishAddress:{
    },
    isActive:{
        type: Boolean,
        default: true
    }
});
const TreiningSchema = mongoose.model("Training", schema);
export default TreiningSchema;