const Product = require('../model/product')
const User = require('../model/user')
const shortName = require('../utils/shortName')

exports.getAdminProduct = async(req, res, next)=>{
  let products = await Product.find({ userId: req.user._id })
  res.render('admin/admin-product', {
    pageTitle: 'Admin Product',
    path: '/admin/admin-product',
    isLogged: req.isLogged,
    shortName : shortName(req.user),
    message: req.flash('message')[0],
    products: products
  })  
}


exports.getAddProduct = (req, res, next)=>{
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isLogged: req.isLogged,
    shortName: shortName(req.user),
    message: req.flash('message')[0],
  })
  
}

exports.postAddProduct = async (req, res, next)=>{
  const { title, imageUrl, price, description } = req.body
  let product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user._id
  })
  await product.save()
  req.flash('message', 'Product Added')  
  res.redirect('/admin/admin-product')
}

exports.postDeleteProduct = async (req, res, next)=>{
  let productId = req.params.productId
  await Product.findByIdAndDelete({_id: productId, userId:req.user._id})
  req.flash('message', "Product Deleted")
  res.redirect('/admin/admin-product')
    
}


//! Cart Functionality

exports.getCart = async (req, res, next)=>{
  let user;
  if(!req.user){
    user = undefined
  } else {
    user = await User.findById(req.user._id).populate('cart.items.productId')
  }  

  res.render('admin/cart', {
    pageTitle: 'Cart Items',
    path: '/admin/cart',
    isLogged: req.isLogged,
    message: req.flash('message')[0],
    shortName: shortName(req.user),
    user: user
  })
  
}


exports.addToCart = async (req, res, next)=>{

  //. 0. find user who current Log in
  //. 1. new cartitem { productId:"", quantity:1 } push ==> cart.items
  //. 2. existing item (productId) findIndex ==>  from cart.items 
  //. 3. if(existing item found) ==> updated quantity
  //. 4. else push new cart product to ==> cart.items
  //. 5. user save()

  let { productId } = req.body  
  let userId = req.user._id

  let user = await User.findById(userId)
  let updateProductIndex = user.cart.items.findIndex(el=>el.productId == productId)
  
  let product = {
    productId: productId,
    quantity: 1
  }
  //. cartItem not yet buy ( item push ==> )
  if(updateProductIndex < 0){
    user.cart.items.push(product)

  } else {
    //. cartItem already once Bougth (then increase qunatity)
    user.cart.items[updateProductIndex].quantity = user.cart.items[updateProductIndex].quantity + 1
  }
  
  await user.save()
  res.redirect('/shop')
}

exports.deleteCart = async(req, res, next)=>{
  let productId = req.params.productId

  let user = await User.findById(req.user._id)
  let items = [...user.cart.items]

  let updatedCartItemIndex = items.findIndex(i=>i.productId == productId)
  let updateProduct = items[updatedCartItemIndex]

  if(updateProduct.quantity <= 1){
    items.splice(updatedCartItemIndex, 1)
  } else {
    updateProduct.quantity--
  }
  user.cart.items = items
  await user.save()
  
  res.redirect('/admin/cart')  
}