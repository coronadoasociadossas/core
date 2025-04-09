import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { Session } from "@/domain/models/session";


export const MysqlSessionModel = sequelize.define<Model<Session>>("session", {
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false,
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    login_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    logout_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },

}, {
    tableName: "sessions",
    timestamps: true,
    underscored: true,
})