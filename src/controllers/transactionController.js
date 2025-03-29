const db = require("../utils/dbConfig");
const util = require("util");
const moment = require("moment");
const { logActivity, uuidv4 } = require("../utils/functions");

module.exports = {
	create: async (req, res) => {
		const token = req.headers["x-access-token"];
		const myData = req.userDecodedData;
		const now = Math.floor(Date.now() / 1000);
		const {
			transaction_type,
			transaction_mode,
			transaction_title,
			transaction_recipient,
			expected_amount,
			transacted_amount,
			transaction_remarks,
		} = req.body;
		const store_id =
			myData.user_role !== "Super Admin"
				? myData.user_store_id
				: req.body.store_id;
		const teller_no = !req.body.teller_no ? null : req.body.teller_no;
		const bank = !req.body.bank ? null : req.body.bank;
		const transactionUUID = uuidv4();

		req.action = "CREATE";
		req.activity = "Created a new transaction";

		if (
			!store_id ||
			!transaction_type ||
			!transaction_mode ||
			!transaction_title ||
			!transaction_recipient ||
			!expected_amount ||
			!transacted_amount ||
			!transaction_remarks
		) {
			res.json({
				error: true,
				message:
					"Please provide a store, type, mode, title, recipient, expected amount, transacted amount & remarks for this transaction.",
			});
		} else if (myData.user_write_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You have been denied access to perfom this action. Please contact admin",
			});
		} else if (isNaN(expected_amount)) {
			res.json({
				error: true,
				message: "Expected amount must be a number",
			});
		} else if (isNaN(transacted_amount)) {
			res.json({
				error: true,
				message: "Transacted amount must be a number",
			});
		} else {
			req.activity_details = req.body;

			const balance = transacted_amount - expected_amount;

			const status = balance >= 0 ? "Completed" : "Uncompleted";

			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				//insert transaction
				await util.promisify(connection.query).bind(connection)(
					"INSERT INTO transactions(store_id, entered_by, transaction_type, transaction_mode, transaction_title, transaction_recipient, expected_amount, transacted_amount, balance, transaction_remarks, transaction_status, transaction_timestamp, teller_no, bank, transaction_uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
					[
						store_id,
						myData.user_id,
						transaction_type,
						transaction_mode,
						transaction_title,
						transaction_recipient,
						expected_amount,
						transacted_amount,
						balance,
						transaction_remarks,
						status,
						now,
						teller_no,
						bank,
						transactionUUID,
					]
				);

				//commit activity
				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Transacton created successfully",
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
		}
	},
	findAll: async (req, res) => {
		const rez = {};
		const {
			store_id,
			user_id,
			status,
			start_time,
			end_time,
			transaction_type,
			transaction_mode,
		} = req.query;
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);

		let query =
			"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS recorded_by FROM transactions a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.entered_by = c.user_id WHERE 1 = 1";
		const queryParams = [];

		if (store_id) {
			query += " AND a.store_id = ?";
			queryParams.push(store_id);
		}

		if (user_id) {
			query += " AND a.entered_by = ?";
			queryParams.push(user_id);
		}

		if (status) {
			query += " AND a.transaction_status = ?";
			queryParams.push(status);
		}

		if (start_time) {
			let startTimestamp = moment(start_time, "YYYY-MM-DD").unix();
			query += ` AND CAST(a.transaction_timestamp AS UNSIGNED) >= ?`;
			queryParams.push(startTimestamp);
		}

		if (end_time) {
			let endTimestamp = moment(end_time, "YYYY-MM-DD").unix() + 86399;
			query += ` AND CAST(a.transaction_timestamp AS UNSIGNED) <= ?`;
			queryParams.push(endTimestamp);
		}

		if (transaction_type) {
			query += " AND a.transaction_type = ?";
			queryParams.push(transaction_type);
		}

		if (transaction_mode) {
			query += " AND a.transaction_mode = ?";
			queryParams.push(transaction_mode);
		}

		query += " ORDER BY a.transaction_id DESC";

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			const rows = await util
				.promisify(connection.query)
				.bind(connection)(query, queryParams);

			const transactions = rows;

			rez.transactions = transactions;

			if (page >= 0 && limit) {
				let skip = page * limit;
				let numPages = Math.ceil(rows.length / limit);

				query += ` LIMIT ?, ?`;
				queryParams.push(skip);
				queryParams.push(limit);

				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(query, queryParams);

				rez.transactions = rows1;

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
		const transactionID = req.params.id;

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			const rows = await util
				.promisify(connection.query)
				.bind(connection)(
				"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS recorded_by FROM transactions a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.entered_by = c.user_id WHERE a.transaction_id = ? LIMIT 1",
				[transactionID]
			);

			if (rows.length == 0) {
				throw new Error("Transaction does not exist");
			}

			res.json({
				error: false,
				transaction: rows[0],
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
			"transaction_id",
			"store_name",
			"recorded_by",
			"transaction_type",
			"transaction_mode",
			"transaction_title",
			"transaction_recipient",
			"teller_no",
			"bank",
			"transaction_uuid",
			"transaction_timestamp",
			"expected_amount",
			"transacted_amount",
			"balance",
			"transaction_status",
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

		const {
			store_id,
			user_id,
			status,
			start_time,
			end_time,
			transaction_type,
			transaction_mode,
		} = req.query;

		let query =
			"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS recorded_by FROM transactions a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.entered_by = c.user_id WHERE 1 = 1";
		const queryParams = [];

		if (store_id) {
			query += " AND a.store_id = ?";
			queryParams.push(store_id);
		}

		if (user_id) {
			query += " AND a.entered_by = ?";
			queryParams.push(user_id);
		}

		if (status) {
			query += " AND a.transaction_status = ?";
			queryParams.push(status);
		}

		if (start_time) {
			let startTimestamp = moment(start_time, "YYYY-MM-DD").unix();
			query += ` AND CAST(a.transaction_timestamp AS UNSIGNED) >= ?`;
			queryParams.push(startTimestamp);
		}

		if (end_time) {
			let endTimestamp = moment(end_time, "YYYY-MM-DD").unix() + 86399;
			query += ` AND CAST(a.transaction_timestamp AS UNSIGNED) <= ?`;
			queryParams.push(endTimestamp);
		}

		if (transaction_type) {
			query += " AND a.transaction_type = ?";
			queryParams.push(transaction_type);
		}

		if (transaction_mode) {
			query += " AND a.transaction_mode = ?";
			queryParams.push(transaction_mode);
		}

		query += " ORDER BY a.transaction_id DESC";

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
					rtData[i].DT_RowId = rtData[i].transaction_id;
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
		const transactionID = req.params.id;
		const token = req.headers["x-access-token"];
		const myData = req.userDecodedData;
		const {
			transaction_type,
			transaction_mode,
			transaction_title,
			transaction_recipient,
			teller_no,
			bank,
			expected_amount,
			transacted_amount,
			transaction_remarks,
		} = req.body;

		const store_id =
			myData.user_role !== "Super Admin"
				? myData.user_store_id
				: req.body.store_id;

		req.action = "UPDATE";
		req.activity = "Updated a transaction";

		if (
			!store_id ||
			!transaction_type ||
			!transaction_mode ||
			!transaction_title ||
			!transaction_recipient ||
			!expected_amount ||
			!transacted_amount ||
			!transaction_remarks
		) {
			res.json({
				error: true,
				message:
					"Please provide a store, type, mode, title, recipient, expected amount, transacted amount & remarks for this transaction.",
			});
		} else if (myData.user_update_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You have been denied access to perfom this action. Please contact admin",
			});
		} else if (isNaN(expected_amount)) {
			res.json({
				error: true,
				message: "Expected amount must be a number",
			});
		} else if (isNaN(transacted_amount)) {
			res.json({
				error: true,
				message: "Transacted amount must be a number",
			});
		} else {
			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				//find transaction
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS recorded_by FROM transactions a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.entered_by = c.user_id WHERE a.transaction_id = ? LIMIT 1",
					[transactionID]
				);

				if (rows.length == 0) {
					throw new Error("Transaction does not exist");
				}

				const transaction = rows[0];

				const balance = expected_amount - transacted_amount;

				const transaction_status =
					balance > 0 ? "Uncompleted" : "Completed";

				//record activity
				req.activity_details = {
					previous_store_id: transaction.store_id,
					previous_store_name: transaction.store_name,
					previous_transaction_type: transaction.transaction_type,
					previous_transaction_mode: transaction.transaction_mode,
					previous_transaction_title: transaction.transaction_title,
					previous_transaction_recipient:
						transaction.transaction_recipient,
					previous_teller_no: transaction.teller_no,
					previous_bank: transaction.bank,
					previous_expected_amount: transaction.expected_amount,
					previous_transacted_amount: transaction.transacted_amount,
					previous_balance: transaction.balance,
					previous_transaction_status: transaction.transaction_status,
					previous_transaction_remarks:
						transaction.transaction_remarks,
					store_id,
					transaction_type,
					transaction_mode,
					transaction_title,
					transaction_recipient,
					teller_no,
					bank,
					expected_amount,
					transacted_amount,
					transaction_remarks,
					balance,
					transaction_status,
				};

				//update transaction
				await util.promisify(connection.query).bind(connection)(
					"UPDATE transactions SET store_id = ?, transaction_type = ?, transaction_mode = ?, transaction_title = ?, transaction_recipient = ?, teller_no = ?, bank = ?, expected_amount = ?, transacted_amount = ?, balance = ?, transaction_remarks = ?, transaction_status = ? WHERE transaction_id = ?",
					[
						store_id,
						transaction_type,
						transaction_mode,
						transaction_title,
						transaction_recipient,
						teller_no,
						bank,
						expected_amount,
						transacted_amount,
						balance,
						transaction_remarks,
						transaction_status,
						transactionID,
					]
				);

				//commit activity
				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Transaction updated successfully",
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
		}
	},
	delete: async (req, res) => {
		const myData = req.userDecodedData;
		const transactionID = req.params.id;
		const token = req.headers["x-access-token"];

		req.action = "DELETE";
		req.activity = "Deleted a transaction";

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

				//check existence of transaction
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS recorded_by FROM transactions a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.entered_by = c.user_id WHERE a.transaction_id = ? LIMIT 1",
					[transactionID]
				);

				if (rows.length == 0) {
					throw new Error("Transaction does not exist");
				}

				const transaction = rows[0];

				req.activity_details = transaction;

				//add date time to activity log
				req.activity_details.transaction_date_time = moment(
					transaction.transaction_timestamp
				).format("MMMM Do, YYYY h:mm:ss a");

				//delete transaction from transaction table
				await util.promisify(connection.query).bind(connection)(
					"DELETE FROM transactions WHERE transaction_id = ?",
					[transaction.transaction_id]
				);

				//delete from invoices table if exists
				await util.promisify(connection.query).bind(connection)(
					"DELETE FROM invoices WHERE invoice_uuid = ?",
					[transaction.transaction_uuid]
				);

				//delete from purchases table if exists
				await util.promisify(connection.query).bind(connection)(
					"DELETE FROM purchase_orders WHERE purchase_order_uuid = ?",
					[transaction.transaction_uuid]
				);

				//register activity
				await logActivity(token, req, connection);

				//commit transaction
				await util.promisify(connection.query).bind(connection)(
					"COMMIT"
				);

				res.json({
					error: false,
					message: "Transaction deleted successfully",
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
