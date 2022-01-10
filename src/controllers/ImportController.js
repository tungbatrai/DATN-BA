const {
  likeClause,
  timeClause,
  removeLastAnd,
} = require("../common/query/make_greate_query");
const excel = require('exceljs')
const getAllImport = (req, res, next) => {
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
    var fillUName = req.query.importer
      ? req.query.importer.replace(/"/g, "")
      : null;
    var sqlQuery = `select i.*, u.name as user_name, p.name as product_name, pt.type as product_type, pt.color as product_color 
    from 
    import i left join user u on i.importer = u.id left join product_type pt on i.product_id = pt.id left join product p on p.id = pt.product_id
    where 
     ${likeClause("p.name", fillPName)} 
     ${likeClause("u.name", fillUName)} 
     ${timeClause("i.time_import",startDate,endDate)}
    `;
    let getAllElements = db.query(removeLastAnd(sqlQuery), (err, orders) => {
      if (err) console.log("err when get all element");
      else {
        var totalElements = orders.length;
        let results = db.query(
          `${removeLastAnd(sqlQuery)} order by time_import desc limit ? offset ?`,
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
const createImport = (req, res, next) => {
  try {
    var db = req.conn;
    var today = new Date();
    var timeImport = new Date(req.body.time_import);
    var quantityImport = parseInt(req.body.quantity);
    var productId = req.body.product_id;
    var data = {
      product_id: productId,
      quantity: quantityImport,
      status: req.body.status,
      time_import: req.body.time_import ? timeImport : today,
      importer: req.body.importer,
    };
    let checkProductExist = db.query(
      "select * from product_type where id = ?",
      productId,
      (err, product) => {
        if (err) console.log("error when check exist product");
        else {
          if (product.length <= 0) {
            res.send({
              status: 404,
              message: "product not exist",
            });
          } else {
            var dataUpdate = {
              quantity: product[0].quantity + quantityImport,
            };
            let updateProduct = db.query(
              "update product_type set ? where id = ?",
              [dataUpdate, productId],
              (err, updateStatus) => {
                if (err) console.log("error when update product");
                else {
                  let insertImport = db.query(
                    "insert into import set ?",
                    data,
                    (err, insertStatus) => {
                      if (err) console.log("error when insert import");
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

const downloadImport = (req, res, next) => {
  try {
    var db = req.conn;
    var startDate = req.query.startDate ? req.query.startDate : null;
    var endDate = req.query.endDate ? req.query.endDate : null;
    var fillPName = req.query.product
      ? req.query.product.replace(/"/g, "")
      : null;
    var fillUName = req.query.importer
      ? req.query.importer.replace(/"/g, "")
      : null;
    var sqlQuery = `select i.*, u.name as user_name, p.name as product_name, pt.type as product_type, pt.color as product_color 
    from 
    import i left join user u on i.importer = u.id left join product_type pt on i.product_id = pt.id left join product p on p.id = pt.product_id
    where 
     ${likeClause("p.name", fillPName)} 
     ${likeClause("u.name", fillUName)} 
     ${timeClause("i.time_import",startDate,endDate)}
    `;
    let getAllElements = db.query(removeLastAnd(sqlQuery), (err, orders) => {
      if (err) console.log("err when get all element");
      else {
        var totalElements = orders.length;
        let results = db.query(
          `${removeLastAnd(sqlQuery)} order by time_import desc`,
          (err, respond) => {
            if (err) console.log("error");
            else {
              let downloadArray = [];
              respond.forEach(item => {
                downloadArray.push({
                  id: item.id,
                  productId: item.product_id,
                  productName: item.product_name,
                  productType: item.product_type,
                  productColor: item.product_color,
                  importer: item.user_name,
                  quantity: item.quantity,
                  status: item.status
                })
              });
              let workbook = new excel.Workbook();
              let worksheet = workbook.addWorksheet("Imports")
              worksheet.columns = [
                { header: "Id", key: "id", width: 5 },
                { header: "Product Id", key: "productId", width: 15 },
                { header: "Product Name", key: "productName", width: 15 },
                { header: "Product Type", key: "productType", width: 15 },
                { header: "Product Color", key: "productColor", width: 15 },
                { header: "Importer", key: "importer", width: 10 },
                { header: "Quantity", key: "quantity", width: 10 },
                { header: "Status", key: "status", width: 15 },
              ]
              worksheet.addRows(downloadArray)
              res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              );
              res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "importer.xlsx"
              );
          
              return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
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
module.exports = {
  getAllImport,
  createImport,
  downloadImport
};
