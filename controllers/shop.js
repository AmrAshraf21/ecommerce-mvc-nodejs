const Product = require("../models/product");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");

const PDFDocument = require('pdfkit');


const ITEMS_PER_PAGE = 1;
exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems ;
    Product.find().countDocuments().then(numProducts=>{
      totalItems = numProducts
      return Product.find()
      .skip((page -1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
    }).then((products) => {
        res.render("shop/product-list", {
          prods: products,
          pageTitle: "Shop",
          path: "/products",
          totalProducts:totalItems,
          currentPage:page,
          hasNextPage:ITEMS_PER_PAGE * page < totalItems,
          hasPrevPage:page >1,
          nextPage : page+1,
          prevPage:page - 1,
          lastPage : Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  











  // Product.find()
  //   .then((products) => {
  //     console.log(products);
  //     res.render("shop/product-list", {
  //       prods: products,
  //       pageTitle: "Shop",
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => {
  //     const error = new Error(err);
  //     error.httpStatusCode = 500;
  //     return next(error);
  //   });

  //console.log("shop js" , adminData.products);
  //console.log("in the home");
  //res.sendFile(path.join(rootDir,'views','shop.html'));
};
exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  //   Product.findAll({ where: { id: prodId } })
  //     .then((products) => {
  //       res.render("shop/product-detail", {
  //         product: products[0],
  //         pageTitle: products[0].title,
  //         path: "/products",
  //       });
  //     })
  // .catch((err) => console.log(err));
  Product.findById(prodId)
    .then((product) => {
      console.log(product);
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {

  const page = +req.query.page || 1;
let totalItems ;
  Product.find().countDocuments().then(numProducts=>{
    totalItems = numProducts
    return Product.find()
    .skip((page -1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  }).then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        totalProducts:totalItems,
        currentPage:page,
        hasNextPage:ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage:page >1,
        nextPage : page+1,
        prevPage:page - 1,
        lastPage : Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  //console.log("shop js" , adminData.products);
  //console.log("in the home");
  //res.sendFile(path.join(rootDir,'views','shop.html'));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")

    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  //   Cart.getCart((cart) => {
  //     Product.fetchAll((products) => {
  //       const cartProduct = [];
  //       for (product of products) {
  //         const cartProductData = cart.products.find(
  //           (prod) => prod.id === product.id
  //         );
  //         if (cartProductData)
  //           cartProduct.push({ productData: product, qty: cartProductData.qty });
  //       }
  //
  //     });
  //   });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
  // let newQuantity = 1;

  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(prodId)
  //       .then((product) => {
  //         return fetchedCart.addProduct(product, {
  //           through: { quantity: newQuantity },
  //         });
  //       })
  //       .catch((err) => console.log(err));
  //   })

  //   .then(() => {
  //
  //   })
  //   .catch((err) => console.log(err));

  //     const prodId = req.body.productId;
  //     Product.findById(prodId, (product) => {
  //     Cart.addProduct(prodId, product.price);
  //   });
  //   res.redirect("/cart");
};
exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Order",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }); 
};

exports.getCheckout = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      let total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  //   Product.findById(prodId, (product) => {
  //     Cart.deleteProduct(prodId, product.price);

  //   });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No Order Found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthoraized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
        const invoicePath = path.join("data", "invoices", invoiceName);
        const pdfDoc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'inline;filename="' + invoiceName + '"'
        );
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text('Invoice');
          pdfDoc.text('-----------------');
          let totalPrice = 0;
          order.products.forEach(prod=>{
            totalPrice += prod.quantity * prod.product.price;
            pdfDoc.text(prod.product.title + ' ' + prod.quantity + ' x ' + ' $ '+prod.product.price );
          })
          pdfDoc.text('-----------------')
          pdfDoc.fontSize(30).text('Total Price $' + totalPrice)
        pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next();
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'inline;filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);
     
      //   file.pipe(res)
    })
    .catch((err) => next(err));
};

exports.postOrder = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // let fetchCart;
  // .getCart()
  // .then((cart) => {
  //   fetchCart = cart;
  //   return cart.getProducts();
  // })
  // .then((products) => {
  //   return req.user
  //     .createOrder()
  //     .then((order) => {
  //       return order.addProducts(
  //         products.map((product) => {
  //           product.orderItem = { quantity: product.cartItem.quantity };
  //           return product;
  //         })
  //       );
  //     })
  //     .catch((err) => console.log(err));
  // })
  // .then((result) => {
  //   fetchCart.setProducts(null);
  // })
  // .then((results) => {
  //   res.redirect("/orders");
  // })
  // .catch((err) => console.log(err));
};
