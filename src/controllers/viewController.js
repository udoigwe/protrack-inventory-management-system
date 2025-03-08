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
	adminAccount: async (req, res) => {
		res.render("admin/account", {
			title: "iStock - My Account",
		});
	},

	/* CASHIER */
};
