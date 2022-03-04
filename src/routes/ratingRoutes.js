const express = require('express')
const router = express.Router();
const authorize = require('../common/authorization/authorization-middleware')
const controller = require('../controllers/RatingController')

/**
 * @swagger
 * tags:
 *  name: Rating
 *  description: this for rate api
 * /rating:
 *  get:
 *      tags: [Rating]
 *      summary: get all rate
 *      parameters:
 *          - name: page
 *            in: query
 *            default: 1
 *            chema:
 *                  type: integer
 *            required: true 
 *          - name: pageSize
 *            in: query
 *            default: 10
 *            chema:
 *                  type: integer
 *            required: true 
 *          - name: product
 *            in: query
 *            chema:
 *                  type: text
 *          - name: rater
 *            in: query
 *            chema:
 *                  type: text
 *          - name: star
 *            in: query
 *            chema: 
 *                  type: integer
 *          - name: startDate
 *            in: query
 *            type: string
 *            default: 2022-01-31
 *            pattern: '^\d{4}-\d{2}-\d{2}$'
 *          - name: endDate
 *            in: query
 *            type: string
 *            default: 2022-05-31
 *            pattern: '^\d{4}-\d{2}-\d{2}$'
 *      responses:
 *          default:
 *              description: this is the default response
 */
router.get("",controller.getAllRating)

/**
 * @swagger
 * tags:
 *  name: Rating
 *  description: this for rate api
 * /rating/{pId}:
 *  get:
 *      tags: [Rating]
 *      summary: get all rate for a product
 *      parameters:
 *          - name: pId
 *            in: path
 *            chema:
 *                  type: integer
 *            required: true
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
 *          - name: star
 *            in: query
 *            chema:
 *                  type: integer
 *      responses:
 *          default:
 *              description: this is the default response 
 */
router.get("/:pId",controller.getProductRate)

/**
 * @swagger
 * tags:
 *  name: Rating
 *  description: this for rate api
 * /rating:
 *  post:
 *      tags: [Rating]
 *      security:
 *          - Bearer: []
 *      summary: create a new rate
 *      parameters:
 *          - name: body
 *            in: body
 *            type: object
 *            properties:
 *                  user_id:
 *                      type: integer
 *                  product_id:
 *                      type: integer
 *                  rate:
 *                      type: integer
 *                  content:
 *                      type: string
 *            required:
 *                  - user_id
 *                  - product_id
 *      responses:
 *          default:
 *              description: this is response
 */
router.post("",authorize(),controller.createRating)

module.exports = router