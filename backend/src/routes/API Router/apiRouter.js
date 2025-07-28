import express from "express";
import multer from "multer";
const apiRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

import authController from "../../controllers/authController.js";
import friendController from "../../controllers/friendController.js";
import chatController from "../../controllers/chatController.js";
import profileController from "../../controllers/profileController.js";

apiRouter.post("/signUp", authController.signUp);
apiRouter.post("/signIn", authController.signIn);
apiRouter.get("/auth", authController.auth);

apiRouter.post("/friendRequest", friendController.friendRequest);
apiRouter.post("/cancelFriendRequest", friendController.cancelFriendRequest);
apiRouter.post("/ignoreFriendRequest", friendController.ignoreFriendRequest);
apiRouter.post("/acceptFriendRequest", friendController.acceptFriendRequest);
apiRouter.post("/PendingFriends", friendController.PendingFriends);
apiRouter.post("/deleteFriendRequest", friendController.deleteFriendRequest);
apiRouter.post("/FriendShips", friendController.FriendShips);
apiRouter.post("/blockFriendRequest", friendController.blockFriendRequest);
apiRouter.post("/unBlockFriendRequest", friendController.unBlockFriendRequest);

apiRouter.get("/getMessage/:idChat", chatController.getMessage);
apiRouter.post("/sendMessage", chatController.sendMessage);
apiRouter.post("/uploadFile", upload.single("file"), chatController.uploadFile);
apiRouter.post("/downloadFile", chatController.downloadFile);
apiRouter.get("/showImg/:info", chatController.showImg);
apiRouter.get(
  "/updateStatusMessage/:idChat",
  chatController.updateStatusMessage
);

apiRouter.post(
  "/changeImage",
  upload.single("image"),
  profileController.changeImage
);

export default apiRouter;
