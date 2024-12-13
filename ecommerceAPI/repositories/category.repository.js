const categoryModel = require('../models/category.model')

const createCategory = async (data) => {
    const category = new categoryModel(data)
    try {
        const result = await category.save()
        if(!result){
            throw new Error("category not craeted")
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    createCategory
}