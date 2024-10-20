import mongoose from 'mongoose'
import User from '../model/user.model.js';
//Creating Schema 
const todoSchema = new mongoose.Schema({

    text:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User, // Referencing 'User' model to connect to users collection in MongoDB
        required: true
    }
})

//Creating Model of the above Schema
const Todo = mongoose.model("Todo",todoSchema);

export default Todo