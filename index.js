//accessing & configuring environmental variables
const dotenv = require("dotenv");
dotenv.config();
//Accepting from unauthorized
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

//variables
const express = require("express");
const app = express();
const port = process.env.PORT || 7001;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const useragent = require("express-useragent");

//using middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());
app.use(fileUpload({ useTempFiles: true }));

app.use(express.static(__dirname + "/public"));
app.use("/assets", express.static(__dirname + "/public/assets"));
app.use("/logos", express.static(__dirname + "/public/logos"));

//set templating engine
app.set("view engine", "ejs");
app.set("views", "./src/views");

//importing all required routes
const authRoutes = require("./src/routes/auth");

//importing all view routes
const viewRoutes = require("./src/routes/view");

//using imported routes
app.use(process.env.ROUTE_PREFIX, authRoutes);

//using imported view routes
app.use(viewRoutes);

app.listen(port, () => {
	console.log(`App successfully running on port ${port}`);
});
