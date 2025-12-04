const pool = require("../config/db");

module.exports = {
  create: async (data) => {
    const sql = `INSERT INTO appointments
      (patient_id, staff_id, clinic_id, appointment_time, appointment_type, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await pool.query(sql, [
      data.patient_id,
      data.staff_id,
      data.clinic_id,
      data.appointment_time,
      data.appointment_type,
      data.status || "scheduled",
      data.notes
    ]);

    return { appointment_id: result.insertId, ...data };
  },

  findAll: async () => {
    const [rows] = await pool.query(`SELECT * FROM appointments ORDER BY appointment_id DESC`);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(`SELECT * FROM appointments WHERE appointment_id = ?`, [id]);
    return rows[0];
  },

  update: async (id, fields) => {
    const sql = `UPDATE appointments SET ? WHERE appointment_id = ?`;
    const [result] = await pool.query(sql, [fields, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query(`DELETE FROM appointments WHERE appointment_id = ?`, [id]);
    return result.affectedRows;
  }
};
