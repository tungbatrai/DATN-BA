const getAllProductType = (req, res, next) => {
  try {
    var db = req.conn;
    var productId = req.params.pId;
    sqlQuery = `select * from product_type where product_id = ${productId}`;
    let getAll = db.query(`${sqlQuery}`, (err, results) => {
      if (err) console.log("error when get all product type");
      else {
        res.send({ status: 200, data: results });
      }
    });
  } catch (err) {
    res.send({ message: "something wrong" });
  }
};

const createProductType = (req, res, next) => {
  try {
    var db = req.conn;
    var productId = req.params.pId;
    var data = {
      product_id: productId,
      image: req.body.image,
      price: req.body.price,
      quantity: req.body.quantity ? req.body.quantity : 0,
      color: req.body.color,
      type: req.body.type,
      color_code: req.body.color_code,
    };
    let createExecute = db.query(
      "insert into product_type set ?",
      [data],
      (err, products) => {
        if (err) console.log("error when insert to product type");
        else {
          res.send({
            status: 200,
            message: "create success",
          });
        }
      }
    );
  } catch (err) {
    res.send({ message: "something wrong" });
  }
};

const updateProductType = (req, res, next) => {
  try {
    var db = req.conn;
    var productId = req.params.pId;
    var id = req.params.id;
    var data = {
      product_id: productId,
      image: req.body.image,
      price: req.body.price,
      quantity: req.body.quantity ? req.body.quantity : 0,
      color: req.body.color,
      type: req.body.type,
      color_code: req.body.color_code,
    };
    let createExecute = db.query(
      "update product_type set ? where id = ?",
      [data, id],
      (err, products) => {
        if (err) console.log("error when insert to product type");
        else {
          res.send({
            status: 200,
            message: "update success",
          });
        }
      }
    );
  } catch (err) {
    res.send({ message: "something wrong" });
  }
};
const getDetail = (req, res, next) => {
  try {
    var db = req.conn;
    var id = req.params.Id;
    let createExecute = db.query(
      "select * from product_type where id = ?",
      [id],
      (err, products) => {
        if (err) console.log("error when insert to product type");
        else {
          res.send({
            status: 200,
            data: products,
          });
        }
      }
    );
  } catch (err) {
    res.send({ message: "something wrong" });
  }
};
module.exports = {
  getAllProductType,
  createProductType,
  updateProductType,
  getDetail
};
