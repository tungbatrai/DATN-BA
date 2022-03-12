const express = require('express')
const router = express.Router();
const uploadFiler = require("../common/cloudy/cloudinaryProductType");
const authorize = require('../common/authorization/authorization-middleware')
const controller = require('../controllers/ProductTypeController')
const uploadController = require("../controllers/CloudinaryController")
/**
 * @swagger
 * tags: 
 *  name: Product Type
 *  description: this is all api use for product type
 * /productType/{pId}:
 *  get:
 *      tags: [Product Type]
 *      summary: get all type of a product
 *      parameters:
 *          - name: pId
 *            in: path
 *            type: integer
 *            required: true
 *      responses:
 *          default:
 *              description: this is response
 */
router.get("/:pId",controller.getAllProductType)


/**
 * @swagger
 * tags: 
 *  name: Product Type
 *  description: this is all api use for product type
 * /productType/detail/{Id}:
 *  get:
 *      tags: [Product Type]
 *      summary: get detail of a product type
 *      parameters:
 *          - name: Id
 *            in: path
 *            type: integer
 *            required: true
 *      responses:
 *          default:
 *              description: this is response
 */
 router.get("/detail/:Id",controller.getDetail)
/**
 * @swagger
 * tags: 
 *  name: Product Type
 *  description: this is all api use for product type
 * /productType/{pId}:
 *  post:
 *      tags: [Product Type]
 *      security:
 *          - Bearer: []
 *      summary: create a type of a product
 *      parameters:
 *          - name: pId
 *            in: path
 *            type: integer
 *            required: true
 *          - name: body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  image:
 *                      type: string
 *                  price:
 *                      type: number
 *                  quantity:
 *                      type: integer
 *                  color:
 *                      type: string
 *                  type:
 *                      type: string
 *                  color_code:
 *                      type: string
 *      responses:
 *          default:
 *              description: this is response
 */
router.post("/:pId",authorize("ADMIN"),controller.createProductType)

/**
 * @swagger
 * tags: 
 *  name: Product Type
 *  description: this is all api use for product type
 * /productType/{pId}/{id}:
 *  put:
 *      tags: [Product Type]
 *      security:
 *          - Bearer: []
 *      summary: create a type of a product
 *      parameters:
 *          - name: pId
 *            in: path
 *            type: integer
 *            required: true
 *          - name: id
 *            in: path
 *            type: integer
 *            required: true
 *          - name: body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  image:
 *                      type: string
 *                  price:
 *                      type: number
 *                  quantity:
 *                      type: integer
 *                  color:
 *                      type: string
 *                  type:
 *                      type: string
 *                  color_code:
 *                      type: string
 *      responses:
 *          default:
 *              description: this is response
 */
router.put("/:pId/:id",authorize("ADMIN"),controller.updateProductType)

/**
 * @swagger
 * /productType/type/uploadUrl:
 *  post:
 *      tags: [Product Type]
 *      consumes:
 *          - multipart/form-data
 *      parameters:
 *          - name: image
 *            in: formData
 *            type: file
 *      responses:
 *          default:
 *              description: this is response
 */
router.post("/type/uploadUrl", uploadFiler.single("image"),uploadController.uploadProductType)
module.exports = router