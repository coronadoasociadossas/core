// src/infrastructure/middlewares/auth.middleware.ts
import dayjs from "dayjs";
import * as jwt from "jsonwebtoken";
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
    if (payload.exp && payload.exp < dayjs().unix())
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
import mongoose from "mongoose";
mongoose.connect(process.env.MONGO_URI);

// src/infrastructure/mongo/model/user.ts
import mongoose2 from "mongoose";
var UserManagementSchema = new mongoose2.Schema({
  user_id: String
});
var UserManagementModel = mongoose2.model("UserManagement", UserManagementSchema, "user_management");

// src/infrastructure/mysql/connection.ts
import { Sequelize } from "sequelize";
var sequelize = new Sequelize({
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
import { DataTypes } from "sequelize";
var MysqlSessionModel = sequelize.define("session", {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(36),
    allowNull: false
  },
  login_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  logout_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "sessions",
  timestamps: true,
  underscored: true
});

// src/infrastructure/mysql/models/user.ts
import { DataTypes as DataTypes2 } from "sequelize";
var MysqlUserModel = sequelize.define("User", {
  id: {
    type: DataTypes2.STRING(45),
    primaryKey: true,
    allowNull: false
  },
  id_type: {
    type: DataTypes2.STRING(45),
    allowNull: false
  },
  id_number: {
    type: DataTypes2.STRING(45),
    allowNull: false
  },
  names: {
    type: DataTypes2.STRING(45),
    allowNull: false
  },
  last_names: {
    type: DataTypes2.STRING(45),
    allowNull: false
  },
  email: {
    type: DataTypes2.STRING(45),
    allowNull: false
  },
  password: {
    type: DataTypes2.STRING(255),
    allowNull: false
  },
  temp_password: {
    type: DataTypes2.BOOLEAN,
    allowNull: false
  },
  phone: {
    type: DataTypes2.STRING(45),
    allowNull: false
  },
  gender: {
    type: DataTypes2.STRING(45),
    allowNull: false
  },
  address: {
    type: DataTypes2.STRING(255),
    allowNull: false
  },
  wrong_login_attempts: {
    type: DataTypes2.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes2.INTEGER,
    allowNull: false
  },
  role: {
    type: DataTypes2.STRING(45),
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
import { Op } from "sequelize";
var SessionRepositoryMysql = class {
  async checkLastOpenSession(user_id) {
    const session = await MysqlSessionModel.findOne({
      where: {
        user_id,
        logout_date: null,
        login_date: {
          [Op.lt]: Date.now()
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
          [Op.lt]: Date.now()
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
import { Op as Op2 } from "sequelize";
var UserRepositoryMysql = class {
  async getUserByUsername(username) {
    const user = await MysqlUserModel.findOne({
      where: {
        [Op2.or]: [
          { email: username },
          { id_number: username }
        ]
      }
    });
    return user ? user.toJSON() : null;
  }
};
export {
  AuthMiddleware,
  MysqlSessionModel,
  MysqlUserModel,
  SessionRepositoryMysql,
  UserManagementModel,
  UserRepositoryMysql,
  sequelize
};
