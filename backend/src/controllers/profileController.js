import connectDB from "../../connectDB.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import responseError from "../../responseError.js";

const profileController = {
  async changeImage(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const conn = await connectDB();
      const file = req.file;
      const type = req.body.type;

      let filePath = "";

      const resultQuery = await conn.request().query(`
              select ${type} from Users where id = ${payload.id}`);
      const oldURL = resultQuery.recordset[0][type];

      if (oldURL === null || oldURL?.includes("default.png")) {
        const filename = fs.readdirSync(
          path.join(process.cwd(), "public/images")
        ).length;

        filePath = path.join(
          "public/images",
          `${filename}.${file.originalname.split(".").pop()}`
        );
      } else {
        console.log(oldURL);
        fs.unlink(`public/${oldURL}`, (err) => {
          if (err) {
            console.error("Lỗi xóa file:", err);
            return;
          }
        });
        filePath = path.join(
          "public/images",
          `${path.basename(oldURL, path.extname(oldURL))}.${file.originalname
            .split(".")
            .pop()}`
        );
        console.log(filePath);
      }

      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) console.log(err);
      });
      filePath = filePath.replace(/\\/g, "/").replace("public", "");
      await conn
        .request()
        .query(
          `update Users set ${type} = '${filePath}' where id = ${payload.id}`
        );

      res.status(200).json({
        filePath: filePath,
        message: "thanh cong",
      });
    } catch (err) {
      responseError(err, res);
    }
  },
};

export default profileController;
