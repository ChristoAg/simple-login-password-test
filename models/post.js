const mongoose= require("mongoose")
const PostSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    }, image:{
        type:Buffer,
        contentType:String,
    }, description:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model("Post",PostSchema)