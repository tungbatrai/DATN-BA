const {
  likeClause,
  removeLastAnd,
  equalClause,
} = require("../common/query/make_greate_query");
const getAllProduct = (req, res, next) => {
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
    var skipNumber = (page - 1) * pageSize;
    var fillPName = req.query.product
      ? req.query.product.replace(/"/g, "")
      : null;
    var fillBName = req.query.brand ? req.query.brand.replace(/"/g, "") : null;
    var fillCName = req.query.category
      ? req.query.category.replace(/"/g, "")
      : null;
    var fillCId = req.query.category_id
      ? req.query.category_id.replace(/"/g, "")
      : null;
    var fillBId = req.query.brand_id
      ? req.query.brand_id.replace(/"/g, "")
      : null;
    sqlQuery = `select p.*, c.name as category_name, b.name as brand_name, sum(pt.quantity) as total_quantity
    from 
    product p left join category c on p.cate_id = c.id left join brand b on p.brand_id = b.id left join product_type pt on pt.product_id = p.id
      where 
     ${likeClause("p.name", fillPName)} 
     ${likeClause("b.name", fillBName)} 
     ${likeClause("c.name", fillCName)} 
     ${equalClause("b.id", fillBId)} 
     ${equalClause("c.id", fillCId)}`;
    let getAllElements = db.query(
      `${removeLastAnd(sqlQuery)} group by p.id`,
      (err, orders) => {
        if (err) console.log("err when get all element");
        else {
          var totalElements = orders.length;
          let results = db.query(
            `${removeLastAnd(sqlQuery)} group by p.id order by id desc limit ? offset ?`,
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
      }
    );
  } catch (err) {
    res.send({
      message: "something wrong",
    });
  }
};
const getAllProductClient = (req, res, next) => {
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
    var skipNumber = (page - 1) * pageSize;
    var fillPName = req.query.product
      ? req.query.product.replace(/"/g, "")
      : null;
    var fillCId = req.query.category_id
      ? req.query.category_id.replace(/"/g, "")
      : null;
    var fillBId = req.query.brand_id
      ? req.query.brand_id.replace(/"/g, "")
      : null;
    sqlQuery = `select p.*, c.name as category_name, b.name as brand_name 
    from 
    product p left join category c on p.cate_id = c.id left join brand b on p.brand_id = b.id 
      where 
     ${likeClause("p.name", fillPName)} 
     ${equalClause("b.id", fillBId)} 
     ${equalClause("c.id", fillCId)}`;
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
const createProduct = async (req, res, next) => {
  try {
    var db = req.conn;
    var data = {
      name: req.body.name,
      image: req.body.image,
      cate_id: req.body.cate_id,
      brand_id: req.body.brand_id,
      digital_detail: req.body.digital_detail,
      description: req.body.description,
    };
    let checkExisCate = db.query(
      "select * from category where id = ?",
      req.body.cate_id,
      (err, cate) => {
        if (err) console.log("error query cate exist");
        else {
          if (cate.length <= 0) {
            res.send({
              status: 404,
              message: "cate id can't found",
            });
          } else {
            let checkExisBrand = db.query(
              "select * from brand where id = ?",
              req.body.brand_id,
              (err, brand) => {
                if (err) console.log("error query brand exist");
                else {
                  if (brand.length <= 0) {
                    res.send({
                      status: 404,
                      message: "brand id can't found",
                    });
                  } else {
                    let results = db.query(
                      "insert into product set ?",
                      [data],
                      (err, respond) => {
                        if (err) console.log("error");
                        else
                          res.send({
                            status: 200,
                            message: "create success",
                          });
                      }
                    );
                  }
                }
              }
            );
          }
        }
      }
    );
  } catch (err) {
    res.send({
      message: "Something wrong",
    });
  }
};
const getProductId = async (req, res, next) => {
  try {
    var db = req.conn;
    let id = req.params.id;
    let results = db.query(
      `select * from product where id = ${id}`,
      (err, respond) => {
        if (err) console.log("error");
        else {
          res.send({
            status: 200,
            message: "success",
            data: respond,
          });
        }
      }
    );
  } catch (err) {
    res.send({
      message: "Something wrong",
    });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    var db = req.conn;
    let id = req.params.id;
    var data = {
      name: req.body.name,
      image: req.body.image,
      cate_id: req.body.cate_id,
      brand_id: req.body.brand_id,
      digital_detail: req.body.digital_detail,
      description: req.body.description,
    };
    let checkExist = db.query(
      "select * from product where id = ?",
      id,
      (err, results) => {
        if (err) console.log("error check exist");
        else {
          if (results.length <= 0) {
            res.send({
              status: 404,
              message: "product not exist",
            });
          } else {
            let checkExisCate = db.query(
              "select * from category where id = ?",
              req.body.cate_id,
              (err, cate) => {
                if (err) console.log("error query cate exist");
                else {
                  if (cate.length <= 0) {
                    res.send({
                      status: 404,
                      message: "cate id can't found",
                    });
                  } else {
                    let checkExisBrand = db.query(
                      "select * from brand where id = ?",
                      req.body.brand_id,
                      (err, brand) => {
                        if (err) console.log("error query brand exist");
                        else {
                          if (brand.length <= 0) {
                            res.send({
                              status: 404,
                              message: "brand id can't found",
                            });
                          } else {
                            let results = db.query(
                              `update product set ? where id = ?`,
                              [data, id],
                              (err, respond) => {
                                if (err) console.log("error");
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
                  }
                }
              }
            );
          }
        }
      }
    );
  } catch (err) {
    res.send({
      message: "Something wrong",
    });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    var db = req.conn;
    var id = req.params.id;
    let results = db.query(
      "delete from product where id = ?",
      id,
      (err, respond) => {
        if (err) console.log("Error");
        else {
          res.send({
            status: 200,
            message: "Delete success",
          });
        }
      }
    );
  } catch (err) {
    res.send({
      message: "Something wrong",
    });
  }
};
module.exports = {
  getAllProduct,
  getAllProductClient,
  createProduct,
  getProductId,
  updateProduct,
  deleteProduct,
};
