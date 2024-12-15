import mongoose from "mongoose";
import bcrypt from "bcrypt";
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
});

// Hash the password before saving
addressSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Export the model
export default mongoose.models.Address || mongoose.model("Address", addressSchema);
