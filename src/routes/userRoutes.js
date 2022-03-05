const express = require("express");
const router = express.Router();
const multer = require("multer");
const { validationResult } = require("express-validator");
const controller = require("../controllers/UserController");
const authorize = require("../common/authorization/authorization-middleware");

/**
 * @swagger
 * tags:
 *  name: User
 *  description: this for user api
 * /user:
 *  get:
 *      tags: [User]
 *      summary: get all users
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - name: page
 *            default: 1
 *            in: query
 *            schema:
 *                  type: integer
 *          - name: pageSize
 *            default: 10
 *            in: query
 *            schema:
 *                  type: integer
 *          - name: name
 *            in: query
 *            chema:
 *                  type: text
 *          - name: email
 *            in: query
 *            chema:
 *                  type: text
 *          - name: phone
 *            in: query
 *            chema:
 *                  type: text
 *          - name: role
 *            in: query
 *            chema:
 *                  type: text
 *      responses:
 *          default:
 *              description: this is the default response
 */
router.get("", authorize("ADMIN"), controller.getAllUser);

/**
 * @swagger
 * tags:
 *  name: User
 *  description: this for user api
 * /user/signup:
 *  post:
 *      tags: [User]
 *      parameters:
 *          - name: body
 *            in: body
 *            schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                      phone:
 *                          type: string
 *                      email:
 *                          type: string
 *                      role:
 *                          type: string
 *                      password:
 *                          type: string
 *            required:
 *                  - name
 *                  - phone
 *                  - role
 *                  - email
 *                  - password
 *      responses:
 *          default:
 *              description: this is the default response
 */
router.post("/signup", controller.createAccount);

/**
 * @swagger
 * tags:
 *  name: User
 *  description: this for user api
 * /user/login:
 *  post:
 *      tags: [User]
 *      parameters:
 *          - name: body
 *            in: body
 *            schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                          type: string
 *                      password:
 *                          type: string
 *            required:
 *                  - email
 *                  - password
 *      responses:
 *          default:
 *              description: this is the default response
 */
router.post("/login", controller.login);

/**
 * @swagger
 * tags:
 *  name: User
 *  description: this for user api
 * /user/vertify-email:
 *  post:
 *      tags: [User]
 *      parameters:
 *          - name: body
 *            in: body
 *            schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                          type: string
 *
 *            required:
 *                  - email
 *
 *      responses:
 *          default:
 *              description: this is the default response
 */
router.post("/vertify-email", controller.vertifyEmail);


/**
 * @swagger
 * tags:
 *  name: User
 *  description: this for user api
 * /user/{id}:
 *  delete:
 *      tags: [User]
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - name: id
 *            in: path
 *            chema:
 *                  type: integer
 *      responses:
 *          default:
 *              description: this is the default response
 */
 router.delete("/:id", authorize('ADMIN') ,controller.deleteUser);

 
/**
 * @swagger
 * /user:
 *  put:
 *      tags: [User]
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - name: body
 *            in: body
 *            schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                      phone:
 *                          type: string
 *                      email:
 *                          type: string
 *                      role:
 *                          type: string
 *                      password:
 *                          type: string
 *      responses:
 *          default:
 *              description: this is the default response
 */
router.put("",authorize() ,controller.updateUser);


/**
 * @swagger
 * /user:
 *  patch:
 *      tags: [User]
 *      summary: reset password
 *      parameters:
 *          - name: email
 *            in: query
 *            schema:
 *                  type: string
 *      responses:
 *          default:
 *              description: this is the default response
 */
 router.patch("", controller.resetPassword);
module.exports = router;
