const {
  likeClause,
  timeClause,
  removeLastAnd,
  equalClause,
} = require("../common/query/make_greate_query");
const getAllRating = (req, res, next) => {
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
    var fillUName = req.query.rater ? req.query.rater.replace(/"/g, "") : null;
    var fillStar = req.query.star ? req.query.star : null;
    var sqlQuery = `select r.*, u.name as user_name,p.name as product_name 
        from 
        rate r left join user u on r.user_id = u.id left join product p on r.product_id = p.id
        where 
         ${likeClause("p.name", fillPName)} 
         ${likeClause("u.name", fillUName)} 
         ${timeClause("r.time_rate", startDate, endDate)}
         ${equalClause("r.rate", fillStar)}
        `;
    let getAllElements = db.query(removeLastAnd(sqlQuery), (err, orders) => {
      if (err) console.log("err when get all element");
      else {
        var totalElements = orders.length;
        let results = db.query(
          `${removeLastAnd(sqlQuery)} order by time_rate desc limit ? offset ?`,
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
const createRating = (req, res, next) => {
  try {
    var db = req.conn;
    var today = new Date();
    var userId = req.body.user_id;
    var productId = req.body.product_id;
    console.log(today);
    var data = {
      user_id: userId,
      product_id: productId,
      rate: req.body.rate,
      content: req.body.content,
      time_rate: today,
    };
    let checkRateExist = db.query(
      "select * from rate where user_id = ? and product_id = ?",
      [userId, productId],
      (err, rates) => {
        if (err) console.log("error when check rate exist");
        else {
          if (rates.length <= 0) {
            let create = db.query(
              "insert into rate set ?",
              data,
              (err, results) => {
                if (err) console.log("error when insert rate");
                else {
                  res.send({
                    status: 200,
                    message: "success",
                  });
                }
              }
            );
          } else {
            let update = db.query(
              "update rate set ? where id = ?",
              [data, rates[0].id],
              (err, results) => {
                if (err) console.log("error when update rate");
                else {
                  res.send({
                    status: 200,
                    message: "success",
                  });
                }
              }
            );
          }
        }
      }
    );
  } catch (err) {
    res.send({
      message: "something wrong",
    });
  }
};
const getProductRate = (req, res, next) => {
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
    var fillStar = req.query.star ? req.query.star : null;
    var sqlQuery = `select r.*, u.name as user_name,p.name as product_name 
        from 
        rate r left join user u on r.user_id = u.id left join product p on r.product_id = p.id
        where 
        r.product_id = ${productId}
        and
         ${equalClause("r.rate", fillStar)}
        `;
    let getTotal = db.query(
      "select round(avg(rate),1) as average ,count(*) as total  from rate where product_id = ?",
      productId,
      (err, total) => {
        if (err) console.log("error when select total rate");
        else {
          let getRate = db.query(
            "select rate, COUNT(*) as time from rate WHERE product_id= ? GROUP BY rate",
            productId,
            (err, rates) => {
              if (err) console.log("error when select rates");
              else {
                let getList = db.query(
                  `${removeLastAnd(
                    sqlQuery
                  )} order by r.time_rate desc limit ? offset ?`,
                  [pageSize, skipNumber],
                  (err, list) => {
                    if (err) console.log("error when get list rate");
                    else {
                      res.send({
                        status: 200,
                        data: {
                          counting: rates,
                          list: list,
                          average: total[0].average,
                          currentPage: page,
                          currentElement: list.length,
                          totalElements: total[0].total,
                        },
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (err) {
    res.send({
      message: "something wrong",
    });
  }
};
module.exports = {
  getAllRating,
  createRating,
  getProductRate,
};
