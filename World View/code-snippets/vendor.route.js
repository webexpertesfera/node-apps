const { Router } = require("express");
const sellerAuth = require("../../middlewares/sellerAuth");
const { addProduct, getProductById, deleteProductById, getApprovedProducts, editProducts, getBusinessSellerCategories } = require("../../controllers/vendor.controller/product.controller");
const { sellerValidation, userValidation } = require("../../validations");
const { createBusinessSeller, editBusinessSeller, editProfile, changePassword, getBusinessSellerById } = require("../../controllers/seller.controller");
const validate = require("../../middlewares/validate");
const liveShowRouter = require("./vendor.route/liveShow.route");

const vendorRoute = Router()
vendorRoute.use(sellerAuth())
vendorRoute.use("/live-show", liveShowRouter)
vendorRoute.route("/product")
    .post(validate(sellerValidation.addProduct), addProduct)

vendorRoute.delete("/product/delete", validate(sellerValidation.deleteProduct), deleteProductById)
vendorRoute.get("/product/get", validate(sellerValidation.getApprovedProducts), getApprovedProducts)
vendorRoute.route("/change-password")
    .post(validate(userValidation.changePassword), changePassword)
vendorRoute.route("/add-seller")
    .post(validate(sellerValidation.businessSeller), createBusinessSeller)
vendorRoute.route("/get-seller")
    .get(getBusinessSellerById)
vendorRoute.route("/product/edit")
    .post(validate(sellerValidation.editProduct), editProducts)
vendorRoute.route("/update-profile")
    .post(validate(sellerValidation.editProfile), editProfile)
vendorRoute.route("/categories").get(getBusinessSellerCategories)

vendorRoute.route("/product/:id")
    .get(validate(sellerValidation.getProductById), getProductById)
vendorRoute.route("/edit-seller/:id")
    .post(validate(sellerValidation.editBusinessSeller), editBusinessSeller)
module.exports = vendorRoute


/**
 * @swagger
 * /seller/add-seller:
 *   post:
 *     summary: Register as a business seller
 *     tags: 
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - $ref: '#/components/parameters/AcceptLanguage'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *                 description: The name of the business
 *               userName:
 *                 type: string
 *                 description: The username of the seller
 *               businessEmail:
 *                 type: string
 *                 format: email
 *                 description: The email of the business
 *               description:
 *                 type: string
 *                 description: Description of the business
 *               latitude:
 *                 type: number
 *                 description: Latitude of the business location
 *               longitude:
 *                 type: number
 *                 description: Longitude of the business location
 *               location:
 *                 type: string
 *                 description: The business location
 *               categories:
 *                 type: array
 *                 description: The category of the business (e.g., Men's Clothing)
 *                 example: ["6788b08d3b8b5c80946d043a", "6788b0c53b8b5c80946d043"]
 *               profileImage:
 *                 type: string
 *                 description: Profile image URL (empty if not set)
 *                 example: "http://vipankumar.in:2022/uploads/1736849765970-858615281.jpeg"
 *     responses:
 *       201:
 *         description: Business Seller created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Business Seller created successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     profileImage:
 *                       type: string
 *                       description: Profile image URL (empty if not set)
 *                       example: 'http://vipankumar.in:2022/uploads/1736849765970-858615281.jpeg'
 *                     categories:
 *                       type: array
 *                       description: The categories associated with the business
 *                       example: ['6788b08d3b8b5c80946d043a', '6788b1413b8b5c80946d0442']
 *                     isEmailVerified:
 *                       type: boolean
 *                       description: Indicates if the email is verified
 *                       example: false
 *                     isApproved:
 *                       type: boolean
 *                       description: Indicates if the seller is approved
 *                       example: false
 *                     _id:
 *                       type: string
 *                       description: Unique identifier for the seller
 *                       example: '6788cd3932a39daeee81712c'
 *                     businessName:
 *                       type: string
 *                       description: The name of the business
 *                       example: 'Seller'
 *                     userName:
 *                       type: string
 *                       description: The username of the seller
 *                       example: 'seller1000'
 *                     businessEmail:
 *                       type: string
 *                       format: email
 *                       description: The email address of the business
 *                       example: 'mybusinessSeller@yopmail.com'
 *                     description:
 *                       type: string
 *                       description: Description of the business
 *                       example: 'dasdasdasdasd'
 *                     latitude:
 *                       type: number
 *                       description: Latitude of the business location
 *                       example: 37.7749
 *                     longitude:
 *                       type: number
 *                       description: Longitude of the business location
 *                       example: -122.4194
 *                     location:
 *                       type: string
 *                       description: The location of the business
 *                       example: 'usa'
 *                     sellerId:
 *                       type: string
 *                       description: Seller's unique identifier
 *                       example: '6788ac5abba06b7f0d8bda6e'
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the seller was created
 *                       example: '2025-01-16T09:11:21.283Z'
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The last update date of the seller
 *                       example: '2025-01-16T09:11:21.283Z'
 *                     __v:
 *                       type: integer
 *                       description: Internal version key for the document
 *                       example: 0
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is already taken"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /seller/edit-seller/{id}:
 *   post:
 *     summary: Edit Business Seller
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the seller
 *         schema:
 *           type: string
 *           example: "677f4e139c50702ea37f706d"
 *       - $ref: '#/components/parameters/AcceptLanguage'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *                 example: "Test"
 *               description:
 *                 type: string
 *                 example: "test lemontree"
 *               businessEmail:
 *                 type: string
 *                 example: "mybusinessSeller@yopmail.com"
 *               userName:
 *                 type: string
 *                 example: "testing on top"
 *               profileImage:
 *                 type: string
 *                 example: "http://localhost:3000/uploads/1736852081212-319726043.png"
 *               latitude:
 *                 type: number
 *                 example: 85.002
 *               longitude:
 *                 type: number
 *                 example: 789.332
 *               location:
 *                 type: string
 *                 example: "Dubai"
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["6788b0c53b8b5c80946d043c", "6788b10d3b8b5c80946d0440", "6788b1413b8b5c80946d0442"]
 *     responses:
 *       200:
 *         description: Business seller updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Business seller updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     profileImage:
 *                       type: string
 *                       example: "http://localhost:3000/uploads/1736852081212-319726043.png"
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["6788b0c53b8b5c80946d043c", "6788b10d3b8b5c80946d0440", "6788b1413b8b5c80946d0442"]
 *                     isEmailVerified:
 *                       type: boolean
 *                       example: false
 *                     _id:
 *                       type: string
 *                       example: "6788b338034c728612d84f86"
 *                     isApproved:
 *                       type: boolean
 *                       example: false
 *                     businessName:
 *                       type: string
 *                       example: "Test"
 *                     userName:
 *                       type: string
 *                       example: "testing on top"
 *                     businessEmail:
 *                       type: string
 *                       example: "mybusinessSeller@yopmail.com"
 *                     description:
 *                       type: string
 *                       example: "test lemontree"
 *                     latitude:
 *                       type: number
 *                       example: 85.002
 *                     longitude:
 *                       type: number
 *                       example: 789.332
 *                     location:
 *                       type: string
 *                       example: "Dubai"
 *                     sellerId:
 *                       type: string
 *                       example: "6788ac5abba06b7f0d8bda6e"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-16T07:20:24.986Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-16T08:48:14.052Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 */

/**
 * @swagger
 * /seller/product/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Fetch a product using its ID from the seller's product list
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the seller
 *         schema:
 *           type: string
 *           example: "677f4e139c50702ea37f706d"
 *       - $ref: '#/components/parameters/AcceptLanguage'
 *     responses:
 *       200:
 *         description: Producto obtenido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto obtenido"
 *                 data:
 *                   type: object
 *                   properties:
 *                     isApproved:
 *                       type: boolean
 *                       example: false
 *                     productImages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [
 *                         "uploads/1736491024465-377935997.jpeg",
 *                         "uploads/1736491024466-963792813.jpeg",
 *                         "uploads/1736491024466-367174124.jpeg"
 *                       ]
 *                     _id:
 *                       type: string
 *                       example: "6780c01050d3d56a58d536c6"
 *                     title:
 *                       type: string
 *                       example: "cloth"
 *                     description:
 *                       type: string
 *                       example: "warmCloths"
 *                     price:
 *                       type: integer
 *                       example: 2500
 *                     deliveryFee:
 *                       type: integer
 *                       example: 50
 *                     sellerId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6780bd74b4037c7c37ea61d2"
 *                         name:
 *                           type: string
 *                           example: "James"
 *                         email:
 *                           type: string
 *                           example: "seller1@yopmail.com"
 *                         phoneNumber:
 *                           type: string
 *                           example: "9873599230"
 *                         role:
 *                           type: string
 *                           example: "seller"
 *                         countryCode:
 *                           type: string
 *                           example: "+91"
 *                         countryName:
 *                           type: string
 *                           example: "India"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-10T06:37:04.654Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-10T06:37:04.654Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 */

/**
 * @swagger
 * /seller/product:
 *   post:
 *     summary: Add Product
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AcceptLanguage'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Mens"
 *               description:
 *                 type: string
 *                 example: "asd4asd 1asdasd"
 *               price:
 *                 type: number
 *                 example: 2600
 *               deliveryFee:
 *                 type: number
 *                 example: 100
 *               productImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example:
 *                   - "http://localhost:3000/uploads/1736514230855-822757341.jpeg"
 *                   - "http://localhost:3000/uploads/1736514230854-461423766.jpeg"
 *                   - "http://localhost:3000/uploads/1736514230855-459746582.jpeg"
 *     responses:
 *       201:
 *         description: Product added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product Added Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     isApproved:
 *                       type: boolean
 *                       example: false
 *                     productImages:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: uri
 *                       example:
 *                         - "http://localhost:3000/uploads/1736514230855-822757341.jpeg"
 *                         - "http://localhost:3000/uploads/1736514230854-461423766.jpeg"
 *                         - "http://localhost:3000/uploads/1736514230855-459746582.jpeg"
 *                     _id:
 *                       type: string
 *                       example: "67849004234593227be9ae86"
 *                     title:
 *                       type: string
 *                       example: "Mens"
 *                     description:
 *                       type: string
 *                       example: "asd4asd 1asdasd"
 *                     price:
 *                       type: number
 *                       example: 2600
 *                     deliveryFee:
 *                       type: number
 *                       example: 100
 *                     sellerId:
 *                       type: string
 *                       example: "6780bd74b4037c7c37ea61d2"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-13T04:01:08.857Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-13T04:01:08.857Z"
 *                     __v:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: Bad request, invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /seller/product/edit:
 *   post:
 *     summary: Editing the products
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AcceptLanguage'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The unique identifier of the product to be edited
 *                 example: "677f6bf0746b5faac27c8448"
 *               title:
 *                 type: string
 *                 example: "Mens"
 *               description:
 *                 type: string
 *                 example: "asd4asd 445"
 *               price:
 *                 type: number
 *                 example: 2600
 *               deliveryFee:
 *                 type: number
 *                 example: 100
 *               productImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example:
 *                   - "http://localhost:3000/uploads/1736514230855-822757341.jpeg"
 *                   - "http://localhost:3000/uploads/1736514230854-461423766.jpeg"
 *                   - "http://localhost:3000/uploads/1736514230855-459746582.jpeg"
 *     responses:
 *       200:
 *         description: Product edited successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product Edited"
 *                 data:
 *                   type: object
 *                   properties:
 *                     isApproved:
 *                       type: boolean
 *                       example: false
 *                     productImages:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: uri
 *                       example:
 *                         - "http://localhost:3000/uploads/1736514230855-822757341.jpeg"
 *                         - "http://localhost:3000/uploads/1736514230854-461423766.jpeg"
 *                         - "http://localhost:3000/uploads/1736514230855-459746582.jpeg"
 *                     _id:
 *                       type: string
 *                       example: "677f6bf0746b5faac27c8448"
 *                     title:
 *                       type: string
 *                       example: "Mens"
 *                     description:
 *                       type: string
 *                       example: "asd4asd 445"
 *                     price:
 *                       type: number
 *                       example: 2600
 *                     deliveryFee:
 *                       type: number
 *                       example: 100
 *                     sellerId:
 *                       type: string
 *                       example: "677e796e01c9c8249b49e714"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-09T06:25:52.932Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-13T03:44:23.753Z"
 *                     __v:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: Bad request, invalid input or missing product ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data or missing product ID"
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /seller/product/delete:
 *   delete:
 *     summary: Delete Product
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AcceptLanguage'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The unique identifier of the product to be deleted
 *                 example: "677f5df57e276d71b1648a65"
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product Deleted"
 *                 data:
 *                   type: object
 *                   properties:
 *                     isApproved:
 *                       type: boolean
 *                       example: false
 *                     productImages:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: uri
 *                       example:
 *                         - "http://localhost:3000/uploads/1736514230855-822757341.jpeg"
 *                         - "http://localhost:3000/uploads/1736514230854-461423766.jpeg"
 *                         - "http://localhost:3000/uploads/1736514230855-459746582.jpeg"
 *                     _id:
 *                       type: string
 *                       example: "677f6bf0746b5faac27c8448"
 *                     title:
 *                       type: string
 *                       example: "Mens"
 *                     description:
 *                       type: string
 *                       example: "asd4asd 445"
 *                     price:
 *                       type: number
 *                       example: 2600
 *                     deliveryFee:
 *                       type: number
 *                       example: 100
 *                     sellerId:
 *                       type: string
 *                       example: "677e796e01c9c8249b49e714"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-09T06:25:52.932Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-13T03:44:23.753Z"
 *                     __v:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: No product found with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Product Found"
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /seller/product/get:
 *   get:
 *     summary: Get all approved products
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         schema:
 *           type: string
 *         description: The authorization token for the seller
 *       - $ref: '#/components/parameters/AcceptLanguage'
 *     responses:
 *       200:
 *         description: Successfully fetched approved products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product Fetched"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       isApproved:
 *                         type: boolean
 *                         example: true
 *                       productImages:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: uri
 *                         example:
 *                           - "http://localhost:3000/uploads/1736514230855-822757341.jpeg"
 *                           - "http://localhost:3000/uploads/1736514230854-461423766.jpeg"
 *                           - "http://localhost:3000/uploads/1736514230855-459746582.jpeg"
 *                       _id:
 *                         type: string
 *                         example: "67849004234593227be9ae86"
 *                       title:
 *                         type: string
 *                         example: "Mens"
 *                       description:
 *                         type: string
 *                         example: "asd4asd 1asdasd"
 *                       price:
 *                         type: number
 *                         example: 2600
 *                       deliveryFee:
 *                         type: number
 *                         example: 100
 *                       sellerId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6780bd74b4037c7c37ea61d2"
 *                           name:
 *                             type: string
 *                             example: "James"
 *                           email:
 *                             type: string
 *                             example: "seller1@yopmail.com"
 *                           phoneNumber:
 *                             type: string
 *                             example: "9873599230"
 *                           role:
 *                             type: string
 *                             example: "seller"
 *                           countryCode:
 *                             type: string
 *                             example: "+91"
 *                           countryName:
 *                             type: string
 *                             example: "India"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-13T04:01:08.857Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-13T04:01:08.857Z"
 *                       __v:
 *                         type: number
 *                         example: 0
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/** 
 * @swagger 
 * /seller/update-profile: 
 *   post: 
 *     summary: Editing my profile 
 *     tags: 
 *       - Seller 
 *     security: 
 *       - bearerAuth: [] 
 *     parameters: 
 *       - $ref: '#/components/parameters/AcceptLanguage' 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             type: object 
 *             properties: 
 *               name: 
 *                 type: string 
 *               email: 
 *                 type: string 
 *               phoneNumber: 
 *                 type: string 
 *               countryCode: 
 *                 type: string 
 *               image: 
 *                 type: string 
 *     responses: 
 *       200: 
 *         description: Profile Updated 
 *         content: 
 *           application/json: 
 *             schema: 
 *               type: object 
 *               properties: 
 *                 message: 
 *                   type: string 
 *                 data: 
 *                   type: object 
 *                   properties: 
 *                     gender: 
 *                       type: string 
 *                     dob: 
 *                       type: string 
 *                     image: 
 *                       type: string 
 *                     isAdmin: 
 *                       type: boolean 
 *                     isEmailVerified: 
 *                       type: boolean 
 *                     isBusinessAdded: 
 *                       type: boolean 
 *                     _id: 
 *                       type: string 
 *                     name: 
 *                       type: string 
 *                     email: 
 *                       type: string 
 *                     phoneNumber: 
 *                       type: string 
 *                     password: 
 *                       type: string 
 *                     role: 
 *                       type: string 
 *                     countryCode: 
 *                       type: string 
 *                     countryName: 
 *                       type: string 
 *                     createdAt: 
 *                       type: string 
 *                     updatedAt: 
 *                       type: string 
 *                     __v: 
 *                       type: integer 
 *                     otp: 
 *                       type: string 
 */

/**
 * @swagger
 * /seller/get-seller:
 *   get:
 *     summary: Get My business seller profile
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters: 
 *       - $ref: '#/components/parameters/AcceptLanguage' 
 *     responses:
 *       200:
 *         description: Business Seller Fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Business Seller Fetched"
 *                 data:
 *                   type: object
 *                   properties:
 *                     profileImage:
 *                       type: string
 *                       description: Profile image URL
 *                       example: "http://vipankumar.in:2022/uploads/1736849765970-858615281.jpeg"
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6788b08d3b8b5c80946d043a"
 *                           categoryName:
 *                             type: string
 *                             example: "Women’s Clothes"
 *                     isEmailVerified:
 *                       type: boolean
 *                       description: Indicates if the email is verified
 *                       example: false
 *                     isApproved:
 *                       type: boolean
 *                       description: Indicates if the seller is approved
 *                       example: false
 *                     _id:
 *                       type: string
 *                       description: Unique identifier for the seller
 *                       example: "6788cd3932a39daeee81712c"
 *                     businessName:
 *                       type: string
 *                       description: The name of the business
 *                       example: "Seller"
 *                     userName:
 *                       type: string
 *                       description: The username of the seller
 *                       example: "seller1000"
 *                     businessEmail:
 *                       type: string
 *                       format: email
 *                       description: The email address of the business
 *                       example: "mybusinessSeller@yopmail.com"
 *                     description:
 *                       type: string
 *                       description: Description of the business
 *                       example: "dasdasdasdasd"
 *                     latitude:
 *                       type: number
 *                       description: Latitude of the business location
 *                       example: 37.7749
 *                     longitude:
 *                       type: number
 *                       description: Longitude of the business location
 *                       example: -122.4194
 *                     location:
 *                       type: string
 *                       description: The location of the business
 *                       example: "usa"
 *                     sellerId:
 *                       type: string
 *                       description: Seller's unique identifier
 *                       example: "6788ac5abba06b7f0d8bda6e"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the seller was created
 *                       example: "2025-01-16T09:11:21.283Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The last update date of the seller
 *                       example: "2025-01-16T09:11:21.283Z"
 *                     __v:
 *                       type: integer
 *                       description: Internal version key for the document
 *                       example: 0
 *       500:
 *         description: Internal server error 
 */

/**
 * @swagger
 * /seller/change-password:
 *   post:
 *     summary: Change Sellers Password
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters: 
 *       - $ref: '#/components/parameters/AcceptLanguage' 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the seller
 *                 example: "admin@123"
 *               newPassword:
 *                 type: string
 *                 description: The new password for the seller
 *                 example: "admin@1234"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Invalid old password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Wrong old password"
 */
