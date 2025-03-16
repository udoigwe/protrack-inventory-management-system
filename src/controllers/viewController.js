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
	adminAccount: async (req, res) => {
		res.render("admin/account", {
			title: "Protrack - My Account",
		});
	},

	/* CASHIER */
};
