const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const { check, body } = require("express-validator");
const User = require("../models/user");
router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);

router.post("/login",[
   body('email',"Email or Password is Invalid").isEmail().normalizeEmail().trim(),
   body('password',"Email or Password is Invalid").trim().isLength({min:5}).isAlphanumeric()
], 
authController.postLogin);



router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .normalizeEmail()
      .trim()
      .withMessage("Please Enter a Valid Email")
      .custom((value, { req }) => {
      
       return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
                "This Email Already Exists"
            );
          }
        })
      }),
    body(
      "password",
      "Please Enter a password that contain a letter and greater than 6 char"
    ).trim()
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password Must be Matching");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
