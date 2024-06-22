const express = require('express');
const router = express.Router();
const { signUp, login, viewProfile, updateProfile } = require("../controllers/user");
const { productAdd, productDelete, productEdit, productList } = require("../controllers/product");
const { isAuthenticatedUser } = require("../middleware/auth");
const { signupSchema, loginSchema, viewProfileSchema, updateProfileSchema } = require("../middleware/validatorSchema")
const validator = require('../middleware/validator');
const { categoryAdd, categoryList, categoryDelete, categoryEdit } = require('../controllers/category');

//registeration - API
router.post('/user/Signup', validator(signupSchema), signUp)
//login - API
router.post('/user/login', validator(loginSchema), login)
//view profile - API
router.post('/get/profile', isAuthenticatedUser, validator(viewProfileSchema), viewProfile)
//update profile - API
router.put('/update/profile', isAuthenticatedUser, validator(updateProfileSchema), updateProfile)
// category management - API
router.post('/category/add', isAuthenticatedUser, categoryAdd)
router.post('/category/list', isAuthenticatedUser, categoryList)
router.post('/category/delete', isAuthenticatedUser, categoryDelete)
router.post('/category/edit', isAuthenticatedUser, categoryEdit)

// product management - API
router.post('/product/list', isAuthenticatedUser, productList)
router.post('/product/delete', isAuthenticatedUser, productDelete)
router.post('/product/add', isAuthenticatedUser, productAdd)
router.post('/product/edit', isAuthenticatedUser, productEdit)

module.exports = router