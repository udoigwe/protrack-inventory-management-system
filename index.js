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
const storeRoutes = require("./src/routes/store");
const userRoutes = require("./src/routes/user");
const productRoutes = require("./src/routes/product");
const invoiceRoutes = require("./src/routes/invoice");
const purchaseRoutes = require("./src/routes/purchase");
const transactionRoutes = require("./src/routes/transaction");

//importing all view routes
const viewRoutes = require("./src/routes/view");
const {
	scheduleExpiredProductStockUpdate,
	scheduleExpiringProductPriceUpdate,
} = require("./src/services/expiration.service");

//using imported routes
app.use(process.env.ROUTE_PREFIX, authRoutes);
app.use(process.env.ROUTE_PREFIX, storeRoutes);
app.use(process.env.ROUTE_PREFIX, userRoutes);
app.use(process.env.ROUTE_PREFIX, productRoutes);
app.use(process.env.ROUTE_PREFIX, invoiceRoutes);
app.use(process.env.ROUTE_PREFIX, purchaseRoutes);
app.use(process.env.ROUTE_PREFIX, transactionRoutes);

//using imported view routes
app.use(viewRoutes);

//run cron jobs
scheduleExpiredProductStockUpdate();
scheduleExpiringProductPriceUpdate();

app.listen(port, () => {
	console.log(`App successfully running on port ${port}`);
});
