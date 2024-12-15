import { Model, Schema } from "mongoose";

export default new Model("config",new Schema({
    admin: String,
    prices:{
        banana: Number,
        seven: Number,
        cherry: Number,
        plum: Number,
        orange: Number,
        bell: Number,
        bar: Number,
        lemon: Number,
        melon: Number
    }
}))