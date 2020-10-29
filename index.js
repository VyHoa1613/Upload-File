const express = require('express')
const app = express()
var cookieParser = require('cookie-parser')

const port = 3000

const bookRoutes = require('./routes/home-routes')
const userRoutes = require('./routes/users-routes')
const tranRoutes = require('./routes/transactions-routes')
const loginRoutes = require('./routes/login-routes')
const productRoutes = require('./routes/products-routes')
const cartRoutes = require('./routes/cart-routes')

const sessionsMiddleware = require('./middware/session')
const validate = require('./validates/login-validate')


app.use(cookieParser('hoadeptrai'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(sessionsMiddleware)

app.use(express.static('public'))


app.set('Views','./Views')
app.set('view engine', 'pug')


app.use('/login', loginRoutes)
app.use("/books", validate.auth ,bookRoutes)
app.use('/users', validate.auth , userRoutes)
app.use('/transactions', validate.auth,tranRoutes)
app.use('/', productRoutes)
app.use('/cart', cartRoutes)
app.listen(port, () =>{
    console.log('app start on port :' + port)
})