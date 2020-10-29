const express = require('express')
const app = express()

require('dotenv').config()
var cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL)

const shortid = require('shortid')
const db = require('../db')

module.exports.usersView =  (req, res, next) => {
    res.render('users/index',{
        users:db.get('users').value()
    })
}

module.exports.postUserCreate = async (req, res, next) => {
    req.body.id = shortid.generate()
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const myPlaintextPassword = req.body.password;
    let avatar = await cloudinary
                    .uploader
                    .upload(req.file.path,{
                        folder:'express'
                    } ,function(error, result) { 
                        return result
                    })  

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
            req.body.password = hash
            req.body.avatar = avatar.secure_url
            db.get('users').push(req.body).write()
        });
    });
    res.redirect('/users')    
}

module.exports.getUserCreate = (req, res) => {
    res.render('users/create')
}

module.exports.getUserUpdate = (req, res) => {
    let id = req.params.id
    let user = db.get('users').find({id: id}).value()
    res.render('users/update', {
        user:user
    })
}
module.exports.postUserUpdate = async (req, res) => {
    let id = req.body.id
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const myPlaintextPassword = req.body.password;
    let avatar = await cloudinary
                    .uploader
                    .upload(req.file.path,{
                        folder:'express'
                    } ,function(error, result) { 
                        return result
                    })  

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
            req.body.password = hash
            req.body.avatar = avatar.secure_url
            let newUser = req.body
            db.get('users')
            .find({id: id})
            .assign({
                name: newUser.name,
                 email: newUser.email,
                  password: newUser.password,
                  avatar: newUser.avatar
                })
            .write()
        });
    });
    res.redirect('/users')
}



module.exports.getUserDelete = (req, res) => {
    let id = req.params.id
    db.get('users').remove({id:id}).write()
    res.redirect("/users")
}