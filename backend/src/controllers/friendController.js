import connectDB from "../../connectDB.js";
import jwt from "jsonwebtoken";
import {
  clients,
  sendMessageToClient,
} from "../routes/Web Socket/webSocket.js";
import responseError from "../../responseError.js";

const friendController = {
  async friendRequest(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const usernameTo = req.body.username;
      const usernameFrom = payload.username;
      if (usernameFrom === usernameTo) {
        res.status(400).json({
          message: "Bạn không thể kết bạn với chính mình.",
        });
      } else {
        const conn = await connectDB();
        const resultQuery = await conn
          .request()
          .query(`select * from users where username = '${usernameTo}'`);
        if (resultQuery.recordsets[0].length === 0) {
          res.status(400).json({
            message:
              "Chà, không thành công rồi. Hãy kiểm tra lại tên đăng nhập có đúng không nhé.",
          });
        } else {
          const data = await conn
            .request()
            .query(
              `select * from friendRequest where user_id_request = ${payload.id} and user_id_response = ${resultQuery.recordsets[0][0].id}`
            );
          const data2 = await conn
            .request()
            .query(
              resultQuery.recordsets[0][0].id < payload.id
                ? `select * from friendShips WHERE user_id_1 = ${resultQuery.recordsets[0][0].id} and user_id_2 = ${payload.id}`
                : `select * from friendShips WHERE user_id_1 = ${payload.id} and user_id_2 = ${resultQuery.recordsets[0][0].id}`
            );

          const data3 = await conn
            .request()
            .query(
              `select * from friendRequest where user_id_request = ${resultQuery.recordsets[0][0].id} and user_id_response = ${payload.id}`
            );
          if (
            data.recordsets[0].length === 0 &&
            data2.recordset.length === 0 &&
            data3.recordset.length === 0
          ) {
            await conn
              .request()
              .query(
                `insert into friendRequest (user_id_request, user_id_response) VALUES (${payload.id}, ${resultQuery.recordsets[0][0].id})`
              );
            res.status(200).json({
              message: "Thành công! Yêu cầu kết bạn được gửi đi rồi nhé.",
            });
            sendMessageToClient(
              resultQuery.recordsets[0][0].id,
              "Get Pendings"
            );
          } else if (data2.recordset.length === 1) {
            res.status(200).json({
              message: "Bạn đã kết bạn với người này rồi nhé.",
            });
          } else if (data3.recordset.length === 1) {
            res.status(200).json({
              message:
                "Người này đã gửi yêu cầu cho bạn. Hãy bấm vào chờ duyệt rồi chấp nhận yêu cầu kết bạn nhé.",
            });
          } else {
            res.status(200).json({
              message:
                "Bạn đã gửi yêu cầu kết bạn rồi. Không thể gửi thêm nữa nhé.",
            });
          }
        }
      }
    } catch (err) {
      responseError(err, res);
    }
  },

  async cancelFriendRequest(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const conn = await connectDB();
      await conn
        .request()
        .query(
          `delete from friendRequest WHERE user_id_request = ${payload.id} and user_id_response = ${req.body.id}`
        );
      const resultQuery = await conn
        .request()
        .query(
          req.body.id < payload.id
            ? `select * from friendShips WHERE user_id_1 = ${req.body.id} and user_id_2 = ${payload.id}`
            : `select * from friendShips WHERE user_id_1 = ${payload.id} and user_id_2 = ${req.body.id}`
        );
      if (resultQuery.recordset.length === 0) {
        res.status(200).json({
          message: "Hủy lời mời kết bạn thành công.",
        });
      } else {
        res.status(409).json({
          message: `${req.body.displayname} đã chấp nhận lời mời kết bạn. Yêu cầu này không thể hủy.`,
        });
      }
    } catch (err) {
      responseError(err, res);
    }
  },

  async ignoreFriendRequest(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const conn = await connectDB();
      await conn
        .request()
        .query(
          `delete from friendRequest WHERE user_id_request = ${req.body.id} and user_id_response = ${payload.id}`
        );
      res.status(200).json({
        message: "Từ chối thành công.",
      });
    } catch (err) {
      responseError(err, res);
    }
  },

  async acceptFriendRequest(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const conn = await connectDB();
      const resultQuery = await conn
        .request()
        .query(
          `select * from friendRequest WHERE user_id_request = ${req.body.id} and user_id_response = ${payload.id}`
        );
      const resultQuery2 = await conn
        .request()
        .query(
          req.body.id < payload.id
            ? `select * from friendShips WHERE user_id_1 = ${req.body.id} and user_id_2 = ${payload.id}`
            : `select * from friendShips WHERE user_id_1 = ${payload.id} and user_id_2 = ${req.body.id}`
        );
      if (resultQuery.recordset.length === 0) {
        res.status(404).json({
          message: "Lời mời kết bạn đã bị hủy.",
        });
      } else {
        if (resultQuery2.recordset.length === 0) {
          await conn
            .request()
            .query(
              req.body.id < payload.id
                ? `insert into friendShips (user_id_1, user_id_2) VALUES (${req.body.id},${payload.id})`
                : `insert into friendShips (user_id_1, user_id_2) VALUES (${payload.id},${req.body.id})`
            );

          await conn
            .request()
            .query(
              `delete from friendRequest WHERE user_id_request = ${req.body.id} and user_id_response = ${payload.id}`
            );
        }
        res.status(200).json({
          message: "Chấp nhận lời mời kết bạn thành công.",
        });
        sendMessageToClient(req.body.id, "Get FriendShips");
      }
    } catch (err) {
      responseError(err, res);
    }
  },

  async deleteFriendRequest(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const id = req.body.id;

      if (id.includes(payload.id)) {
        const [user1, user2] = id.split("_");
        const conn = await connectDB();
        await conn.request().query(
          `delete from friendShips where user_id_1 = ${user1} and user_id_2 = ${user2}
            delete from boxChat where id = '${id}'`
        );
        res.status(200).json({
          message: "Xóa bạn thành công.",
        });
      } else {
        res.status(403).json({
          message: "Bạn không có quyền xóa bạn.",
        });
      }
    } catch (err) {
      responseError(err, res);
    }
  },

  async blockFriendRequest(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const idUser = payload.id;
      const [user1, user2] = req.body.id.split("_");
      const conn = await connectDB();
      const resultQuery = await conn
        .request()
        .query(
          `select isBlock from friendShips where user_id_1 = ${user1} and user_id_2 = ${user2}`
        );
      if (resultQuery.recordset.length !== 0) {
        const isBlock = resultQuery.recordset[0].isBlock;
        if (isBlock === 0 || isBlock === idUser) {
          await conn
            .request()
            .query(
              `update friendShips set isBlock = ${idUser} where user_id_1 = ${user1} and user_id_2 = ${user2}`
            );
          res.status(200).json({
            message: "Chặn bạn thành công.",
          });
        } else {
          res.status(409).json({
            message: "Người này đã chặn bạn trước.",
          });
        }
      } else {
        res.status(409).json({
          message: "Người này đã hủy kết bạn.",
          delete: true,
        });
      }
    } catch (err) {
      responseError(err, res);
    }
  },

  async unBlockFriendRequest(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const idUser = payload.id;
      const [user1, user2] = req.body.id.split("_");
      const conn = await connectDB();
      const resultQuery = await conn
        .request()
        .query(
          `select isBlock from friendShips where user_id_1 = ${user1} and user_id_2 = ${user2}`
        );
      if (resultQuery.recordset.length === 0) {
        res.status(409).json({
          message: "Người này đã hủy kết bạn.",
          delete: true,
        });
      } else {
        const isBlock = resultQuery.recordset[0].isBlock;
        if (idUser === isBlock) {
          await conn
            .request()
            .query(
              `update friendShips set isBlock = 0 where user_id_1 = ${user1} and user_id_2 = ${user2}`
            );
          res.status(200).json({
            message: "Bỏ chặn thành công.",
          });
        } else {
          res.status(403).json({
            message: "Bạn không có quyền bỏ chặn.",
          });
        }
      }
    } catch (err) {
      responseError(err, res);
    }
  },

  async getPendings(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const conn = await connectDB();
      const resultQuery = await conn
        .request()
        .query(
          `select user_id_request, user_id_response, id, username, displayname, avatarURL from friendRequest join users on friendRequest.user_id_response = users.id where friendRequest.user_id_request = ${payload.id}`
        );
      res.status(200).json({
        data: resultQuery.recordset,
      });
    } catch (err) {
      responseError(err, res);
    }
  },

  async getInvitations(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const conn = await connectDB();
      const resultQuery = await conn
        .request()
        .query(
          `select user_id_request, user_id_response, id, username, displayname, avatarURL from friendRequest join users on friendRequest.user_id_request = users.id where friendRequest.user_id_response = ${payload.id}`
        );
      res.status(200).json({
        data: resultQuery.recordset,
      });
    } catch (err) {
      responseError(err, res);
    }
  },

  async FriendShips(req, res) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const conn = await connectDB();
      const resultQuery = await conn.request().query(
        `select CONCAT(user_id_1, '_', user_id_2) AS friendshipsID, isBlock, users.id, users.username, users.displayname, users.avatarURL, users.backgroundURL, (select COUNT(*) from boxChat where boxChat.id = CONCAT(user_id_1, '_', user_id_2) and isRead = 0) as unreadMessages, (select user_id_receive from boxChat where boxChat.id = CONCAT(user_id_1, '_', user_id_2) and isRead = 0 group by user_id_receive) as userIdReceive from friendShips join users on user_id_2 = users.id where user_id_1 = ${payload.id}
        select CONCAT(user_id_1, '_', user_id_2) AS friendshipsID, isBlock, users.id, users.username, users.displayname, users.avatarURL, users.backgroundURL, (select COUNT(*) from boxChat where boxChat.id = CONCAT(user_id_1, '_', user_id_2) and isRead = 0) as unreadMessages, (select user_id_receive from boxChat where boxChat.id = CONCAT(user_id_1, '_', user_id_2) and isRead = 0 group by user_id_receive) as userIdReceive from friendShips join users on user_id_1 = users.id where user_id_2 = ${payload.id}`
      );
      const newArr = [
        ...resultQuery.recordsets[0],
        ...resultQuery.recordsets[1],
      ];
      const data = newArr.map((item) => {
        return {
          ...item,
          status: clients.get(item.id) ? true : false,
        };
      });
      res.status(200).json({
        data: data,
      });
    } catch (err) {
      responseError(err, res);
    }
  },
};

export default friendController;
