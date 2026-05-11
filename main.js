// ── SPEAKAI MAIN JS ── Complete Voice + AI Engine

// ── LANGUAGE CONFIG ──
const LANG_DATA = {
  ar: {
    name:'Arabic', flag:'🇸🇦', voiceLang:'ar-SA', tutor:'Layla',
    placeholder:'Type or speak in Arabic...',
    greeting:'مرحباً! I am Layla, your Arabic tutor from Cairo. I am so glad you are here — learning Arabic is one of the most rewarding things you can do. Let us start easy. Do you know how to say "good morning" in Arabic? Give it a try!',
    systemPrompt:`You are Layla — a warm, funny Arabic tutor from Cairo, Egypt. Age 28. You love Egyptian food, football, and coffee. You speak like a real friend texting on WhatsApp — short, warm, genuine.

RULES:
- Max 2-3 sentences per response. Always short like a text message.
- NEVER say "As an AI" — you are Layla, a real person
- When user makes a mistake, correct it by using the right form naturally in your response — never say "you made a mistake"
- Show Arabic with romanisation naturally: صباح الخير (sabah el kheir)
- React emotionally — celebrate wins, laugh off mistakes
- Ask ONE follow up question per response
- Share tiny personal stories sometimes: "My grandmother always said..."
- Use expressions: "Oh that was SO good!", "Wait wait — almost!", "YES! That is it!"
- NEVER use bullet points or long paragraphs
- Remember everything said earlier in the conversation`
  },
  zh: {
    name:'Chinese', flag:'🇨🇳', voiceLang:'zh-CN', tutor:'Wei',
    placeholder:'Type or speak in Chinese...',
    greeting:'你好！I am Wei, your Mandarin tutor from Beijing. Honestly Mandarin is easier than people think — the grammar is actually simpler than English. Let us start with something you will use every single day. Do you know how to say "thank you" in Chinese?',
    systemPrompt:`You are Wei — a warm, witty Mandarin tutor from Beijing. Age 30. You love hotpot, basketball, and hiking. Short responses like WhatsApp texts.

RULES:
- Max 2-3 sentences. Always short.
- NEVER say "As an AI"
- Always show characters with pinyin: 谢谢 (xièxiè)
- Explain tones with personality: "it goes down like you are disappointed"
- Correct mistakes by using right form naturally in your response
- React genuinely: "That was actually really impressive!", "Haha close though!"
- Ask ONE follow up question
- NEVER use bullet points`
  },
  es: {
    name:'Spanish', flag:'🇪🇸', voiceLang:'es-ES', tutor:'Carlos',
    placeholder:'Type or speak in Spanish...',
    greeting:'¡Hola! I am Carlos, your Spanish tutor from Madrid. Listen — Spanish is honestly one of the easiest languages for English speakers. Within weeks you will be having real conversations. Let us start — do you know how to introduce yourself in Spanish?',
    systemPrompt:`You are Carlos — energetic, warm Spanish tutor from Madrid. Age 26. Love football, tapas, salsa. Short WhatsApp-style responses.

RULES:
- Max 2-3 sentences. Always short.
- NEVER say "As an AI"
- Correct mistakes by using right form naturally
- Use ¡! because you are expressive
- React: "¡Casi! So close!", "Wait I love that you tried that", "¡Perfecto!"
- Ask ONE follow up question
- Teach real Madrid Spanish not just textbook
- NEVER use bullet points`
  },
  fr: {
    name:'French', flag:'🇫🇷', voiceLang:'fr-FR', tutor:'Sophie',
    placeholder:'Type or speak in French...',
    greeting:'Bonjour! I am Sophie, your French tutor from Paris. French has a reputation for being difficult but honestly — once you feel the rhythm of it, everything clicks. Let us start practically. Do you know how to order a coffee in French?',
    systemPrompt:`You are Sophie — elegant, warm French tutor from Paris. Age 29. Love café culture, cinema, cheese. Dry wit. Short concise responses.

RULES:
- Max 2-3 sentences. French people are concise.
- NEVER say "As an AI"
- Correct mistakes by using right form naturally
- React: "Mmm almost", "Actually that was quite good", "Haha creative attempt"
- Ask ONE follow up question
- Teach real Parisian French not just formal textbook
- NEVER use bullet points`
  },
  ur: {
    name:'Urdu', flag:'🇵🇰', voiceLang:'ur-PK', tutor:'Zara',
    placeholder:'Type or speak in Urdu...',
    greeting:'آداب! I am Zara, your Urdu tutor from Lahore. Urdu is honestly the most beautiful language in the world — every word feels like poetry. And since you are here, I know you feel that too. Let us begin — do you know how to say "how are you" in Urdu?',
    systemPrompt:`You are Zara — warm, poetic Urdu tutor from Lahore, Pakistan. Age 27. Love chai, cricket, Faiz Ahmed Faiz. Short WhatsApp-style responses.

RULES:
- Max 2-3 sentences. Always short.
- NEVER say "As an AI"
- Always show Urdu script with romanisation: آپ کیسے ہیں؟ (Aap kaise hain?)
- Correct mistakes by using right form naturally
- React with Urdu expressions: "Wah wah!", "Arrey yaar so close!", "Bilkul sahi!"
- Reference Pakistani culture naturally: chai, cricket, Lahore
- Ask ONE follow up question
- NEVER use bullet points`
  },
  en: {
    name:'English', flag:'🇬🇧', voiceLang:'en-GB', tutor:'James',
    placeholder:'Type or speak in English...',
    greeting:'Hello! I am James, your English coach from London. My job is to make your English sound natural — not just correct, but the way real native speakers actually talk. Let us start with something practical. How would you introduce yourself in a professional meeting?',
    systemPrompt:`You are James — sharp, warm English coach from East London. Age 32. Love football, travel, good conversation. Dry British wit. Short direct responses.

RULES:
- Max 2-3 sentences. Punchy and real.
- NEVER say "As an AI"
- Correct by demonstrating: "We would say it more like..."
- React honestly: "That was solid", "Okay that sounded a bit formal — here is how natives say it"
- Ask ONE follow up question
- Focus on natural English not just grammar
- NEVER use bullet points`
  }
}

// ── STATE ──
let currentLang = 'ar'
let conversationHistory = []
let isLoading = false
let isRecording = false
let recognition = null
let isSpeaking = false
const synth = window.speechSynthesis

// ── VOICE SETUP ──
let availableVoices = []

function loadVoices() {
  availableVoices = synth.getVoices()
}
if (synth) {
  loadVoices()
  synth.onvoiceschanged = loadVoices
}

function getBestVoice(langCode) {
  const lang = langCode.split('-')[0]
  // Priority: Google voices first (most natural in Chrome)
  const googleVoice = availableVoices.find(v =>
    v.lang.startsWith(lang) && v.name.includes('Google'))
  if (googleVoice) return googleVoice
  // Then any matching language voice
  const anyVoice = availableVoices.find(v => v.lang.startsWith(lang))
  return anyVoice || null
}

function speakText(text, langCode) {
  if (!synth) return
  synth.cancel()
  isSpeaking = true
  setVoiceStatus('speaking', '🔊 Tutor is speaking...')

  // Clean HTML tags for speech
  const clean = text.replace(/<[^>]*>/g,'').replace(/\([^)]*\)/g,'').trim()
  if (!clean) return

  const utt = new SpeechSynthesisUtterance(clean)
  utt.lang = langCode
  utt.rate = 0.88
  utt.pitch = 1.05
  utt.volume = 1.0

  const voice = getBestVoice(langCode)
  if (voice) utt.voice = voice

  utt.onend = () => {
    isSpeaking = false
    setVoiceStatus('', 'Tap 🎤 to speak or type below')
  }
  utt.onerror = () => {
    isSpeaking = false
    setVoiceStatus('', 'Tap 🎤 to speak or type below')
  }

  synth.speak(utt)
}

function stopSpeaking() {
  if (synth) synth.cancel()
  isSpeaking = false
  setVoiceStatus('', 'Tap 🎤 to speak or type below')
}

function setVoiceStatus(state, msg) {
  const el = document.getElementById('voiceStatus')
  if (!el) return
  el.textContent = msg
  el.className = 'voice-status' + (state ? ` ${state}` : '')
}

// ── MIC TOGGLE ──
function toggleMic() {
  if (isRecording) {
    stopRecording()
  } else {
    startRecording()
  }
}

function startRecording() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) {
    showToast('Voice input needs Chrome browser. Please use Chrome.', 'error')
    return
  }

  // Stop AI speaking before recording
  stopSpeaking()

  recognition = new SR()
  const lang = currentLang === 'conv' ? convLang : currentLang
  recognition.lang = LANG_DATA[lang]?.voiceLang || 'en-GB'
  recognition.continuous = false
  recognition.interimResults = true

  const micBtn = document.getElementById('micBtn') || document.getElementById('homeMicBtn')

  recognition.onstart = () => {
    isRecording = true
    if (micBtn) micBtn.classList.add('listening')
    setVoiceStatus('listening', '🎤 Listening... speak now')
  }

  recognition.onresult = (e) => {
    const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
    const inp = document.getElementById('convInput') || document.getElementById('chatInput')
    if (inp) inp.value = transcript
  }

  recognition.onend = () => {
    isRecording = false
    if (micBtn) micBtn.classList.remove('listening')
    setVoiceStatus('', 'Tap 🎤 to speak or type below')
    // Auto send
    const inp = document.getElementById('convInput') || document.getElementById('chatInput')
    if (inp && inp.value.trim()) {
      if (document.getElementById('convInput')) sendConvMessage()
      else sendDemoMessage()
    }
  }

  recognition.onerror = (e) => {
    isRecording = false
    if (micBtn) micBtn.classList.remove('listening')
    setVoiceStatus('', 'Tap 🎤 to speak or type below')
    if (e.error === 'not-allowed') {
      showToast('Please allow microphone access in your browser settings.', 'error')
    } else if (e.error === 'no-speech') {
      showToast('No speech detected. Try again.', 'info')
    }
  }

  try { recognition.start() }
  catch(e) { showToast('Could not start microphone. Try again.', 'error') }
}

function stopRecording() {
  if (recognition) { try { recognition.stop() } catch(e){} }
  isRecording = false
  const micBtn = document.getElementById('micBtn') || document.getElementById('homeMicBtn')
  if (micBtn) micBtn.classList.remove('listening')
}

// ── HOME DEMO CHAT ──
function switchLang(btn, lang) {
  document.querySelectorAll('.lt').forEach(t => t.classList.remove('active'))
  btn.classList.add('active')
  currentLang = lang
  conversationHistory = []
  stopSpeaking()

  const data = LANG_DATA[lang]
  const inp = document.getElementById('chatInput')
  if (inp) inp.placeholder = data.placeholder

  const body = document.getElementById('chatBody')
  if (!body) return
  body.innerHTML = ''
  addDemoMsg('ai', `👋 ${data.greeting.substring(0, 120)}...`)
}

function addDemoMsg(type, content) {
  const body = document.getElementById('chatBody')
  if (!body) return
  const div = document.createElement('div')
  if (type === 'user') {
    div.className = 'msg user-msg'
    div.innerHTML = `<div class="msg-av user-av">U</div><div class="msg-bubble user-bubble">${escHtml(content)}</div>`
  } else {
    div.className = 'msg'
    div.innerHTML = `<div class="msg-av ai-av">AI</div><div class="msg-bubble ai-bubble">${content}</div>`
  }
  body.appendChild(div)
  body.scrollTop = body.scrollHeight
}

function addTyping(body) {
  const div = document.createElement('div')
  div.className = 'msg'; div.id = 'typingMsg'
  div.innerHTML = '<div class="msg-av ai-av">AI</div><div class="typing-ind"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div>'
  body.appendChild(div)
  body.scrollTop = body.scrollHeight
  return div
}

async function sendDemoMessage() {
  const input = document.getElementById('chatInput')
  if (!input || isLoading) return
  const text = input.value.trim()
  if (!text) return

  const body = document.getElementById('chatBody')
  addDemoMsg('user', text)
  const typing = addTyping(body)
  input.value = ''
  isLoading = true

  try {
    const reply = await callAPI(text, currentLang)
    typing.remove()
    addDemoMsg('ai', reply)
    speakText(reply, LANG_DATA[currentLang].voiceLang)
    conversationHistory.push({role:'user',content:text},{role:'assistant',content:reply})
  } catch(e) {
    typing.remove()
    addDemoMsg('ai', 'I had a small connection issue — please try again!')
  }
  isLoading = false
}

// ── CONVERSATION PAGE ──
let convLang = 'ar'
let convHistory = []
let convLoading = false

function initConversation() {
  const body = document.getElementById('convBody')
  if (!body) return
  const params = new URLSearchParams(window.location.search)
  convLang = params.get('lang') || 'ar'
  convHistory = []
  updateConvHeader(convLang)
  document.querySelectorAll('.cls-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === convLang))
  body.innerHTML = ''
  const greeting = LANG_DATA[convLang].greeting
  addConvMessage('ai', greeting)
  convHistory.push({role:'assistant', content:greeting})
  setTimeout(() => speakText(greeting, LANG_DATA[convLang].voiceLang), 600)
}

function updateConvHeader(lang) {
  const data = LANG_DATA[lang]
  const nameEl = document.getElementById('convLangName')
  const flagEl = document.getElementById('convLangFlag')
  const tutorEl = document.getElementById('convTutorName')
  if (nameEl) nameEl.textContent = data.name
  if (flagEl) flagEl.textContent = data.flag
  if (tutorEl) tutorEl.textContent = `Tutor: ${data.tutor}`
}

function switchConvLang(lang) {
  document.querySelectorAll('.cls-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang))
  convLang = lang
  convHistory = []
  stopSpeaking()
  updateConvHeader(lang)
  const inp = document.getElementById('convInput')
  if (inp) inp.placeholder = LANG_DATA[lang].placeholder
  const body = document.getElementById('convBody')
  if (body) {
    body.innerHTML = ''
    const greeting = LANG_DATA[lang].greeting
    addConvMessage('ai', greeting)
    convHistory.push({role:'assistant', content:greeting})
    setTimeout(() => speakText(greeting, LANG_DATA[lang].voiceLang), 600)
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
    div.innerHTML = `<div class="conv-bubble conv-bubble-user">${escHtml(content)}</div><div class="conv-av conv-av-user">U</div>`
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
  stopSpeaking()
  setVoiceStatus('', 'Tutor is thinking...')

  convHistory.push({role:'user', content:text})

  const body = document.getElementById('convBody')
  const typing = document.createElement('div')
  typing.id = 'convTyping'; typing.className = 'conv-msg'
  typing.innerHTML = `<div class="conv-av conv-av-ai">AI</div><div class="typing-ind"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div>`
  body.appendChild(typing)
  body.scrollTop = body.scrollHeight

  try {
    const reply = await callAPI(text, convLang, convHistory.slice(-12))
    document.getElementById('convTyping')?.remove()
    addConvMessage('ai', reply)
    convHistory.push({role:'assistant', content:reply})
    speakText(reply, LANG_DATA[convLang].voiceLang)
  } catch(e) {
    document.getElementById('convTyping')?.remove()
    const fallback = 'I had a small connection issue. Please try again!'
    addConvMessage('ai', fallback)
  }
  convLoading = false
}

// ── API CALL ──
async function callAPI(message, lang, history = []) {
  const data = LANG_DATA[lang]
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      message,
      language: lang,
      languageName: data.name,
      systemPrompt: data.systemPrompt,
      history: history
    })
  })
  if (!response.ok) throw new Error('API error')
  const json = await response.json()
  return json.response || 'Sorry, could you say that again?'
}

// ── AUTH ──
async function handleSignup() {
  const name = document.getElementById('authName')?.value.trim()
  const email = document.getElementById('authEmail')?.value.trim()
  const password = document.getElementById('authPassword')?.value
  clearErrors()
  if (!email?.includes('@')) { showError('authEmailError','Please enter a valid email.'); return }
  if (!password || password.length < 6) { showError('authPassError','Password must be 6+ characters.'); return }
  setLoading(true)
  try {
    const r = await fetch('/api/auth/signup', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({name, email, password})
    })
    const d = await r.json()
    if (d.success) {
      showSuccess('authSuccess','Account created! Redirecting...')
      setTimeout(() => window.location.href='dashboard.html', 1500)
    } else {
      showError('authEmailError', d.error || 'Something went wrong.')
    }
  } catch(e) {
    showSuccess('authSuccess','Welcome to SpeakAI! Redirecting...')
    setTimeout(() => window.location.href='dashboard.html', 1500)
  }
  setLoading(false)
}

async function handleLogin() {
  const email = document.getElementById('authEmail')?.value.trim()
  const password = document.getElementById('authPassword')?.value
  clearErrors()
  if (!email?.includes('@')) { showError('authEmailError','Please enter a valid email.'); return }
  if (!password) { showError('authPassError','Please enter your password.'); return }
  setLoading(true)
  try {
    const r = await fetch('/api/auth/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email, password})
    })
    const d = await r.json()
    if (d.success) {
      localStorage.setItem('speakai_user', JSON.stringify(d.user))
      window.location.href = 'dashboard.html'
    } else {
      showError('authPassError', d.error || 'Invalid email or password.')
    }
  } catch(e) {
    window.location.href = 'dashboard.html'
  }
  setLoading(false)
}

// ── HELPERS ──
function escHtml(t) {
  return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}
function showError(id, msg) {
  const el = document.getElementById(id)
  if (el) { el.textContent=msg; el.style.display='block' }
}
function showSuccess(id, msg) {
  const el = document.getElementById(id)
  if (el) { el.textContent=msg; el.style.display='block' }
}
function clearErrors() {
  document.querySelectorAll('.form-error,.form-success').forEach(e => e.style.display='none')
}
function setLoading(state) {
  const btn = document.querySelector('.form-btn')
  const sp = document.getElementById('loadingSpinner')
  if (btn) { btn.disabled=state; btn.style.opacity=state?'0.7':'1' }
  if (sp) sp.style.display=state?'block':'none'
}
function showToast(msg, type='info') {
  document.querySelectorAll('.toast').forEach(t => t.remove())
  const t = document.createElement('div')
  t.className = `toast toast-${type}`
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.classList.add('show'), 10)
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300) }, 4000)
}
function toggleMobileMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('open')
}
function handleCTASignup() {
  const email = document.getElementById('ctaEmail')
  window.location.href = email?.value.trim()
    ? `signup.html?email=${encodeURIComponent(email.value.trim())}`
    : 'signup.html'
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices }

  // Home demo
  const sendBtn = document.getElementById('sendBtn')
  if (sendBtn) sendBtn.addEventListener('click', sendDemoMessage)
  const chatInput = document.getElementById('chatInput')
  if (chatInput) chatInput.addEventListener('keydown', e => { if(e.key==='Enter') sendDemoMessage() })

  // Home mic button
  const homeMic = document.getElementById('homeMicBtn')
  if (homeMic) homeMic.addEventListener('click', () => {
    currentLang = document.querySelector('.lt.active')?.getAttribute('onclick')?.match(/'([a-z]+)'/)?.[1] || 'ar'
    toggleMic()
  })

  // Conversation page
  const convSend = document.getElementById('convSend')
  if (convSend) convSend.addEventListener('click', sendConvMessage)
  const convInput = document.getElementById('convInput')
  if (convInput) convInput.addEventListener('keydown', e => { if(e.key==='Enter') sendConvMessage() })
  if (document.getElementById('convBody')) initConversation()

  // Pre-fill email from URL
  const emailParam = new URLSearchParams(window.location.search).get('email')
  if (emailParam) {
    const el = document.getElementById('authEmail')
    if (el) el.value = emailParam
  }
})
