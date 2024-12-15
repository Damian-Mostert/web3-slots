import { Model, Schema } from "mongoose";

export default new Model("Spins",new Schema({
    user_id:String,
    amount:Number
}))