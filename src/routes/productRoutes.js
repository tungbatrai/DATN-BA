const express = require("express");
const router = express.Router();
const controller = require("../controllers/ProductController");
const uploadFiler = require("../common/cloudy/cloudinaryProduct");
const authorize = require("../common/authorization/authorization-middleware");
const uploadController = require("../controllers/CloudinaryController")

/**
 * @swagger
 * tags: 
 *  name: Product
 *  description: this is api for product
 * /product:
 *  get:
 *      tags: [Product]
 *      summary: get all product
 *      parameters:
 *          - name: page
 *            default: 1
 *            in: query
 *            schema:
 *                  type: number
 *          - name: pageSize
 *            default: 10
 *            in: query
 *            schema:
 *                  type: number
 *          - name: product
 *            in: query
 *            schema:
 *                  type: text
 *          - name: brand
 *            in: query
 *            schema:
 *                  type: text
 *          - name: category
 *            in: query
 *            schema:
 *                  type: text
 *          - name: category_id
 *            in: query
 *            schema:
 *                  type: number
 *          - name: brand_id
 *            in: query
 *            schema:
 *                  type: number
 *      responses:
 *          default:
 *              description: this is response   
 */

router.get("",controller.getAllProduct);

/**
 * @swagger
 * /product/client:
 *  get:
 *      tags: [Product]
 *      summary: get all product for client
 *      parameters:
 *          - name: page
 *            default: 1
 *            in: query
 *            schema:
 *                  type: number
 *          - name: pageSize
 *            default: 10
 *            in: query
 *            schema:
 *                  type: number
 *          - name: product
 *            in: query
 *            schema:
 *                  type: text
 *          - name: category_id
 *            in: query
 *            schema:
 *                  type: number
 *          - name: brand_id
 *            in: query
 *            schema:
 *                  type: number
 *      responses:
 *          default:
 *              description: this is response   
 */

router.get("/client", controller.getAllProductClient)

/**
 * @swagger
 * /product:
 *  post:
 *      tags: [Product]
 *      security:
 *          - Bearer: []
 *      summary: create new product
 *      parameters:
 *          - name: body
 *            in: body
 *            schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                      image:
 *                          type: string
 *                      cate_id:
 *                          type: number
 *                      brand_id:
 *                          type: number
 *                      digital_detail:
 *                          type: string
 *                      description:
 *                          type: string
 *            required:
 *                  - name
 *                  - image
 *                  - cate_id
 *                  - brand_id
 *      responses:
 *          default:
 *              description: this is the default response
 */
router.post("",authorize("ADMIN"),controller.createProduct);

/**
 * @swagger
 * /product/{id}:
 *  get:
 *      tags: [Product]
 *      summary: get a product 
 *      parameters:
 *          - name: id
 *            in: path
 *            schema:
 *                  type: number
 *            required: true
 *      responses:
 *          default:
 *              description: this is response   
 */
router.get("/:id", controller.getProductId);

/**
 * @swagger
 * /product/{id}:
 *  put:
 *      tags: [Product]
 *      summary: update a product 
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - name: id
 *            in: path
 *            schema:
 *                  type: number
 *            required: true
 *          - name: body
 *            in: body
 *            schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                      image:
 *                          type: string
 *                      cate_id:
 *                          type: number
 *                      brand_id:
 *                          type: number
 *                      digital_detail:
 *                          type: string
 *                      description:
 *                          type: string
 *            required:
 *                  - name
 *                  - image
 *                  - cate_id
 *                  - brand_id
 *      responses:
 *          default:
 *              description: this is response   
 */
router.put("/:id",authorize("ADMIN"),controller.updateProduct);

/**
 * @swagger
 * /product/{id}:
 *  delete:
 *      tags: [Product]
 *      summary: delete a product 
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - name: id
 *            in: path
 *            schema:
 *                  type: number
 *            required: true
 *      responses:
 *          default:
 *              description: this is response   
 */
router.delete("/:id",authorize("ADMIN"),controller.deleteProduct);
/**
 * @swagger
 * /product/uploadUrl:
 *  post:
 *      tags: [Product]
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
router.post("/uploadUrl", uploadFiler.single("image"),uploadController.uploadProduct)
module.exports = router;
