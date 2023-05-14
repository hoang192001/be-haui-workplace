require('dotenv').config();
const express = require("express");
//Config
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./configs/connectDB");
const routes = require("./routers/index");
const errorHandler = require("./utils/errorHandler");
const SocketServer = require("./socket/socketServer");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable("x-powered-by");
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api/v1", routes);

app.use(errorHandler);

// const schedule = require('node-schedule');

// const job = schedule.scheduleJob('*/5 * * * * *', function(){
//   console.log('Công việc được chạy mỗi 10 phút');
// });

const PORT = process.env.PORT || 8001;
app.get("/", (req, res) => {
  res.send("Start coding workapp backend");
});

const server = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

//Socket
SocketServer(server);
