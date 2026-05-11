// api/chat.js — Vercel Serverless Function
// This is the REAL AI brain of SpeakAI
// Deploy to Vercel — it runs server-side so your API key is safe

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { message, language, languageName, systemPrompt, history = [], mode } = req.body

  if (!message || !language) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Build messages array with conversation history
    const messages = [
      // Include last 10 turns of history for context
      ...history.slice(-10).map(h => ({
        role: h.role,
        content: h.content
      })),
      // Current user message
      {
        role: 'user',
        content: message
      }
    ]

    // Remove the last message if it's already in history
    // (avoid duplication since we add it above)
    const cleanMessages = messages.filter((m, i) => {
      if (i === messages.length - 1) return true
      return !(m.role === 'user' && m.content === message)
    })

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: systemPrompt || `You are a helpful ${languageName} language tutor. Teach through natural conversation. Correct mistakes gently by incorporating the correct form in your response. Keep responses to 2-4 sentences.`,
        messages: cleanMessages
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Anthropic API error:', error)
      return res.status(500).json({ error: 'AI service error', details: error.error?.message })
    }

    const data = await response.json()
    const aiResponse = data.content[0]?.text || 'I did not quite catch that. Could you try again?'

    return res.status(200).json({
      success: true,
      response: aiResponse,
      usage: data.usage
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
}
