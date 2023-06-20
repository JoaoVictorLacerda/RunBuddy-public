import mongoose from "mongoose";

const schema = new mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    refreshToken:{
        type: String,
        required: false,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    birthDate:{
        type: String,
        required: true,
    },
    telephone:{
        type: String,
        required: true,
    },
    cep:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    rules:[{
        type: String,
        required: true,
    }],
    checked:{
        type: Boolean,
        required: false,
    },
    recoverPassCode:{
        type: String,
        required: false
    },
    imageLink:{
        type: String,
        required: false
    },
    deletedAt:{
        type: Date,
        required: false,
        default: undefined
    }

});
const AccountSchema = mongoose.model("Account", schema);
export default AccountSchema;