"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AuthMiddleware: () => AuthMiddleware,
  MysqlSessionModel: () => MysqlSessionModel,
  MysqlUserModel: () => MysqlUserModel,
  SessionRepositoryMysql: () => SessionRepositoryMysql,
  UserManagementModel: () => UserManagementModel,
  UserRepositoryMysql: () => UserRepositoryMysql,
  sequelize: () => sequelize
});
module.exports = __toCommonJS(src_exports);

// src/infrastructure/middlewares/auth.middleware.ts
var import_dayjs = __toESM(require("dayjs"));
var jwt = __toESM(require("jsonwebtoken"));
var AuthMiddleware = () => ({
  before(request) {
    const authHeader = request.event.headers.Authorization || request.event.headers.authorization;
    if (!authHeader) {
      throw new Error("Unauthorized: No token provided");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized: Invalid token format");
    }
    const payload = jwt.decode(token);
    if (!payload) {
      throw new Error("Unauthorized: Invalid token");
    }
    if (payload.exp && payload.exp < (0, import_dayjs.default)().unix())
      throw new Error("Unauthorized: Token expired");
    request.user = payload;
  },
  after(request) {
  },
  onError(request) {
    return {
      statusCode: request.error.statusCode || 500,
      body: JSON.stringify({
        error: request.error.message || "Internal Server Error"
      })
    };
  }
});

// src/infrastructure/mongo/connection.ts
var import_mongoose = __toESM(require("mongoose"));
import_mongoose.default.connect(process.env.MONGO_URI);

// src/infrastructure/mongo/model/user.ts
var import_mongoose2 = __toESM(require("mongoose"));
var UserManagementSchema = new import_mongoose2.default.Schema({
  user_id: String
});
var UserManagementModel = import_mongoose2.default.model("UserManagement", UserManagementSchema, "user_management");

// src/infrastructure/mysql/connection.ts
var import_sequelize = require("sequelize");
var sequelize = new import_sequelize.Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
sequelize.authenticate().then(async () => {
  await sequelize.sync({ force: false });
  console.log("Connection has been established successfully.");
}).catch((err) => {
  console.error("Unable to connect to the database:", err);
});

// src/infrastructure/mysql/models/session.ts
var import_sequelize2 = require("sequelize");
var MysqlSessionModel = sequelize.define("session", {
  id: {
    type: import_sequelize2.DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  ip_address: {
    type: import_sequelize2.DataTypes.STRING(45),
    allowNull: false
  },
  user_id: {
    type: import_sequelize2.DataTypes.STRING(36),
    allowNull: false
  },
  login_date: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  },
  logout_date: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "sessions",
  timestamps: true,
  underscored: true
});

// src/infrastructure/mysql/models/user.ts
var import_sequelize3 = require("sequelize");
var MysqlUserModel = sequelize.define("User", {
  id: {
    type: import_sequelize3.DataTypes.STRING(45),
    primaryKey: true,
    allowNull: false
  },
  id_type: {
    type: import_sequelize3.DataTypes.STRING(45),
    allowNull: false
  },
  id_number: {
    type: import_sequelize3.DataTypes.STRING(45),
    allowNull: false
  },
  names: {
    type: import_sequelize3.DataTypes.STRING(45),
    allowNull: false
  },
  last_names: {
    type: import_sequelize3.DataTypes.STRING(45),
    allowNull: false
  },
  email: {
    type: import_sequelize3.DataTypes.STRING(45),
    allowNull: false
  },
  password: {
    type: import_sequelize3.DataTypes.STRING(255),
    allowNull: false
  },
  temp_password: {
    type: import_sequelize3.DataTypes.BOOLEAN,
    allowNull: false
  },
  phone: {
    type: import_sequelize3.DataTypes.STRING(45),
    allowNull: false
  },
  gender: {
    type: import_sequelize3.DataTypes.STRING(45),
    allowNull: false
  },
  address: {
    type: import_sequelize3.DataTypes.STRING(255),
    allowNull: false
  },
  wrong_login_attempts: {
    type: import_sequelize3.DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: import_sequelize3.DataTypes.INTEGER,
    allowNull: false
  },
  role: {
    type: import_sequelize3.DataTypes.STRING(45),
    allowNull: false
  }
}, {
  timestamps: true,
  deletedAt: "deleted_at",
  createdAt: "created_at",
  updatedAt: "updated_at",
  tableName: "users"
});

// src/infrastructure/mysql/repositories/sessionRepository.ts
var import_sequelize4 = require("sequelize");
var SessionRepositoryMysql = class {
  async checkLastOpenSession(user_id) {
    const session = await MysqlSessionModel.findOne({
      where: {
        user_id,
        logout_date: null,
        login_date: {
          [import_sequelize4.Op.lt]: Date.now()
        }
      }
    });
    return session ? session.toJSON() : null;
  }
  async updateSession(id) {
    const session = await MysqlSessionModel.findOne({
      where: {
        user_id: id,
        logout_date: null,
        login_date: {
          [import_sequelize4.Op.lt]: Date.now()
        }
      },
      order: [["login_date", "DESC"]],
      limit: 1
    });
    if (!session)
      throw new Error("Session not found or already logged out");
    session.dataValues.logout_date = new Date(Date.now());
    await session.save();
  }
};

// src/infrastructure/mysql/repositories/userRepository.ts
var import_sequelize5 = require("sequelize");
var UserRepositoryMysql = class {
  async getUserByUsername(username) {
    const user = await MysqlUserModel.findOne({
      where: {
        [import_sequelize5.Op.or]: [
          { email: username },
          { id_number: username }
        ]
      }
    });
    return user ? user.toJSON() : null;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthMiddleware,
  MysqlSessionModel,
  MysqlUserModel,
  SessionRepositoryMysql,
  UserManagementModel,
  UserRepositoryMysql,
  sequelize
});
