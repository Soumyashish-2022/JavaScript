const createError = require('http-errors')
const fs = require('fs')
const mongoose = require('mongoose')
const path = require('path');
const ObjectId = mongoose.Types.ObjectId

const Category = require('../models/category.model')
const moment = require('moment');

const createCategory = async (req,res,next) => {
    const image = req.body.image;
    const imageBuffer = Buffer.from(image, 'base64');

    let fileExt = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const imageFileName = `${uniqueSuffix}${fileExt}`
    const imagePath = path.join('public/uploads/images/category/', imageFileName);

    fs.writeFile(imagePath, imageBuffer, async(error) => {
        if(error){
            return res.status(500).json({ message: 'Error saving the image', error: err });
        }
        const category = new Category({
            name: req.body.name,
            slug: req.body.slug,
            image: imagePath,
            status: req.body.status,
            createdOn: currentDateTime,
            updatedOn: null,
            deletedOn: null
        })

        try{
            const result = await category.save()
            if(result){
                res.status(200)
                res.send({ status:true,message:`Category created successfully`,data:{ category:result } });
            } else {
                res.status(400)
                res.send({ status:false,message:`Category not created`,data:{ category: null } });
            }
        } catch(error){
            console.log(error)
            res.status(400)
            res.send({ status:false,message:error.message,data:null });
        }
    });
}

const fetchCategory  = async(req,res,next) => {
    try{
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit;
        const totalItems = await Category.countDocuments()
        const totalPages = Math.ceil(totalItems / limit)
        
        const result = await Category.find(req.body,{__v:0}).skip(skip).limit(limit)
        if (!result) {
            throw createError(404, `No category found!`)
        } else {
            let message = {
                page:page,
                limit:limit,
                totalItems:totalItems,
                totalPages:totalPages
            }
            res.status(200)
            res.send({ status:true, message:message, data:{ category:result } })
        }
    } catch (excep) {
        if(excep instanceof mongoose.CastError){
            console.log(excep.message)
            next(createError(400, `Somethong went wrong!`))
        }
        next(excep)
    }
}

const updateCategory = async (req,res,next) => {
    const currentDateTime = moment().format('YYYY-MM-DD hh:mm:ss')
    try{
        if(ObjectId.isValid(req.params.id)){
            const filter  = { _id: req.params.id }
            const updates = {
                name: req.body.name,
                slug: req.body.slug,
                status: req.body.status,
                updatedOn: currentDateTime
            }
            if (req.file) {
                console.log('In image',req.file.filename);
                const imageUrl = `public/uploads/images/category/${req.file.filename}`
                updates.image = imageUrl
            }
            const result = await Category.findOneAndUpdate(filter,updates,{ new:true,runValidators:true }).select('-__v')
            if (!result) {
                throw createError(400, `Category not updated!`)
            } else {
                res.status(200).json({ status:true, message:`Category updated succesfully`, data:{ category:result } })
            }
        } else { 
            throw createError(400, `Invalid category id provided`)
        }
    } catch (excep) {
        if(excep instanceof mongoose.CastError ){
            console.log(excep.message)
            next(createError(400, `Somethong went wrong!`))
        }
        next(excep)
    }
}

const deleteCategory = async (req,res,next) => {
    const deletedOn = moment().format('YYYY-MM-DD hh:mm:ss')
    try{
        if(ObjectId.isValid(req.params.id)){
            const filter  = { _id: req.params.id }
            const updates = { deletedOn: deletedOn}
            console.log(updates); 
            const result = await Category.findOneAndUpdate(filter,updates,{ new:true,runValidators:true }).select('-__v')
            if (!result) {
                throw createError(400, `Category not deleted!`)
            } else {
                res.status(200)
                res.send({ status:true, message:`Category deleted succesfully!`, data:{ category:result } })
            }
        } else { 
            throw createError(400, `Invalid category id provided`)
        }
    } catch (excep) {
        if(excep instanceof mongoose.CastError ){
            console.log(excep.message)
            next(createError(400, `Somethong went wrong!`))
        }
        next(excep)
    }
}

const restoreCategory = async (req,res,next) => {
    const deletedOn = moment().format('YYYY-MM-DD hh:mm:ss')
    try{
        if(ObjectId.isValid(req.params.id)){
            const filter  = { _id: req.params.id }
            const updates = { deletedOn: null }
            console.log(updates); 
            const result = await Category.findOneAndUpdate(filter,updates,{ new:true,runValidators:true }).select('-__v')
            if (!result) {
                throw createError(400, `Category not deleted!`)
            } else {
                res.status(200)
                res.send({ status:true, message:`Category deleted succesfully!`, data:{ category:result } })
            }
        } else { 
            throw createError(400, `Invalid category id provided`)
        }
    } catch (excep) {
        if(excep instanceof mongoose.CastError ){
            console.log(excep.message)
            next(createError(400, `Somethong went wrong!`))
        }
        next(excep)
    }
}

module.exports = { 
    createCategory, 
    fetchCategory, 
    updateCategory, 
    deleteCategory, 
    restoreCategory 
}