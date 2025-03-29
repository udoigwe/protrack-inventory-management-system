const db = require("../utils/dbConfig");
const util = require("util");
const moment = require("moment");
const {
	validateLeadingZeros,
	validateEmail,
	logActivity,
	slugify,
	uuidv4,
} = require("../utils/functions");

module.exports = {
	create: async (req, res) => {
		const token = req.headers["x-access-token"];
		const myData = req.userDecodedData;
		const now = Math.floor(Date.now() / 1000);
		const {
			purchase_order_status,
			company_name,
			purchase_order_total_amount,
			purchase_order_items,
		} = req.body;
		const store_id =
			myData.user_role !== "Super Admin"
				? myData.user_store_id
				: req.body.store_id;
		const purchaseOrderUUID = uuidv4();
		const items = JSON.parse(purchase_order_items);

		req.action = "CREATE";
		req.activity = "Created a new purchase order";

		if (
			!store_id ||
			!purchase_order_status ||
			!company_name ||
			!purchase_order_total_amount ||
			!purchase_order_items
		) {
			res.json({
				error: true,
				message:
					"Please provide a store, order status, company name, order total amount and order items",
			});
		} else if (myData.user_write_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You have been denied access to perfom this action. Please contact admin",
			});
		} else if (isNaN(purchase_order_total_amount)) {
			res.json({
				error: true,
				message: "Order total amount must be a number",
			});
		} else {
			req.activity_details = {
				company_name,
				purchase_order_status,
				purchase_order_total_amount,
				contact_person:
					myData.user_firstname + " " + myData.user_lastname,
				purchase_order_uuid: purchaseOrderUUID,
			};

			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				//start transaction
				await util.promisify(connection.query).bind(connection)(
					"START TRANSACTION"
				);

				//insert into purchase order table
				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(
					"INSERT INTO purchase_orders (store_id, ordered_by, purchase_order_uuid, company_name, purchase_order_total_amount, purchase_order_timestamp, purchase_order_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
					[
						store_id,
						myData.user_id,
						purchaseOrderUUID,
						company_name,
						purchase_order_total_amount,
						now,
						purchase_order_status,
					]
				);

				//insert into purchase_order_items table
				for (let i = 0; i < items.length; i++) {
					const item = items[i];

					await util.promisify(connection.query).bind(connection)(
						"INSERT INTO purchase_order_items (purchase_order_id, purchase_order_item, purchase_order_item_unit_price, purchase_order_item_qty) VALUES (?, ?, ?, ?)",
						[
							rows1.insertId,
							item.purchase_order_item,
							item.purchase_order_item_unit_price,
							item.purchase_order_item_qty,
						]
					);
				}

				//insert into transaction table
				await util.promisify(connection.query).bind(connection)(
					"INSERT INTO transactions (store_id, entered_by, transaction_type, transaction_mode, transaction_title, transaction_recipient, transaction_remarks, transaction_uuid, transaction_timestamp, expected_amount, transacted_amount, balance, transaction_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
					[
						store_id,
						myData.user_id,
						"Expenditure",
						"Others",
						"Purchases",
						company_name,
						"Expenditure From Purchases",
						purchaseOrderUUID,
						now,
						purchase_order_total_amount,
						purchase_order_total_amount,
						0,
						"Completed",
					]
				);

				//commit activity
				await logActivity(token, req, connection);

				//commit transaction
				await util.promisify(connection.query).bind(connection)(
					"COMMIT"
				);

				res.json({
					error: false,
					message: "Purchase created successfully",
				});
			} catch (e) {
				//rollback transaction
				await util.promisify(connection.query).bind(connection)(
					"ROLLBACK"
				);

				console.log(e.stack);

				res.json({
					error: true,
					message: e.message,
				});
			} finally {
				connection.release();
			}
		}
	},
	findAll: async (req, res) => {
		const rez = {};
		const { store_id, user_id, status, start_time, end_time } = req.query;
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);

		let query =
			"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS contact_person, c.user_phone FROM purchase_orders a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.ordered_by = c.user_id WHERE 1 = 1";
		const queryParams = [];

		if (store_id) {
			query += " AND a.store_id = ?";
			queryParams.push(store_id);
		}

		if (user_id) {
			query += " AND a.ordered_by = ?";
			queryParams.push(user_id);
		}

		if (status) {
			query += " AND a.purchase_order_status = ?";
			queryParams.push(status);
		}

		if (start_time) {
			let startTimestamp = moment(start_time, "YYYY-MM-DD").unix();
			query += ` AND CAST(a.purchase_order_timestamp AS UNSIGNED) >= ?`;
			queryParams.push(startTimestamp);
		}

		if (end_time) {
			let endTimestamp = moment(end_time, "YYYY-MM-DD").unix();
			query += ` AND CAST(a.invoice_order_timestamp AS UNSIGNED) <= ?`;
			queryParams.push(endTimestamp);
		}

		query += " ORDER BY a.invoice_id DESC";

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			const rows = await util
				.promisify(connection.query)
				.bind(connection)(query, queryParams);

			const purchases = rows;

			rez.purchases = purchases;

			if (page >= 0 && limit) {
				let skip = page * limit;
				let numPages = Math.ceil(rows.length / limit);

				query += ` LIMIT ?, ?`;
				queryParams.push(skip);
				queryParams.push(limit);

				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(query, queryParams);

				rez.purchases = rows1;

				if (page < numPages) {
					rez.pagination = {
						total_records: rows.length,
						numPages,
						current: page,
						perPage: limit,
						previous: page > 0 ? page - 1 : undefined,
						next: page < numPages - 1 ? page + 1 : undefined,
					};
				}

				res.json({
					error: false,
					result: rez,
				});
			} else {
				res.json({
					error: false,
					result: rez,
				});
			}
		} catch (e) {
			console.log(e.stack);

			res.json({
				error: true,
				message: e.message,
			});
		} finally {
			connection.release();
		}
	},
	findOne: async (req, res) => {
		const purchaseOrderID = req.params.id;

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			const rows = await util
				.promisify(connection.query)
				.bind(connection)(
				"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS contact_person, c.user_phone FROM purchase_orders a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.ordered_by = c.user_id WHERE a.purchase_order_id = ? LIMIT 1",
				[purchaseOrderID]
			);

			if (rows.length == 0) {
				throw new Error("Purchase order does not exist");
			}

			//get purchase order items
			const items = await util
				.promisify(connection.query)
				.bind(connection)(
				"SELECT * FROM purchase_order_items WHERE purchase_order_id = ?",
				[purchaseOrderID]
			);

			//attach items to purchase order
			rows[0].items = items;

			res.json({
				error: false,
				purchase: rows[0],
			});
		} catch (e) {
			console.log(e.stack);

			res.json({
				error: true,
				message: e.message,
			});
		} finally {
			connection.release();
		}
	},
	fetchForDataTable: async (req, res) => {
		//dataTable Server-Side parameters
		var columns = [
			"purchase_order_id",
			"store_name",
			"contact_person",
			"company_name",
			"purchase_order_uuid",
			"purchase_order_total_amount",
			"purchase_order_timestamp",
			"purchase_order_status",
		];
		var draw = parseInt(req.query.draw);
		var start = parseInt(req.query.start);
		var length = parseInt(req.query.length);
		var orderCol = req.query.order[0].column;
		var orderDir = req.query.order[0].dir;
		var search = req.query.search.value;

		var dTData = (dTNumRows = dNumRowsFiltered = where = "");
		var filter = search == "" || search == null ? false : true;
		orderCol = columns[orderCol];
		var columnsJoined = columns.join(", ");

		const { store_id, user_id, status, start_time, end_time } = req.query;

		let query =
			"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS contact_person, c.user_phone FROM purchase_orders a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.ordered_by = c.user_id WHERE 1 = 1";
		const queryParams = [];

		if (store_id) {
			query += " AND a.store_id = ?";
			queryParams.push(store_id);
		}

		if (user_id) {
			query += " AND a.ordered_by = ?";
			queryParams.push(user_id);
		}

		if (status) {
			query += " AND a.purchase_order_status = ?";
			queryParams.push(status);
		}

		if (start_time) {
			let startTimestamp = moment(start_time, "YYYY-MM-DD").unix();
			query += ` AND CAST(a.purchase_order_timestamp AS UNSIGNED) >= ?`;
			queryParams.push(startTimestamp);
		}

		if (end_time) {
			let endTimestamp = moment(end_time, "YYYY-MM-DD").unix();
			query += ` AND CAST(a.purchase_order_timestamp AS UNSIGNED) <= ?`;
			queryParams.push(endTimestamp);
		}

		query += " ORDER BY a.purchase_order_id DESC";

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			const rows = await util
				.promisify(connection.query)
				.bind(connection)(query, queryParams);

			dTNumRows = rows.length;

			if (filter) {
				where += "WHERE ";
				var i = 0;
				var len = columns.length - 1;

				for (var x = 0; x < columns.length; x++) {
					if (i == len) {
						where += `${columns[x]} LIKE '%${search}%'`;
					} else {
						where += `${columns[x]} LIKE '%${search}%' OR `;
					}

					i++;
				}

				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT * FROM (${query})X ${where}`,
					queryParams
				);

				dNumRowsFiltered = rows1.length;
			} else {
				dNumRowsFiltered = dTNumRows;
			}

			const rows2 = await util
				.promisify(connection.query)
				.bind(connection)(
				`SELECT ${columns} FROM (${query})X ${where} ORDER BY ${orderCol} ${orderDir} LIMIT ${length} OFFSET ${start}`,
				queryParams
			);

			if (rows2.length > 0) {
				var data = [];
				var rtData = rows2;

				for (var i = 0; i < rtData.length; i++) {
					rtData[i].DT_RowId = rtData[i].purchase_order_id;
					data.push(rtData[i]);
				}

				dTData = data;
			} else {
				dTData = [];
			}

			var responseData = {
				draw: draw,
				recordsTotal: dTNumRows,
				recordsFiltered: dNumRowsFiltered,
				data: dTData,
			};

			res.send(responseData);
		} catch (e) {
			console.log(e.stack);
		} finally {
			connection.release();
		}
	},
	update: async (req, res) => {
		const purchaseOrderID = req.params.id;
		const token = req.headers["x-access-token"];
		const myData = req.userDecodedData;
		const {
			purchase_order_status,
			company_name,
			purchase_order_total_amount,
			purchase_order_items,
		} = req.body;
		const store_id =
			myData.user_role !== "Super Admin"
				? myData.user_store_id
				: req.body.store_id;
		const items = JSON.parse(purchase_order_items);

		req.action = "UPDATE";
		req.activity = "Updated a purchase order";

		if (
			!store_id ||
			!purchase_order_status ||
			!company_name ||
			!purchase_order_total_amount ||
			!purchase_order_items
		) {
			res.json({
				error: true,
				message:
					"Please provide a store, order status, company name, order total amount and order items",
			});
		} else if (myData.user_update_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You have been denied access to perfom this action. Please contact admin",
			});
		} else if (isNaN(purchase_order_total_amount)) {
			res.json({
				error: true,
				message: "Order total amount must be a number",
			});
		} else {
			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				//start transaction
				await util.promisify(connection.query).bind(connection)(
					"START TRANSACTION"
				);

				//find purchase order
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS contact_person, c.user_phone FROM purchase_orders a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.ordered_by = c.user_id WHERE a.purchase_order_id = ? LIMIT 1",
					[purchaseOrderID]
				);

				if (rows.length == 0) {
					throw new Error("Purchase Order does not exist");
				}

				const purchaseOrder = rows[0];

				//record activity
				req.activity_details = {
					previous_store_name: purchaseOrder.store_name,
					previous_company_name: purchaseOrder.company_name,
					previous_purchase_order_status:
						purchaseOrder.purchase_order_status,
					previous_purchase_order_total_amount:
						purchaseOrder.purchase_order_total_amount,
					purchase_order_status,
					company_name,
					purchase_order_total_amount,
				};

				//deleting existing purchase order items
				await util.promisify(connection.query).bind(connection)(
					"DELETE FROM purchase_order_items WHERE purchase_order_id = ?",
					[purchaseOrderID]
				);

				//update purchase order
				await util.promisify(connection.query).bind(connection)(
					"UPDATE purchase_orders SET purchase_order_status = ?, company_name = ?, purchase_order_total_amount = ?, store_id = ? WHERE purchase_order_id = ?",
					[
						purchase_order_status,
						company_name,
						purchase_order_total_amount,
						store_id,
						purchaseOrderID,
					]
				);

				//insert into purchase_order_items table
				for (let i = 0; i < items.length; i++) {
					const item = items[i];

					await util.promisify(connection.query).bind(connection)(
						"INSERT INTO purchase_order_items (purchase_order_id, purchase_order_item, purchase_order_item_unit_price, purchase_order_item_qty) VALUES (?, ?, ?, ?)",
						[
							purchaseOrderID,
							item.purchase_order_item,
							item.purchase_order_item_unit_price,
							item.purchase_order_item_qty,
						]
					);
				}

				//update transactions table
				await util.promisify(connection.query).bind(connection)(
					"UPDATE transactions SET transaction_recipient = ?,  expected_amount = ?, transacted_amount = ?, balance = ?, transaction_status = ? WHERE transaction_uuid = ?",
					[
						company_name,
						purchase_order_total_amount,
						purchase_order_total_amount,
						0,
						"Completed",
						purchaseOrder.purchase_order_uuid,
					]
				);

				//commit activity
				await logActivity(token, req, connection);

				//commit transaction
				await util.promisify(connection.query).bind(connection)(
					"COMMIT"
				);

				res.json({
					error: false,
					message: "Purchase updated successfully",
				});
			} catch (e) {
				//rollback transaction
				await util.promisify(connection.query).bind(connection)(
					"ROLLBACK"
				);

				console.log(e.stack);

				res.json({
					error: true,
					message: e.message,
				});
			} finally {
				connection.release();
			}
		}
	},
	delete: async (req, res) => {
		const myData = req.userDecodedData;
		const purchaseOrderID = req.params.id;
		const token = req.headers["x-access-token"];

		req.action = "DELETE";
		req.activity = "Deleted a purchase order";

		if (myData.delete_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You have been denied rights to perform this action. Contact admin",
			});
		} else {
			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				//start transaction
				await util.promisify(connection.query).bind(connection)(
					"START TRANSACTION"
				);

				//check existence of purchase order
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS contact_person FROM purchase_orders a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.ordered_by = c.user_id WHERE a.purchase_order_id = ? LIMIT 1",
					[purchaseOrderID]
				);

				if (rows.length == 0) {
					throw new Error("Purchase Order does not exist");
				}

				const purchaseOrder = rows[0];

				req.activity_details = purchaseOrder;

				//add date time to activity log
				req.activity_details.date_time = moment(
					purchaseOrder.purchase_order_timestamp
				).format("MMMM Do, YYYY h:mm:ss a");

				//delete transaction from transaction table
				await util.promisify(connection.query).bind(connection)(
					"DELETE FROM transactions WHERE transaction_uuid = ?",
					[purchaseOrder.purchase_order_uuid]
				);

				//delete purchase order from purchase_orders table
				await util.promisify(connection.query).bind(connection)(
					"DELETE FROM purchase_orders WHERE purchase_order_id = ?",
					[purchaseOrderID]
				);

				//register activity
				await logActivity(token, req, connection);

				//commit transaction
				await util.promisify(connection.query).bind(connection)(
					"COMMIT"
				);

				res.json({
					error: false,
					message: "Purchase Order deleted successfully",
				});
			} catch (e) {
				//rollback transaction
				await util.promisify(connection.query).bind(connection)(
					"ROLLBACK"
				);

				console.log(e.stack);

				res.json({
					error: true,
					message: e.message,
				});
			} finally {
				connection.release();
			}
		}
	},
};
