const {
  likeClause,
  timeClause,
  removeLastAnd,
  equalClause,
} = require("../common/query/make_greate_query");
const getAllComment = (req, res, next) => {
  try {
    var db = req.conn;
    var startDate = req.query.startDate ? req.query.startDate : null;
    var endDate = req.query.endDate ? req.query.endDate : null;
    var page =
      isNaN(parseInt(req.query.page)) || parseInt(req.query.page) === 0
        ? 1
        : parseInt(req.query.page);
    var pageSize =
      isNaN(parseInt(req.query.pageSize)) || parseInt(req.query.pageSize) === 0
        ? 20
        : parseInt(req.query.pageSize);
    var skipNumber = (page - 1) * pageSize;
    var fillPName = req.query.product
      ? req.query.product.replace(/"/g, "")
      : null;
    var fillUName = req.query.commenter
      ? req.query.commenter.replace(/"/g, "")
      : null;
    var sqlQuery = `select c.*, u.name as user_name,p.name as product_name 
          from 
          comment c left join user u on c.user_id = u.id left join product p on c.product_id = p.id
          where 
           ${likeClause("p.name", fillPName)} 
           ${likeClause("u.name", fillUName)} 
           ${timeClause("c.time_comment", startDate, endDate)}
          `;
    let getAllElements = db.query(`${removeLastAnd(sqlQuery)}`, (err, orders) => {
      if (err) console.log("err when get all element");
      else {
        var totalElements = orders.length;
        let results = db.query(
          `${removeLastAnd(
            sqlQuery
          )} order by time_comment desc limit ? offset ?`,
          [pageSize, skipNumber],
          (err, respond) => {
            if (err) console.log("error");
            else {
              let currentElement = respond.length;
              res.send({
                status: 200,
                message: "Success",
                data: respond,
                currentPage: page,
                currentElement: currentElement,
                totalElements: totalElements,
              });
            }
          }
        );
      }
    });
  } catch (err) {
    res.send({
      message: "something wrong",
    });
  }
};
const createComment = (req, res, next) => {
  try {
    var db = req.conn;
    var today = new Date();
    var userId = req.body.user_id;
    var productId = req.body.product_id;
    var data = {
      user_id: userId,
      product_id: productId,
      reply_id: req.body.reply_id,
      content: req.body.content,
      time_comment: today,
    };
    let create = db.query("insert into comment set ?", data, (err, results) => {
      if (err) console.log("error when insert comment");
      else {
        res.send({
          status: 200,
          message: "success",
        });
      }
    });
  } catch (err) {
    res.send({
      message: "something wrong",
    });
  }
};
const getProductCommentParrent = (req, res, next) => {
  try {
    var db = req.conn;
    var productId = req.params.pId;
    var page =
      isNaN(parseInt(req.query.page)) || parseInt(req.query.page) === 0
        ? 1
        : parseInt(req.query.page);
    var pageSize =
      isNaN(parseInt(req.query.pageSize)) || parseInt(req.query.pageSize) === 0
        ? 20
        : parseInt(req.query.pageSize);
    var skipNumber = (page - 1) * pageSize;
    var sqlQuery = `select c.*, u.name as user_name,p.name as product_name 
          from 
          comment c left join user u on c.user_id = u.id left join product p on c.product_id = p.id
          where c.reply_id = 0 and
          c.product_id = ${productId}`;
    let getAllElements = db.query(sqlQuery, (err, orders) => {
      if (err) console.log("err when get all element");
      else {
        var totalElements = orders.length;
        let results = db.query(
          `${sqlQuery} order by time_comment desc limit ? offset ?`,
          [pageSize, skipNumber],
          (err, respond) => {
            if (err) console.log("error");
            else {
              let currentElement = respond.length;
              res.send({
                status: 200,
                message: "Success",
                data: respond,
                currentPage: page,
                currentElement: currentElement,
                totalElements: totalElements,
              });
            }
          }
        );
      }
    });
  } catch (err) {
    res.send({
      message: "something wrong",
    });
  }
};
const getProductCommentChild = (req, res, next) => {
  try {
    var db = req.conn;
    var commentId = req.params.cId;
    var page =
      isNaN(parseInt(req.query.page)) || parseInt(req.query.page) === 0
        ? 1
        : parseInt(req.query.page);
    var pageSize =
      isNaN(parseInt(req.query.pageSize)) || parseInt(req.query.pageSize) === 0
        ? 20
        : parseInt(req.query.pageSize);
    var skipNumber = (page - 1) * pageSize;
    var sqlQuery = `select c.*, u.name as user_name,p.name as product_name 
            from 
            comment c left join user u on c.user_id = u.id left join product p on c.product_id = p.id
            where 
            c.reply_id = ${commentId}`;
    console.log(commentId);
    let getAllElements = db.query(sqlQuery, (err, orders) => {
      if (err) console.log("err when get all element");
      else {
        var totalElements = orders.length;
        let results = db.query(
          `${sqlQuery} order by time_comment desc limit ? offset ?`,
          [pageSize, skipNumber],
          (err, respond) => {
            if (err) console.log("error");
            else {
              let currentElement = respond.length;
              res.send({
                status: 200,
                message: "Success",
                data: respond,
                currentPage: page,
                currentElement: currentElement,
                totalElements: totalElements,
              });
            }
          }
        );
      }
    });
  } catch (err) {
    res.send({
      message: "something wrong",
    });
  }
};
const editComment = (req, res, next) => {
  try {
    var db = req.conn;
    var commentId = req.params.id;
    var userId = req.body.user_id;
    var productId = req.body.product_id;
    var today = new Date();
    var editData = {
      user_id: userId,
      product_id: productId,
      reply_id: req.body.reply_id,
      content: req.body.content,
      time_comment: today,
    };
    let updateComment = db.query(
      "update comment set ? where id = ?",
      [editData, commentId],
      (err, respond) => {
        if (err) res.send({ message: error });
        else {
          res.send({ status: 200, message: "update success" });
        }
      }
    );
  } catch (err) {
    res.send({ message: "something wrong" });
  }
};
const deleteComment = (req, res, next) => {
  try {
    var db = req.conn;
    var commentId = req.params.id;
    let deleteComment = db.query(
      "delete from comment where id = ?",
      [commentId],
      (err, respond) => {
        if (err) res.send({ message: error });
        else {
          res.send({ status: 200, message: "delete success" });
        }
      }
    );
  } catch (err) {
    res.send({ message: "something wrong" });
  }
};
module.exports = {
  getAllComment,
  getProductCommentParrent,
  createComment,
  editComment,
  deleteComment,
  getProductCommentChild,
};
