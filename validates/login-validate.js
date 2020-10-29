const express = require('express')
const app = express()

const db = require('../db')

module.exports.auth = (req, res, next) => {
    if(!req.signedCookies.userCookie)
    {
        res.redirect('/login')
        return;
    }

    user = db.get('users')
    .find({id:req.signedCookies.userCookie})
    .value()

    if(!user)
    {
        res.redirect('/login')
        return;
    }

    res.locals.user = user
    next()
}