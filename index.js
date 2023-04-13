const express = require("express");
const sequelize = require("./database/index.js");
const cors = require("cors");
const path = require("path");
const apiRouter = require("./routes/api/index.js");
const frontendRouter = require("./routes/frontend/index.js");
const { PORT } = require("./config/env.js");
const User = require("./models/user.js");
const Expense = require("./models/expense.js");
const Order = require("./models/order.js");
const morgan = require("morgan");
const File = require("./models/files.js");
const fs = require("fs");
const logStream = fs.createWriteStream(
  path.join(require.main.path, "logs", "access.log"),
  { flags: "a" }
);

const app = express();

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(File);
File.belongsTo(User);
app.use(morgan("combined", { stream: logStream }));
app.use(cors());
app.use(express.static(path.join(require.main.path, "public")));
app.use(express.json());
app.use("/api", apiRouter);
app.use("/", frontendRouter);
// Start server

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on http://localhost:3000");
  });
});
