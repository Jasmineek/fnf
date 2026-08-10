const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.ADMIN_DASHBOARD_PASSWORD || req.headers['x-admin-password'] !== process.env.ADMIN_DASHBOARD_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await db.from('rsvps').select('name, attending, guest_count, wishes, created_at').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: 'Could not read responses' });
  return res.status(200).json(data);
};
