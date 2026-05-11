export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  const { name, email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': process.env.SUPABASE_ANON_KEY },
      body: JSON.stringify({ email, password, data: { full_name: name } })
    })
    const data = await response.json()
    if (data.user || data.id) {
      return res.status(200).json({ success: true, user: { email, name } })
    } else {
      return res.status(400).json({ error: data.msg || 'Signup failed. Email may already be registered.' })
    }
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
