module.exports = {
	home: async (req, res) => {
		res.render("index", { title: "IStock - Home" });
	},
	login: async (req, res) => {
		res.render("login", { title: "IStock - Sign In" });
	},

	/* SUPER ADMIN */
	saHome: async (req, res) => {
		res.render("sa/dashboard", {
			title: "iStock - Dashboard",
		});
	},
	saBrands: async (req, res) => {
		res.render("sa/brands", {
			title: "iStock - Brands",
		});
	},
	saCategories: async (req, res) => {
		res.render("sa/categories", {
			title: "iStock - Categories",
		});
	},
	saStores: async (req, res) => {
		res.render("sa/stores", {
			title: "iStock - Stores",
		});
	},
	saUsers: async (req, res) => {
		res.render("sa/users", {
			title: "iStock - Users",
		});
	},
	saActivityLog: async (req, res) => {
		res.render("sa/activity-log", {
			title: "iStock - Activity Log",
		});
	},
	saProducts: async (req, res) => {
		res.render("sa/products", {
			title: "iStock - Products",
		});
	},
	saSales: async (req, res) => {
		res.render("sa/sales", {
			title: "iStock - Sales",
		});
	},
	saPurchases: async (req, res) => {
		res.render("sa/purchases", {
			title: "iStock - Purchases",
		});
	},
	saTransactions: async (req, res) => {
		res.render("sa/transactions", {
			title: "iStock - Transactions",
		});
	},
	saAccount: async (req, res) => {
		res.render("sa/account", {
			title: "iStock - My Account",
		});
	},

	/* ADMIN */
	adminHome: async (req, res) => {
		res.render("admin/dashboard", {
			title: "iStock - Admin Dashboard",
		});
	},
	adminUsers: async (req, res) => {
		res.render("admin/users", {
			title: "iStock - Users",
		});
	},
	adminActivityLog: async (req, res) => {
		res.render("admin/activity-log", {
			title: "iStock - Activity Log",
		});
	},
	adminProducts: async (req, res) => {
		res.render("admin/products", {
			title: "iStock - Products",
		});
	},
	adminSales: async (req, res) => {
		res.render("admin/sales", {
			title: "iStock - Sales",
		});
	},
	adminPurchases: async (req, res) => {
		res.render("admin/purchases", {
			title: "iStock - Purchases",
		});
	},
	adminTransactions: async (req, res) => {
		res.render("admin/transactions", {
			title: "iStock - Transactions",
		});
	},
	adminAccount: async (req, res) => {
		res.render("admin/account", {
			title: "iStock - My Account",
		});
	},

	/* CASHIER */
	cashierHome: async (req, res) => {
		res.render("cashier/dashboard", {
			title: "iStock - Cashier Dashboard",
		});
	},
	cashierSales: async (req, res) => {
		res.render("cashier/sales", {
			title: "iStock - Cashier Sales",
		});
	},
	cashierAccount: async (req, res) => {
		res.render("cashier/account", {
			title: "iStock - Cashier Account",
		});
	},
};
