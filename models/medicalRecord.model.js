const pool = require("../config/db");

module.exports = {
  create: async (data) => {
    const sql = `
      INSERT INTO medical_records
      (patient_id, staff_id, clinic_id, visit_date, chief_complaint, diagnosis, vitals, procedures, treatment_plan, prescriptions, notes, follow_up_date, signed_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      data.patient_id,
      data.staff_id,
      data.clinic_id,
      data.visit_date,
      data.chief_complaint,
      data.diagnosis,
      data.vitals,
      data.procedures,
      data.treatment_plan,
      data.prescriptions,
      data.notes,
      data.follow_up_date,
      data.signed_by
    ]);

    return { record_id: result.insertId, ...data };
  },

  findByPatient: async (patient_id) => {
    const [rows] = await pool.query(
      `SELECT * FROM medical_records WHERE patient_id = ? ORDER BY visit_date DESC`,
      [patient_id]
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT * FROM medical_records WHERE record_id = ?`,
      [id]
    );
    return rows[0];
  },

  update: async (id, fields) => {
    const sql = `UPDATE medical_records SET ? WHERE record_id = ?`;
    const [result] = await pool.query(sql, [fields, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query(
      `DELETE FROM medical_records WHERE record_id = ?`,
      [id]
    );
    return result.affectedRows;
  }
};
