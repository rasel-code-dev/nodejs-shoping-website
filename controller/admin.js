const Product = require("../model/product");
const User = require("../model/user");
const Cart = require("../model/cart");
const shortName = require("../utils/shortName");

exports.getAdminProduct = async (req, res, next) => {
  let products = await Product.find({ userId: req.user._id });
  res.render("admin/admin-product", {
    pageTitle: "Admin Product",
    path: "/admin/admin-product",
    isLogged: req.isLogged,
    shortName: shortName(req.user),
    message: req.flash("message")[0],
    products: products
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    isLogged: req.isLogged,
    shortName: shortName(req.user),
    message: req.flash("message")[0]
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  let product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user._id
  });
  await product.save();
  req.flash("message", "Product Added");
  res.redirect("/admin/admin-product");
};

exports.postDeleteProduct = async (req, res, next) => {
  let productId = req.params.productId;
  await Product.findByIdAndDelete({ _id: productId, userId: req.user._id });
  req.flash("message", "Product Deleted");
  res.redirect("/admin/admin-product");
};

//! Cart Functionality

exports.getCart = async (req, res, next) => {
  let cart;
  if (!req.user) {
    cart = undefined;
  } else {
    cart = await Cart.findOne({ userId: req.user._id })
      .populate("userId")
      .populate("cart.items.productId");
  }
  res.render("admin/cart", {
    pageTitle: "Cart Items",
    path: "/admin/cart",
    isLogged: req.isLogged,
    message: req.flash("message")[0],
    shortName: shortName(req.user),
    cart: cart
  });
};

exports.addToCart = async (req, res, next) => {
  //! A  if collection is empty and
  //.     when create new database in new pc
  //.     ==> so, You have to Create new Cart Collection with cartitms object 
  //.     otherwise if fail to find array  === cart.items


  //! B   if collection is not empty 
  //! 1.  check cart item already bought or not 
  //.     if not => push cart object inside items array.
  //! 2.  or if already buy ==> then with index ==> increase quantity
  //. 3.  save() it


  let { productId } = req.body;
  let userId = req.user._id;
  let cartData = await Cart.findOne({ userId: userId });

  //! check collection empty
  if (cartData === null) {
    let newCartItem = new Cart({
      userId: userId,
      cart: {
        items: [{ productId: productId, quantity: 1 }]
      }
    });
    await newCartItem.save();

  } else {
    //! check not collection empty
    let items = [...cartData.cart.items];
    let updatedItemIndex = items.findIndex(cp => cp.productId == productId);
    //! item not yet bought
    if (updatedItemIndex < 0) {
      items.push({
        productId: productId,
        quantity: 1
      });
    } else {
      //! item already bought
      items[updatedItemIndex].quantity++;
    }

    cartData.cart.items = items;
    await cartData.save();
  }

  res.redirect("/shop");
};

exports.deleteCart = async (req, res, next) => {

    //. find Cart via currently logged userId
  //. findIndex our target cartitem via productId
  //. find this single cartitem object via findIndex
  //. if it quantity greater than 1 ==>  decrease this quantity
  //. if it quantity <= 1 ==>  delete this cartitem product

  let productId = req.params.productId;
  let userId = req.user._id


  let cartData = await Cart.findOne({userId: userId}) 
  const items = [ ...cartData.cart.items ]
  const updatedItemIndex = items.findIndex(cpi=> cpi.productId == productId )
  let updateCartItem = items[updatedItemIndex]

  if(updateCartItem.quantity > '1'){
    updateCartItem.quantity--
  } else {
    items.splice(updatedItemIndex, 1)
  }

  cartData.cart.items = items

  await cartData.save();
  res.redirect("/admin/cart");
};
