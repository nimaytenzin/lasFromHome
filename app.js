var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const TelegramBot = require("node-telegram-bot-api");
const token = "5904987489:AAG1OOVNR-xPR8m7pEx57rOvvV8pkVNl0sY";
const bot = new TelegramBot(token, { polling: true });
const axios = require("axios");

const registeredUsers = [
  {
    name: "Nima Yoezer Tenzin",
    alias: "tenzin",
    cid: "10302000402",
    password: "10302000402",
    lemonHoneyDate: 0,
  },
  {
    name: "Sonam Eden",
    alias: "eden",
    cid: "10807000525",
    password: "10807000525",
    lemonHoneyDate: 18,
  },
  {
    name: "Kinley Wangyel",
    alias: "kwangyel",
    cid: "10503000532",
    password: "10503000532",
    lemonHoneyDate: 19,
  },
  {
    name: "Sangay Wangdi",
    alias: "sangay",
    cid: "11705001357",
    password: "arsenal2019",
    lemonHoneyDate: 22,
  },
];

function findUserByAlias(alias) {
  for (let i = 0; i < registeredUsers.length; i++) {
    if (registeredUsers[i].alias === alias) {
      return registeredUsers[i];
    }
  }
  return null;
}

bot.onText(/\/las\/(.+)\/(.+)/, async function onLasText(msg, match) {
  const alias = match[1];
  const hostId = match[2];

  const user = findUserByAlias(alias);
  if (!user) {
    bot.sendMessage(msg.chat.id, `No you cant boss! you are not registered`);
    return;
  }

  const formData = new FormData();
  formData.append("cid", user.cid);
  formData.append("password", user.password);

  bot.sendMessage(
    msg.chat.id,
    `Logging in using the following credentials \ncid: ${user.cid},\npassword: ${user.password},\nhost:192.168.20.${hostId}`
  );

  const response = await axios.post(
    `http://192.168.20.83/las_final/index.php/ATD/login_validate`,
    formData,
    {
      headers: {
        "X-Forwarded-For": "192.168.20." + hostId,
        Cookie: "PHPSESSID=in2p5adpjpjh3jiqgkeo266dv0",
      },
    }
  );
  const responseData = String(response.data);

  const regex = /<!-- Welcome -->([\s\S]*?)<!--end  Welcome -->/;
  const welcomeText = responseData.match(regex);

  if (welcomeText) {
    const extractedText = welcomeText[1].trim();
    bot.sendMessage(msg.chat.id, extractedText);
    const today = new Date();
    const day = today.getDate();
    if (day === user.lemonHoneyDate) {
      bot.sendMessage(
        msg.chat.id,
        "\n\nits your turn for the lemon honey tea today\n\n"
      );
    }
  } else {
    bot.sendMessage(
      msg.chat.id,
      "Failed to do your attendance!\n1)Check your username and password\n2)Try a different host ID\n3)If you tried the above options.I am sorry you cant be helped! Office jo gop ren chi nu"
    );
  }
  // if (extractedText) {
  //
  // } else {
  //
  // }
});

var app = express();
app.locals.bot = bot;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
