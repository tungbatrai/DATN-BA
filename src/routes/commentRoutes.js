const express = require("express");
const router = express.Router();
const authorize = require("../common/authorization/authorization-middleware");
const controller = require("../controllers/CommentController");

/**
 * @swagger
 * tags:
 *  name: Comment
 *  description: this for comment api
 * /comment:
 *  get:
 *      tags: [Comment]
 *      summary: get all comment
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
 *          - name: commenter
 *            in: query
 *            chema:
 *                  type: text
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
router.get("", controller.getAllComment);

/**
 * @swagger
 * /comment:
 *  post:
 *      tags: [Comment]
 *      security:
 *          - Bearer: []
 *      summary: create a new comment
 *      parameters:
 *          - name: body
 *            in: body
 *            type: object
 *            properties:
 *                  user_id:
 *                      type: integer
 *                  product_id:
 *                      type: integer
 *                  content:
 *                      type: string
 *                  reply_id:
 *                      type: integer
 *            required:
 *                  - user_id
 *                  - product_id
 *      responses:
 *          default:
 *              description: this is response
 */
router.post("", authorize(), controller.createComment);

/**
 * @swagger
 * /comment/{pId}:
 *  get:
 *      tags: [Comment]
 *      summary: get all comment parent for a product
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
 *      responses:
 *          default:
 *              description: this is the default response
 */
router.get("/:pId", controller.getProductCommentParrent);

/**
 * @swagger
 * /comment/child/{cId}:
 *  get:
 *      tags: [Comment]
 *      summary: get all comment child
 *      parameters:
 *          - name: cId
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
 *      responses:
 *          default:
 *              description: this is the default response
 */
router.get("/child/:cId", controller.getProductCommentChild);

/**
 * @swagger
 * /comment/{id}:
 *  delete:
 *      tags: [Comment]
 *      security:
 *          - Bearer: []
 *      summary: delete a comment
 *      parameters:
 *          - name: id
 *            in: path
 *            chema:
 *                  type: integer
 *            required: true
 *      responses:
 *          default:
 *              description: this is the default response
 */
router.delete("/:id", authorize(), controller.deleteComment);

/**
 * @swagger
 * /comment/{id}:
 *  put:
 *      tags: [Comment]
 *      security:
 *          - Bearer: []
 *      summary: update a comment
 *      parameters:
 *          - name: id
 *            in: path
 *            chema:
 *                  type: integer
 *          - name: body
 *            in: body
 *            type: object
 *            properties:
 *                  user_id:
 *                      type: integer
 *                  product_id:
 *                      type: integer
 *                  content:
 *                      type: string
 *                  reply_id:
 *                      type: integer
 *            required:
 *                  - user_id
 *                  - product_id
 *      responses:
 *          default:
 *              description: this is response
 */
router.put("/:id", authorize(), controller.editComment);
module.exports = router;
