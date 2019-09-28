

module.exports = (req, res, next)=>{
  if(!req.isLogged){  
    return res.redirect('/auth/login')
  }
  next()
}