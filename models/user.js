// const Sequelize = require("sequelize");
// // const sequelize = require("../util/database");

// // const User = sequelize.define("user", {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true,
// //   },
// //   name: { type: Sequelize.STRING, allowNull: false },
// //   email: { type: Sequelize.STRING}
// // });

// // module.exports = User
// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');
// const ObjectId = mongodb.ObjectId
// class User {
//   constructor(username,email,cart,id){
//     this.name = username;
//     this.email = email;
//     this.cart = cart
//     this._id = id
//   }
// save(){
//   const db = getDb();
//   return db.collection('users').insertOne(this)
//   .then(result=>{
//   })
//   .catch(err=>console.log(err))

// }
// addToCart(product){
//   const cartProductIndex = this.cart.items.findIndex(cp =>{
//    return cp.productId?.toString() === product._id?.toString()
//   });
//   let newQuantity = 1;
//   const updateCartItems =[...this.cart.items];
//   if(cartProductIndex >= 0){
//     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//     updateCartItems[cartProductIndex].quantity = newQuantity;
//   }else{
//     updateCartItems.push({productId:new mongodb.ObjectId(product._id), quantity:newQuantity})
//   }
//   const updatedCart = {items:updateCartItems}
//   const db=getDb();
//  return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:updatedCart}})
// }

// deleteItemFromCart(prodId){
//   const db = getDb();
//   const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== prodId.toString())
//   console.log(updatedCartItems);
//   return db.collection('users').updateOne({_id:new ObjectId(this._id)},
//   {$set:{cart:{items:updatedCartItems}}}
//   )

//   }

// addOrder(){
//   const db = getDb();
//  return this.getCart().then(products=>{
//     const order = {
//       item:products,
//       user:{
//         _id:new ObjectId(this._id),
//         name:this.name,

//       }
//   }
//   return db.collection('orders').insertOne(order).then(result=>{
//     this.cart = {items:[]};
//     return db.collection('users').updateOne({_id:new ObjectId(this._id)}, {$set : {cart:{items:[]}}})
//   })

//   })

// }
// getOrders(){
//   const db= getDb();
//   return db.collection('orders').find({"user._id":new ObjectId(this._id)}).toArray();

// }
// static findById(userId){

//   const db = getDb();
//   return db.collection('users').findOne({_id:new mongodb.ObjectId(userId)}).then(user=>{
//     return user
//   }).catch(err=>console.log(err))
// }

// getCart(){
//   const db = getDb();
//   const productsIds = this.cart.items.map(p=>  p.productId)
//   return db.collection('products').find({_id:{$in:productsIds}}).toArray().then(products=>{
//     return products.map(p=>{
//       return {...p,quantity:this.cart.items.find(i=>{
//         return i.productId?.toString() === p._id?.toString()
//       }).quantity
//     }
//     })
//   })

// }

// }

// module.exports = User

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
 
  email: {
    type: String,
    required: true,
  },
  password:{
    type:String,
    required:true,
  },
  resetToken:String,
  resetTokenExpire:Date,
  cart: {
    items: [
      { productId: { type: Schema.Types.ObjectId,required:true,ref:"Product" }, quantity: { type: Number, required: true } },
    ],
  },
});
userSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart?.items?.findIndex(cp =>{
       return cp.productId?.toString() === product._id?.toString()
      });
      let newQuantity = 1;
      const updateCartItems =[...this.cart?.items];
      if(cartProductIndex >= 0){
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updateCartItems[cartProductIndex].quantity = newQuantity;
      }else{
        updateCartItems.push({productId:product._id, quantity:newQuantity})
      }
      const updatedCart = {items:updateCartItems}
      this.cart = updatedCart
     return this.save()


}
userSchema.methods.removeFromCart = function(productId){
 
    const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString())
    this.cart.items = updatedCartItems
    return this.save()
}
userSchema.methods.clearCart = function(){
  this.cart = {items:[]};
  return this.save()
}
module.exports = mongoose.model('User',userSchema)