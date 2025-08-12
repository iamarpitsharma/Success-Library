require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // safer on Windows
const Admin = require("../models/Admin"); // adjust path if needed

async function createAdmin() {
  try {
    // Make sure MONGO_URI exists
    if (!process.env.MONGO_URI) {
      throw new Error('❌ MONGO_URI is not set in .env');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const existingAdmin = await Admin.findOne({ email: 'admin@successlibrary.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('success@276205', 10);

    const admin = new Admin({
      name: 'Devbrat',
      email: 'admin@successlibrary.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@successlibrary.com');
    console.log('🔑 Password: success@276205');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
