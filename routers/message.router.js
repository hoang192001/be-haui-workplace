const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../configs/configMulter");
const {
  getAllConversation,
  createMessage,
  createConversation,
  getMessagesByConversation,
  getConversationById,
  deleteOrAddMemberGroup,
  deleteConversation,
  changeConversation,
} = require("../controllers/message.controller");

router.use(verifyToken);
router.use(upload.single("file"));

router.get("/", getAllConversation);

router.post("/", createConversation);

router.post("/send-message", createMessage);

router.post("/delete-add-user/:conversationId", deleteOrAddMemberGroup);

router.get("/:conversationId", getMessagesByConversation);

router.get("/conversation/:conversationId", getConversationById);

router.delete("/conversation/:conversationId", deleteConversation);

router.patch("/conversation/:conversationId", changeConversation);

module.exports = router;
