const pool = require("../config/db");

module.exports = {
  create: async (data) => {
    const sql = `INSERT INTO patients
      (first_name, middle_name, last_name, university_id, external_id, gender, dob, contact, email, address, campus_id, registered_clinic_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await pool.query(sql, [
      data.first_name,
      data.middle_name,
      data.last_name,
      data.university_id,
      data.external_id,
      data.gender,
      data.dob,
      data.contact,
      data.email,
      data.address,
      data.campus_id,
      data.registered_clinic_id
    ]);

    return { patient_id: result.insertId, ...data };
  },

  findAll: async () => {
    const [rows] = await pool.query(`SELECT * FROM patients ORDER BY patient_id DESC`);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(`SELECT * FROM patients WHERE patient_id = ?`, [id]);
    return rows[0];
  },

  update: async (id, fields) => {
    const sql = `UPDATE patients SET ? WHERE patient_id = ?`;
    const [result] = await pool.query(sql, [fields, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query(`DELETE FROM patients WHERE patient_id = ?`, [id]);
    return result.affectedRows;
  }
};
