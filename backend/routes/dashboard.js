const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE assignee_id = $1) AS my_tasks,
        COUNT(*) FILTER (WHERE assignee_id = $1 AND status = 'done') AS completed,
        COUNT(*) FILTER (WHERE assignee_id = $1 AND status = 'in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE assignee_id = $1 AND status != 'done' AND due_date < CURRENT_DATE) AS overdue
      FROM tasks
    `, [req.user.id]);

    const recentTasks = await pool.query(`
      SELECT t.*, p.name AS project_name, u.name AS assignee_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assignee_id = u.id
      WHERE t.assignee_id = $1
      ORDER BY t.created_at DESC
      LIMIT 5
    `, [req.user.id]);

    res.json({ stats: stats.rows[0], recentTasks: recentTasks.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;