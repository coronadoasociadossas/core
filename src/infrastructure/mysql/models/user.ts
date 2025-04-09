 import { sequelize } from "@/infrastructure/mysql/connection";
import { DataTypes } from "sequelize";


export const MysqlUserModel = sequelize.define("User", {
    id: {
        type: DataTypes.STRING(45),
        primaryKey: true,
        allowNull: false,
    },
    id_type: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    id_number: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    names: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    last_names: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    temp_password: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    wrong_login_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },

}, {
    timestamps: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'users',
})