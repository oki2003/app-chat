import connectDB from "../../connectDB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import responseError from "../../responseError.js";

const authController = {
  async signIn(req, res) {
    try {
      const { username, password } = req.body;
      const conn = await connectDB();
      const resultQuery = await conn
        .request()
        .query(`select * from users where username = '${username}'`);
      if (resultQuery.recordsets[0].length === 0) {
        res.status(401).json({
          message: "Tên đăng nhập hoặc mật khẩu không hợp lệ.",
        });
      } else {
        bcrypt.compare(
          password,
          resultQuery.recordsets[0][0].password,
          async (err, result) => {
            if (result) {
              const token = jwt.sign(
                {
                  id: resultQuery.recordsets[0][0].id,
                  username: resultQuery.recordsets[0][0].username,
                },
                process.env.JWT_SECRET,
                { expiresIn: "8h" }
              );
              res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                path: "/",
              });
              res.status(200).json({
                message: "Đăng nhập thành công.",
                currentUser: {
                  id: resultQuery.recordsets[0][0].id,
                  username: resultQuery.recordsets[0][0].username,
                  displayname: resultQuery.recordsets[0][0].displayname,
                  avatarURL: resultQuery.recordsets[0][0].avatarURL,
                  backgroundURL: resultQuery.recordsets[0][0].backgroundURL,
                },
              });
            } else {
              res.status(401).json({
                message: "Tên đăng nhập hoặc mật khẩu không hợp lệ.",
              });
            }
          }
        );
      }
    } catch (err) {
      responseError(err, res);
    }
  },

  async signUp(req, res) {
    try {
      const { username, displayname, password } = req.body;
      const conn = await connectDB();
      const resultQuery = await conn
        .request()
        .query(`select * from users where username = '${username}'`);
      if (resultQuery.recordsets[0][0]) {
        res.status(409).json({
          message: "Tên đăng nhập đã tồn tại.",
        });
      } else {
        bcrypt.hash(password, 10, async (err, hash) => {
          if (err) {
            console.error("Lỗi khi băm mật khẩu:", err);
            res.status(500).json({
              message: "Đã xảy ra lỗi khi đăng ký.",
            });
            return;
          }
          const result = await conn
            .request()
            .query(
              `insert into users (username, displayname, password, avatarURL, backgroundURL) output inserted.id values ('${username}', '${displayname}', '${hash}', '/images/default.png', null);`
            );
          const token = jwt.sign(
            {
              id: result.recordset[0].id,
              username: username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
          );
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: "/",
          });
          res.status(200).json({
            message: "Đăng ký thành công.",
            currentUser: {
              id: result.recordset[0].id,
              username: username,
              displayname: displayname,
              avatarURL: "/images/default.png",
              backgroundURL: null,
            },
          });
        });
      }
    } catch (err) {
      responseError(err, res);
    }
  },

  async auth(req, res) {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, async (err, user) => {
      if (err) return res.sendStatus(403); // Token invalid
      const conn = await connectDB();
      const resultQuery = await conn
        .request()
        .query(
          `select id, username, displayname, avatarURL, backgroundURL from users where id=${user.id}`
        );
      res.status(200).json({
        message: "Xác thực thành công.",
        currentUser: resultQuery.recordset[0],
      });
    });
  },
};

export default authController;
