module.exports = (parameters) => {
  return (req, res, next) => {
    try {
      var db = req.conn;
      var page =
        isNaN(parseInt(req.query.page)) || parseInt(req.query.page) === 0
          ? 1
          : parseInt(req.query.page);
      var pageSize =
        isNaN(parseInt(req.query.pageSize)) ||
        parseInt(req.query.pageSize) === 0
          ? parameters.size
          : parseInt(req.query.pageSize);
      var fillName = req.query.name
      var skipNumber = (page - 1) * pageSize;
      let getAllElements = db.query(`select * from ${parameters.table} where ${(fillName) ? `name = ${fillName}` : null}`, (err, orders) => {
        if (err) console.log("err when get all element");
        else {
          var totalElements = orders.length;
          let results = db.query(
            `select * from ${parameters.table} where ${(fillName) ? `name = ${fillName}` : null} limit ? offset ?`,
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
};
