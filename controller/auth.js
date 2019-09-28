const User = require('../model/user')
const shortName = require('../utils/shortName')

exports.getRegister = (req, res, next)=>{
  res.render('auth/register', {
    pageTitle: 'Register',
    path: '/auth/register',
    isLogged: req.isLogged,
    shortName: shortName(req.user)
  })
}


exports.postRegister = async (req, res, next)=>{
  const { username, email, password } = req.body

  if(!email){
    req.flash('message', "Please Give Your Email")
    return res.redirect('/auth/login')
  }

  let user = await User.findOne({email:email})
  if(user){
    req.flash('message', "This Email not Registered")
    return res.redirect('/auth/login')
  } 

  if(!password){
    req.flash('message', "Please Give Your Password")
    return res.redirect('/auth/login')
  }

  user = new User({
    username: username,
    email: email,
    password: password
  })
  await user.save()
  res.redirect('/auth/login')
}


exports.getLogin = (req, res)=>{
  res.render('auth/login', {
    pageTitle: 'Login',
    path:'/auth/login',
    isLogged: req.isLogged,
    shortName: shortName(req.user),
    message: req.flash('message')[0]
  })
}

exports.postLogin = async (req, res)=>{
  const { email, password } = req.body

  if(!email){
    req.flash('message', "Please Give Your Email")
    return res.redirect('/auth/login')
  }

  let user = await User.findOne({email:email})
  if(!user){
    req.flash('message', "This Email not Registered")
    return res.redirect('/auth/login')
  } 

  if(!password){
    req.flash('message', "Please Give Your Password")
    return res.redirect('/auth/login')
  }

  user = await User.findOne({email:email, password:password})
  if(user){
    req.flash('message', "Logged")
    req.session.userId = user._id
    return res.redirect('/shop')
  } 
  req.flash('message', "Password Not Match")
  res.redirect('/auth/login')
}




exports.postLogout = (req, res, next)=>{
  req.session.destroy(err=>{
    res.redirect('/auth/login')
  })
}
