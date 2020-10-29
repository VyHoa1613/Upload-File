const express = require('express')
const router = express.Router()
const bookControllers = require('../controllers/books-controller')

const multer  = require('multer')

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
const upload = multer({ storage: storage })


router.get('/' ,bookControllers.index)

router.get('/create', bookControllers.getCreateBook)

router.post('/create',
        upload.single('image'),
        bookControllers.postCreateBook)

router.get('/:id/update', bookControllers.getUpdateBook)

router.post('/update',
    upload.single('image'),
    bookControllers.postUpdateBook )

router.get("/:id/delete", bookControllers.getDeleteBook )

module.exports =  router;