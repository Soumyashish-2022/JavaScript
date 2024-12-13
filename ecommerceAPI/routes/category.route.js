const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()

const categoryController = require('../controller/category.controller')

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads/images/category/')
    },
    filename: (req, file, callback) => {
        let fileExt = path.extname(file.originalname)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, `${uniqueSuffix}${fileExt}`)
    },
    fileFilter: function (req, file, callback) {
        let fileExt = path.extname(file.originalname);
        console.log(fileExt)
        if(fileExt !== '.png' && fileExt !== '.jpg' && fileExt !== '.gif' && fileExt !== '.jpeg') {
            return callback(new Error(`Please upload only image file`))
        }
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    }
})
var upload = multer({ storage: storage })

router.post('/fetch', categoryController.fetchCategory)

router.post('/add', upload.single('image'), categoryController.createCategory)

router.patch('/update/:id', upload.single('image'), categoryController.updateCategory)

router.delete('/delete/:id', categoryController.deleteCategory)

router.get('restore/:id', categoryController.restoreCategory)

module.exports = router