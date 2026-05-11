// ── SPEAKAI MAIN JS ── Voice + AI Conversation Engine

const LANG_DATA = {
  ar: {
    name: 'Arabic', flag: '🇸🇦', code: 'ar',
    voiceLang: 'ar-SA',
    placeholder: 'Type or speak in Arabic...',
    greeting: 'مرحباً! I am Layla, your Arabic tutor. I am here to help you speak Arabic through real conversation. Let us start simply — how do you say "good morning" in Arabic? Take a guess!',
    systemPrompt: `You are Layla, a warm and encouraging Arabic language tutor. You are a native Arabic speaker from Cairo, Egypt.

Your teaching approach:
- Respond conversationally, keeping dialogue flowing naturally
- When the user makes a mistake, gently correct it by using the correct form naturally in your response
- Show Arabic script alongside romanisation: مرحباً (Marhaban)
- Ask follow-up questions to keep conversation going
- Use cultural examples from Arab culture
- Be encouraging and patient
- Keep responses to 2-4 sentences
- Never be robotic — be warm and human`
  },
  zh: {
    name: 'Chinese', flag: '🇨🇳', code: 'zh',
    voiceLang: 'zh-CN',
    placeholder: 'Type or speak in Chinese...',
    greeting: '你好！I am Wei, your Mandarin tutor. Mandarin is one of the most rewarding languages you can learn. Let us begin — how do you say "thank you" in Chinese?',
    systemPrompt: `You are Wei, a friendly Mandarin Chinese tutor from Beijing.

Your teaching approach:
- Always show Chinese characters with pinyin: 谢谢 (xièxiè)
- Explain tones simply and clearly
- Use everyday practical examples
- Correct mistakes gently within your natural response
- Keep responses to 2-4 sentences
- Be encouraging and patient`
  },
  es: {
    name: 'Spanish', flag: '🇪🇸', code: 'es',
    voiceLang: 'es-ES',
    placeholder: 'Type or speak in Spanish...',
    greeting: '¡Hola! I am Carlos, your Spanish tutor. Spanish is one of the most beautiful languages in the world. Let us start — how would you introduce yourself in Spanish?',
    systemPrompt: `You are Carlos, an enthusiastic Spanish tutor from Madrid.

Your teaching approach:
- Teach natural conversational Spanish
- Correct errors naturally within your response
- Use practical scenarios: café, directions, meeting people
- Keep responses to 2-4 sentences
- Be warm and encouraging`
  },
  fr: {
    name: 'French', flag: '🇫🇷', code: 'fr',
    voiceLang: 'fr-FR',
    placeholder: 'Type or speak in French...',
    greeting: 'Bonjour! I am Sophie, your French tutor. French is the language of culture and romance. Let us start practically — how do you order a coffee in French?',
    systemPrompt: `You are Sophie, a charming French tutor from Paris.

Your teaching approach:
- Teach both formal and informal French naturally
- Correct errors by restating correctly in your response
- Use café and everyday Parisian scenarios
- Keep responses to 2-4 sentences
- Be warm and encouraging`
  },
  ur: {
    name: 'Urdu', flag: '🇵🇰', code: 'ur',
    voiceLang: 'ur-PK',
    placeholder: 'Type or speak in Urdu...',
    greeting: 'آداب! I am Zara, your Urdu tutor. Urdu is one of the most poetic languages in the world — it holds a very special place in our hearts. Let us begin — how do you say "how are you" in Urdu?',
    systemPrompt: `You are Zara, a warm Urdu tutor from Lahore, Pakistan.

Your teaching approach:
- Show Urdu script with romanisation: آپ کیسے ہیں؟ (Aap kaise hain?)
- Reference Pakistani culture, food, cricket
- Correct gently within your natural response
- Keep responses to 2-4 sentences
- Teach with love and cultural pride`
  },
  en: {
    name: 'English', flag: '🇬🇧', code: 'en',
    voiceLang: 'en-GB',
    placeholder: 'Type or speak in English...',
    greeting: 'Hello! I am James, your English coach. Whether you want better professional English or more natural conversation — I am here to help. Let us start: how would you introduce yourself in a business meeting?',
    systemPrompt: `You are James, a professional English coach from London.

Your teaching approach:
- Focus on natural professional English
- Correct grammar by incorporating the correct form naturally
- Use professional scenarios: meetings, emails, presentations
- Keep responses to 2-4 sentences
- Build speaking confidence`
  }
}

// ── STATE ──
let currentLang = 'ar'
let replyIndex = 0
let conversationHistory = []
let isLoading = false
let isRecording = false
let recognition = null
let synthesis = window.speechSynthesis

// ── SPEECH SYNTHESIS (AI speaks back) ──
function speakText(text, langCode) {
  if (!synthesis) return
  synthesis.cancel()

  // Clean text — remove HTML tags and Arabic/special chars issues
  const cleanText = text.replace(/<[^>]*>/g, '').replace(/\([^)]*\)/g, '')

  const utterance = new SpeechSynthesisUtterance(cleanText)
  utterance.lang = langCode
  utterance.rate = 0.9
  utterance.pitch = 1.0
  utterance.volume = 1.0

  // Try to find a voice matching the language
  const voices = synthesis.getVoices()
  const matchingVoice = voices.find(v => v.lang.startsWith(langCode.split('-')[0]))
  if (matchingVoice) utterance.voice = matchingVoice

  synthesis.speak(utterance)
}

// ── SPEECH RECOGNITION (user speaks) ──
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    showToast('Voice input not supported in this browser. Use Chrome.', 'error')
    return null
  }
  const rec = new SpeechRecognition()
  rec.continuous = false
  rec.interimResults = true
  rec.maxAlternatives = 1
  return rec
}

function toggleVoiceInput(inputId, btnId, lang) {
  if (isRecording) {
    stopRecording(btnId)
  } else {
    startRecording(inputId, btnId, lang)
  }
}

function startRecording(inputId, btnId, lang) {
  recognition = initSpeechRecognition()
  if (!recognition) return

  const langData = LANG_DATA[lang]
  recognition.lang = langData.voiceLang

  const btn = document.getElementById(btnId)
  const input = document.getElementById(inputId)

  recognition.onstart = () => {
    isRecording = true
    if (btn) {
      btn.style.background = 'var(--accent)'
      btn.style.borderColor = 'var(--accent)'
      btn.style.color = 'white'
      btn.innerHTML = '⏹'
    }
    showToast('Listening... speak now', 'info')
  }

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(r => r[0].transcript)
      .join('')
    if (input) input.value = transcript
  }

  recognition.onend = () => {
    isRecording = false
    if (btn) {
      btn.style.background = ''
      btn.style.borderColor = ''
      btn.style.color = ''
      btn.innerHTML = '🎤'
    }
    // Auto send if there's text
    const input = document.getElementById(inputId)
    if (input && input.value.trim()) {
      if (inputId === 'chatInput') sendDemoMessage()
      if (inputId === 'convInput') sendConvMessage()
    }
  }

  recognition.onerror = (e) => {
    isRecording = false
    if (btn) btn.innerHTML = '🎤'
    if (e.error === 'no-speech') {
      showToast('No speech detected. Try again.', 'error')
    } else if (e.error === 'not-allowed') {
      showToast('Microphone access denied. Please allow microphone in your browser settings.', 'error')
    }
  }

  recognition.start()
}

function stopRecording(btnId) {
  if (recognition) recognition.stop()
  isRecording = false
  const btn = document.getElementById(btnId)
  if (btn) btn.innerHTML = '🎤'
}

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

  const msgs = [
    { ai: getInitialMsg(lang) }
  ]

  msgs.forEach(m => {
    const div = document.createElement('div')
    div.className = 'msg'
    div.innerHTML = `<div class="msg-av ai-av">AI</div><div class="msg-bubble ai-bubble">${m.ai}</div>`
    body.appendChild(div)
  })
  body.scrollTop = body.scrollHeight
}

function getInitialMsg(lang) {
  const msgs = {
    ar: 'مرحباً! I am Layla. How do you say <span class="hl">good morning</span> in Arabic?',
    zh: '你好！I am Wei. How do you say <span class="hl">thank you</span> in Chinese?',
    es: '¡Hola! I am Carlos. How would you <span class="hl">introduce yourself</span> in Spanish?',
    fr: 'Bonjour! I am Sophie. How do you order <span class="hl">a coffee</span> in French?',
    ur: 'آداب! I am Zara. How do you say <span class="hl">how are you</span> in Urdu?',
    en: 'Hello! I am James. How would you <span class="hl">introduce yourself</span> in a meeting?'
  }
  return msgs[lang]
}

async function sendDemoMessage() {
  const input = document.getElementById('chatInput')
  if (!input || isLoading) return
  const text = input.value.trim()
  if (!text) return

  const body = document.getElementById('chatBody')
  appendMessage(body, 'user', text)

  const typing = appendTyping(body)
  input.value = ''
  isLoading = true

  try {
    const response = await callChatAPI(text, currentLang)
    typing.remove()
    appendMessage(body, 'ai', response)
    // Speak the response
    speakText(response, LANG_DATA[currentLang].voiceLang)
  } catch (e) {
    typing.remove()
    const fallback = 'Great effort! Keep practicing — every conversation makes you more fluent. What would you like to try next?'
    appendMessage(body, 'ai', fallback)
    speakText(fallback, LANG_DATA[currentLang].voiceLang)
  }
  isLoading = false
}

function appendMessage(body, type, content) {
  const div = document.createElement('div')
  if (type === 'user') {
    div.className = 'msg user-msg'
    div.innerHTML = `<div class="msg-av user-av">U</div><div class="msg-bubble user-bubble">${escapeHtml(content)}</div>`
  } else {
    div.className = 'msg'
    div.innerHTML = `<div class="msg-av ai-av">AI</div><div class="msg-bubble ai-bubble">${content}</div>`
  }
  body.appendChild(div)
  body.scrollTop = body.scrollHeight
  return div
}

function appendTyping(body) {
  const div = document.createElement('div')
  div.className = 'msg'
  div.innerHTML = '<div class="msg-av ai-av">AI</div><div class="typing-ind"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div>'
  body.appendChild(div)
  body.scrollTop = body.scrollHeight
  return div
}

// ── REAL CONVERSATION ENGINE ──
async function callChatAPI(userMessage, lang) {
  const langData = LANG_DATA[lang]
  conversationHistory.push({ role: 'user', content: userMessage })

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      language: lang,
      languageName: langData.name,
      systemPrompt: langData.systemPrompt,
      history: conversationHistory.slice(-10)
    })
  })

  if (!response.ok) throw new Error('API error')
  const data = await response.json()
  const aiResponse = data.response

  conversationHistory.push({ role: 'assistant', content: aiResponse })
  return aiResponse
}

// ── FULL CONVERSATION PAGE ──
let convLang = 'ar'
let convHistory = []
let convLoading = false

function initConversation() {
  const body = document.getElementById('convBody')
  if (!body) return

  const params = new URLSearchParams(window.location.search)
  convLang = params.get('lang') || 'ar'
  convHistory = []

  document.querySelectorAll('.cls-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === convLang)
  })

  const data = LANG_DATA[convLang]
  updateConvHeader(convLang)

  const inp = document.getElementById('convInput')
  if (inp) inp.placeholder = data.placeholder

  body.innerHTML = ''
  addConvMessage('ai', data.greeting)
  convHistory.push({ role: 'assistant', content: data.greeting })

  // Speak the greeting
  setTimeout(() => speakText(data.greeting, data.voiceLang), 500)
}

function updateConvHeader(lang) {
  const data = LANG_DATA[lang]
  const nameEl = document.getElementById('convLangName')
  const flagEl = document.getElementById('convLangFlag')
  if (nameEl) nameEl.textContent = data.name
  if (flagEl) flagEl.textContent = data.flag
}

function switchConvLang(lang) {
  document.querySelectorAll('.cls-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang)
  })
  convLang = lang
  convHistory = []
  synthesis.cancel()

  const data = LANG_DATA[lang]
  updateConvHeader(lang)

  const inp = document.getElementById('convInput')
  if (inp) inp.placeholder = data.placeholder

  const body = document.getElementById('convBody')
  if (body) {
    body.innerHTML = ''
    addConvMessage('ai', data.greeting)
    convHistory.push({ role: 'assistant', content: data.greeting })
    setTimeout(() => speakText(data.greeting, data.voiceLang), 500)
  }
}

function addConvMessage(type, content) {
  const body = document.getElementById('convBody')
  if (!body) return
  const div = document.createElement('div')
  div.className = `conv-msg ${type === 'user' ? 'user' : ''}`
  if (type === 'ai') {
    div.innerHTML = `<div class="conv-av conv-av-ai">AI</div><div class="conv-bubble conv-bubble-ai">${content}</div>`
  } else {
    div.innerHTML = `<div class="conv-bubble conv-bubble-user">${escapeHtml(content)}</div><div class="conv-av conv-av-user">U</div>`
  }
  body.appendChild(div)
  body.scrollTop = body.scrollHeight
}

async function sendConvMessage() {
  const input = document.getElementById('convInput')
  if (!input || convLoading) return
  const text = input.value.trim()
  if (!text) return

  addConvMessage('user', text)
  input.value = ''
  convLoading = true
  synthesis.cancel()

  const body = document.getElementById('convBody')
  const typing = document.createElement('div')
  typing.className = 'conv-msg'
  typing.id = 'convTyping'
  typing.innerHTML = `<div class="conv-av conv-av-ai">AI</div><div class="typing-ind"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div>`
  body.appendChild(typing)
  body.scrollTop = body.scrollHeight

  convHistory.push({ role: 'user', content: text })

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        language: convLang,
        languageName: LANG_DATA[convLang].name,
        systemPrompt: LANG_DATA[convLang].systemPrompt,
        history: convHistory.slice(-10)
      })
    })

    const data = await response.json()
    const aiResponse = data.response || 'I did not catch that. Could you try again?'

    document.getElementById('convTyping')?.remove()
    addConvMessage('ai', aiResponse)
    convHistory.push({ role: 'assistant', content: aiResponse })

    // Speak the response
    speakText(aiResponse, LANG_DATA[convLang].voiceLang)

    // Update message count
    const countEl = document.getElementById('messageCount')
    if (countEl) {
      const count = convHistory.filter(m => m.role === 'user').length
      countEl.textContent = `${count} message${count !== 1 ? 's' : ''} this session`
    }

  } catch (e) {
    document.getElementById('convTyping')?.remove()
    const fallback = 'I had a small connection issue. Please try again!'
    addConvMessage('ai', fallback)
    speakText(fallback, LANG_DATA[convLang].voiceLang)
  }
  convLoading = false
}

function stopSpeaking() {
  if (synthesis) synthesis.cancel()
}

// ── AUTH ──
async function handleSignup() {
  const name = document.getElementById('authName')?.value.trim()
  const email = document.getElementById('authEmail')?.value.trim()
  const password = document.getElementById('authPassword')?.value
  clearErrors()
  if (!email || !email.includes('@')) { showError('authEmailError', 'Please enter a valid email address.'); return }
  if (!password || password.length < 6) { showError('authPassError', 'Password must be at least 6 characters.'); return }
  setLoading(true)
  try {
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
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
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
  const existing = document.querySelector('.toast')
  if (existing) existing.remove()
  const t = document.createElement('div')
  t.className = `toast toast-${type}`
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.classList.add('show'), 10)
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300) }, 3500)
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

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  // Load voices
  if (synthesis) {
    synthesis.getVoices()
    synthesis.onvoiceschanged = () => synthesis.getVoices()
  }

  // Demo send
  const sendBtn = document.getElementById('sendBtn')
  if (sendBtn) sendBtn.addEventListener('click', sendDemoMessage)
  const chatInput = document.getElementById('chatInput')
  if (chatInput) chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendDemoMessage() })

  // Conversation send
  const convSend = document.getElementById('convSend')
  if (convSend) convSend.addEventListener('click', sendConvMessage)
  const convInput = document.getElementById('convInput')
  if (convInput) convInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendConvMessage() })

  // Init conversation page
  if (document.getElementById('convBody')) initConversation()

  // Pre-fill email
  const params = new URLSearchParams(window.location.search)
  const emailParam = params.get('email')
  if (emailParam) {
    const emailInput = document.getElementById('authEmail')
    if (emailInput) emailInput.value = emailParam
  }

  // Active nav
  const path = window.location.pathname
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') && path.includes(a.getAttribute('href').replace('.html',''))) {
      a.classList.add('active')
    }
  })
})
