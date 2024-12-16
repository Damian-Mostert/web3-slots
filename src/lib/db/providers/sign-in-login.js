import bcrypt from "bcrypt";
import Address from "../models/address";
import verifyCaptcha from "./verify-recaptcha";

export default async function signInLogin({ address, password, captcha_value }) {
    if(!(await verifyCaptcha(captcha_value))){
        return {
            success: false,
            message: "Recaptcha validation failed",
        };
    }

    try {
        // Ensure address and password are provided
        if (!address || !password) {
            return {
                success: false,
                message: "Address and password are required.",
            };
        }

        // Check if address record exists
        const addressRecord = await Address.findOne({ value:address });

        // If no record exists, create a new account
        if (!addressRecord) {
            const hashedPassword = await bcrypt.hash(password,10);
            await Address.create({
                value:address,
                password:hashedPassword
            });
            return {
                success: true,
                message: "Account created successfully.",
            };
        }

        // If record exists, validate password
        const isPasswordValid = await bcrypt.compare(password, addressRecord.password);
        if (isPasswordValid) {
            return {
                success: true,
                message: "Login successful.",
            };
        }

        // Password is invalid
        return {
            success: false,
            message: "Invalid password.",
        };
    } catch (error) {
        console.error("Error in signInLogin:", error);
        return {
            success: false,
            message: "An error occurred. Please try again.",
        };
    }
}
