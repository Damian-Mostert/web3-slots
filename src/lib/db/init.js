import mongoose from "mongoose";

var connected = false;

export default function Init(){
    if(connected)return;
    mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
    connected = true
}