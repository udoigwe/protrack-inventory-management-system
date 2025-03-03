const db = require("../utils/dbConfig");
const util = require("util");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { logActivity, slugify } = require("../utils/functions");

module.exports = {
  create: async (req, res) => {
    const token = req.headers["x-access-token"];
    const myData = req.userDecodedData;
    const now = Math.floor(Date.now() / 1000);
    const { store_name, store_address } = req.body;
    const uploadPath = "public/logos/";
    const acceptedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

    req.action = "CREATE";
    req.activity = "Created a new store";

    if (!store_name || !store_address) {
      res.json({
        error: true,
        message: "Please provide store name and address",
      });
    } else if (acceptedMimeTypes.indexOf(req.files.store_logo.mimetype) == -1) {
      res.json({
        error: true,
        message: "File attachment must be a jpg or png file",
      });
    } else if (req.files.store_logo.size > 1000000) {
      res.json({
        error: true,
        message: "File attachment must not be more than 1MB in size",
      });
    } else {
      const connection = await util.promisify(db.getConnection).bind(db)();

      const storeSlug = slugify(store_name);

      const file = req.files.store_logo;
      const filename = req.files.store_logo.name;
      const extensionPosition = filename.lastIndexOf(".");
      const extension = filename.substr(extensionPosition).toLowerCase();
      const newFileName = now + extension;

      req.activity_details = req.body;

      try {
        const rows = await util.promisify(connection.query).bind(connection)(
          "SELECT * FROM stores WHERE store_slug = ?",
          [storeSlug]
        );

        if (rows.length > 0) {
          throw new Error("Store already exists");
        }

        file.mv(uploadPath + newFileName, function (err) {
          if (err) {
            throw new Error(err);
          }
        });

        await util.promisify(connection.query).bind(connection)(
          "INSERT INTO stores (store_name, store_address, store_logo, store_slug, store_created_at) VALUES (?, ?, ?, ?, ?)",
          [store_name, store_address, newFileName, storeSlug, now]
        );

        await logActivity(token, req, connection);

        res.json({
          error: false,
          message: "Store created successfully",
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
    const { status } = req.query;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    let query = "SELECT * FROM stores WHERE 1 = 1";
    const queryParams = [];

    if (status) {
      query += " AND store_status = ?";
      queryParams.push(status);
    }

    //query += ` ORDER BY store_id DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

    query += ` ORDER BY store_id DESC`;

    const connection = await util.promisify(db.getConnection).bind(db)();

    try {
      const rows = await util.promisify(connection.query).bind(connection)(
        query,
        queryParams
      );

      const stores = rows;

      rez.stores = stores;

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

        rez.stores = rows1;

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
    const storeID = req.params.id;

    const connection = await util.promisify(db.getConnection).bind(db)();

    try {
      const rows = await util.promisify(connection.query).bind(connection)(
        "SELECT * FROM stores WHERE store_id = ? LIMIT 1",
        [storeID]
      );

      if (rows.length == 0) {
        throw new Error("Store does not exist");
      }

      res.json({
        error: false,
        store: rows[0],
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
      "store_id",
      "store_name",
      "store_slug",
      "store_address",
      "store_created_at",
      "store_status",
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

    let query = "SELECT * FROM stores WHERE 1 = 1";
    const queryParams = [];

    if (status) {
      query += " AND store_status = ?";
      queryParams.push(status);
    }

    query += " ORDER BY store_id DESC";

    const connection = await util.promisify(db.getConnection).bind(db)();

    try {
      const rows = await util.promisify(connection.query).bind(connection)(
        query,
        [queryParams]
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
          [queryParams]
        );

        dNumRowsFiltered = rows1.length;
      } else {
        dNumRowsFiltered = dTNumRows;
      }

      const rows2 = await util.promisify(connection.query).bind(connection)(
        `SELECT ${columns} FROM (${query})X ${where} ORDER BY ${orderCol} ${orderDir} LIMIT ${length} OFFSET ${start}`,
        [queryParams]
      );

      if (rows2.length > 0) {
        var data = [];
        var rtData = rows2;

        for (var i = 0; i < rtData.length; i++) {
          rtData[i].DT_RowId = rtData[i].store_id;
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
      console.log(e.message);
    } finally {
      connection.release();
    }
  },
  update: async (req, res) => {
    const storeID = req.params.id;
    const token = req.headers["x-access-token"];
    const myData = req.userDecodedData;
    const now = Math.floor(Date.now() / 1000);
    const { store_name, store_address, store_status } = req.body;
    const uploadPath = "public/logos/";

    req.action = "UPDATE";
    req.activity = "Updated an existing store";

    if (!store_name || !store_address || !store_status) {
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
    } else {
      const storeSlug = slugify(store_name);

      const connection = await util.promisify(db.getConnection).bind(db)();

      try {
        const rows = await util.promisify(connection.query).bind(connection)(
          "SELECT * FROM stores WHERE store_id = ? LIMIT 1",
          [storeID]
        );

        const rows1 = await util.promisify(connection.query).bind(connection)(
          "SELECT * FROM stores WHERE store_slug = ? AND store_id != ? LIMIT 1",
          [storeSlug, storeID]
        );

        if (rows.length == 0) {
          throw new Error("Store does not exist");
        }

        if (rows1.length > 0) {
          throw new Error("Store name already exists");
        }

        const store = rows[0];

        req.activity_details = {
          previous_store_name: store.store_name,
          previous_store_address: store.store_address,
          previous_store_status: store.store_status,
          store_name,
          store_address,
          store_status,
        };

        let updateQuery =
          "UPDATE stores SET store_name = ?, store_slug = ?, store_address = ?, store_status = ?";
        let updateQueryParams = [
          store_name,
          storeSlug,
          store_address,
          store_status,
        ];

        if (req.files) {
          const file = req.files.store_logo;
          const filename = req.files.store_logo.name;
          const extensionPosition = filename.lastIndexOf(".");
          const extension = filename.substr(extensionPosition).toLowerCase();
          const newFileName = now + extension;

          if (
            store.store_logo &&
            fs.existsSync(uploadPath + store.store_logo)
          ) {
            fs.unlink(uploadPath + store.store_logo, (err) => {
              if (err) {
                throw new Error(err);
              }
            });
          }

          file.mv(uploadPath + newFileName, function (err) {
            if (err) {
              throw new Error(err);
            }
          });

          updateQuery += `, store_logo = ?`;
          updateQueryParams.push(newFileName);
        }

        updateQuery += ` WHERE store_id = ?`;
        updateQueryParams.push(storeID);

        await util.promisify(connection.query).bind(connection)(
          updateQuery,
          updateQueryParams
        );

        await logActivity(token, req, connection);

        res.json({
          error: false,
          message: "Store updated successfully",
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
    const storeID = req.params.id;
    const token = req.headers["x-access-token"];

    req.action = "DELETE";
    req.activity = "Deleted a store";

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
          "SELECT * FROM stores WHERE store_id = ? LIMIT 1",
          [storeID]
        );

        if (rows.length == 0) {
          throw new Error("Store does not exist");
        }

        const store = rows[0];

        req.activity_details = store;

        await util.promisify(connection.query).bind(connection)(
          "DELETE FROM stores WHERE store_id = ?",
          [storeID]
        );

        await logActivity(token, req, connection);

        await util.promisify(connection.query).bind(connection)("COMMIT");

        res.json({
          error: false,
          message: "Store deleted successfully",
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
