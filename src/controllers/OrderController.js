const {
  likeClause,
  removeLastAnd,
} = require("../common/query/make_greate_query");
const getAllOrder = (req, res, next) => {
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
    var fillUName = req.query.user ? req.query.user.replace(/"/g, "") : null;
    var fillCName = req.query.category
      ? req.query.category.replace(/"/g, "")
      : null;
    var fillStatus = req.query.status
      ? req.query.status.replace(/"/g, "")
      : null;
    var sqlQuery = `select o.id as id, p.name as product_name, u.name as user_name,b.name as brand_name, c.name as category_name, o.quantity as quantity, o.status as status 
    from 
    orders o left join product p on o.product_id = p.id left JOIN user u on o.customer_id = u.id left join category c on p.cate_id = c.id left join brand b on p.brand_id=b.id 
    where 
    ${likeClause("p.name", fillPName)} 
    ${likeClause("u.name", fillUName)} 
    ${likeClause("b.name", fillBName)}  
    ${likeClause("c.name", fillCName)} 
    ${likeClause("o.status", fillStatus)}`;
    let getAllElements = db.query(removeLastAnd(sqlQuery), (err, orders) => {
      if (err) console.log("err when get all element");
      else {
        var totalElements = orders.length;
        let results = db.query(
          `${removeLastAnd(sqlQuery)} limit ? offset ?`,
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

const getOrderDetail = async (req, res, next) => {
  try {
    var db = req.conn;
    var id = req.params.id;
    let results = db.query(
      "select * from orders where id = ?",
      id,
      (err, respond) => {
        if (err) console.log("error");
        else {
          if (respond.length <= 0) {
            res.send({
              status: 400,
              message: "not found",
            });
          } else
            res.send({
              status: 200,
              message: "Success",
              data: respond,
            });
        }
      }
    );
  } catch (err) {
    res.send({
      message: "something wrong",
    });
  }
};
const createOrder = async (req, res, next) => {
  try {
    var db = req.conn;
    var quatityOrder = req.body.quantity;
    var productId = req.body.product_id;
    var data = {
      customer_id: req.body.customer_id,
      product_id: req.body.product_id,
      quantity: parseInt(req.body.quantity),
      status: req.body.status,
    };
    let checkExisProduct = db.query(
      "select * from product where id = ?",
      req.body.product_id,
      (err, product) => {
        if (err) console.log("error query product exist");
        else {
          if (product.length <= 0) {
            res.send({
              status: 404,
              message: "product id not exist",
            });
          } else {
            let checkExisUser = db.query(
              "select * from user where id = ?",
              req.body.customer_id,
              (err, cate) => {
                if (err) console.log("error query user exist");
                else {
                  if (cate.length <= 0) {
                    res.send({
                      status: 404,
                      message: "user id not exist",
                    });
                  } else {
                    if (product[0].quantity < quatityOrder) {
                      res.send({
                        status: 400,
                        message: "not enought product",
                      });
                    } else {
                      let inventory =
                        parseInt(product[0].quantity) - parseInt(quatityOrder);
                      let makeOrder = db.query(
                        "insert into orders set ?",
                        [data],
                        (err, respond) => {
                          if (err) console.log("error when insert");
                          else {
                            var updateProduct = {
                              quantity: inventory,
                            };
                            let updateProductQuantity = db.query(
                              "update product set ? where id = ?",
                              [updateProduct, productId],
                              (err, ress) => {
                                if (err)
                                  console.log(
                                    "error when update product quantity"
                                  );
                                else
                                  res.send({
                                    status: 200,
                                    message: "order success",
                                  });
                              }
                            );
                          }
                        }
                      );
                    }
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
      message: "something wrong",
    });
  }
};
const deleteOrder = async (req, res, next) => {
  try {
    var db = req.conn;
    var id = req.params.id;
    let checkOrderExist = db.query(
      "select * from orders where id = ?",
      id,
      (err, order) => {
        if (err) console.log("error when check exist order");
        else {
          let quantityOrder = order[0].quantity;
          let productOrderId = order[0].product_id;
          let checkExistProduct = db.query(
            "select * from product where id = ?",
            productOrderId,
            (err, product) => {
              if (err) console.log("error when check product exist");
              else {
                if (product.length <= 0) {
                  res.send({
                    status: 404,
                    message: "product not exist",
                  });
                } else {
                  var updateProduct = {
                    quantity:
                      parseInt(product[0].quantity) + parseInt(quantityOrder),
                  };
                  let updateProductQuantity = db.query(
                    "update product set ? where id = ?",
                    [updateProduct, productOrderId],
                    (err, ress) => {
                      if (err)
                        console.log("error when update product quantity");
                      else {
                        let deleteOrderQuery = db.query(
                          "delete from orders where id = ?",
                          id,
                          (err, orderDelete) => {
                            if (err) console.log("error query delete");
                            else {
                              res.send({
                                status: 200,
                                message: "delete order success",
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
  getAllOrder,
  createOrder,
  deleteOrder,
  getOrderDetail,
};
