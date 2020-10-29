const express = require('express')
const app = express()
require('dotenv').config()
const sgMail = require('@sendgrid/mail')

const shortid = require('shortid')
const db = require('../db')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports.index = (req, res, next) =>{
    res.render('login/login')
}
var count = 0
module.exports.login = (req, res, next) => {
    let userLogin = req.body
    let checkAcc = db.get('users').find({email:userLogin.email}).value()

    const msg = {
        to: 'vyhoa1613@gmail.com',
        from: '17110381@student.hcmute.edu.vn', // Use the email address or domain you verified above
        subject: 'nhap sai pass roi con pho',
        text: 'dm m reset password di',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      //ES6

    if(!checkAcc)
    {
        res.render('login/login',{
            errors: ['nguoi dung khong ton tai']
        })   
    }
    
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    hash = checkAcc.password
    const myPlaintextPassword = userLogin.password;
    bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
        if(result =! true)
        {
            count ++;
            if(count > 3)
            {
                sgMail
                .send(msg)
                count = 0
            }
            res.render('login/login', {
                errors:['mat khau khong dung']
            })
            return;
        }
        })
    
    res.cookie('userCookie', checkAcc.id, {signed: true})
    res.redirect('/books')
}