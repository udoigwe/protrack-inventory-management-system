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

	/* ADMIN */

	/* CASHIER */
};
