const express = require('express')
const router = express.Router();
const authorize = require('../common/authorization/authorization-middleware')
const controller = require('../controllers/CommentController')

// router.get("",authorize("ADMIN"),controller.getAllImport)
module.exports = router