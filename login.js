export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': process.env.SUPABASE_ANON_KEY },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (data.access_token) {
      return res.status(200).json({ success: true, user: { email, id: data.user?.id }, token: data.access_token })
    } else {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
