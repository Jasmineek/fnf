const { createClient } = require('@supabase/supabase-js');

const client = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, attending, guests, coupleOrFamilyName, wishes } = req.body || {};
  if (!name || typeof attending !== 'boolean') return res.status(400).json({ error: 'Invalid RSVP' });
  const { error } = await client().from('rsvps').insert({
    name, attending, guest_count: attending ? guests : null,
    couple_or_family_name: attending ? coupleOrFamilyName || null : null,
    wishes: attending ? wishes || null : null
  });
  if (error) return res.status(500).json({ error: 'Could not save RSVP' });
  return res.status(201).json({ ok: true });
};
