const pool = require("../config/db");

module.exports = {
  add: async (data) => {
    const sql = `INSERT INTO queue 
      (patient_id, clinic_id, queue_number, source, status, assigned_staff_id, arrived_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())`;

    const [result] = await pool.query(sql, [
      data.patient_id,
      data.clinic_id,
      data.queue_number,
      data.source,
      data.status || "waiting",
      data.assigned_staff_id || null
    ]);

    return { queue_id: result.insertId, ...data };
  },

  findAll: async () => {
    const [rows] = await pool.query(`
      SELECT q.*, 
             p.first_name, p.middle_name, p.last_name
      FROM queue q
      JOIN patients p ON q.patient_id = p.patient_id
      WHERE q.status != 'completed'
      ORDER BY q.queue_id ASC
    `);
    return rows;
  },

  callPatient: async (id) => {
    const sql = `UPDATE queue 
                 SET status='called', called_at=NOW() 
                 WHERE queue_id=?`;
    const [r] = await pool.query(sql, [id]);
    return r.affectedRows;
  },

  startService: async (id, staffId) => {
    const sql = `UPDATE queue 
                 SET status='in_service', assigned_staff_id=?, called_at=NOW()
                 WHERE queue_id=?`;
    const [r] = await pool.query(sql, [staffId, id]);
    return r.affectedRows;
  },

  complete: async (id) => {
    const sql = `UPDATE queue 
                 SET status='completed', completed_at=NOW()
                 WHERE queue_id=?`;
    const [r] = await pool.query(sql, [id]);
    return r.affectedRows;
  }
};
