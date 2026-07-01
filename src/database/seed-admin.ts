import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";

async function seedAdmin() {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/systems";
    await mongoose.connect(uri);

    const db = mongoose.connection.db!;
    const users = db.collection("users");

    const email = "admin@example.com";
    const existing = await users.findOne({ email });
    if (existing) {
        console.log(`Admin user "${email}" already exists`);
        await mongoose.disconnect();
        return;
    }

    const hashed = await bcrypt.hash("admin123", 10);
    await users.insertOne({
        firstName: "Admin",
        lastName: "User",
        email,
        password: hashed,
        role: "admin",
        status: "active",
        plan: "premium",
        avatar: { url: "", publicId: "" },
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    console.log(`Admin user created: ${email} / admin123`);
    await mongoose.disconnect();
}

seedAdmin().catch((err) => {
    console.error("Failed to seed admin:", err);
    process.exit(1);
});
