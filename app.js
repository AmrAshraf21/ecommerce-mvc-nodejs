const express = require("express");
const path = require("path");
const errorController = require("./controllers/error");
const mongoose = require("mongoose");
// const mongoConnect = require('./util/database').mongoConnect
const User = require("./models/user");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const MongodbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const https = require("https");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.wdl7qor.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
const store = MongodbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

// const privateKey= fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const currentDate = new Date().toISOString();
    const customDate = currentDate.replace(/:/g, "-");
    cb(null, customDate + "-" + file.originalname);
  },
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet()); //can save a response header and put some strange data in it;
app.use(compression()); //بتضغط الملفات الخاصه بالستايل سواء كانت صور او اي حاجه عشان يكون حجمها صغير
app.use(morgan("combined", { stream: accessLogStream })); // can help me as a can get a log that info coming in request and save it in a file with extinction .log
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuth = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)

    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      return next(new Error(err));
    });
});

// app.use((req,res,next)=>{  // use add a middleware function

// console.log("in the middleware");
// next(); //Alow the req to continue  to next middleware

// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "500",
    path: "/500",
    isAuth: req?.session?.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("connected");
    // https.createServer({key:privateKey,cert:certificate},app).listen(process.env.PORT || 5000);
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });

// //const routes = require('./routes');
// //const http = require('http');
// const express = require("express");
// const path = require("path");
// const errorController = require("./controllers/error");
// const mongoose = require("mongoose");
// // const mongoConnect = require('./util/database').mongoConnect
// const User = require("./models/user");
// const bodyParser = require("body-parser");
// const app = express();
// const session = require("express-session");
// const MongodbStore = require("connect-mongodb-session")(session);
// const csrf = require("csurf");
// const flash = require("connect-flash");
// const multer = require("multer");

// const MONGODB_URI =
//   "mongodb+srv://amr:amr2242001@cluster0.wdl7qor.mongodb.net/shop";
// const store = MongodbStore({
//   uri: MONGODB_URI,
//   collection: "sessions",
// });

// const csrfProtection = csrf();

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images');
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + '-' + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/png' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/jpeg'
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// app.set('view engine', 'ejs');
// app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
// const authRoutes = require('./routes/auth');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
// );
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//   session({
//     secret: 'my secret',
//     resave: false,
//     saveUninitialized: false,
//     store: store
//   })
// );
// app.use(csrfProtection);
// app.use(flash());

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

// app.use((req, res, next) => {
//   // throw new Error('Sync Dummy');
//   if (!req.session.user) {
//     return next();
//   }
//   User.findById(req.session.user._id)
//     .then(user => {
//       if (!user) {
//         return next();
//       }
//       req.user = user;
//       next();
//     })
//     .catch(err => {
//       next(new Error(err));
//     });
// });

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
// app.use(authRoutes);

// app.get('/500', errorController.get500);

// app.use(errorController.get404);

// app.use((error, req, res, next) => {
//   // res.status(error.httpStatusCode).render(...);
//   // res.redirect('/500');
//   res.status(500).render('500', {
//     pageTitle: 'Error!',
//     path: '/500',
//     isAuthenticated: req.session.isLoggedIn
//   });
// });

// mongoose
//   .connect(MONGODB_URI)
//   .then(result => {
//     app.listen(3000);
//   })
//   .catch(err => {
//     console.log(err);
//   });

//const routes = require('./routes');
//const http = require('http');
// // //const server = http.createServer(app)
// // //server.listen(5000);
// // const Product = require('./models/product');
// // const User = require('./models/user');
// // const Cart = require("./models/cart");
// // const CartItem = require("./models/cart-item");
// // const Order= require('./models/order')
// // const OrderItem= require('./models/order-item')
// // const sequelize = require("./util/database");

// // app.use('/',(req,res,next)=>{
// //    // console.log("is always run?");
// //     next();

// // })
// //     Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
// //     User.hasMany(Product);

// //     User.hasOne(Cart);
// //     Cart.belongsTo(User);
// //     Cart.belongsToMany(Product,{through:CartItem});
// //     Product.belongsToMany(Cart,{through:CartItem});
// //     Order.belongsTo(User);
// //     User.hasMany(Order);
// //     Order.belongsToMany(Product,{through:OrderItem});
// //     sequelize.sync().then(results=>{
// //         return User.findByPk(1)

// //     }).then(user=>{
// //         console.log(user);
// //         if(!user){
// //           return User.create({name:"max",email:'user@hotst.com'})
// //         }
// //         return user;
// //     })
// //     .then(user=>{
// //        // console.log(user);
// //       return user.createCart()
// //      })
// //     .then(cart=>{
// //         app.listen(5000)
// //     })
// //     .catch(err => console.log(err))

// //  //this is use instead of the code below that create a server and do a listen in the same line
