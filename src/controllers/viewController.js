module.exports = {
	home: async (req, res) => {
		res.render("index", { title: "Protrack - Home" });
	},
	login: async (req, res) => {
		res.render("login", { title: "Protrack - Sign In" });
	},

	/* SUPER ADMIN */
	saHome: async (req, res) => {
		res.render("sa/dashboard", {
			title: "Protrack - Dashboard",
		});
	},
	saBrands: async (req, res) => {
		res.render("sa/brands", {
			title: "Protrack - Brands",
		});
	},
	saCategories: async (req, res) => {
		res.render("sa/categories", {
			title: "Protrack - Categories",
		});
	},
	saStores: async (req, res) => {
		res.render("sa/stores", {
			title: "Protrack - Stores",
		});
	},
	saUsers: async (req, res) => {
		res.render("sa/users", {
			title: "Protrack - Users",
		});
	},
	saActivityLog: async (req, res) => {
		res.render("sa/activity-log", {
			title: "Protrack - Activity Log",
		});
	},
	saProducts: async (req, res) => {
		res.render("sa/products", {
			title: "Protrack - Products",
		});
	},
	saSales: async (req, res) => {
		res.render("sa/sales", {
			title: "Protrack - Sales",
		});
	},
	saPurchases: async (req, res) => {
		res.render("sa/purchases", {
			title: "Protrack - Purchases",
		});
	},
	saTransactions: async (req, res) => {
		res.render("sa/transactions", {
			title: "Protrack - Transactions",
		});
	},
	saAccount: async (req, res) => {
		res.render("sa/account", {
			title: "Protrack - My Account",
		});
	},

	/* ADMIN */
	adminHome: async (req, res) => {
		res.render("admin/dashboard", {
			title: "Protrack - Admin Dashboard",
		});
	},
	adminUsers: async (req, res) => {
		res.render("admin/users", {
			title: "Protrack - Users",
		});
	},
	adminActivityLog: async (req, res) => {
		res.render("admin/activity-log", {
			title: "Protrack - Activity Log",
		});
	},
	adminProducts: async (req, res) => {
		res.render("admin/products", {
			title: "Protrack - Products",
		});
	},
	adminSales: async (req, res) => {
		res.render("admin/sales", {
			title: "Protrack - Sales",
		});
	},
	adminPurchases: async (req, res) => {
		res.render("admin/purchases", {
			title: "Protrack - Purchases",
		});
	},
	adminTransactions: async (req, res) => {
		res.render("admin/transactions", {
			title: "Protrack - Transactions",
		});
	},
	adminAccount: async (req, res) => {
		res.render("admin/account", {
			title: "Protrack - My Account",
		});
	},

	/* CASHIER */
	cashierHome: async (req, res) => {
		res.render("cashier/dashboard", {
			title: "Protrack - Cashier Dashboard",
		});
	},
	cashierProducts: async (req, res) => {
		res.render("cashier/products", {
			title: "Protrack - Products",
		});
	},
	cashierSales: async (req, res) => {
		res.render("cashier/sales", {
			title: "Protrack - Cashier Sales",
		});
	},
	cashierAccount: async (req, res) => {
		res.render("cashier/account", {
			title: "Protrack - Cashier Account",
		});
	},
};
