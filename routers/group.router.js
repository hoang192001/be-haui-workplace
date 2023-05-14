const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../configs/configMulter");
const {
  getAllGroup,
  createGroup,
  getGroupDetail,
  deleteGroup,
  changeGroup,
  joinGroup,
  getAllGroupNotJoin
} = require("../controllers/group.controller");

router.use(verifyToken);
router.use(upload.single("file"));

router.get("/", getAllGroup);

router.post("/", createGroup);

router.get("/groups-not-join", getAllGroupNotJoin);

router.get("/:groupId", getGroupDetail);

router.delete("/:groupId", deleteGroup);

router.patch("/:groupId", changeGroup);

router.post("/join-group/:groupId", joinGroup);

module.exports = router;
