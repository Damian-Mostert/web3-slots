import mongoose from "mongoose";

// Define the schema
const addressSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    spins:{
        type: Number,
        default:0,
        required:true
    },
    balance:{
        type: Number,
        default:0,
        required:true
    }
});



// Export the model
export default mongoose.models.Address || mongoose.model("Address", addressSchema);
