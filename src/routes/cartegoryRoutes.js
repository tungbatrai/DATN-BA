const express = require("express");
const router = express.Router();
const controller = require("../controllers/CategoryController");
const fileUploader = require("../common/cloudy/cloudinary");
const authorize = require("../common/authorization/authorization-middleware");
const uploadController = require("../controllers/CloudinaryController")
/**
 * @swagger
 * tags:
 *  name: Category
 *  description: this is all api use for category
 * /category:
 *  get:
 *      tags: [Category]
 *      summary: get all category
 *      parameters:
 *          - name: page
 *            default: 1
 *            in: query
 *            chema:
 *                  type: integer
 *          - name: pageSize
 *            default: 10
 *            in: query
 *            chema: 
 *                  type: integer
 *          - name: name
 *            in: query
 *            chema: 
 *                  type: string
 *      responses:
 *          default:
 *              description: this is response
 *          
 */
router.get("", controller.getAllCategory);

/**
 * @swagger
 * /category/{id}:
 *  get:
 *      tags: [Category]
 *      summary: get category detail
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            type: integer
 *      responses:
 *          default:
 *              description: this is response
 * 
 * 
 */
router.get("/:id", controller.getProductInCate);

/**
 * @swagger
 * /category:
 *  post:
 *      tags: [Category]
 *      security:
 *          - Bearer: []
 *      summary: create a new category
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
 *            required:
 *                  - name
 *                  - image
 *      responses:
 *          default:
 *              description: this is the default response
 */
router.post("",authorize("ADMIN"), controller.createCategory);

/**
 * @swagger
 * /category/{id}:
 *  put:
 *      tags: [Category]
 *      security:
 *          - Bearer: []
 *      summary: update category
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
 *            required:
 *                  - name
 *                  - image
 *      responses:
 *          default:
 *              description: this is the default response
 */
router.put("/:id",authorize("ADMIN"),controller.updateCategory);

/**
 * @swagger
 * /category/{id}:
 *  delete:
 *      tags: [Category]
 *      security:
 *          - Bearer: []
 *      summary: delete category
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            type: integer
 *      responses:
 *          default:
 *              description: this is response
 * 
 * 
 */
router.delete("/:id", authorize("ADMIN"),controller.deleteCategory);
/**
 * @swagger
 * /category/uploadUrl:
 *  post:
 *      tags: [Category]
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
router.post("/uploadUrl",fileUploader.single("image"),uploadController.uploadCategory)
module.exports = router;
