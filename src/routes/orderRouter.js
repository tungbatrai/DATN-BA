const express = require("express");
const router = express.Router();
const controller = require("../controllers/OrderController");

/**
 * @swagger
 * tags:
 *  name: Order
 *  description: this is all api for order
 * /order:
 *  get:
 *      tags: [Order]
 *      security:
 *          - Bearer: []
 *      summary: get all order list
 *      parameters: 
 *          - name: page
 *            default: 1
 *            in: query
 *            type: integer
 *          - name: pageSize
 *            default: 10
 *            in: query
 *            type: integer
 *          - name: product
 *            in: query
 *            type: string
 *          - name: brand
 *            in: query
 *            type: string
 *          - name: user
 *            in: query
 *            type: string
 *          - name: category
 *            in: query
 *            type: string
 *          - name: status
 *            in: query
 *            type: string
 *      responses:
 *          default:
 *              description: this is responses
 */
router.get("", controller.getAllOrder);

/**
 * @swagger
 * /order/{id}:
 *  get:
 *      tags: [Order]
 *      security:
 *          - Bearer: []
 *      summary: get order detail
 *      parameters: 
 *          - name: id
 *            in: path
 *            type: integer
 *      responses:
 *          default:
 *              description: this is responses
 */
router.get("/:id", controller.getOrderDetail);

/**
 * @swagger
 * /order:
 *  post:
 *      tags: [Order]
 *      security:
 *          - Bearer: []
 *      summary: create new order
 *      parameters:
 *          - name: body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  customer_id: 
 *                      type: integer
 *                  product_id:
 *                      type: integer
 *                  quatity:
 *                      type: integer
 *                  status:
 *                      type: string
 *      responses:
 *          default:
 *              description: this is responses
 */
router.post("", controller.createOrder);

/**
 * @swagger
 * /order/{id}:
 *  delete:
 *      tags: [Order]
 *      security:
 *          - Bearer: []
 *      summary: delete order
 *      parameters: 
 *          - name: id
 *            in: path
 *            type: integer
 *      responses:
 *          default:
 *              description: this is responses
 */
router.delete("/:id", controller.deleteOrder);
module.exports = router;
