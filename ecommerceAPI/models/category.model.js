const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const categorySchema = new Schema({
    parent_id:{
        type:String,
    },
    name:{
        type:String,
        required: true
    },
    slug:{
        type:String,
        required: true,
        unique:true
    },
    image:{
        type:String
    },
    status:{
        type:String,
        enum : ['active','inactive'],
        required: true
    },
    createdOn:{
        type:Date,
        required: true
    },
    updatedOn:{
        type:Date,
    },
    deletedOn:{
        type:Date,
    }
})



const Category = mongoose.model('Category',categorySchema)
module.exports = Category
