import mongoose from "mongoose";

export interface UserManagement {
    user_id: string;
}

const UserManagementSchema = new mongoose.Schema({
    user_id: String,

})

export const UserManagementModel = mongoose.model<UserManagement>("UserManagement", UserManagementSchema, "user_management");

