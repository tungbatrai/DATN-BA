const {
  likeClause,
  removeLastAnd,
} = require("../common/query/make_greate_query");
const getAllBrand = (req, res, next) => {
  try {
    var db = req.conn;
    var page =
      isNaN(parseInt(req.query.page)) || parseInt(req.query.page) === 0
        ? 1
        : parseInt(req.query.page);
    var pageSize =
      isNaN(parseInt(req.query.pageSize)) || parseInt(req.query.pageSize) === 0
        ? 20
        : parseInt(req.query.pageSize);
    var fillName = req.query.name ? req.query.name.replace(/"/g, "") : null;
    var skipNumber = (page - 1) * pageSize;
    sqlQuery = `select * from brand 
    where 
    ${likeClause("name", fillName)}`;
    let getAllElements = db.query(removeLastAnd(sqlQuery), (err, orders) => {
      if (err) console.log("err when get all element");
      else {
        var totalElements = orders.length;
        let results = db.query(
          `${removeLastAnd(sqlQuery)} order by id desc limit ? offset ?`,
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
const createBrand = async (req, res, next) => {
  try {
    var db = req.conn;
    var data = {
      name: req.body.name,
      logo: req.body.logo,
    };
    let results = db.query(
      "insert into brand set ?",
      [data],
      (err, resopond) => {
        if (err) console.log("error");
        else
          res.send({
            status: 200,
            message: "create success",
          });
      }
    );
  } catch (err) {
    res.send({
      message: "something wrong",
    });
  }
};
const getProductInBrand = async (req, res, next) => {
  try {
    var db = req.conn;
    var id = req.params.id;
    let checkExist = db.query(
      "select * from brand where id = ?",
      id,
      (err, brand) => {
        if (err) console.log("error check exist");
        else {
          if (brand.length <= 0) {
            res.send({
              status: 404,
              message: "not exist",
            });
          } else {
            let updateQuery = db.query(
              "select * from product where brand_id = ? order by id desc",
              id,
              (err, products) => {
                if (err) console.log("error query");
                else {
                  res.send({
                    status: 200,
                    message: "success",
                    data: {
                      brand: brand[0],
                      product: products,
                    },
                  });
                }
              }
            );
          }
        }
      }
    );
  } catch (err) {
    res.send({ message: "something wrong" });
  }
};
const updateBrand = async (req, res, next) => {
  try {
    var db = req.conn;
    var id = req.params.id;
    var dataUpdate = {
      name: req.body.name,
      logo: req.body.logo,
    };
    let checkExist = db.query(
      "select * from brand where id = ?",
      id,
      (err, results) => {
        if (err) console.log("error check exist");
        else {
          if (results.length <= 0) {
            res.send({
              status: 404,
              message: "not exist",
            });
          } else {
            let updateQuery = db.query(
              "update brand set ? where id = ?",
              [dataUpdate, id],
              (err, responds) => {
                if (err) console.log("error uodate query");
                else {
                  res.send({
                    status: 200,
                    message: "update success",
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
const deleteBrand = async (req, res, next) => {
  try {
    var db = req.conn;
    var id = req.params.id;
    let checkExist = db.query(
      "select * from brand where id = ?",
      id,
      (err, results) => {
        if (err) console.log("error check exist");
        else {
          if (results.length <= 0) {
            res.send({
              status: 404,
              message: "not exist",
            });
          } else {
            let results = db.query(
              "delete from brand where id = ?",
              id,
              (err, respond) => {
                if (err) console.log("error query");
                else {
                  let deleteAllProduct = db.query(
                    "delete from product where brand_id = ?",
                    id,
                    (err, deleteProduct) => {
                      if (err)
                        console.log("error when delete product with brand id");
                      else {
                        res.send({
                          status: 200,
                          message: "Delete success",
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  } catch (err) {
    res.send({ message: "something wrong" });
  }
};
module.exports = {
  getAllBrand,
  createBrand,
  getProductInBrand,
  deleteBrand,
  updateBrand
};
