const express = require("express");
const connectDb = require("./db");
const cors = require("cors");
const app = express();

connectDb();
const signinRouter = require("./routes/signin");
const loginRouter = require("./routes/login");
const homeRouter = require("./routes/home");

app.use(express.json());
app.use(cors({ origin: "*" }));


app.get("/get", (req, res) => {
    res.send("Hello World");
});

app.use("/signin", signinRouter)
app.use("/login", loginRouter)
app.use("/home", homeRouter);

app.listen(4000, () => {
    console.log("Sever is running in port");
});