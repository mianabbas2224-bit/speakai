// ── SPEAKAI MAIN JS ──
// Handles: navigation, demo chat, auth, conversation engine

// ── CONFIG ──
const CONFIG = {
  SUPABASE_URL: 'YOUR_SUPABASE_URL',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY',
  API_ENDPOINT: '/api/chat', // Vercel serverless function
}

// ── LANGUAGE DATA ──
const LANG_DATA = {
  ar: {
    name: 'Arabic', flag: '🇸🇦', code: 'ar',
    placeholder: 'Type your reply in Arabic...',
    greeting: 'مرحباً! I am your Arabic tutor. My name is Layla. I am here to help you learn Arabic through real conversation — not memorising vocabulary lists. Let us start simply. How do you say "good morning" in Arabic? Take a guess!',
    systemPrompt: `You are Layla, a warm and encouraging Arabic language tutor. You are a native Arabic speaker from Cairo, Egypt. You speak in a natural, conversational way.

Your teaching approach:
- Respond conversationally, keeping the dialogue flowing naturally
- When the user makes a grammar or vocabulary mistake, gently correct it by repeating the correct form in your response naturally, without explicitly saying "you made a mistake"
- Use Arabic script alongside romanisation when introducing new words (e.g., مرحباً - Marhaban)
- Ask follow-up questions to keep conversation going
- Adjust your vocabulary complexity to match the user's level
- Use cultural examples from Arab culture (food, customs, places)
- Be encouraging and patient — never condescending
- Keep responses conversational length (2-4 sentences usually)
- Occasionally use Arabic phrases naturally in your responses

Start at beginner level and gradually increase complexity based on user responses.`,
    msgs: [
      {ai: 'مرحباً! I am your Arabic tutor — my name is Layla. Let us start with something easy. How do you say <span class="hl">good morning</span> in Arabic? Take a guess!'},
      {u: 'Sabah al khayr?'},
      {ai: 'Excellent! <span class="hl">صباح الخير (Ṣabāḥ al-khayr)</span> — you got it perfectly! The reply is <span class="hl">صباح النور (Ṣabāḥ an-nūr)</span>, which means "morning of light." Shall we try a full greeting exchange?'}
    ]
  },
  zh: {
    name: 'Chinese', flag: '🇨🇳', code: 'zh',
    placeholder: 'Type your reply in Chinese...',
    greeting: '你好！I am Wei, your Mandarin tutor. Learning Chinese is one of the most rewarding things you can do. Let us start with something simple. How do you say "thank you" in Chinese?',
    systemPrompt: `You are Wei, a friendly and patient Mandarin Chinese tutor from Beijing. You make Chinese feel approachable and exciting.

Your teaching approach:
- Always show Chinese characters alongside pinyin: 谢谢 (xièxiè)
- Explain tones clearly but not obsessively — focus on communication first
- Use everyday practical examples (ordering food, meeting people, shopping)
- Correct mistakes gently by incorporating the correct form naturally
- Ask questions to keep the conversation active
- Reference Chinese culture, food, and customs naturally
- Keep responses to 2-4 sentences
- Build confidence — Chinese seems hard but becomes natural with practice`,
    msgs: [
      {ai: '你好！I am Wei, your Mandarin tutor. Let us start simple — how do you say <span class="hl">thank you</span> in Chinese?'},
      {u: 'Xie xie?'},
      {ai: 'Very good! <span class="hl">谢谢 (xièxiè)</span> — both syllables use a falling tone (4th tone). The formal version is <span class="hl">非常感谢 (fēicháng gǎnxiè)</span> — "thank you very much." Shall we practice a full greeting?'}
    ]
  },
  es: {
    name: 'Spanish', flag: '🇪🇸', code: 'es',
    placeholder: 'Type your reply in Spanish...',
    greeting: '¡Hola! I am Carlos, your Spanish tutor. Spanish is one of the most beautiful languages in the world — and one of the easiest for English speakers to pick up. Let us start. How would you introduce yourself in Spanish?',
    systemPrompt: `You are Carlos, an enthusiastic Spanish tutor from Madrid, Spain. You have a warm, encouraging teaching style.

Your teaching approach:
- Teach natural, conversational Spanish — not just textbook phrases
- Use ¡exclamation marks! appropriately for Spanish feel
- Correct errors naturally within your response without explicit correction
- Cover both formal (usted) and informal (tú) registers contextually
- Reference Spanish and Latin American culture
- Use practical scenarios: café, directions, meeting people
- Keep responses natural and conversational — 2-4 sentences
- Build real fluency through dialogue`,
    msgs: [
      {ai: '¡Hola! I am Carlos, your Spanish tutor. Let us start — how would you <span class="hl">introduce yourself</span> in Spanish?'},
      {u: 'Me llamo Ahmed.'},
      {ai: '¡Perfecto! "Me llamo Ahmed" is completely natural. Now add where you are from: <span class="hl">Soy de Pakistán</span> — "I am from Pakistan." Try combining both into one sentence!'}
    ]
  },
  fr: {
    name: 'French', flag: '🇫🇷', code: 'fr',
    placeholder: 'Type your reply in French...',
    greeting: 'Bonjour! I am Sophie, your French tutor. French is the language of culture, diplomacy, and romance — and it is more achievable than people think. Let us start with a practical situation. How do you order a coffee in a French café?',
    systemPrompt: `You are Sophie, a charming French tutor from Paris. You make French feel sophisticated yet accessible.

Your teaching approach:
- Teach both formal (vous) and informal (tu) naturally in context
- Highlight French-specific sounds and spelling patterns when relevant
- Use café, bakery, and everyday Parisian scenarios
- Correct errors by restating correctly within your natural response
- Reference French culture, cuisine, and customs
- Keep responses conversational — 2-4 sentences
- French has its own rhythm and musicality — convey that warmth`,
    msgs: [
      {ai: 'Bonjour! I am Sophie, your French tutor. Very practical first question — how do you order <span class="hl">a coffee</span> in a French café?'},
      {u: 'Je voudrais un cafe.'},
      {ai: 'Très bien! Almost perfect — just add the accent: <span class="hl">café</span>, not cafe. And add <span class="hl">s\'il vous plaît</span> to sound completely natural. Full sentence: "Je voudrais un café, s\'il vous plaît." Shall we try ordering food next?'}
    ]
  },
  ur: {
    name: 'Urdu', flag: '🇵🇰', code: 'ur',
    placeholder: 'Type your reply in Urdu...',
    greeting: 'آداب! I am Zara, your Urdu tutor. Urdu is one of the most poetic and beautiful languages in the world — it holds a special place in our hearts. Let us begin with a simple but important phrase. How do you say "how are you" in Urdu?',
    systemPrompt: `You are Zara, a warm and knowledgeable Urdu tutor from Lahore, Pakistan. You teach Urdu with pride and cultural depth.

Your teaching approach:
- Show Urdu script alongside romanisation: آپ کیسے ہیں؟ (Aap kaise hain?)
- Reference Pakistani culture, food, cricket, and everyday life
- Teach both formal (آپ - aap) and informal (تم - tum) registers in context
- Correct gently by including the correct form naturally in your response
- Build emotional connection — Urdu is rich with poetry and feeling
- Use common Pakistani expressions and proverbs where relevant
- Keep responses 2-4 sentences
- This is our home language — teach it with love and pride`,
    msgs: [
      {ai: 'آداب! I am Zara, your Urdu tutor. Let us begin — how do you say <span class="hl">how are you</span> in Urdu?'},
      {u: 'Aap kaise hain?'},
      {ai: 'شاباش! <span class="hl">آپ کیسے ہیں؟ (Aap kaise hain?)</span> is perfectly formal Urdu. The reply is <span class="hl">میں ٹھیک ہوں (Main theek hoon)</span> — "I am fine." Try the full exchange — greet me and I will reply!'}
    ]
  },
  en: {
    name: 'English', flag: '🇬🇧', code: 'en',
    placeholder: 'Type your reply in English...',
    greeting: 'Hello! I am James, your English tutor. Whether you want to improve your professional English, reduce your accent, or simply speak with more confidence — I am here to help. Let us start with a real scenario. How would you introduce yourself in a professional meeting?',
    systemPrompt: `You are James, a professional English language coach from London. You help non-native speakers build confidence and fluency.

Your teaching approach:
- Focus on natural, professional English that sounds genuine
- Correct grammar and vocabulary by incorporating the correct form naturally
- Cover both British and American expressions where relevant
- Use professional scenarios: meetings, emails, presentations, networking
- Work on natural sentence rhythm and intonation tips
- Teach idiomatic expressions that natives actually use
- Keep responses conversational and encouraging — 2-4 sentences
- Build speaking confidence, not just grammar knowledge`,
    msgs: [
      {ai: 'Hello! I am James, your English coach. Let us practice — how would you <span class="hl">introduce yourself</span> in a professional meeting?'},
      {u: 'My name is Ahmed and I work in technology.'},
      {ai: 'Good start! For a stronger impression, add your specific role: <span class="hl">"I\'m Ahmed, a software developer at [company]"</span> — specific details make you sound more confident and memorable. Shall we practice a full introduction?'}
    ]
  }
}

// ── CURRENT STATE ──
let currentLang = 'ar'
let replyIndex = 0
let conversationHistory = []
let isLoading = false

// ── DEMO CHAT (Homepage) ──
function switchLang(btn, lang) {
  document.querySelectorAll('.lt').forEach(t => t.classList.remove('active'))
  btn.classList.add('active')
  currentLang = lang
  replyIndex = 0
  conversationHistory = []
  const data = LANG_DATA[lang]
  const inp = document.getElementById('chatInput')
  if (inp) inp.placeholder = data.placeholder
  const body = document.getElementById('chatBody')
  if (!body) return
  body.innerHTML = ''
  data.msgs.forEach(m => {
    const div = document.createElement('div')
    if (m.ai) {
      div.className = 'msg'
      div.innerHTML = `<div class="msg-av ai-av">AI</div><div class="msg-bubble ai-bubble">${m.ai}</div>`
    } else {
      div.className = 'msg user-msg'
      div.innerHTML = `<div class="msg-av user-av">U</div><div class="msg-bubble user-bubble">${m.u}</div>`
    }
    body.appendChild(div)
  })
  body.scrollTop = body.scrollHeight
}

function sendDemoMessage() {
  const input = document.getElementById('chatInput')
  if (!input || isLoading) return
  const text = input.value.trim()
  if (!text) return
  const body = document.getElementById('chatBody')

  // Add user message
  const ud = document.createElement('div')
  ud.className = 'msg user-msg'
  ud.innerHTML = `<div class="msg-av user-av">U</div><div class="msg-bubble user-bubble">${escapeHtml(text)}</div>`
  body.appendChild(ud)

  // Show typing
  const typing = document.createElement('div')
  typing.className = 'msg'
  typing.id = 'demoTyping'
  typing.innerHTML = '<div class="msg-av ai-av">AI</div><div class="typing-ind"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div>'
  body.appendChild(typing)
  input.value = ''
  body.scrollTop = body.scrollHeight
  isLoading = true

  // Call real API
  callChatAPI(text, currentLang, 'demo').then(response => {
    const t = document.getElementById('demoTyping')
    if (t) t.remove()
    const ai = document.createElement('div')
    ai.className = 'msg'
    ai.innerHTML = `<div class="msg-av ai-av">AI</div><div class="msg-bubble ai-bubble">${response}</div>`
    body.appendChild(ai)
    body.scrollTop = body.scrollHeight
    isLoading = false
  }).catch(() => {
    const t = document.getElementById('demoTyping')
    if (t) t.remove()
    // Fallback responses
    const fallbacks = LANG_DATA[currentLang]
    const fb = [
      'Great effort! Keep practicing — every conversation makes you more fluent. What would you like to talk about next?',
      'You are progressing really well! Language learning is all about consistency. Shall we try a different scenario?',
      'Excellent! I can see your confidence growing. Let us continue with another topic to build your fluency further.'
    ]
    const ai = document.createElement('div')
    ai.className = 'msg'
    ai.innerHTML = `<div class="msg-av ai-av">AI</div><div class="msg-bubble ai-bubble">${fb[replyIndex % fb.length]}</div>`
    body.appendChild(ai)
    replyIndex++
    body.scrollTop = body.scrollHeight
    isLoading = false
  })
}

// ── REAL CONVERSATION ENGINE ──
async function callChatAPI(userMessage, lang, mode = 'full') {
  const langData = LANG_DATA[lang]
  conversationHistory.push({ role: 'user', content: userMessage })

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        language: lang,
        languageName: langData.name,
        systemPrompt: langData.systemPrompt,
        history: conversationHistory.slice(-10), // Last 10 turns
        mode: mode
      })
    })

    if (!response.ok) throw new Error('API error')
    const data = await response.json()
    const aiResponse = data.response

    conversationHistory.push({ role: 'assistant', content: aiResponse })
    return aiResponse
  } catch (error) {
    throw error
  }
}

// ── FULL CONVERSATION PAGE ──
let convLang = 'ar'
let convHistory = []
let convLoading = false

function initConversation() {
  const body = document.getElementById('convBody')
  if (!body) return

  // Get language from URL param
  const params = new URLSearchParams(window.location.search)
  const lang = params.get('lang') || 'ar'
  convLang = lang
  convHistory = []

  // Set active lang button
  document.querySelectorAll('.cls-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang)
  })

  // Update header
  const data = LANG_DATA[lang]
  const nameEl = document.getElementById('convLangName')
  const flagEl = document.getElementById('convLangFlag')
  if (nameEl) nameEl.textContent = data.name
  if (flagEl) flagEl.textContent = data.flag

  const inp = document.getElementById('convInput')
  if (inp) inp.placeholder = data.placeholder

  // Add greeting
  body.innerHTML = ''
  addConvMessage('ai', data.greeting)
  convHistory.push({ role: 'assistant', content: data.greeting })
}

function switchConvLang(lang) {
  document.querySelectorAll('.cls-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang)
  })
  convLang = lang
  convHistory = []
  const data = LANG_DATA[lang]
  const nameEl = document.getElementById('convLangName')
  const flagEl = document.getElementById('convLangFlag')
  if (nameEl) nameEl.textContent = data.name
  if (flagEl) flagEl.textContent = data.flag
  const inp = document.getElementById('convInput')
  if (inp) inp.placeholder = data.placeholder
  const body = document.getElementById('convBody')
  if (body) {
    body.innerHTML = ''
    addConvMessage('ai', data.greeting)
    convHistory.push({ role: 'assistant', content: data.greeting })
  }
}

function addConvMessage(type, content) {
  const body = document.getElementById('convBody')
  if (!body) return
  const div = document.createElement('div')
  div.className = `conv-msg ${type === 'user' ? 'user' : ''}`
  const av = type === 'ai'
    ? `<div class="conv-av conv-av-ai">AI</div>`
    : `<div class="conv-av conv-av-user">U</div>`
  const bubble = `<div class="conv-bubble conv-bubble-${type === 'ai' ? 'ai' : 'user'}">${content}</div>`
  div.innerHTML = type === 'user' ? bubble + av : av + bubble
  body.appendChild(div)
  body.scrollTop = body.scrollHeight
}

async function sendConvMessage() {
  const input = document.getElementById('convInput')
  if (!input || convLoading) return
  const text = input.value.trim()
  if (!text) return

  addConvMessage('user', escapeHtml(text))
  input.value = ''
  convLoading = true

  // Typing indicator
  const body = document.getElementById('convBody')
  const typing = document.createElement('div')
  typing.className = 'conv-msg'
  typing.id = 'convTyping'
  typing.innerHTML = `<div class="conv-av conv-av-ai">AI</div><div class="typing-ind"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div>`
  body.appendChild(typing)
  body.scrollTop = body.scrollHeight

  try {
    const response = await callChatAPI(text, convLang, 'full')
    const t = document.getElementById('convTyping')
    if (t) t.remove()
    addConvMessage('ai', response)
  } catch (e) {
    const t = document.getElementById('convTyping')
    if (t) t.remove()
    addConvMessage('ai', 'I am having a small connection issue — please try again in a moment!')
  }
  convLoading = false
}

// ── AUTH FUNCTIONS ──
async function handleSignup() {
  const name = document.getElementById('authName')?.value.trim()
  const email = document.getElementById('authEmail')?.value.trim()
  const password = document.getElementById('authPassword')?.value

  clearErrors()
  if (!email || !email.includes('@')) { showError('authEmailError', 'Please enter a valid email address.'); return }
  if (!password || password.length < 6) { showError('authPassError', 'Password must be at least 6 characters.'); return }

  setLoading(true)

  try {
    // Supabase signup (will work when keys are added)
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    const data = await response.json()
    if (data.success) {
      showSuccess('authSuccess', 'Account created! Redirecting...')
      setTimeout(() => window.location.href = 'dashboard.html', 1500)
    } else {
      showError('authEmailError', data.error || 'Something went wrong. Please try again.')
    }
  } catch (e) {
    // For now redirect to dashboard (will require real auth later)
    showSuccess('authSuccess', 'Welcome to SpeakAI! Redirecting...')
    setTimeout(() => window.location.href = 'dashboard.html', 1500)
  }
  setLoading(false)
}

async function handleLogin() {
  const email = document.getElementById('authEmail')?.value.trim()
  const password = document.getElementById('authPassword')?.value

  clearErrors()
  if (!email || !email.includes('@')) { showError('authEmailError', 'Please enter a valid email address.'); return }
  if (!password) { showError('authPassError', 'Please enter your password.'); return }

  setLoading(true)

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (data.success) {
      localStorage.setItem('speakai_user', JSON.stringify(data.user))
      window.location.href = 'dashboard.html'
    } else {
      showError('authPassError', data.error || 'Invalid email or password.')
    }
  } catch (e) {
    window.location.href = 'dashboard.html'
  }
  setLoading(false)
}

// ── HELPERS ──
function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

function showError(id, msg) {
  const el = document.getElementById(id)
  if (el) { el.textContent = msg; el.style.display = 'block' }
}

function showSuccess(id, msg) {
  const el = document.getElementById(id)
  if (el) { el.textContent = msg; el.style.display = 'block' }
}

function clearErrors() {
  document.querySelectorAll('.form-error, .form-success').forEach(e => e.style.display = 'none')
}

function setLoading(state) {
  const btn = document.querySelector('.form-btn')
  const spinner = document.getElementById('loadingSpinner')
  if (btn) { btn.disabled = state; btn.style.opacity = state ? '0.7' : '1' }
  if (spinner) spinner.style.display = state ? 'block' : 'none'
}

function showToast(msg, type = 'info') {
  const t = document.createElement('div')
  t.className = `toast toast-${type}`
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.classList.add('show'), 10)
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300) }, 3000)
}

function toggleMobileMenu() {
  const m = document.getElementById('mobileMenu')
  if (m) m.classList.toggle('open')
}

function handleCTASignup() {
  const email = document.getElementById('ctaEmail')
  if (email && email.value.trim()) {
    window.location.href = `signup.html?email=${encodeURIComponent(email.value.trim())}`
  } else {
    window.location.href = 'signup.html'
  }
}

function selectLangCard(el) {
  document.querySelectorAll('.lang-card').forEach(c => c.classList.remove('selected'))
  el.classList.add('selected')
}

// ── EVENT LISTENERS ──
document.addEventListener('DOMContentLoaded', () => {
  // Demo send button
  const sendBtn = document.getElementById('sendBtn')
  if (sendBtn) sendBtn.addEventListener('click', sendDemoMessage)
  const chatInput = document.getElementById('chatInput')
  if (chatInput) chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendDemoMessage() })

  // Conversation send button
  const convSend = document.getElementById('convSend')
  if (convSend) convSend.addEventListener('click', sendConvMessage)
  const convInput = document.getElementById('convInput')
  if (convInput) convInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendConvMessage() })

  // Init conversation page if on it
  if (document.getElementById('convBody')) initConversation()

  // Pre-fill email from URL
  const params = new URLSearchParams(window.location.search)
  const emailParam = params.get('email')
  if (emailParam) {
    const emailInput = document.getElementById('authEmail')
    if (emailInput) emailInput.value = emailParam
  }

  // Set active nav link
  const path = window.location.pathname
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') && path.includes(a.getAttribute('href').replace('.html',''))) {
      a.classList.add('active')
    }
  })
})
