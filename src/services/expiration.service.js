const cron = require("node-cron");
const {
	expiredProductStockUpdate,
	expiringProductPriceUpdate,
} = require("../controllers/serviceController");

// Schedule expiring product price update cron job
const scheduleExpiringProductPriceUpdate = () => {
	// Run the task every minute
	cron.schedule("* * * * *", () => expiringProductPriceUpdate);
};

//schedule expired product stock update cron job
const scheduleExpiredProductStockUpdate = () => {
	//Run the task every minute
	cron.schedule("* * * * *", () => expiredProductStockUpdate);
};

module.exports = {
	scheduleExpiredProductStockUpdate,
	scheduleExpiringProductPriceUpdate,
};
