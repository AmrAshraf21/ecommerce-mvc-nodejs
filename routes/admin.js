const express = require('express');
const router = express.Router();
// const rootDir = require('../util/path');
const isAuth = require('../middlewares/is-auth');
const {check , body } = require('express-validator');

const adminController = require('../controllers/admin');

// const path = require('path');

router.get('/add-product',isAuth,adminController.getAddProduct);
router.post('/add-product',[
    body('title','Enter a valid title').isLength({max:50,min:2}).isString(),
    // body('imageUrl','Enter a valid image').trim().isURL(),
    body('price','Enter a valid price').trim().isFloat(),
    body('description','Enter a valid desc')
  

],
isAuth,adminController.postAddProduct);
router.get('/products',isAuth,adminController.getProducts);

router.get('/edit-product/:productId',isAuth,adminController.getEditProduct)

router.post('/edit-product', 
[
    body('title','Enter a valid title').isString(),
    // body('imageUrl','Enter a valid image').trim(),
    body('price','Enter a valid price').trim().isFloat(),
    body('description','Enter a valid desc')
  

],

isAuth,adminController.postEditProduct)

router.delete('/product/:productId',isAuth,adminController.deleteProduct)
module.exports = router