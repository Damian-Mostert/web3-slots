import mongoose from "mongoose";

// Define the schema
const configSchema = new mongoose.Schema({
    prizes:{
        banana: Array,
        seven: Array,
        cherry: Array,
        plum: Array,
        orange: Array,
        bell: Array,
        bar: Array,
        lemon: Array,
        melon: Array
    }
});

export default mongoose.models.Config || mongoose.model("Config", configSchema);
