const db = require("../utils/dbConfig");
const util = require("util");
const moment = require("moment");
const {
	validateLeadingZeros,
	validateEmail,
	logActivity,
	slugify,
	uuidv4,
	generateRandomCharacters,
} = require("../utils/functions");

module.exports = {
	create: async (req, res) => {
		const token = req.headers["x-access-token"];
		const myData = req.userDecodedData;
		const now = Math.floor(Date.now() / 1000);
		const {
			customer_name,
			invoice_paid_amount,
			invoice_due,
			invoice_payment_method,
			form_meta,
		} = req.body;
		const store_id =
			myData.user_role !== "Super Admin"
				? myData.user_store_id
				: req.body.store_id;
		const invoiceObject = JSON.parse(form_meta);
		let totalVatRate = 0;
		let totalDiscountRate = 0;
		let totalVatAmount = 0;
		let totalDiscountAmount = 0;

		req.action = "CREATE";
		req.activity = "Created a new invoice";

		if (!invoice_paid_amount || !invoice_payment_method) {
			res.json({
				error: true,
				message: "Please provide amount paid & Method of payment",
			});
		} else if (myData.user_write_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You have been denied access to perfom this action. Please contact admin",
			});
		} else if (isNaN(invoice_paid_amount)) {
			res.json({
				error: true,
				message: "Please provide valid amount paid",
			});
		} else {
			req.activity_details = {
				customer_name,
				invoice_paid_amount,
				invoice_payment_method,
				invoice_gross_total: invoiceObject.invoiceGrossTotal,
				invoice_net_total: invoiceObject.invoiceNetTotal,
				/* invoice_vat_rate: invoiceObject.invoiceVatRate,
                invoice_discount_rate: invoiceObject.invoiceDiscountRate,
                invoice_discount_amount: invoiceObject.discountAmount,
                invoice_vat_amount: invoiceObject.vatAmount, */
				cashier: myData.user_firstname + " " + myData.user_lastname,
			};

			const items = invoiceObject.items;

			//instantiate gross total
			let grossTotal = 0;

			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				//start transaction
				await util.promisify(connection.query).bind(connection)(
					"START TRANSACTION"
				);

				//loop through invoice items and insert into invoice_items table
				for (let i = 0; i < items.length; i++) {
					const item = items[i];

					//check if product exists
					let rows = await util
						.promisify(connection.query)
						.bind(connection)(
						"SELECT * FROM products WHERE product_id = ? LIMIT 1",
						[item.product_id]
					);

					if (rows.length == 0) {
						throw new Error(
							`A product with ID ${item.product_id} was not found`
						);
					}

					const product = rows[0];

					//check if product is in stock
					if (
						parseFloat(item.quantity_ordered) >
						product.product_stock
					) {
						throw new Error(
							`The product ${product.product_name} with ordered quantity of ${item.quantity_ordered} is greater than the available quantity of ${product.product_stock}`
						);
					}

					//get product vat
					let productVAT =
						(product.product_price * product.product_vat_rate) /
						100;

					//get product discount
					let productDiscount =
						(product.product_price *
							product.product_discount_rate) /
						100;

					//add product vat rate to total vat rate
					totalVatRate += product.product_vat_rate;

					//add product discount rate
					totalDiscountRate += product.product_discount_rate;

					//add product vat amount to total vat amount
					totalVatAmount += productVAT;

					//add product discount amount to total discount amount
					totalDiscountAmount += productDiscount;

					//if it is in stock, calculate the subtotal
					const subTotal =
						parseFloat(item.quantity_ordered) *
						product.product_price;

					//add to gross total
					grossTotal += subTotal;
				}

				/* //fetch current applied tax and discounts from store
                let rows = await util.promisify(connection.query).bind(connection)("SELECT * FROM stores WHERE store_id = ? LIMIT 1", [store_id]);

                if(rows.length == 0)
                {
                    throw new Error(`Store does not exist`);
                }

                vatRate = rows[0].store_vat_rate;
                discountRate = rows[0].store_discount_rate;

                //calculate net total
                const vat = (grossTotal * vatRate / 100).toFixed(2);
                const discount = (grossTotal * discountRate / 100).toFixed(2);
                const netTotal = (grossTotal + parseFloat(vat) - parseFloat(discount)).toFixed(2); */

				const netTotal =
					grossTotal + totalVatAmount - totalDiscountAmount;

				//insert into invoice table
				//const invoiceUUID = uuidv4();
				const invoiceUUID = generateRandomCharacters(6);

				//get the actual due
				const actualDue = (
					parseFloat(invoice_paid_amount) - netTotal
				).toFixed(2);

				//insert due into activity
				req.activity_details.invoice_due = actualDue;
				req.activity_details.invoice_total_vat_rate = totalVatRate;
				req.activity_details.invoice_total_vat_amount = totalVatAmount;
				req.activity_details.invoice_total_discount_rate =
					totalDiscountRate;
				req.activity_details.invoice_total_discount_amount =
					totalDiscountAmount;

				//insert into invoice table
				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(
					"INSERT INTO invoices (store_id, cashier_id, invoice_uuid, invoice_customer_name, invoice_gross_total, total_invoice_vat_rate, total_invoice_vat, total_invoice_discount_rate, total_invoice_discount, invoice_net_total, invoice_paid_amount, invoice_due, invoice_payment_method, invoice_order_timestamp, invoice_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
					[
						store_id,
						myData.user_id,
						invoiceUUID,
						customer_name,
						grossTotal.toFixed(2),
						totalVatRate.toFixed(2),
						totalVatAmount.toFixed(2),
						totalDiscountRate.toFixed(2),
						totalDiscountAmount.toFixed(2),
						netTotal.toFixed(2),
						invoice_paid_amount,
						actualDue,
						invoice_payment_method,
						now,
						`${
							parseFloat(invoice_paid_amount) >=
							parseFloat(netTotal)
								? "Paid"
								: parseFloat(invoice_paid_amount) == 0
								? "Unpaid"
								: "Incomplete Payment"
						}`,
					]
				);

				//insert into invoice_items table
				for (let i = 0; i < items.length; i++) {
					const item = items[i];

					//get product details
					let pr = await util
						.promisify(connection.query)
						.bind(connection)(
						"SELECT * FROM products WHERE product_id = ? LIMIT 1",
						[item.product_id]
					);

					//get invoice product VAT amount
					let invoiceProductVatAmount =
						(pr[0].product_price * pr[0].product_vat_rate) / 100;

					//get invoice product discount amount
					let invoiceProductDiscountAmount =
						(pr[0].product_price * pr[0].product_discount_rate) /
						100;

					await util.promisify(connection.query).bind(connection)(
						"INSERT INTO invoice_items (invoice_id, invoice_product_id, invoice_product_unit_cost_price, invoice_product_unit_price, invoice_product_qty, invoice_product_vat, invoice_product_discount, invoice_product_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
						[
							rows1.insertId,
							item.product_id,
							pr[0].product_cost_price,
							item.product_unit_price,
							item.quantity_ordered,
							invoiceProductVatAmount.toFixed(2),
							invoiceProductDiscountAmount.toFixed(2),
							now,
						]
					);

					//update product stock
					await util.promisify(connection.query).bind(connection)(
						"UPDATE products SET product_stock = product_stock - ? WHERE product_id = ?",
						[item.quantity_ordered, item.product_id]
					);
				}

				//insert into transaction table
				await util.promisify(connection.query).bind(connection)(
					"INSERT INTO transactions (store_id, entered_by, transaction_type, transaction_mode, transaction_title, transacted_by, transaction_recipient, transaction_remarks, transaction_uuid, transaction_timestamp, expected_amount, transacted_amount, balance, transaction_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
					[
						store_id,
						myData.user_id,
						"Income",
						invoice_payment_method,
						"Sales",
						`${myData.user_lastname} ${myData.user_firstname}`,
						process.env.COMPANY_NAME,
						"Income From Sales",
						invoiceUUID,
						now,
						netTotal,
						invoice_paid_amount,
						(parseFloat(invoice_paid_amount) - netTotal).toFixed(2),
						`${
							parseFloat(invoice_paid_amount) >= netTotal
								? "Completed"
								: "Uncompleted"
						}`,
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
					message: "Invoice created successfully",
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
		const {
			store_id,
			cashier_id,
			payment_mode,
			status,
			start_time,
			end_time,
		} = req.query;
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);

		let query =
			"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS cashier FROM invoices a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.cashier_id = c.user_id WHERE 1 = 1";
		const queryParams = [];

		if (store_id) {
			query += " AND a.store_id = ?";
			queryParams.push(store_id);
		}

		if (cashier_id) {
			query += " AND a.cashier_id = ?";
			queryParams.push(cashier_id);
		}

		if (payment_mode) {
			query += " AND a.invoice_payment_method = ?";
			queryParams.push(payment_mode);
		}

		if (status) {
			query += " AND a.invoice_status = ?";
			queryParams.push(status);
		}

		if (start_time) {
			let startTimestamp = moment(start_time, "YYYY-MM-DD").unix();
			query += ` AND CAST(a.invoice_order_timestamp AS UNSIGNED) >= ?`;
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

			const invoices = rows;

			rez.invoices = invoices;

			if (page >= 0 && limit) {
				let skip = page * limit;
				let numPages = Math.ceil(rows.length / limit);

				query += ` LIMIT ?, ?`;
				queryParams.push(skip);
				queryParams.push(limit);

				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(query, queryParams);

				rez.invoices = rows1;

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
		const invoiceID = req.params.id;

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			const rows = await util
				.promisify(connection.query)
				.bind(connection)(
				"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS cashier FROM invoices a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.cashier_id = c.user_id WHERE a.invoice_id = ? LIMIT 1",
				[invoiceID]
			);

			if (rows.length == 0) {
				throw new Error("Invoice does not exist");
			}

			//get invoice items
			const items = await util
				.promisify(connection.query)
				.bind(connection)(
				"SELECT a.*, b.product_name, b.product_measuring_units FROM invoice_items a LEFT JOIN products b ON a.invoice_product_id = b.product_id WHERE a.invoice_id = ?",
				[invoiceID]
			);

			//attach items to invoice
			rows[0].items = items;

			res.json({
				error: false,
				invoice: rows[0],
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
			"invoice_id",
			"store_name",
			"cashier",
			"invoice_uuid",
			"invoice_customer_name",
			"invoice_gross_total",
			"total_invoice_vat",
			"total_invoice_discount",
			"invoice_net_total",
			"invoice_paid_amount",
			"invoice_due",
			"invoice_payment_method",
			"invoice_order_timestamp",
			"invoice_status",
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
			cashier_id,
			payment_mode,
			status,
			start_time,
			end_time,
		} = req.query;

		let query =
			"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS cashier FROM invoices a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.cashier_id = c.user_id WHERE 1 = 1";
		const queryParams = [];

		if (store_id) {
			query += " AND a.store_id = ?";
			queryParams.push(store_id);
		}

		if (cashier_id) {
			query += " AND a.cashier_id = ?";
			queryParams.push(cashier_id);
		}

		if (payment_mode) {
			query += " AND a.invoice_payment_method = ?";
			queryParams.push(payment_mode);
		}

		if (status) {
			query += " AND a.invoice_status = ?";
			queryParams.push(status);
		}

		if (start_time) {
			let startTimestamp = moment(start_time, "YYYY-MM-DD").unix();
			query += ` AND CAST(a.invoice_order_timestamp AS UNSIGNED) >= ?`;
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
					rtData[i].DT_RowId = rtData[i].invoice_id;
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
	delete: async (req, res) => {
		const myData = req.userDecodedData;
		const invoiceID = req.params.id;
		const token = req.headers["x-access-token"];

		req.action = "DELETE";
		req.activity = "Deleted an invoice";

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

				//check existence of invoice
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS cashier FROM invoices a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.cashier_id = c.user_id WHERE a.invoice_id = ? LIMIT 1",
					[invoiceID]
				);

				if (rows.length == 0) {
					throw new Error("Invoice does not exist");
				}

				const invoice = rows[0];

				req.activity_details = invoice;

				//add date time to activity log
				req.activity_details.date_time = moment(
					invoice.invoice_order_timestamp
				).format("MMMM Do, YYYY h:mm:ss a");

				//fetch invoice items
				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM invoice_items WHERE invoice_id = ?",
					[invoiceID]
				);

				if (rows1.length == 0) {
					throw new Error("No invoice item found");
				}

				const invoiceItems = rows1;

				//update stock
				for (var i = 0; i < invoiceItems.length; i++) {
					const invoiceItem = invoiceItems[i];

					await util.promisify(connection.query).bind(connection)(
						"UPDATE products SET product_stock = product_stock + ? WHERE product_id = ?",
						[
							invoiceItem.invoice_product_qty,
							invoiceItem.invoice_product_id,
						]
					);
				}

				//delete transaction fro transaction table
				await util.promisify(connection.query).bind(connection)(
					"DELETE FROM transactions WHERE transaction_uuid = ?",
					[invoice.invoice_uuid]
				);

				//delete invoice from invoices table
				await util.promisify(connection.query).bind(connection)(
					"DELETE FROM invoices WHERE invoice_id = ?",
					[invoiceID]
				);

				//register activity
				await logActivity(token, req, connection);

				//commit transaction
				await util.promisify(connection.query).bind(connection)(
					"COMMIT"
				);

				res.json({
					error: false,
					message: "Invoice deleted successfully",
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
