import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

async function initDatabase() {
  try {
    // Create database
    await db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log("✅ Database created or already exists");

    // Switch to database
    await db.query(`USE ${process.env.DB_NAME}`);

    // Create tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS departments (
        department_id INT AUTO_INCREMENT PRIMARY KEY,
        department_name VARCHAR(100) NOT NULL,
        description TEXT
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin','Doctor','Nurse','LabStaff','PharmacyStaff','Receptionist') NOT NULL,
        department_id INT,
        email VARCHAR(100),
        phone VARCHAR(20),
        status ENUM('Active','Inactive') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS patients (
        patient_id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        student_id VARCHAR(50),
        age INT,
        gender ENUM('Male','Female','Other'),
        contact VARCHAR(50),
        address VARCHAR(255),
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        registered_by INT,
        FOREIGN KEY (registered_by) REFERENCES users(user_id) ON DELETE SET NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        appointment_id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT,
        doctor_id INT,
        appointment_date DATETIME,
        status ENUM('Pending','Approved','Completed','Cancelled') DEFAULT 'Pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE SET NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS medical_records (
        record_id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT,
        diagnosis TEXT,
        treatment TEXT,
        visit_date DATE,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE SET NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS lab_tests (
        test_id INT AUTO_INCREMENT PRIMARY KEY,
        test_name VARCHAR(100) NOT NULL,
        description TEXT
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS lab_results (
        result_id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        test_id INT,
        requested_by INT,
        result TEXT,
        result_date DATE,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
        FOREIGN KEY (test_id) REFERENCES lab_tests(test_id) ON DELETE SET NULL,
        FOREIGN KEY (requested_by) REFERENCES users(user_id) ON DELETE SET NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS pharmacy (
        medicine_id INT AUTO_INCREMENT PRIMARY KEY,
        medicine_name VARCHAR(100) NOT NULL,
        stock INT DEFAULT 0,
        price DECIMAL(10,2),
        expiry_date DATE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS billing (
        bill_id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT,
        total_amount DECIMAL(10,2),
        payment_status ENUM('Pending','Paid') DEFAULT 'Pending',
        bill_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS referrals (
        referral_id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT,
        doctor_id INT,
        referred_to VARCHAR(255),
        reason TEXT,
        referral_date DATE,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE SET NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        message TEXT,
        recipient_role ENUM('All','Doctor','Nurse','Admin','LabStaff','PharmacyStaff'),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS system_logs (
        log_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_id INT AUTO_INCREMENT PRIMARY KEY,
        clinic_name VARCHAR(150),
        contact_info VARCHAR(255),
        address TEXT
      );
    `);

    console.log("✅ All tables created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database setup error:", error);
    process.exit(1);
  }
}

initDatabase();
