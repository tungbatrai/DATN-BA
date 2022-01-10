const express = require('express')
const router = express.Router();
const authorize = require('../common/authorization/authorization-middleware')
const controller = require('../controllers/ImportController')

/**
 * @swagger
 * tags:
 *  name: Import
 *  description: this is all api for import action
 * /import:
 *  get:
 *      tags: [Import]
 *      security:
 *          - Bearer: []
 *      summary: get all import list
 *      parameters:
 *          - name: startDate
 *            in: query
 *            type: string
 *          - name: endDate
 *            in: query
 *            type: string
 *          - name: page
 *            in: query
 *            default: 1
 *            type: integer
 *          - name: pageSize
 *            in: query
 *            default: 10
 *            type: integer
 *          - name: importer
 *            in: query
 *            type: string
 *          - name: product
 *            in: query
 *            type: string
 *      responses:
 *          default:
 *              description: this is responses
 *      
 */
router.get("",authorize("ADMIN"),controller.getAllImport)

/**
 * @swagger
 * /import:
 *  post:
 *      tags: [Import]
 *      security:
 *          - Bearer: []
 *      summary: create a new import
 *      parameters:
 *          - name: body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  product_id: 
 *                      type: integer
 *                  quantity:
 *                      type: integer
 *                  status:
 *                      type: string
 *                  importer:
 *                      type: integer
 *      required:
 *          - product_id
 *          - importer
 *          - quatity
 *      responses:
 *          default:
 *              description: This is responses
 *                  
 */
router.post("",authorize("ADMIN"),controller.createImport)

/**
 * @swagger
 * tags:
 *  name: Import
 *  description: this is all api for import action
 * /import/download:
 *  get:
 *      tags: [Import]
 *      security:
 *          - Bearer: []
 *      summary: download all import list
 *      parameters:
 *          - name: startDate
 *            in: query
 *            type: string
 *          - name: endDate
 *            in: query
 *            type: string
 *          - name: importer
 *            in: query
 *            type: string
 *          - name: product
 *            in: query
 *            type: string
 *      responses:
 *          default:
 *              description: this is responses
 *      
 */
router.get("/download", controller.downloadImport)
module.exports = router