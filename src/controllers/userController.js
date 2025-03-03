const db = require("../utils/dbConfig");
const util = require("util");
const moment = require("moment");
const fs = require("fs");
const CryptoJS = require("crypto-js");
const {
  validateLeadingZeros,
  validateEmail,
  logActivity,
} = require("../utils/functions");

module.exports = {
  create: async (req, res) => {
    const token = req.headers["x-access-token"];
    const myData = req.userDecodedData;
    const now = Math.floor(Date.now() / 1000);
    const {
      user_firstname,
      user_lastname,
      user_gender,
      user_email,
      user_phone,
      user_role,
      password,
    } = req.body;

    const store_id =
      myData.user_role == "Admin"
        ? myData.user_store_id
        : user_role !== "Super Admin"
        ? req.body.store_id
        : null;

    req.action = "CREATE";
    req.activity = "Created a new User";

    if (
      !user_firstname ||
      !user_lastname ||
      !user_gender ||
      !user_email ||
      !user_phone ||
      !user_role ||
      !password
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
    } else if (user_role !== "Super Admin" && !store_id) {
      res.json({
        error: true,
        message: "The current user role requires a store",
      });
    } else if (!validateEmail(user_email)) {
      res.json({
        error: true,
        message: "Please provide a valid email addresss",
      });
    } else {
      const encPassword = CryptoJS.AES.encrypt(
        password,
        process.env.CRYPTOJS_SECRET
      ).toString();

      req.activity_details = req.body;

      const connection = await util.promisify(db.getConnection).bind(db)();

      try {
        const rows = await util.promisify(connection.query).bind(connection)(
          "SELECT * FROM users WHERE user_email = ? LIMIT 1",
          [user_email]
        );

        const rows1 = await util.promisify(connection.query).bind(connection)(
          "SELECT * FROM users WHERE user_phone = ? LIMIT 1",
          [user_phone]
        );

        if (rows.length > 0) {
          throw new Error("Preffered email address already exists");
        }

        if (rows1.length > 0) {
          throw new Error("Preffered phone number already exists");
        }

        await util.promisify(connection.query).bind(connection)(
          "INSERT INTO users (store_id, user_firstname, user_lastname, user_gender, user_email, user_phone, user_role, plain_password, enc_password, user_created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            store_id,
            user_firstname,
            user_lastname,
            user_gender,
            user_email,
            user_phone,
            user_role,
            password,
            encPassword,
            now,
          ]
        );

        await logActivity(token, req, connection);

        res.json({
          error: false,
          message: "User created successfully",
        });
      } catch (e) {
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
    const { store_id, user_role } = req.query;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    let query =
      "SELECT a.*, b.store_name FROM users a LEFT JOIN stores b ON a.store_id = b.store_id WHERE 1 = 1";
    const queryParams = [];

    if (user_role) {
      let rolesImploded = user_role.split(",").join("','");
      query += ` AND a.user_role IN ('${rolesImploded}')`;
    }

    if (store_id) {
      query += " AND a.store_id = ?";
      queryParams.push(store_id);
    }

    query += " ORDER BY a.user_id DESC";

    const connection = await util.promisify(db.getConnection).bind(db)();

    try {
      const rows = await util.promisify(connection.query).bind(connection)(
        query,
        queryParams
      );

      const users = rows;

      rez.users = users;

      if (page >= 0 && limit) {
        let skip = page * limit;
        let numPages = Math.ceil(rows.length / limit);

        query += ` LIMIT ?, ?`;
        queryParams.push(skip);
        queryParams.push(limit);

        const rows1 = await util.promisify(connection.query).bind(connection)(
          query,
          queryParams
        );

        rez.users = rows1;

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
    const userID = req.params.id;

    const connection = await util.promisify(db.getConnection).bind(db)();

    try {
      const rows = await util.promisify(connection.query).bind(connection)(
        "SELECT a.*, b.store_name FROM users a LEFT JOIN stores b ON a.store_id = b.store_id WHERE a.user_id = ? LIMIT 1",
        [userID]
      );

      if (rows.length == 0) {
        throw new Error("User does not exist");
      }

      res.json({
        error: false,
        user: rows[0],
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
      "user_id",
      "store_name",
      "user_firstname",
      "user_lastname",
      "user_role",
      "user_phone",
      "user_email",
      "user_created_at",
      "write_rights",
      "update_rights",
      "delete_rights",
      "login_rights",
      "last_login_timestamp",
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

    const { user_role, store_id } = req.query;

    let query =
      "SELECT a.*, b.store_name FROM users a LEFT JOIN stores b ON a.store_id = b.store_id WHERE 1 = 1";
    const queryParams = [];

    if (user_role) {
      query += " AND a.user_role = ?";
      queryParams.push(user_role);
    }

    if (store_id) {
      query += " AND a.store_id = ?";
      queryParams.push(store_id);
    }

    query += " ORDER BY a.user_id DESC";

    const connection = await util.promisify(db.getConnection).bind(db)();

    try {
      const rows = await util.promisify(connection.query).bind(connection)(
        query,
        queryParams
      );

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

        const rows1 = await util.promisify(connection.query).bind(connection)(
          `SELECT * FROM (${query})X ${where}`,
          queryParams
        );

        dNumRowsFiltered = rows1.length;
      } else {
        dNumRowsFiltered = dTNumRows;
      }

      const rows2 = await util.promisify(connection.query).bind(connection)(
        `SELECT ${columns} FROM (${query})X ${where} ORDER BY ${orderCol} ${orderDir} LIMIT ${length} OFFSET ${start}`,
        queryParams
      );

      if (rows2.length > 0) {
        var data = [];
        var rtData = rows2;

        for (var i = 0; i < rtData.length; i++) {
          rtData[i].DT_RowId = rtData[i].user_id;
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
  fetchUserActivitiesForDatatable: async (req, res) => {
    //dataTable Server-Side parameters
    var columns = [
      "activity_id",
      "userfullname",
      "store_name",
      "role",
      "action",
      "activity",
      "ip_address",
      "user_agent",
      "created_at",
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

    const myData = req.userDecodedData;
    const { user_id, store_id, start_time, end_time } = req.query;
    const rez = {};

    let query = "";
    const queryParams = [];

    if (myData.user_role == "Super Admin") {
      query +=
        "SELECT a.*, CONCAT(b.user_firstname,' ',b.user_lastname) AS userfullname, c.store_name FROM activity_log a LEFT JOIN users b ON a.user_id = b.user_id LEFT JOIN stores c ON b.store_id = c.store_id WHERE 1 = 1";
    }

    if (myData.user_role == "Admin") {
      query +=
        "SELECT a.*, CONCAT(b.user_firstname,' ',b.user_lastname) AS userfullname, c.store_name FROM activity_log a LEFT JOIN users b ON a.user_id = b.user_id INNER JOIN stores c ON b.store_id = c.store_id WHERE 1 = 1";
    }

    if (user_id) {
      query += ` AND a.user_id = ?`;
      queryParams.push(user_id);
    }

    if (store_id) {
      query += ` AND b.store_id = ?`;
      queryParams.push(store_id);
    }

    if (start_time) {
      let startTimestamp = moment(start_time, "YYYY-MM-DD").unix();
      query += ` AND CAST(a.created_at AS UNSIGNED) >= ?`;
      queryParams.push(startTimestamp);
    }

    if (end_time) {
      let endTimestamp = moment(end_time, "YYYY-MM-DD").unix() + 86399;
      query += ` AND CAST(a.created_at AS UNSIGNED) <= ?`;
      queryParams.push(endTimestamp);
    }

    const connection = await util.promisify(db.getConnection).bind(db)();

    try {
      //check total of rows in database
      const rows = await util.promisify(connection.query).bind(connection)(
        query,
        queryParams
      );

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

        //check filtered number of rows based on search
        const rows1 = await util.promisify(connection.query).bind(connection)(
          `SELECT * FROM (${query})X ${where}`,
          queryParams
        );

        dNumRowsFiltered = rows1.length;
      } else {
        dNumRowsFiltered = dTNumRows;
      }

      columns = columns.join(", ");

      const rows2 = await util.promisify(connection.query).bind(connection)(
        `SELECT ${columns} FROM (${query})X ${where} ORDER BY ${orderCol} ${orderDir} LIMIT ${length} OFFSET ${start}`,
        queryParams
      );

      if (rows2.length > 0) {
        var data = [];
        var rtData = rows2;

        for (var i = 0; i < rtData.length; i++) {
          rtData[i].DT_RowId = rtData[i].activity_id;
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
  findOneActivity: async (req, res) => {
    const activityID = req.params.id;

    const connection = await util.promisify(db.getConnection).bind(db)();

    try {
      const rows = await util.promisify(connection.query).bind(connection)(
        "SELECT a.*, CONCAT(b.user_firstname,' ',b.user_lastname) AS userfullname, c.store_name FROM activity_log a LEFT JOIN users b ON a.user_id = b.user_id LEFT JOIN stores c ON b.store_id = c.store_id WHERE a.activity_id = ? LIMIT 1",
        [activityID]
      );

      res.json({
        error: false,
        activity: rows[0],
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
  update: async (req, res) => {
    const userID = req.params.id;
    const token = req.headers["x-access-token"];
    const myData = req.userDecodedData;
    const now = Math.floor(Date.now / 1000);
    const {
      user_firstname,
      user_lastname,
      user_gender,
      user_email,
      user_phone,
      write_rights,
      update_rights,
      delete_rights,
      login_rights,
      user_role,
    } = req.body;

    const store_id =
      myData.user_role == "Admin"
        ? myData.user_store_id
        : user_role !== "Super Admin"
        ? req.body.store_id
        : null;

    req.action = "UPDATE";
    req.activity = "Updated an existing user";

    if (
      !user_firstname ||
      !user_lastname ||
      !user_gender ||
      !user_email ||
      !user_phone ||
      !write_rights ||
      !update_rights ||
      !delete_rights ||
      !login_rights ||
      !user_role
    ) {
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
    } else if (user_role !== "Super Admin" && !store_id) {
      res.json({
        error: true,
        message: "The current user role requires a store",
      });
    } else if (!validateEmail(user_email)) {
      res.json({
        error: true,
        message: "Please provide a valid email addresss",
      });
    } else {
      const connection = await util.promisify(db.getConnection).bind(db)();

      try {
        const rows = await util.promisify(connection.query).bind(connection)(
          "SELECT a.*, b.store_name FROM users a LEFT JOIN stores b ON a.store_id = b.store_id WHERE a.user_id = ? LIMIT 1",
          [userID]
        );

        if (rows.length == 0) {
          throw new Error("User does not exist");
        }

        const user = rows[0];

        req.activity_details = {
          previous_user_firstname: user.user_firstname,
          previous_user_lastname: user.user_lastname,
          previous_user_gender: user.user_gender,
          previous_user_email: user.user_email,
          previous_user_phone: user.user_phone,
          previous_user_store: user.store_name,
          previous_write_rights: user.write_rights,
          previous_update_rights: user.update_rights,
          previous_delete_rights: user.delete_rights,
          previous_login_rights: user.login_rights,
          previous_user_role: user.user_role,
          user_firstname,
          user_lastname,
          user_gender,
          user_email,
          user_phone,
          write_rights,
          update_rights,
          delete_rights,
          login_rights,
          user_role,
        };

        const rows1 = await util.promisify(connection.query).bind(connection)(
          "SELECT user_id FROM users WHERE user_email = ? AND user_id != ? LIMIT 1",
          [user_email, userID]
        );

        if (rows1.length > 0) {
          throw new Error("The preffered email address already exists");
        }

        const rows2 = await util.promisify(connection.query).bind(connection)(
          "SELECT user_id FROM users WHERE user_phone = ? AND user_id != ? LIMIT 1",
          [user_phone, userID]
        );

        if (rows2.length > 0) {
          throw new Error("The preffered phone number already exists");
        }

        let updateQuery =
          "UPDATE users SET store_id = ?, user_firstname = ?, user_lastname = ?, user_gender = ?, user_email = ?, user_phone = ?, user_role = ?, write_rights = ?, update_rights = ?, delete_rights = ?, login_rights = ? WHERE user_id = ?";

        let updateQueryParams = [
          store_id,
          user_firstname,
          user_lastname,
          user_gender,
          user_email,
          user_phone,
          user_role,
          write_rights,
          update_rights,
          delete_rights,
          login_rights,
          userID,
        ];

        await util.promisify(connection.query).bind(connection)(
          updateQuery,
          updateQueryParams
        );

        await logActivity(token, req, connection);

        res.json({
          error: false,
          message: "User updated successfully",
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
    const userID = req.params.id;
    const token = req.headers["x-access-token"];

    req.action = "DELETE";
    req.activity = "Deleted a User";

    if (myData.delete_rights == "Denied") {
      res.json({
        error: true,
        message:
          "Sorry!!! You have been denied rights to perform this action. Contact admin",
      });
    } else {
      const connection = await util.promisify(db.getConnection).bind(db)();

      try {
        const rows = await util.promisify(connection.query).bind(connection)(
          "SELECT a.*, b.store_name FROM users a LEFT JOIN stores b ON a.store_id = b.store_id WHERE a.user_id = ? LIMIT 1",
          [userID]
        );

        if (rows.length == 0) {
          throw new Error("User does not exist");
        }

        const user = rows[0];

        req.activity_details = user;

        await util.promisify(connection.query).bind(connection)(
          "DELETE FROM users WHERE user_id = ?",
          [userID]
        );

        await logActivity(token, req, connection);

        res.json({
          error: false,
          message: "User deleted successfully",
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
