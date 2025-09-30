import connectDB from "../../connectDB.js";
import jwt from "jsonwebtoken";
import { sendMessageToClient } from "../routes/Web Socket/webSocket.js";
import fs from "fs";
import path from "path";
import responseError from "../../responseError.js";

async function canAddMessage(req, conn, idUserReceive, res) {
  // id Chat
  const [user1, user2] = req.body.idChat.split("_");
  const resultQuery = await conn.request().query(
    `select isBlock from friendShips where user_id_1 = ${user1} and user_id_2 = ${user2}
            select * from friendShips where user_id_1 = ${user1} and user_id_2 = ${user2}
            select displayname from users where id = ${idUserReceive}`
  );
  const displaynameUserReceive = resultQuery.recordsets[2][0].displayname;
  if (resultQuery.recordsets[1].length === 0) {
    res.status(404).json({
      message: `${displaynameUserReceive} đã hủy kết bạn nên cuộc trò chuyện đã bị xóa.`,
    });
    return false;
  } else if (resultQuery.recordsets[0][0].isBlock !== 0) {
    res.status(403).json({
      message: `${displaynameUserReceive} đã chặn bạn.`,
    });
    return false;
  } else {
    return true;
  }
}

const chatController = {
  async getMessage(req, res) {
    try {
      jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const idChat = req.params.idChat;
      const conn = await connectDB();
      const resultQuery = await conn
        .request()
        .query(`select * from boxChat where id = '${idChat}'`);
      res.status(200).json({
        data: resultQuery.recordset,
      });
    } catch (err) {
      responseError(err, res);
    }
  },

  async sendMessage(idChat, message, idUserSend, idUserReceive, createAt) {
    try {
      const conn = await connectDB();
      await conn
        .request()
        .query(
          `insert into boxChat (id, content, user_id_send, user_id_receive, isRead, typeId, createAt) VALUES ('${idChat}',N'${message.replace(
            "'",
            "''"
          )}',${idUserSend},${idUserReceive},0,1,'${createAt}')`
        );
      sendMessageToClient(
        idUserReceive,
        "Receive New Message",
        message,
        idUserSend
      );
      //sendMessageToClient(idUserSend,"")
    } catch (err) {
      console.log(err);
    }
  },

  async uploadFile(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const conn = await connectDB();
      const idUserReceive = parseInt(
        req.body.idChat.replace("_", "").replace(payload.id, "")
      );
      const check = await canAddMessage(req, conn, idUserReceive, res);
      console.log("check: ", check);
      if (check) {
        const file = req.file;
        const resultQuery = await conn
          .request()
          .query(`select id from typeMessage where type ='${file.mimetype}'`);
        const typeId =
          resultQuery.recordset.length === 0 ? 2 : resultQuery.recordset[0].id;
        const filename =
          Date.now() +
          Math.round(Math.random() * 1e9) +
          "-" +
          file.originalname;
        const filePath = path.join("storage", filename);
        fs.writeFile(filePath, file.buffer, (err) => {
          if (err)
            return res.status(403).json({
              message: `Lỗi ghi file.`,
            });
        });
        await conn
          .request()
          .query(
            `insert into boxChat (id, content, user_id_send, user_id_receive, isRead, typeId, createAt) VALUES ('${req.body.idChat}','${filePath}',${payload.id},${idUserReceive},0,${typeId},'${req.body.createAt}')`
          );
        sendMessageToClient(idUserReceive, "Receive New Message");
        res.status(200).json({
          nameFile: filePath,
        });
      }
    } catch (err) {
      responseError(err, res);
    }
  },

  async downloadFile(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const conn = await connectDB();
      res.status(200).json({ message: "tai thanh cong" });
    } catch (err) {
      responseError(err, res);
    }
  },

  async showImg(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const idChat = req.params.info.split("-")[0];
      const nameFile = req.params.info.replace(`${idChat}-`, "");
      if (idChat.includes(payload.id.toString())) {
        const filePath = path.join(process.cwd(), "storage", nameFile);
        res.sendFile(filePath);
      } else {
        res.sendStatus(200);
      }
    } catch (err) {
      responseError(err, res);
    }
  },

  async updateStatusMessage(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const idChat = req.params.idChat;
      const conn = await connectDB();
      console.log("results:", idChat, "-", payload.id);
      const resultQuery = await conn
        .request()
        .query(
          `update boxChat set isRead = 1 where id = '${idChat}' and isRead = 0  and user_id_receive = ${payload.id}`
        );
      res.status(200).json({
        data: resultQuery.recordset,
      });
    } catch (err) {
      responseError(err, res);
    }
  },
};

export default chatController;
