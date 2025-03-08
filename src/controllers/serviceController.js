const db = require("../utils/dbConfig");
const util = require("util");
const moment = require("moment");

module.exports = {
	expiringProductPriceUpdate: async (req, res) => {
		const now = moment();

		let connection;

		try {
			//initiate db connection
			connection = await util.promisify(db.getConnection).bind(db)();

			// Fetch items with expiry_date exactly 2 minutes from now
			const itemsToReducePrice = await util
				.promisify(connection.query)
				.bind(connection)(
				`
                SELECT * FROM products 
                WHERE TIMESTAMPDIFF(MINUTE, NOW(), product_expiry_date) = 2
                AND price_reduced = false
                AND product_stock != 0
            `,
				[]
			);

			// Apply discount logic to these items
			for (let item of itemsToReducePrice) {
				const newPrice =
					parseFloat(item.product_price) *
					parseFloat(100 - item.product_expiry_discount_rate) *
					0.01; // Example 50% reduction

				// Update the price and mark it as updated
				await util.promisify(connection.query).bind(connection)(
					`
                        UPDATE products 
                        SET product_price = ?, price_reduced = true 
                        WHERE product_id = ?
                    `,
					[newPrice, item.product_id]
				);

				console.log(
					`${item.product_name} price changed to ${newPrice} due to close expiration date & time`
				);
			}

			// Reset price_reduced to false for items that were updated
			if (itemsToReducePrice.length > 0) {
				const itemIds = itemsToReducePrice
					.map((item) => item.product_id)
					.join(",");

				await util.promisify(connection.query).bind(connection)(`
                    UPDATE products 
                    SET price_reduced = false 
                    WHERE product_id IN (${itemIds})
                `);
			}

			console.log(`Product price update job executed successfully`);
		} catch (e) {
			console.log(e.stack);

			res.json({
				error: true,
				message: e.message,
			});
		} finally {
			connection ? connection.release() : null;
		}
	},
	expiredProductStockUpdate: async (req, res) => {
		const now = moment();
		const currentTime = now.format("YYYY-MM-DD HH:mm:ss");
		let connection;

		try {
			//initiate db connection
			connection = await util.promisify(db.getConnection).bind(db)();

			// Fetch items that have already expired
			const expiredItems = await util
				.promisify(connection.query)
				.bind(connection)(
				`
                    SELECT * FROM products 
                    WHERE product_expiry_date < ?
                `,
				[currentTime]
			);

			// Set the quantity to 0 for expired items
			for (let item of expiredItems) {
				await util.promisify(connection.query).bind(connection)(
					`
                        UPDATE products 
                        SET 
							product_stock = 0,
							product_status = 'Inactive'
                        WHERE product_id = ?
                    `,
					[item.product_id]
				);
				console.log(
					`${item.product_name} has expired & quantity changed to 0 due to close expiration`
				);
			}
			console.log(
				`Expired product stock update job executed successfully`
			);
		} catch (e) {
			console.log(e.stack);

			res.json({
				error: true,
				message: e.message,
			});
		} finally {
			connection ? connection.release() : null;
		}
	},
};
