
const shortName = require('../utils/shortName')
const Product = require('../model/product')
const User = require('../model/user')

exports.getShop = async(req, res, next)=>{
  let products = await Product.find()

  res.render('shop', {
    pageTitle: 'Shop Page',
    path: '/shop',
    isLogged: req.isLogged,
    message: req.flash('message')[0],
    shortName: shortName(req.user),
    products
  })  
}

exports.getProductDetails = async (req, res, next)=>{
  let productId = req.params.productId
  let product = await Product.findById(productId)

  res.render('product-details', {
    pageTitle: 'Product ' + product.title,
    path: '/shop',
    isLogged: req.isLogged,
    message: req.flash('message')[0],
    shortName: shortName(req.user),
    product: product,
  })  
}




