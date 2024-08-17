import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true
        },
        password: String
    }
)

export const User = mongoose.model('user', UserSchema)