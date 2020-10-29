const express = require('express')
const router = express.Router()
const multer  = require('multer')

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
const upload = multer({ storage: storage })

const usersRouter = require('../controllers/users-controllers')

router.get('/', usersRouter.usersView)

router.get('/create', usersRouter.getUserCreate)

router.post('/create',
    upload.single('avatar'),
    usersRouter.postUserCreate)

router.get('/:id/update', usersRouter.getUserUpdate)

router.post("/update",
    upload.single('avatar'),
    usersRouter.postUserUpdate)

router.get('/:id/delete', usersRouter.getUserDelete)

module.exports = router