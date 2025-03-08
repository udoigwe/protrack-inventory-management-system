const db = require("../utils/dbConfig");
const util = require("util");
const moment = require("moment");
const fs = require("fs");
const CryptoJS = require("crypto-js");
const {
	validateLeadingZeros,
	validateEmail,
	logActivity,
	slugify,
} = require("../utils/functions");

module.exports = {
	createCategory: async (req, res) => {
		const token = req.headers["x-access-token"];
		const myData = req.userDecodedData;
		const now = Math.floor(Date.now() / 1000);
		const { product_category_name } = req.body;

		req.action = "CREATE";
		req.activity = "Created a new product category";

		if (!product_category_name) {
			res.json({
				error: true,
				message: "Please provide a product category name",
			});
		} else if (myData.user_write_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You have been denied access to perfom this action. Please contact admin",
			});
		} else {
			const productCategorySlug = slugify(product_category_name);

			req.activity_details = req.body;

			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM product_categories WHERE product_category_slug = ? LIMIT 1",
					[productCategorySlug]
				);

				if (rows.length > 0) {
					throw new Error("Product Category name already exists");
				}

				await util.promisify(connection.query).bind(connection)(
					"INSERT INTO product_categories (product_category_name, product_category_slug, product_category_created_at) VALUES (?, ?, ?)",
					[product_category_name, productCategorySlug, now]
				);

				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Product category created successfully",
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
	findAllCategories: async (req, res) => {
		const rez = {};
		const { status } = req.query;
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);

		let query = "SELECT * FROM product_categories WHERE 1 = 1";
		const queryParams = [];

		if (status) {
			query += " AND product_category_status = ?";
			queryParams.push(status);
		}

		query += " ORDER BY product_category_id DESC";

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			const rows = await util
				.promisify(connection.query)
				.bind(connection)(query, queryParams);

			const categories = rows;

			rez.categories = categories;

			if (page >= 0 && limit) {
				let skip = page * limit;
				let numPages = Math.ceil(rows.length / limit);

				query += ` LIMIT ?, ?`;
				queryParams.push(skip);
				queryParams.push(limit);

				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(query, queryParams);

				rez.categories = rows1;

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
	findOneCategory: async (req, res) => {
		const categoryID = req.params.id;

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			const rows = await util
				.promisify(connection.query)
				.bind(connection)(
				"SELECT * FROM product_categories WHERE product_category_id = ? LIMIT 1",
				[categoryID]
			);

			if (rows.length == 0) {
				throw new Error("Category does not exist");
			}

			res.json({
				error: false,
				category: rows[0],
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
	fetchCategoriesForDataTable: async (req, res) => {
		//dataTable Server-Side parameters
		var columns = [
			"product_category_id",
			"product_category_name",
			"product_category_slug",
			"product_category_created_at",
			"product_category_status",
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

		const { status } = req.query;

		let query = "SELECT * FROM product_categories WHERE 1 = 1";
		const queryParams = [];

		if (status) {
			query += " AND product_category_status = ?";
			queryParams.push(status);
		}

		query += " ORDER BY product_category_id DESC";

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
					rtData[i].DT_RowId = rtData[i].product_category_id;
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
	updateCategory: async (req, res) => {
		const categoryID = req.params.id;
		const token = req.headers["x-access-token"];
		const myData = req.userDecodedData;
		const now = Math.floor(Date.now / 1000);
		const { product_category_name, product_category_status } = req.body;

		req.action = "UPDATE";
		req.activity = "Updated an existing product category";

		if (!product_category_name || !product_category_status) {
			res.json({
				error: true,
				message: "All fields are required",
			});
		} else if (myData.user_update_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You do not have enough rights to perform this operation. Please contact admin",
			});
		} else {
			const productCategorySlug = slugify(product_category_name);

			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM product_categories WHERE product_category_id = ? LIMIT 1",
					[categoryID]
				);

				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM product_categories WHERE product_category_slug = ? AND product_category_id != ? LIMIT 1",
					[productCategorySlug, categoryID]
				);

				if (rows.length == 0) {
					throw new Error("Product category does not exist");
				}

				if (rows1.length > 0) {
					throw new Error("Product category name already exist");
				}

				const category = rows[0];

				req.activity_details = {
					previous_product_category_name:
						category.product_category_name,
					previous_product_category_status:
						category.product_category_status,
					product_category_name,
					product_category_status,
				};

				let updateQuery =
					"UPDATE product_categories SET product_category_name = ?, product_category_slug = ?, product_category_status = ? WHERE product_category_id = ?";

				let updateQueryParams = [
					product_category_name,
					productCategorySlug,
					product_category_status,
					categoryID,
				];

				await util.promisify(connection.query).bind(connection)(
					updateQuery,
					updateQueryParams
				);

				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Product category updated successfully",
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
	deleteCategory: async (req, res) => {
		const myData = req.userDecodedData;
		const categoryID = req.params.id;
		const token = req.headers["x-access-token"];

		req.action = "DELETE";
		req.activity = "Deleted a product category";

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
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM product_categories WHERE product_category_id = ? LIMIT 1",
					[categoryID]
				);

				if (rows.length == 0) {
					throw new Error("Product category does not exist");
				}

				const category = rows[0];

				req.activity_details = category;

				await util.promisify(connection.query).bind(connection)(
					"DELETE FROM product_categories WHERE product_category_id = ?",
					[categoryID]
				);

				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Product category deleted successfully",
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
	createBrand: async (req, res) => {
		const token = req.headers["x-access-token"];
		const myData = req.userDecodedData;
		const now = Math.floor(Date.now() / 1000);
		const { product_brand_name } = req.body;

		req.action = "CREATE";
		req.activity = "Created a new product brand";

		if (!product_brand_name) {
			res.json({
				error: true,
				message: "Please provide a product brand name",
			});
		} else if (myData.user_write_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You have been denied access to perfom this action. Please contact admin",
			});
		} else {
			const productBrandSlug = slugify(product_brand_name);

			req.activity_details = req.body;

			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM product_brands WHERE product_brand_slug = ? LIMIT 1",
					[productBrandSlug]
				);

				if (rows.length > 0) {
					throw new Error("Product brand name already exists");
				}

				await util.promisify(connection.query).bind(connection)(
					"INSERT INTO product_brands (product_brand_name, product_brand_slug, product_brand_created_at) VALUES (?, ?, ?)",
					[product_brand_name, productBrandSlug, now]
				);

				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Product brand created successfully",
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
	findAllBrands: async (req, res) => {
		const rez = {};
		const { status } = req.query;
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);

		let query = "SELECT * FROM product_brands WHERE 1 = 1";
		const queryParams = [];

		if (status) {
			query += " AND product_brand_status = ?";
			queryParams.push(status);
		}

		query += " ORDER BY product_brand_id DESC";

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			const rows = await util
				.promisify(connection.query)
				.bind(connection)(query, queryParams);

			const brands = rows;

			rez.brands = brands;

			if (page >= 0 && limit) {
				let skip = page * limit;
				let numPages = Math.ceil(rows.length / limit);

				query += ` LIMIT ?, ?`;
				queryParams.push(skip);
				queryParams.push(limit);

				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(query, queryParams);

				rez.brands = rows1;

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
	findOneBrand: async (req, res) => {
		const brandID = req.params.id;

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			const rows = await util
				.promisify(connection.query)
				.bind(connection)(
				"SELECT * FROM product_brands WHERE product_brand_id = ? LIMIT 1",
				[brandID]
			);

			if (rows.length == 0) {
				throw new Error("Brand does not exist");
			}

			res.json({
				error: false,
				brand: rows[0],
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
	fetchBrandsForDataTable: async (req, res) => {
		//dataTable Server-Side parameters
		var columns = [
			"product_brand_id",
			"product_brand_name",
			"product_brand_slug",
			"product_brand_created_at",
			"product_brand_status",
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

		const { status } = req.query;

		let query = "SELECT * FROM product_brands WHERE 1 = 1";
		const queryParams = [];

		if (status) {
			query += " AND product_brand_status = ?";
			queryParams.push(status);
		}

		query += " ORDER BY product_brand_id DESC";

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
					rtData[i].DT_RowId = rtData[i].product_brand_id;
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
	updateBrand: async (req, res) => {
		const brandID = req.params.id;
		const token = req.headers["x-access-token"];
		const myData = req.userDecodedData;
		const now = Math.floor(Date.now / 1000);
		const { product_brand_name, product_brand_status } = req.body;

		req.action = "UPDATE";
		req.activity = "Updated an existing product brand";

		if (!product_brand_name || !product_brand_status) {
			res.json({
				error: true,
				message: "All fields are required",
			});
		} else if (myData.user_update_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You do not have enough rights to perform this operation. Please contact admin",
			});
		} else {
			const productBrandSlug = slugify(product_brand_name);

			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM product_brands WHERE product_brand_id = ? LIMIT 1",
					[brandID]
				);

				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM product_brands WHERE product_brand_slug = ? AND product_brand_id != ? LIMIT 1",
					[productBrandSlug, brandID]
				);

				if (rows.length == 0) {
					throw new Error("Product brand does not exist");
				}

				if (rows1.length > 0) {
					throw new Error("Product brand name already exist");
				}

				const brand = rows[0];

				req.activity_details = {
					previous_product_brand_name: brand.product_brand_name,
					previous_product_brand_status: brand.product_brand_status,
					product_brand_name,
					product_brand_status,
				};

				let updateQuery =
					"UPDATE product_brands SET product_brand_name = ?, product_brand_slug = ?, product_brand_status = ? WHERE product_brand_id = ?";

				let updateQueryParams = [
					product_brand_name,
					productBrandSlug,
					product_brand_status,
					brandID,
				];

				await util.promisify(connection.query).bind(connection)(
					updateQuery,
					updateQueryParams
				);

				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Product brand updated successfully",
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
	deleteBrand: async (req, res) => {
		const myData = req.userDecodedData;
		const brandID = req.params.id;
		const token = req.headers["x-access-token"];

		req.action = "DELETE";
		req.activity = "Deleted a product brand";

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
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM product_brands WHERE product_brand_id = ? LIMIT 1",
					[brandID]
				);

				if (rows.length == 0) {
					throw new Error("Product brand does not exist");
				}

				const brand = rows[0];

				req.activity_details = brand;

				await util.promisify(connection.query).bind(connection)(
					"DELETE FROM product_brands WHERE product_brand_id = ?",
					[brandID]
				);

				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Product brand deleted successfully",
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
	createProduct: async (req, res) => {
		const token = req.headers["x-access-token"];
		const myData = req.userDecodedData;
		const now = Math.floor(Date.now() / 1000);
		const {
			product_category_id,
			product_brand_id,
			product_name,
			product_cost_price,
			product_price,
			product_stock,
			product_measuring_units,
			product_reorder_level,
		} = req.body;

		const store_id =
			myData.user_role == "Admin"
				? myData.user_store_id
				: req.body.store_id;
		const product_expiry_date = !req.body.product_expiry_date
			? null
			: req.body.product_expiry_date;
		const product_expiry_time = !req.body.product_expiry_time
			? null
			: req.body.product_expiry_time;
		const product_expiry_discount_rate = !req.body
			.product_expiry_discount_rate
			? null
			: req.body.product_expiry_discount_rate;

		req.action = "CREATE";
		req.activity = "Created a new product";

		if (
			!store_id ||
			!product_category_id ||
			!product_brand_id ||
			!product_name ||
			!product_cost_price ||
			!product_price ||
			!product_stock ||
			!product_measuring_units ||
			!product_reorder_level
		) {
			res.json({
				error: true,
				message: "All fields are required",
			});
		} else if (myData.user_write_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You have been denied access to perfom this action. Please contact admin",
			});
		} else if (
			isNaN(product_cost_price) ||
			isNaN(product_price) ||
			isNaN(product_stock) ||
			isNaN(product_reorder_level)
		) {
			res.json({
				error: true,
				message: "Prices, stock and reorder level must be a number",
			});
		} else if (
			product_expiry_date &&
			(!product_expiry_discount_rate || !product_expiry_time)
		) {
			res.json({
				error: true,
				message:
					"Please provide a product expiry discount rate and expiry time",
			});
		} else if (
			product_expiry_time &&
			(!product_expiry_discount_rate || !product_expiry_date)
		) {
			res.json({
				error: true,
				message:
					"Please provide a product expiry discount rate and expiry date",
			});
		} else if (
			product_expiry_discount_rate &&
			(!product_expiry_time || !product_expiry_date)
		) {
			res.json({
				error: true,
				message: "Please provide a product expiry time and expiry date",
			});
		} else if (
			product_expiry_discount_rate &&
			isNaN(product_expiry_discount_rate)
		) {
			res.json({
				error: true,
				message: "Product expiry discount rate must be a number",
			});
		} else {
			const productSlug = slugify(product_name);

			req.activity_details = req.body;

			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM products WHERE product_slug = ? AND store_id = ? LIMIT 1",
					[productSlug, store_id]
				);

				if (rows.length > 0) {
					throw new Error("Product already exists");
				}

				const productExpiryDate =
					product_expiry_date && product_expiry_time
						? `${product_expiry_date} ${product_expiry_time}:00`
						: null;

				await util.promisify(connection.query).bind(connection)(
					"INSERT INTO products (store_id, product_category_id,product_brand_id, product_name, product_slug, product_cost_price, product_price, product_stock, product_measuring_units, product_reorder_level, product_created_at, product_expiry_date, product_expiry_discount_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
					[
						store_id,
						product_category_id,
						product_brand_id,
						product_name,
						productSlug,
						product_cost_price,
						product_price,
						product_stock,
						product_measuring_units,
						product_reorder_level,
						now,
						productExpiryDate,
						product_expiry_discount_rate,
					]
				);

				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Product created successfully",
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
	findAllProducts: async (req, res) => {
		const rez = {};
		const { store_id, category_id, brand_id, status } = req.query;
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);

		let query =
			"SELECT a.*, b.store_name, c.product_category_name, d.product_brand_name FROM products a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN product_categories c ON a.product_category_id = c.product_category_id LEFT JOIN product_brands d ON a.product_brand_id = d.product_brand_id WHERE 1 = 1";
		const queryParams = [];

		if (store_id) {
			query += " AND a.store_id = ?";
			queryParams.push(store_id);
		}

		if (category_id) {
			query += " AND a.product_category_id = ?";
			queryParams.push(category_id);
		}

		if (brand_id) {
			query += " AND a.product_brand_id = ?";
			queryParams.push(brand_id);
		}

		if (status) {
			query += " AND a.product_status = ?";
			queryParams.push(status);
		}

		query += " ORDER BY a.product_id DESC";

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			const rows = await util
				.promisify(connection.query)
				.bind(connection)(query, queryParams);

			const products = rows;

			rez.products = products;

			if (page >= 0 && limit) {
				let skip = page * limit;
				let numPages = Math.ceil(rows.length / limit);

				query += ` LIMIT ?, ?`;
				queryParams.push(skip);
				queryParams.push(limit);

				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(query, queryParams);

				rez.products = rows1;

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
	findOneProduct: async (req, res) => {
		const productID = req.params.id;

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			const rows = await util
				.promisify(connection.query)
				.bind(connection)(
				"SELECT a.*, b.store_name, c.product_category_name, d.product_brand_name FROM products a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN product_categories c ON a.product_category_id = c.product_category_id LEFT JOIN product_brands d ON a.product_brand_id = d.product_brand_id WHERE product_id = ? LIMIT 1",
				[productID]
			);

			if (rows.length == 0) {
				throw new Error("Product does not exist");
			}

			res.json({
				error: false,
				product: rows[0],
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
	fetchProductsForDataTable: async (req, res) => {
		//dataTable Server-Side parameters
		var columns = [
			"product_id",
			"store_name",
			"product_category_name",
			"product_brand_name",
			"product_name",
			"product_cost_price",
			"product_price",
			"product_stock",
			"product_reorder_level",
			"product_expiry_date",
			"product_expiry_discount_rate",
			"product_vat_rate",
			"product_discount_rate",
			"product_measuring_units",
			"product_created_at",
			"product_status",
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

		const { store_id, category_id, brand_id, status } = req.query;

		let query =
			"SELECT a.*, b.store_name, c.product_category_name, d.product_brand_name FROM products a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN product_categories c ON a.product_category_id = c.product_category_id LEFT JOIN product_brands d ON a.product_brand_id = d.product_brand_id WHERE 1 = 1";
		const queryParams = [];

		if (store_id) {
			query += " AND a.store_id = ?";
			queryParams.push(store_id);
		}

		if (category_id) {
			query += " AND a.product_category_id = ?";
			queryParams.push(category_id);
		}

		if (brand_id) {
			query += " AND a.product_brand_id = ?";
			queryParams.push(brand_id);
		}

		if (status) {
			query += " AND a.product_status = ?";
			queryParams.push(status);
		}

		query += " ORDER BY a.product_id DESC";

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
					rtData[i].DT_RowId = rtData[i].product_id;
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
	updateProduct: async (req, res) => {
		const productID = req.params.id;
		const token = req.headers["x-access-token"];
		const myData = req.userDecodedData;
		const now = Math.floor(Date.now / 1000);
		const {
			product_category_id,
			product_brand_id,
			product_name,
			product_cost_price,
			product_price,
			product_stock,
			product_measuring_units,
			product_reorder_level,
			product_vat_rate,
			product_discount_rate,
			product_status,
		} = req.body;

		const store_id =
			myData.user_role == "Admin"
				? myData.user_store_id
				: req.body.store_id;
		const product_expiry_date = !req.body.product_expiry_date
			? null
			: req.body.product_expiry_date;
		const product_expiry_time = !req.body.product_expiry_time
			? null
			: req.body.product_expiry_time;
		const product_expiry_discount_rate = !req.body
			.product_expiry_discount_rate
			? null
			: req.body.product_expiry_discount_rate;

		req.action = "UPDATE";
		req.activity = "Updated an existing product";

		if (
			!store_id ||
			!product_category_id ||
			!product_brand_id ||
			!product_name ||
			!product_cost_price ||
			!product_price ||
			!product_stock ||
			!product_measuring_units ||
			!product_reorder_level ||
			!product_status ||
			!product_vat_rate ||
			!product_discount_rate
		) {
			res.json({
				error: true,
				message: "Please fill all required fields",
			});
		} else if (myData.user_update_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You do not have enough rights to perform this operation. Please contact admin",
			});
		} else if (
			isNaN(product_cost_price) ||
			isNaN(product_price) ||
			isNaN(product_stock) ||
			isNaN(product_reorder_level) ||
			isNaN(product_vat_rate) ||
			isNaN(product_discount_rate)
		) {
			res.json({
				error: true,
				message:
					"Prices, Stock, Product VAT Rate, Product Discount Rate and Reorder Level must be numbers",
			});
		} else if (
			product_expiry_time &&
			(!product_expiry_discount_rate || !product_expiry_date)
		) {
			res.json({
				error: true,
				message:
					"Please provide a product expiry discount rate and expiry date",
			});
		} else if (
			product_expiry_discount_rate &&
			(!product_expiry_time || !product_expiry_date)
		) {
			res.json({
				error: true,
				message: "Please provide a product expiry time and expiry date",
			});
		} else if (
			product_expiry_discount_rate &&
			isNaN(product_expiry_discount_rate)
		) {
			res.json({
				error: true,
				message: "Product expiry discount rate must be a number",
			});
		} else {
			const productSlug = slugify(product_name);

			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT a.*, b.store_name, c.product_category_name, d.product_brand_name FROM products a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN product_categories c ON a.product_category_id = c.product_category_id LEFT JOIN product_brands d ON a.product_brand_id = d.product_brand_id WHERE product_id = ? LIMIT 1",
					[productID]
				);

				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM products WHERE product_slug = ? AND store_id = ? AND product_id != ? LIMIT 1",
					[productSlug, store_id, productID]
				);

				if (rows.length == 0) {
					throw new Error("Product does not exist");
				}

				if (rows1.length > 0) {
					throw new Error(
						"Product name already exist for the selected store"
					);
				}

				const product = rows[0];
				const productExpiryDate =
					product_expiry_date && product_expiry_time
						? `${product_expiry_date} ${product_expiry_time}:00`
						: null;

				req.activity_details = {
					previous_product_name: product.product_name,
					previous_product_cost_price: product.product_cost_price,
					previous_product_price: product.product_price,
					previous_product_stock: product.product_stock,
					previous_product_measuring_units:
						product.product_measuring_units,
					previous_product_reorder_level:
						product.product_reorder_level,
					previous_product_vat_rate: product.product_vat_rate,
					previous_product_discount_rate:
						product.product_discount_rate,
					previous_product_status: product.product_status,
					previous_product_store_name: product.store_name,
					previous_product_category_name:
						product.product_category_name,
					previous_product_brand_name: product.product_brand_name,
					previous_product_expiry_date: product.product_expiry_date,
					previous_product_expiry_discount_rate:
						product.product_expiry_discount_rate,
					store_id,
					product_category_id,
					product_brand_id,
					product_name,
					product_cost_price,
					product_price,
					product_stock,
					product_measuring_units,
					product_reorder_level,
					product_vat_rate,
					product_discount_rate,
					product_status,
					productExpiryDate,
					product_expiry_discount_rate,
				};

				let updateQuery = `
                        UPDATE products 
                        SET 
                            store_id = ?, 
                            product_category_id = ?, 
                            product_brand_id = ?, 
                            product_name = ?, 
                            product_slug = ?, 
                            product_cost_price = ?, 
                            product_price = ?, 
                            product_stock = ?, 
                            product_measuring_units = ?, 
                            product_reorder_level = ?, 
                            product_vat_rate = ?, 
                            product_discount_rate = ?, 
                            product_status = ?,
                            product_expiry_date = ?,
                            product_expiry_discount_rate = ?
                        WHERE product_id = ?`;

				let updateQueryParams = [
					store_id,
					product_category_id,
					product_brand_id,
					product_name,
					productSlug,
					product_cost_price,
					product_price,
					product_stock,
					product_measuring_units,
					product_reorder_level,
					product_vat_rate,
					product_discount_rate,
					product_status,
					productExpiryDate,
					product_expiry_discount_rate,
					productID,
				];

				await util.promisify(connection.query).bind(connection)(
					updateQuery,
					updateQueryParams
				);

				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Product updated successfully",
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
	returnProduct: async (req, res) => {
		const token = req.headers["x-access-token"];
		const myData = req.userDecodedData;
		const { qty, product_id } = req.body;

		req.action = "UPDATE";
		req.activity = `Updated an existing product. Returned ${qty} unit(s)`;

		if (!product_id || !qty) {
			res.json({
				error: true,
				message: "Please fill all required fields",
			});
		} else if (myData.user_update_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You do not have enough rights to perform this operation. Please contact admin",
			});
		} else if (isNaN(qty)) {
			res.json({
				error: true,
				message: "Quantity must be numbers",
			});
		} else {
			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				await util.promisify(connection.query).bind(connection)(
					`UPDATE products SET product_stock = product_stock + ${qty}`,
					[product_id]
				);

				req.activity_details = {
					product_id,
					quantity_returned: qty,
				};

				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Product Stock returned successfully",
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
	deleteProduct: async (req, res) => {
		const myData = req.userDecodedData;
		const productID = req.params.id;
		const token = req.headers["x-access-token"];

		req.action = "DELETE";
		req.activity = "Deleted a product";

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
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT a.*, b.store_name, c.product_category_name, d.product_brand_name FROM products a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN product_categories c ON a.product_category_id = c.product_category_id LEFT JOIN product_brands d ON a.product_brand_id = d.product_brand_id WHERE product_id = ? LIMIT 1",
					[productID]
				);

				if (rows.length == 0) {
					throw new Error("Product does not exist");
				}

				const product = rows[0];

				req.activity_details = product;

				await util.promisify(connection.query).bind(connection)(
					"DELETE FROM products WHERE product_id = ?",
					[productID]
				);

				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Product deleted successfully",
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
	getProductFinancialReport: async (req, res) => {
		const rez = {};
		const { product_id, starting_date, ending_date } = req.query;

		if (!product_id || !starting_date || !ending_date) {
			res.json({
				error: true,
				message:
					"Please provide a product, starting date & ending date",
			});
		} else {
			const startTimestamp = moment(starting_date, "YYYY-MM-DD").unix();
			const endTimestamp =
				moment(ending_date, "YYYY-MM-DD").unix() + 86399;

			let query =
				"SELECT SUM(invoice_product_qty) AS tqty, SUM(cost_price) AS tcp, SUM(selling_price) AS tsp, SUM(invoice_product_vat) AS tvat, SUM(invoice_product_discount) AS td FROM (SELECT (invoice_product_unit_cost_price * invoice_product_qty) AS cost_price, (invoice_product_unit_price * invoice_product_qty) AS selling_price, invoice_product_qty, invoice_product_vat, invoice_product_discount FROM invoice_items WHERE invoice_product_id = ? AND invoice_product_timestamp BETWEEN ? AND ?)X";
			const queryParams = [product_id, startTimestamp, endTimestamp];

			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(query, queryParams);

				res.json({
					error: false,
					data: rows[0],
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
};
