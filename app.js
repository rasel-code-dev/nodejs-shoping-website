const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoDBStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')

const DBURI = 'mongodb://localhost/shopping-cart'
const store = new mongoDBStore({
  uri: DBURI,
  collection: 'session'
})

const User = require('./model/user')
const shopRoutes = require('./routes/shop.js')
const adminRoutes = require('./routes/admin.js')
const authRoutes = require('./routes/auth.js')


const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
  secret: 'ERJKLRH',
  resave: false,
  saveUninitialized: false,
  store: store,
}))

app.use(flash())
app.use( async (req, res, next)=>{
  if(req.session.userId){
    let user = await User.findById(req.session.userId)
    req.user = user,
    req.isLogged = true
    return next()
  }
  next()
})


app.use('/', shopRoutes)
app.use('/admin', adminRoutes)
app.use('/', authRoutes)


const port = process.env.PORT || 4000
app.listen(port, ()=>console.log(`Server is running on port ${port}`))
mongoose.connect(DBURI, {useNewUrlParser:true})
  .then(()=>console.log('Database Connected'))
  .catch((err)=>console.log('Database Connection Error'))