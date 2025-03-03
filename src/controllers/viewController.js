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

  /* ADMIN */

  /* CASHIER */
};
