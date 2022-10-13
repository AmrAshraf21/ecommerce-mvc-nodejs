// // const fs = require("fs");
// // const path = require("path");
// // // const products = [];
// // const db = require("../util/database");
// // const Cart = require("./cart");
// // const p = path.join(
// //   path.dirname(process.mainModule.filename),
// //   "data",
// //   "products.json"
// // );

// // // const getProductFromFile = (cb)=>{

// // //     fs.readFile(p,(err,fileContent)=>{
// // //         if(err){
// // //            cb([])
// // //         }else{

// // //             cb(JSON.parse(fileContent));
// // //         }
// // //     })

// // // }

// // module.exports = class Product {
// //   constructor(id, title, imageUrl, description, price) {
// //     this.id = id;
// //     this.title = title;
// //     this.imageUrl = imageUrl;
// //     this.description = description;
// //     this.price = price;
// //   }
// //   save() {
// //     return db.execute(
// //       "INSERT INTO products (title ,price ,imageUrl,description) VALUE (?, ?, ?, ?)",
// //       [this.title, this.price, this.imageUrl, this.description]
// //     );

// //     // getProductFromFile(products =>{
// //     //     if(this.id){
// //     //         const existingProductIndex = products.findIndex(prod => prod.id ===this.id);
// //     //         const updatedProducts = [...products];
// //     //         updatedProducts[existingProductIndex] = this
// //     //         fs.writeFile(p,JSON.stringify(updatedProducts),(err)=>{
// //     //             console.log(err);
// //     //            })
// //     //     }else{
// //     //         this.id = Math.random().toString();

// //     //         products.push(this);
// //     //         fs.writeFile(p,JSON.stringify(products),(err)=>{
// //     //          console.log(err);
// //     //         })
// //     //     }
// //     //     // let products = [];

// //     // })
// //     // fs.readFile(p,(err,fileContent)=>{})
// //   }

// //   static deleteById(id) {
// //     // getProductFromFile(products =>{
// //     //     const product = products.find(prod => prod.id ===id)
// //     //     const updateProducts = products.filter(prod => prod.id !== id);
// //     //     fs.writeFile(p,JSON.stringify(updateProducts),(err)=>{
// //     //         if(!err){
// //     //             if(!err){
// //     //                 Cart.deleteProduct(id, product.price)
// //     //             }
// //     //         }
// //     //     })
// //     // })
// //   }

// //   static fetchAll() {
// //     return db.execute("SELECT * FROM products");
// //     //  getProductFromFile()
// //   }

// //   static findById(id) {
// //     return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);

// //     //     getProductFromFile(products =>{
// //     //         const product = products.find(p => p.id === id)
// //     //         cb(product)

// //     //     })
// //     // }
// //   }
// // };

// // const Sequelize = require("sequelize");
// // const sequelize = require("../util/database");

// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');

// class Product {
//   constructor(title,price,description,imageUrl,id,userId){
//     this.title = title;
//     this.price = price;
//       this.description = description;
//       this.imageUrl = imageUrl;
//       this._id =id ? new mongodb.ObjectId(id) : null ;
//       this.userId = userId

//   }
//   save(){
//     const db = getDb();
//     let dpOp;
//     if(this._id){
//       dpOp = db.collection('products').updateOne({_id:this._id},{$set:this})
//     }else{
//       dpOp = db.collection('products').insertOne(this)

//     }
//     return dpOp
//     .then(result => {
//       console.log(result);
//     }).catch(err=>console.log(err))
//   }

//   static fetchAll(){
//     const db = getDb();
//       return db.collection('products').find().toArray().then(products=>{
//           console.log(products);
//           return products
//       }).catch(err=>console.log(err))

//   }
//   static findById(propId){
//     const db = getDb();
//     return db.collection('products').find({_id:new mongodb.ObjectId(propId)}).next()
//     .then(product=>{
//       console.log(product);
//       return product
//     }).catch(err=>console.log(err))
//   }
//   static deleteById(prodId){
//     const db = getDb();
//     return db.collection('products').deleteOne({_id:new mongodb.ObjectId(prodId)}).then(result=>{
//       console.log('deleted');
//     }).catch(err=>console.log(err))
//   }
// }

// // const Product = sequelize.define("product", {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     primaryKey: true,
// //     allowNull: false,
// //     autoIncrement: true,
// //   },
// //   title: { type: Sequelize.STRING, allowNull: false },
// //   price: { type: Sequelize.DOUBLE, allowNull: false },
// //   imageUrl: { type: Sequelize.STRING, allowNull: false },
// //   description: { type: Sequelize.STRING, allowNull: false },
// // });

// module.exports = Product;

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
});



module.exports = mongoose.model('Product',productSchema)