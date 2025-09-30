import { WebSocketServer } from "ws";
import connectDB from "../../../connectDB.js";
import chatController from "../../controllers/chatController.js";

const clients = new Map(); // use Map to store clients with key that is id
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (ws, request) => {
  const payload = JSON.parse(atob(request.headers.cookie.split(".")[1]));
  ws.on("error", console.error);
  ws.on("message", (message) => {
    const parsedData = JSON.parse(message);

    if (parsedData.type === "Add client") {
      clients.set(payload.id, [ws]);
      updateStatus(payload.id, "online");
    }

    if (parsedData.type === "Send Message") {
      chatController.sendMessage(
        parsedData.idChat,
        parsedData.messageContent,
        payload.id,
        parsedData.idUserReceive,
        parsedData.createAt
      );
    }

    if (parsedData.type === "Init Call Connection") {
      sendMessageToClient(
        parsedData.to,
        "Init Call Connection",
        parsedData.typeCall,
        payload.id
      );
    }

    if (parsedData.type === "Reject Call Connection") {
      sendMessageToClient(
        parsedData.to,
        "Reject Call Connection",
        null,
        payload.id
      );
    }

    if (parsedData.type === "Accept Call Connection") {
      sendMessageToClient(
        parsedData.to,
        "Accept Call Connection",
        null,
        payload.id
      );
    }

    if (parsedData.type === "Send Offer") {
      sendMessageToClient(
        parsedData.to,
        "Send Offer",
        parsedData.offer,
        payload.id
      );
    }

    if (parsedData.type === "Send Answer") {
      sendMessageToClient(
        parsedData.to,
        "Send Answer",
        parsedData.answer,
        payload.id
      );
    }

    if (parsedData.type === "Ice Candidate") {
      sendMessageToClient(parsedData.to, "Ice Candidate", parsedData.candidate);
    }

    if (parsedData.type === "End Call") {
      sendMessageToClient(parsedData.to, "End Call");
    }

    if (parsedData.type === "Change Camera") {
      sendMessageToClient(
        parsedData.to,
        "Change Camera",
        parsedData.camera,
        payload.id
      );
    }

    if (parsedData.type === "Change Mic") {
      sendMessageToClient(
        parsedData.to,
        "Change Mic",
        parsedData.mic,
        payload.id
      );
    }
  });

  ws.on("close", () => {
    updateStatus(payload.id, "offline");
  });
});

function sendMessageToClient(idClient, message, data, idFrom) {
  const wsArr = clients.get(idClient);
  wsArr?.map((ws) =>
    ws.send(
      JSON.stringify({
        message: message,
        data: data,
        idFrom: idFrom,
      })
    )
  );
}

async function updateStatus(currentUserId, status) {
  if (status === "offline") {
    clients.delete(currentUserId);
  }
  const conn = await connectDB();
  const resultQuery = await conn.request().query(
    `select user_id_1 from friendShips where user_id_2 = ${currentUserId}
        select user_id_2 from friendShips where user_id_1 = ${currentUserId}`
  );
  resultQuery.recordsets[0].map((item) => {
    if (clients.get(item.user_id_1)) {
      clients.get(item.user_id_1).map((ws) =>
        ws.send(
          JSON.stringify({
            message: status,
          })
        )
      );
    }
  });
  resultQuery.recordsets[1].map((item) => {
    if (clients.get(item.user_id_2)) {
      clients.get(item.user_id_2).map((ws) =>
        ws.send(
          JSON.stringify({
            message: status,
          })
        )
      );
    }
  });
}

export { clients, sendMessageToClient };

export default wss;
