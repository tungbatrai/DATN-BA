const bcrypt = require("bcryptjs");
const e = require("express");
const jwt = require("jsonwebtoken");
const config = require("../common/authorization/config");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const {
  likeClause,
  removeLastAnd,
} = require("../common/query/make_greate_query");
const getAllUser = (req, res, next) => {
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
    var fillName = req.query.name ? req.query.name.replace(/"/g, "") : null;
    var fillEmail = req.query.email ? req.query.email.replace(/"/g, "") : null;
    var fillRole = req.query.role ? req.query.role.replace(/"/g, "") : null;
    var fillPhone = req.query.phone ? req.query.phone.replace(/"/g, "") : null;
    sqlQuery = `select * from user where is_delete = 'FALSE' and
    ${likeClause("name", fillName)} 
    ${likeClause("email", fillEmail)} 
    ${likeClause("phone", fillPhone)}  
    ${likeClause("role", fillRole)}`;
    console.log(removeLastAnd(sqlQuery));
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

const createAccount = async (req, res, next) => {
  try {
    var db = req.conn;
    var email = req.body.email;
    var phone = req.body.phone;
    const hashPass = await bcrypt.hash(req.body.password, 12);
    var data = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashPass,
      role: req.body.role,
      is_delete: "FALSE",
    };
    let checkEmail = db.query(
      "select * from user where `email` =?",
      email,
      (err, respond) => {
        if (err) console.log("error email");
        else {
          if (respond.length > 0) {
            res.send({
              status: 402,
              message: "Email already registed",
            });
          } else {
            let checkPhone = db.query(
              "select * from user where phone = ?",
              phone,
              (err, phoneCount) => {
                if (err) console.log("error when check phone");
                else {
                  if (phoneCount.length > 0) {
                    res.send({
                      status: 402,
                      message: "Phone number already registed",
                    });
                  } else {
                    let results = db.query(
                      "insert into user set ?",
                      [data],
                      (err, respond) => {
                        if (err) console.log("error insert");
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
const hashPass = async (value) => {
  return await bcrypt.hash(value, 12);
};
const login = async (req, res, next) => {
  try {
    var db = req.conn;
    var email = req.body.email;
    var password = req.body.password;
    let results = await db.query(
      "SELECT * FROM user WHERE `email`=? and is_delete = 'FALSE'",
      email,
      (err, respond) => {
        if (err) {
          res.send({
            status: 404,
            message: "something wrong",
          });
        } else {
          if (respond.length > 0) {
            bcrypt.compare(password, respond[0].password, (err, ress) => {
              if (!ress) {
                res.send({
                  status: false,
                  message: " Email or Password does not match",
                });
              } else {
                const theToken = jwt.sign(
                  {
                    id: respond[0].id,
                    name: respond[0].name,
                    email: respond[0].email,
                    phone: respond[0].phone,
                    role: respond[0].role,
                  },
                  config.JWT_SECRET
                );
                res.send({
                  status: 200,
                  message: "ok",
                  data: respond,
                  token: theToken,
                });
              }
            });
          } else {
            res.send({
              status: 404,
              message: "Invalid email address",
            });
          }
        }
      }
    );
  } catch (err) {
    next(err);
  }
};
const vertifyEmail = (req, res, next) => {
  try {
    var code = Math.floor(1000 + Math.random() * 9000);
    var transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        auth: {
          user: "shopmobieST@gmail.com",
          pass: "tung123456",
        },
      })
    );

    var mailOptions = {
      from: "shopmobieST@gmail.com",
      to: req.body.email,
      subject: "Code",
      html: `<h1 style="text-align: center; font-weight: bold">VERTIFY EMAIL CODE</h1> <p style="color: blue;text-align: center; font-weight: 900; font-size: 30px">${code}</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send({
          status: 400,
          message: "vertify email fault",
        });
      } else {
        console.log("Email sent: " + info.response);
        res.send({
          status: 200,
          message: "vertify email success",
        });
      }
    });
  } catch (err) {
    res.send({
      message: "something wrong",
    });
  }
};
const deleteUser = (req, res, next) => {
  try {
    var db = req.conn;
    var idUser = req.params.id;
    var updateStatus = {
      is_delete: "TRUE",
    };
    db.query(
      `update user set ? where id = ?`,
      [updateStatus, idUser],
      (err, update) => {
        if (err) {
          res.status(400).send({ message: "error" });
        } else {
          res.status(200).send({ message: `delete success` });
        }
      }
    );
  } catch (err) {
    res.send({ message: "something wrong" });
  }
};
const updateUser = async (req, res, next) => {
  try {
    var db = req.conn;
    const accessToken = req.headers.authorization.split(" ")[1];
    var userOld = jwt.decode(accessToken, config.JWT_SECRET);
    const passChange = req.body.password
      ? await bcrypt.hash(req.body.password, 12)
      : false;
    db.query(`select * from user where id = ${userOld.id}`, (err, respond) => {
      if (err) {
        res.status(400).send({ message: "error" });
        console.log(err);
      } else {
        var updateUserData = {
          name: req.body.name ? req.body.name : respond[0].name,
          email: req.body.email ? req.body.email : respond[0].email,
          phone: req.body.phone ? req.body.phone : respond[0].phone,
          password: passChange ? passChange : respond[0].password,
          role: req.body.role ? req.body.role : respond[0].role,
          is_delete: respond[0].is_delete,
        };
        db.query(
          `update user set ? where id = ?`,
          [updateUserData, userOld.id],
          (err, updateRes) => {
            if (err) {
              res.status(400).send({ message: "error" });
            } else {
              res
                .status(200)
                .send({ data: updateRes, message: `update success` });
            }
          }
        );
      }
    });
  } catch (err) {
    res.status(400).send({ message: "something wrong" });
  }
};
const resetPassword = async (req, res, next) => {
  try {
    var db = req.conn;
    var email = req.query.email;
    var newPass = await Array(10)
      .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join("");
    const passChange = await bcrypt.hash(newPass, 12);
    db.query(`select * from user where email = '${email}'`, (err, respond) => {
      if (err) {
        res.status(400).send({ message: "error" });
        console.log(err);
      } else {
        var updateUserData = {
          name: respond[0].name,
          email: respond[0].email,
          phone: respond[0].phone,
          password: passChange,
          role: respond[0].role,
          is_delete: respond[0].is_delete,
        };
        db.query(
          `update user set ? where email = '${email}'`,
          [updateUserData],
          (err, updateRes) => {
            if (err) {
              res.status(400).send({ message: "error" });
            } else {
              var transporter = nodemailer.createTransport(
                smtpTransport({
                  service: "gmail",
                  auth: {
                    user: "shopmobieST@gmail.com",
                    pass: "tung123456",
                  },
                })
              );

              var mailOptions = {
                from: "shopmobieST@gmail.com",
                to: email,
                subject: "Code",
                html: `<h1 style="text-align: center; font-weight: bold">YOUR NEW PASSWORD</h1> <p style="color: blue;text-align: center; font-weight: 900; font-size: 30px">${newPass}</p>`,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  res.send({
                    status: 400,
                    message: "wrong",
                  });
                } else {
                  console.log("Email sent: " + info.response);
                  res.send({
                    status: 200,
                    message: "reset password success",
                  });
                }
              });
            }
          }
        );
      }
    });
  } catch (err) {
    res.status(400).send({ message: "something wrong" });
  }
};
const getUser = async (req, res, next) => {
  try {
    var db = req.conn;
    let id = req.params.id;
    let results = db.query(
      `select * from user where id = ${id}`,
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
module.exports = {
  createAccount,
  getAllUser,
  login,
  vertifyEmail,
  deleteUser,
  updateUser,
  resetPassword,
  getUser
};
