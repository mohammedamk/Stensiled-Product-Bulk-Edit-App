import mongoose from "mongoose";

const completedTaskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    queueId:String,
    type:String,
    shopOrigin: String,
    editOption: String,
    editValue: Number,
    variantFilterOptions:{},
    variant:{},
    status:String,
    statusText:String,
    created_at: String,
    updated_at: String,
})

const CTask = mongoose.model("completedTasks", completedTaskSchema);
export default CTask;


