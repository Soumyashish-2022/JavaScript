const categoryRepository = require('../repositories/category.repository')

const createCategory = async (payload) => {
    try{
        const result = await categoryRepository.createCategory({
            name: payload.name,
            slug: payload.slug,
            image: payload.imagePath,
            status: payload.status,
            createdOn: new Date(),
            updatedOn: null,
            deletedOn: null
        });
        return result
    } catch(error) {
        throw new Error(error.message)
    }
    
}