import './App.css'
import { useState } from 'react'

function App() {

  // ==========================================
  // USER / ACCOUNT
  // ==========================================

  const savedUser = localStorage.getItem('aiLiteracyUser')

  const [user, setUser] = useState(
    savedUser ? JSON.parse(savedUser) : null
  )

  // ==========================================
  // LOGIN
  // ==========================================

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginMessage, setLoginMessage] = useState('')

  // ==========================================
  // SIGN UP
  // ==========================================

  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [signupRole, setSignupRole] = useState('student')
  const [signupMessage, setSignupMessage] = useState('')

  // ==========================================
  // PAGE
  // ==========================================

  const [page, setPage] = useState(
    savedUser ? 'dashboard' : 'home'
  )

  // ==========================================
  // QUIZ
  // ==========================================

  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [question, setQuestion] = useState(1)
  const [correct, setCorrect] = useState(false)

  // ==========================================
  // LESSONS
  // ==========================================

  const [lesson1Complete, setLesson1Complete] = useState(false)
  const [lesson2Complete, setLesson2Complete] = useState(false)

  // ==========================================
  // MISINFORMATION
  // ==========================================

  const [misinfoQuestion, setMisinfoQuestion] = useState(1)
  const [misinfoAnswered, setMisinfoAnswered] = useState(false)
  const [misinfoCorrect, setMisinfoCorrect] = useState(false)

  // ==========================================
  // AI TUTOR
  // ==========================================

  const [tutorInput, setTutorInput] = useState('')
  const [tutorMessages, setTutorMessages] = useState([])

  // ==========================================
  // TEACHER PLAGIARISM CHECKER
  // ==========================================

  const [studentText, setStudentText] = useState('')
  const [referenceText, setReferenceText] = useState('')
  const [plagiarismResult, setPlagiarismResult] = useState(null)

  // ==========================================
  // PROTECTED LEARNING PAGES
  // ==========================================

  const openLearningPage = (targetPage) => {

    if (!user) {
      setLoginMessage(
        'Please sign in or create an account to access the learning content.'
      )

      setPage('login')
      return
    }

    if (user.role !== 'student') {
      setPage('teacherDashboard')
      return
    }

    setPage(targetPage)
  }

  // ==========================================
  // STUDENT DASHBOARD
  // ==========================================

  const openStudentDashboard = () => {

    if (!user) {
      setLoginMessage(
        'Please sign in or create a student account to access the Student Dashboard.'
      )

      setPage('login')
      return
    }

    if (user.role !== 'student') {
      setPage('teacherDashboard')
      return
    }

    setPage('dashboard')
  }

  // ==========================================
  // TEACHER DASHBOARD
  // ==========================================

  const openTeacherPage = () => {

    if (!user) {
      setLoginMessage(
        'Please sign in to access the Teacher Dashboard.'
      )

      setPage('login')
      return
    }

    if (user.role !== 'teacher') {
      setPage('dashboard')
      return
    }

    setPage('teacherDashboard')
  }

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = (e) => {

    e.preventDefault()

    setLoginMessage('')

    if (
      loginEmail.trim() === '' ||
      loginPassword.trim() === ''
    ) {

      setLoginMessage(
        'Please enter your email and password.'
      )

      return
    }

    const savedAccount =
      localStorage.getItem('aiLiteracyAccount')

    if (!savedAccount) {

      setLoginMessage(
        'No account found. Please create an account first.'
      )

      return
    }

    const account = JSON.parse(savedAccount)

    if (
      loginEmail.trim().toLowerCase() !==
        account.email.toLowerCase() ||
      loginPassword !== account.password
    ) {

      setLoginMessage(
        'Incorrect email or password.'
      )

      return
    }

    const loggedInUser = {
      name: account.name,
      email: account.email,
      role: account.role || 'student'
    }

    localStorage.setItem(
      'aiLiteracyUser',
      JSON.stringify(loggedInUser)
    )

    setUser(loggedInUser)

    setLoginEmail('')
    setLoginPassword('')
    setLoginMessage('')

    if (loggedInUser.role === 'teacher') {
      setPage('teacherDashboard')
    } else {
      setPage('dashboard')
    }
  }

  // ==========================================
  // SIGN UP
  // ==========================================

  const handleSignup = (e) => {

    e.preventDefault()

    setSignupMessage('')

    if (
      !signupName.trim() ||
      !signupEmail.trim() ||
      !signupPassword ||
      !signupConfirmPassword
    ) {

      setSignupMessage(
        'Please fill in all fields.'
      )

      return
    }

    if (signupPassword.length < 6) {

      setSignupMessage(
        'Password must be at least 6 characters long.'
      )

      return
    }

    if (
      signupPassword !==
      signupConfirmPassword
    ) {

      setSignupMessage(
        'Passwords do not match.'
      )

      return
    }

    const existingAccount =
      localStorage.getItem('aiLiteracyAccount')

    if (existingAccount) {

      const account =
        JSON.parse(existingAccount)

      if (
        account.email.toLowerCase() ===
        signupEmail.trim().toLowerCase()
      ) {

        setSignupMessage(
          'An account with this email already exists.'
        )

        return
      }
    }

    const newAccount = {
      name: signupName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      role: signupRole
    }

    localStorage.setItem(
      'aiLiteracyAccount',
      JSON.stringify(newAccount)
    )

    setSignupMessage(
      'Account created successfully! Redirecting to login...'
    )

    setSignupName('')
    setSignupEmail('')
    setSignupPassword('')
    setSignupConfirmPassword('')
    setSignupRole('student')

    setTimeout(() => {

      setSignupMessage('')
      setPage('login')

    }, 1200)
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem('aiLiteracyUser')

    setUser(null)

    setPage('home')
  }

  // ==========================================
  // TEXT NORMALISATION
  // ==========================================

  const normalizeText = (text) => {

    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // ==========================================
  // CREATE WORD LIST
  // ==========================================

  const getWords = (text) => {

    const normalized = normalizeText(text)

    if (!normalized) return []

    return normalized.split(' ')
  }

  // ==========================================
  // CREATE PHRASES
  // ==========================================

  const getNgrams = (words, size = 3) => {

    if (words.length < size) {
      return words.length > 0
        ? [words.join(' ')]
        : []
    }

    const ngrams = []

    for (
      let i = 0;
      i <= words.length - size;
      i++
    ) {

      ngrams.push(
        words.slice(i, i + size).join(' ')
      )

    }

    return ngrams
  }

  // ==========================================
  // PLAGIARISM / SIMILARITY CHECKER
  // ==========================================

  const checkPlagiarism = () => {

    if (
      !studentText.trim() ||
      !referenceText.trim()
    ) {

      setPlagiarismResult({
        level: 'error',
        percentage: 0,
        message:
          'Please enter both the student work and reference text.'
      })

      return
    }

    const normalizedStudent =
      normalizeText(studentText)

    const normalizedReference =
      normalizeText(referenceText)

    // ==========================================
    // EXACT MATCH
    // ==========================================
    // This is important:
    // If the two texts are exactly the same
    // after ignoring capital letters and punctuation,
    // the result MUST be 100%.
    // ==========================================

    if (
      normalizedStudent ===
      normalizedReference
    ) {

      setPlagiarismResult({
        level: 'high',
        percentage: 100,
        message:
          'The student work is an exact match to the reference text.'
      })

      return
    }

    // ==========================================
    // WORD ANALYSIS
    // ==========================================

    const studentWords =
      getWords(studentText)

    const referenceWords =
      getWords(referenceText)

    if (
      studentWords.length === 0 ||
      referenceWords.length === 0
    ) {

      setPlagiarismResult({
        level: 'error',
        percentage: 0,
        message:
          'There is not enough text to perform the check.'
      })

      return
    }

    // ==========================================
    // WORD FREQUENCY SIMILARITY
    // ==========================================

    const studentFrequency = {}

    const referenceFrequency = {}

    studentWords.forEach(word => {

      studentFrequency[word] =
        (studentFrequency[word] || 0) + 1

    })

    referenceWords.forEach(word => {

      referenceFrequency[word] =
        (referenceFrequency[word] || 0) + 1

    })

    let matchingWordCount = 0

    Object.keys(studentFrequency).forEach(word => {

      if (referenceFrequency[word]) {

        matchingWordCount +=
          Math.min(
            studentFrequency[word],
            referenceFrequency[word]
          )

      }

    })

    const wordSimilarity =
      matchingWordCount /
      Math.max(
        studentWords.length,
        referenceWords.length
      )

    // ==========================================
    // PHRASE SIMILARITY
    // ==========================================

    const studentPhrases =
      getNgrams(studentWords, 3)

    const referencePhrases =
      new Set(getNgrams(referenceWords, 3))

    let matchingPhrases = 0

    studentPhrases.forEach(phrase => {

      if (referencePhrases.has(phrase)) {
        matchingPhrases++
      }

    })

    const phraseSimilarity =
      studentPhrases.length > 0
        ? matchingPhrases /
          Math.max(
            studentPhrases.length,
            referencePhrases.size
          )
        : 0

    // ==========================================
    // COMBINED SCORE
    // ==========================================

    let percentage = Math.round(
      (
        wordSimilarity * 0.6 +
        phraseSimilarity * 0.4
      ) * 100
    )

    // Prevent impossible values
    percentage =
      Math.max(
        0,
        Math.min(100, percentage)
      )

    // ==========================================
    // RESULT LEVEL
    // ==========================================

    let level = 'low'

    let message =
      'Low similarity detected. Continue reviewing the work normally.'

    if (percentage >= 70) {

      level = 'high'

      message =
        'High similarity detected. The teacher should review the work carefully and discuss the student’s sources and writing process.'

    } else if (percentage >= 40) {

      level = 'medium'

      message =
        'Moderate similarity detected. Further investigation and source checking are recommended.'

    }

    setPlagiarismResult({
      level,
      percentage,
      message
    })
  }

  // ==========================================
  // CLEAR PLAGIARISM CHECKER
  // ==========================================

  const clearPlagiarismChecker = () => {

    setStudentText('')
    setReferenceText('')
    setPlagiarismResult(null)

  }

  // ==========================================
  // AI TUTOR
  // ==========================================

  if (page === 'tutor') {

    if (!user || user.role !== 'student') {
      setPage(user ? 'teacherDashboard' : 'login')
      return null
    }

    const askTutor = () => {

      if (tutorInput.trim() === '') return

      const questionText =
        tutorInput.toLowerCase()

      let answer =
        "That's a great question! Try reviewing the AI lessons for more information."

      if (questionText.includes('what is ai')) {

        answer =
          'AI, or Artificial Intelligence, is technology that allows computers to perform tasks that normally require human intelligence.'

      } else if (
        questionText.includes('how does ai learn')
      ) {

        answer =
          'AI systems learn by finding patterns in data. They use examples and algorithms to make predictions or produce results.'

      } else if (
        questionText.includes('misinformation')
      ) {

        answer =
          'Misinformation is false or inaccurate information. Before believing something online, check the source and look for reliable evidence.'

      } else if (
        questionText.includes('deepfake')
      ) {

        answer =
          'A deepfake is AI-generated or AI-manipulated audio, video or images that can make someone appear to say or do something they did not actually say or do.'

      } else if (
        questionText.includes('safe') ||
        questionText.includes('privacy')
      ) {

        answer =
          'Stay safe by protecting your personal information, using strong passwords, enabling multi-factor authentication and being careful about suspicious links or messages.'
      }

      setTutorMessages([

        ...tutorMessages,

        {
          type: 'user',
          text: tutorInput
        },

        {
          type: 'ai',
          text: answer
        }

      ])

      setTutorInput('')
    }

    return (

      <div className="learning-page">

        <h1>🤖 AI Tutor</h1>

        <p>
          Ask me a question about artificial intelligence.
        </p>

        <div className="tutor-chat">

          {tutorMessages.length === 0 && (

            <div>

              <h3>
                👋 Hi! I'm your AI Tutor.
              </h3>

              <p>
                Try asking me:
              </p>

              <p>• What is AI?</p>
              <p>• How does AI learn?</p>
              <p>• What is misinformation?</p>
              <p>• What is a deepfake?</p>
              <p>• How can I stay safe online?</p>

            </div>
          )}

          {tutorMessages.map(
            (message, index) => (

              <div key={index}>

                {message.type === 'user' ? (

                  <p>
                    <strong>You:</strong>{' '}
                    {message.text}
                  </p>

                ) : (

                  <p>
                    <strong>
                      🤖 AI Tutor:
                    </strong>{' '}
                    {message.text}
                  </p>

                )}

              </div>
            )
          )}

        </div>

        <input
          type="text"
          value={tutorInput}
          onChange={(e) =>
            setTutorInput(e.target.value)
          }
          onKeyDown={(e) => {

            if (e.key === 'Enter') {
              askTutor()
            }

          }}
          placeholder="Ask the AI Tutor..."
        />

        <button onClick={askTutor}>
          Ask Tutor →
        </button>

        <br />

        <button
          onClick={() =>
            setPage('dashboard')
          }
        >
          ← Back
        </button>

      </div>
    )
  }

  // ==========================================
  // MISINFORMATION
  // ==========================================

  if (page === 'misinformation') {

    if (!user || user.role !== 'student') {
      setPage(user ? 'teacherDashboard' : 'login')
      return null
    }

    const handleMisinfoAnswer = (isCorrect) => {

      if (misinfoAnswered) return

      setMisinfoCorrect(isCorrect)
      setMisinfoAnswered(true)
    }

    const nextMisinfoQuestion = () => {

      setMisinfoQuestion(
        misinfoQuestion + 1
      )

      setMisinfoAnswered(false)
      setMisinfoCorrect(false)
    }

    const restartMisinfo = () => {

      setMisinfoQuestion(1)
      setMisinfoAnswered(false)
      setMisinfoCorrect(false)
    }

    return (

      <div className="learning-page">

        <h1>
          🕵️ Spot the Fake
        </h1>

        <p>
          Can you tell when information might be misleading?
        </p>

        <p>
          Scenario {misinfoQuestion} of 3
        </p>

        {misinfoQuestion === 1 && (

          <>

            <h2>
              "Scientists have discovered that drinking one glass
              of water makes you 10 times smarter instantly!"
            </h2>

            <p>
              You see this claim posted on social media.
              What should you think?
            </p>

            <button
              onClick={() =>
                handleMisinfoAnswer(false)
              }
            >
              ✅ This is definitely true
            </button>

            <button
              onClick={() =>
                handleMisinfoAnswer(true)
              }
            >
              🔎 This claim should be checked before believing it
            </button>

          </>
        )}

        {misinfoQuestion === 2 && (

          <>

            <h2>
              A video shows a famous person saying something
              surprising. The video has no information about
              where it came from.
            </h2>

            <p>
              What should you do?
            </p>

            <button
              onClick={() =>
                handleMisinfoAnswer(true)
              }
            >
              🔎 Check whether the video is authentic and find
              the original source
            </button>

            <button
              onClick={() =>
                handleMisinfoAnswer(false)
              }
            >
              ✅ Share it immediately
            </button>

          </>
        )}

        {misinfoQuestion === 3 && (

          <>

            <h2>
              An AI chatbot gives you an answer that sounds very
              confident but provides no sources.
            </h2>

            <p>
              What is the safest response?
            </p>

            <button
              onClick={() =>
                handleMisinfoAnswer(true)
              }
            >
              🔎 Verify the information using reliable sources
            </button>

            <button
              onClick={() =>
                handleMisinfoAnswer(false)
              }
            >
              ✅ Believe it because the AI sounds confident
            </button>

          </>
        )}

        {misinfoAnswered &&
          misinfoQuestion < 3 && (

            <div>

              {misinfoCorrect ? (
                <h2>
                  🎉 Good thinking!
                </h2>
              ) : (
                <h2>
                  ❌ Not quite. Think critically!
                </h2>
              )}

              <p>
                Remember: don't automatically trust information
                just because it looks convincing.
              </p>

              <button
                onClick={nextMisinfoQuestion}
              >
                Next Scenario →
              </button>

            </div>
          )}

        {misinfoAnswered &&
          misinfoQuestion === 3 && (

            <div>

              {misinfoCorrect ? (
                <h2>
                  🎉 Good thinking!
                </h2>
              ) : (
                <h2>
                  ❌ Not quite. Keep practising!
                </h2>
              )}

              <h2>
                🎊 Activity Complete!
              </h2>

              <p>
                You have completed the misinformation
                detection activity.
              </p>

              <button
                onClick={restartMisinfo}
              >
                🔄 Try Again
              </button>

              <button
                onClick={() =>
                  setPage('dashboard')
                }
              >
                ← Back
              </button>

            </div>
          )}

        {!misinfoAnswered && (

          <button
            onClick={() =>
              setPage('dashboard')
            }
          >
            ← Back
          </button>

        )}

      </div>
    )
  }

  // ==========================================
  // TEACHER DASHBOARD
  // ==========================================

  if (page === 'teacherDashboard') {

    if (!user) {
      setPage('login')
      return null
    }

    if (user.role !== 'teacher') {
      setPage('dashboard')
      return null
    }

    return (

      <div className="dashboard-page">

        <div className="dashboard-header">

          <div>

            <p className="dashboard-label">
              TEACHER DASHBOARD
            </p>

            <h1>
              👩‍🏫 Welcome, {user.name}!
            </h1>

            <p>
              Manage AI literacy resources, academic
              integrity activities and responsible AI teaching.
            </p>

          </div>

          <div className="dashboard-icon">
            👩‍🏫
          </div>

        </div>

        <div className="dashboard-stats">

          <div className="dashboard-stat">

            <div className="stat-icon">
              📚
            </div>

            <div>

              <h3>
                Teaching Resources
              </h3>

              <strong>
                5
              </strong>

              <p>
                Available
              </p>

            </div>

          </div>

          <div className="dashboard-stat">

            <div className="stat-icon">
              🔎
            </div>

            <div>

              <h3>
                Integrity Tools
              </h3>

              <strong>
                1
              </strong>

              <p>
                Available
              </p>

            </div>

          </div>

          <div className="dashboard-stat">

            <div className="stat-icon">
              🎓
            </div>

            <div>

              <h3>
                AI Education
              </h3>

              <strong>
                Ready
              </strong>

              <p>
                Explore resources
              </p>

            </div>

          </div>

        </div>

        <h2 className="dashboard-section-title">
          Teacher Tools
        </h2>

        <div className="dashboard-tools">

          <div
            className="dashboard-tool"
            onClick={() =>
              setPage('teacherPlagiarism')
            }
          >

            <div className="tool-icon">
              📚
            </div>

            <h3>
              Plagiarism & Academic Integrity
            </h3>

            <p>
              Learn how AI affects academic integrity
              and review student work.
            </p>

            <button>
              Explore →
            </button>

          </div>

          <div
            className="dashboard-tool"
            onClick={() =>
              setPage('teacherChecker')
            }
          >

            <div className="tool-icon">
              🔎
            </div>

            <h3>
              Plagiarism Checker
            </h3>

            <p>
              Compare student writing against reference
              material and identify possible similarity.
            </p>

            <button>
              Open Checker →
            </button>

          </div>

          <div
            className="dashboard-tool"
            onClick={() =>
              setPage('teacherPlanning')
            }
          >

            <div className="tool-icon">
              📝
            </div>

            <h3>
              AI-Assisted Lesson Planning
            </h3>

            <p>
              Learn how teachers can responsibly use
              AI to support lesson planning.
            </p>

            <button>
              Explore →
            </button>

          </div>

          <div
            className="dashboard-tool"
            onClick={() =>
              setPage('teacherEthical')
            }
          >

            <div className="tool-icon">
              ⚖️
            </div>

            <h3>
              Ethical AI Integration
            </h3>

            <p>
              Understand fairness, privacy, transparency
              and responsible AI use.
            </p>

            <button>
              Explore →
            </button>

          </div>

          <div
            className="dashboard-tool"
            onClick={() =>
              setPage('teacherEducation')
            }
          >

            <div className="tool-icon">
              🎓
            </div>

            <h3>
              AI in Education
            </h3>

            <p>
              Explore opportunities and challenges
              created by AI in education.
            </p>

            <button>
              Explore →
            </button>

          </div>

        </div>

        <div className="achievements-card">

          <h2>
            💡 Teaching with AI
          </h2>

          <p>
            AI can be a powerful educational tool, but teachers
            should remain responsible for reviewing AI-generated
            content, checking accuracy and protecting student
            information.
          </p>

          <p>
            The goal is not to replace teachers. AI should
            support teachers while human judgement remains
            central to education.
          </p>

        </div>

        <button
          className="dashboard-back"
          onClick={handleLogout}
        >
          🚪 Log Out
        </button>

      </div>
    )
  }

  // ==========================================
  // TEACHER PLAGIARISM LESSON
  // ==========================================

  if (page === 'teacherPlagiarism') {

    if (!user || user.role !== 'teacher') {
      setPage('login')
      return null
    }

    return (

      <div className="learning-page">

        <h1>
          📚 Plagiarism & Academic Integrity
        </h1>

        <p>
          AI tools can make it easier for students to generate
          essays, answers and assignments. This creates new
          challenges for academic integrity.
        </p>

        <h2>
          What is plagiarism?
        </h2>

        <p>
          Plagiarism is presenting someone else's ideas, words
          or work as your own without appropriate
          acknowledgement.
        </p>

        <h2>
          How does AI change the issue?
        </h2>

        <p>
          Students may use AI to generate work without
          understanding the material or acknowledging that AI
          was used.
        </p>

        <h2>
          Signs teachers can look for
        </h2>

        <p>
          Teachers can compare a student's current work with
          previous work, ask students to explain their reasoning,
          request drafts and discuss sources.
        </p>

        <h2>
          What can teachers do?
        </h2>

        <p>
          Focus on the learning process. Ask students to explain
          their reasoning, show drafts and discuss how they
          developed their work.
        </p>

        <button
          onClick={() =>
            setPage('teacherDashboard')
          }
        >
          ← Back to Teacher Dashboard
        </button>

        <button
          onClick={() =>
            setPage('teacherChecker')
          }
        >
          Open Plagiarism Checker →
        </button>

      </div>
    )
  }

  // ==========================================
  // TEACHER PLAGIARISM CHECKER
  // ==========================================

  if (page === 'teacherChecker') {

    if (!user || user.role !== 'teacher') {
      setPage('login')
      return null
    }

    return (

      <div className="learning-page">

        <h1>
          🔎 Plagiarism & Similarity Checker
        </h1>

        <p>
          Compare student writing against reference material.
        </p>

        <div className="achievements-card">

          <h2>
            ⚠️ Important
          </h2>

          <p>
            This is a demonstration similarity checker.
            It compares the two pieces of text entered below.
            It does not search the internet, academic databases
            or other student submissions.
          </p>

        </div>

        <h2>
          👨‍🎓 Student Work
        </h2>

        <textarea
          value={studentText}
          onChange={(e) =>
            setStudentText(e.target.value)
          }
          placeholder="Paste the student's work here..."
          rows="10"
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid #b8c5d2',
            fontSize: '15px',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />

        <h2>
          📄 Reference Text
        </h2>

        <textarea
          value={referenceText}
          onChange={(e) =>
            setReferenceText(e.target.value)
          }
          placeholder="Paste the reference/source text here..."
          rows="10"
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid #b8c5d2',
            fontSize: '15px',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />

        <br />

        <button
          onClick={checkPlagiarism}
        >
          🔎 Check Similarity
        </button>

        <button
          onClick={clearPlagiarismChecker}
        >
          🗑️ Clear
        </button>

        {plagiarismResult && (

          <div className="achievements-card">

            {plagiarismResult.level === 'error' ? (

              <>

                <h2>
                  ⚠️ Check Required
                </h2>

                <p>
                  {plagiarismResult.message}
                </p>

              </>

            ) : (

              <>

                <h2>
                  📊 Similarity Result
                </h2>

                <h1>
                  {plagiarismResult.percentage}%
                </h1>

                <p>
                  {plagiarismResult.message}
                </p>

                {plagiarismResult.level === 'high' && (

                  <p>
                    🔴 High similarity
                  </p>

                )}

                {plagiarismResult.level === 'medium' && (

                  <p>
                    🟠 Moderate similarity
                  </p>

                )}

                {plagiarismResult.level === 'low' && (

                  <p>
                    🟢 Low similarity
                  </p>

                )}

              </>

            )}

          </div>
        )}

        <button
          onClick={() =>
            setPage('teacherDashboard')
          }
        >
          ← Back to Teacher Dashboard
        </button>

      </div>
    )
  }

  // ==========================================
  // TEACHER LESSON - AI PLANNING
  // ==========================================

  if (page === 'teacherPlanning') {

    if (!user || user.role !== 'teacher') {
      setPage('login')
      return null
    }

    return (

      <div className="learning-page">

        <h1>
          📝 AI-Assisted Lesson Planning
        </h1>

        <p>
          Teachers can use AI to help brainstorm lesson ideas,
          generate examples, create activities and adapt content
          for different learning needs.
        </p>

        <h2>
          Example
        </h2>

        <p>
          A teacher could ask an AI system to suggest three
          classroom activities for introducing artificial
          intelligence to high-school learners.
        </p>

        <h2>
          Good practice
        </h2>

        <p>
          Give the AI clear instructions, specify the learners'
          level and explain the educational objective.
        </p>

        <h2>
          Important reminder
        </h2>

        <p>
          AI-generated lesson plans should always be reviewed by
          the teacher. AI can produce inaccurate information,
          inappropriate examples or content that does not fit
          the learners' needs.
        </p>

        <button
          onClick={() =>
            setPage('teacherDashboard')
          }
        >
          ← Back to Teacher Dashboard
        </button>

      </div>
    )
  }

  // ==========================================
  // TEACHER LESSON - ETHICAL AI
  // ==========================================

  if (page === 'teacherEthical') {

    if (!user || user.role !== 'teacher') {
      setPage('login')
      return null
    }

    return (

      <div className="learning-page">

        <h1>
          ⚖️ Ethical AI Integration
        </h1>

        <p>
          Responsible AI use in education requires teachers and
          institutions to think about fairness, privacy,
          transparency and accountability.
        </p>

        <h2>
          🔐 Privacy
        </h2>

        <p>
          Avoid entering sensitive student information into
          public AI systems.
        </p>

        <h2>
          ⚖️ Fairness
        </h2>

        <p>
          AI systems can produce biased results. Teachers should
          critically review AI-generated recommendations.
        </p>

        <h2>
          👀 Transparency
        </h2>

        <p>
          Students should understand when and how AI is being
          used in their education.
        </p>

        <h2>
          👤 Human responsibility
        </h2>

        <p>
          Teachers remain responsible for decisions made in
          their classrooms. AI should assist human judgement,
          not replace it.
        </p>

        <button
          onClick={() =>
            setPage('teacherDashboard')
          }
        >
          ← Back to Teacher Dashboard
        </button>

      </div>
    )
  }

  // ==========================================
  // TEACHER LESSON - AI IN EDUCATION
  // ==========================================

  if (page === 'teacherEducation') {

    if (!user || user.role !== 'teacher') {
      setPage('login')
      return null
    }

    return (

      <div className="learning-page">

        <h1>
          🎓 AI in Education
        </h1>

        <p>
          Artificial intelligence is changing how students
          learn and how teachers create educational content.
        </p>

        <h2>
          Opportunities
        </h2>

        <p>
          AI can help personalise learning, provide additional
          explanations, support teachers and create educational
          resources.
        </p>

        <h2>
          Challenges
        </h2>

        <p>
          AI also creates challenges involving misinformation,
          privacy, bias, plagiarism and over-reliance on
          technology.
        </p>

        <h2>
          The goal
        </h2>

        <p>
          The goal is not to replace teachers. Instead, AI
          should be used as a tool that supports teaching and
          learning responsibly.
        </p>

        <button
          onClick={() =>
            setPage('teacherDashboard')
          }
        >
          ← Back to Teacher Dashboard
        </button>

      </div>
    )
  }

  // ==========================================
  // STUDENT DASHBOARD
  // ==========================================

  if (page === 'dashboard') {

    if (!user) {
      setPage('login')
      return null
    }

    if (user.role !== 'student') {
      setPage('teacherDashboard')
      return null
    }

    const lessonsCompleted =
      Number(lesson1Complete) +
      Number(lesson2Complete)

    const lessonProgress =
      (lessonsCompleted / 2) * 100

    const quizProgress =
      (score / 3) * 100

    const overallProgress =
      Math.round(
        (lessonProgress + quizProgress) / 2
      )

    return (

      <div className="dashboard-page">

        <div className="dashboard-header">

          <div>

            <p className="dashboard-label">
              STUDENT DASHBOARD
            </p>

            <h1>
              👋 Welcome back, {user.name}!
            </h1>

            <p>
              Continue your AI literacy journey and
              build your digital skills.
            </p>

          </div>

          <div className="dashboard-icon">
            🎓
          </div>

        </div>

        <div className="dashboard-progress-card">

          <div className="progress-heading">

            <div>

              <h2>
                📚 Your Learning Progress
              </h2>

              <p>
                Keep going! You're making progress.
              </p>

            </div>

            <strong>
              {overallProgress}%
            </strong>

          </div>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${overallProgress}%`
              }}
            ></div>

          </div>

        </div>

        <div className="dashboard-stats">

          <div className="dashboard-stat">

            <div className="stat-icon">
              📖
            </div>

            <div>

              <h3>Lessons</h3>

              <strong>
                {lessonsCompleted}/2
              </strong>

              <p>
                Completed
              </p>

            </div>

          </div>

          <div className="dashboard-stat">

            <div className="stat-icon">
              🧠
            </div>

            <div>

              <h3>Quiz</h3>

              <strong>
                {score}/3
              </strong>

              <p>
                Current Score
              </p>

            </div>

          </div>

          <div className="dashboard-stat">

            <div className="stat-icon">
              🕵️
            </div>

            <div>

              <h3>
                Spot the Fake
              </h3>

              <strong>
                Ready
              </strong>

              <p>
                Test your skills
              </p>

            </div>

          </div>

        </div>

        <div className="continue-card">

          <div>

            <span className="continue-badge">
              RECOMMENDED
            </span>

            <h2>
              🚀 Continue Learning
            </h2>

            <p>
              Learn how AI systems use data and
              patterns to produce results.
            </p>

          </div>

          <button
            onClick={() =>
              openLearningPage('lesson2')
            }
          >
            Continue Learning →
          </button>

        </div>

        <h2 className="dashboard-section-title">
          Explore Your Learning Tools
        </h2>

        <div className="dashboard-tools">

          <div
            className="dashboard-tool"
            onClick={() =>
              openLearningPage('learning')
            }
          >

            <div className="tool-icon">
              📚
            </div>

            <h3>
              AI Lessons
            </h3>

            <p>
              Learn the fundamentals of
              artificial intelligence.
            </p>

            <button>
              View Lessons →
            </button>

          </div>

          <div
            className="dashboard-tool"
            onClick={() =>
              openLearningPage('quiz')
            }
          >

            <div className="tool-icon">
              🧠
            </div>

            <h3>
              AI Quiz
            </h3>

            <p>
              Test your understanding of
              artificial intelligence.
            </p>

            <button>
              Take Quiz →
            </button>

          </div>

          <div
            className="dashboard-tool"
            onClick={() =>
              openLearningPage('misinformation')
            }
          >

            <div className="tool-icon">
              🕵️
            </div>

            <h3>
              Spot the Fake
            </h3>

            <p>
              Learn how to identify
              misleading information.
            </p>

            <button>
              Start Activity →
            </button>

          </div>

          <div
            className="dashboard-tool"
            onClick={() =>
              openLearningPage('tutor')
            }
          >

            <div className="tool-icon">
              🤖
            </div>

            <h3>
              AI Tutor
            </h3>

            <p>
              Ask questions and learn
              about AI.
            </p>

            <button>
              Ask Tutor →
            </button>

          </div>

        </div>

        <div className="achievements-card">

          <div>

            <h2>
              🏆 Achievements
            </h2>

            <p>
              Complete activities to unlock
              achievements.
            </p>

          </div>

          <div className="achievement-list">

            <div
              className={
                lesson1Complete
                  ? "achievement unlocked"
                  : "achievement"
              }
            >

              <span>📖</span>

              <div>

                <strong>
                  First Lesson
                </strong>

                <p>
                  Complete your first AI lesson
                </p>

              </div>

            </div>

            <div
              className={
                lesson2Complete
                  ? "achievement unlocked"
                  : "achievement"
              }
            >

              <span>🧠</span>

              <div>

                <strong>
                  AI Explorer
                </strong>

                <p>
                  Complete both lessons
                </p>

              </div>

            </div>

            <div
              className={
                score > 0
                  ? "achievement unlocked"
                  : "achievement"
              }
            >

              <span>🏆</span>

              <div>

                <strong>
                  Quiz Starter
                </strong>

                <p>
                  Start the AI literacy quiz
                </p>

              </div>

            </div>

          </div>

        </div>

        <button
          className="dashboard-back"
          onClick={handleLogout}
        >
          🚪 Log Out
        </button>

      </div>
    )
  }

  // ==========================================
  // LOGIN PAGE
  // ==========================================

  if (page === 'login') {

    return (

      <div className="login-page">

        <div className="login-card">

          <div className="login-icon">
            🤖
          </div>

          <h1>
            Welcome Back
          </h1>

          <p>
            Sign in to access your account and learning content.
          </p>

          <form onSubmit={handleLogin}>

            <label>
              Email Address
            </label>

            <input
              type="email"
              value={loginEmail}
              onChange={(e) =>
                setLoginEmail(e.target.value)
              }
              placeholder="Enter your email"
            />

            <label>
              Password
            </label>

            <input
              type="password"
              value={loginPassword}
              onChange={(e) =>
                setLoginPassword(e.target.value)
              }
              placeholder="Enter your password"
            />

            {loginMessage && (

              <p className="auth-message">
                {loginMessage}
              </p>

            )}

            <button type="submit">
              Sign In →
            </button>

          </form>

          <div className="auth-divider">
            Don't have an account?
          </div>

          <button
            className="secondary-button"
            onClick={() => {

              setLoginMessage('')
              setPage('signup')

            }}
          >
            Create Account
          </button>

          <button
            className="login-back"
            onClick={() =>
              setPage('home')
            }
          >
            ← Back to Home
          </button>

        </div>

      </div>
    )
  }

  // ==========================================
  // SIGN UP PAGE
  // ==========================================

  if (page === 'signup') {

    return (

      <div className="auth-page">

        <div className="auth-card">

          <div className="auth-icon">
            🤖
          </div>

          <h1>
            Create Your Account
          </h1>

          <p>
            Join the AI Literacy Platform and start
            your learning journey.
          </p>

          <form onSubmit={handleSignup}>

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={signupName}
              onChange={(e) =>
                setSignupName(e.target.value)
              }
            />

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={signupEmail}
              onChange={(e) =>
                setSignupEmail(e.target.value)
              }
            />

            <label>
              Account Type
            </label>

            <select
              value={signupRole}
              onChange={(e) =>
                setSignupRole(e.target.value)
              }
              style={{
                width: '100%',
                padding: '13px 14px',
                border: '1px solid #b8c5d2',
                borderRadius: '10px',
                fontSize: '15px',
                background: '#ffffff',
                color: '#172b4d',
                marginBottom: '5px'
              }}
            >

              <option value="student">
                Student
              </option>

              <option value="teacher">
                Teacher
              </option>

            </select>

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={signupPassword}
              onChange={(e) =>
                setSignupPassword(e.target.value)
              }
            />

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={signupConfirmPassword}
              onChange={(e) =>
                setSignupConfirmPassword(e.target.value)
              }
            />

            {signupMessage && (

              <p className="auth-message">
                {signupMessage}
              </p>

            )}

            <button type="submit">
              Create Account →
            </button>

          </form>

          <div className="auth-divider">
            Already have an account?
          </div>

          <button
            className="secondary-button"
            onClick={() =>
              setPage('login')
            }
          >
            Sign In
          </button>

          <button
            className="back-button"
            onClick={() =>
              setPage('home')
            }
          >
            ← Back to Home
          </button>

        </div>

      </div>
    )
  }

  // ==========================================
  // PROGRESS
  // ==========================================

  if (page === 'progress') {

    if (!user) {
      setPage('login')
      return null
    }

    if (user.role !== 'student') {
      setPage('teacherDashboard')
      return null
    }

    const lessonsCompleted =
      Number(lesson1Complete) +
      Number(lesson2Complete)

    return (

      <div className="progress-page">

        <h1>
          📊 My Progress
        </h1>

        <h2>
          Learning Progress
        </h2>

        <p>
          Lessons completed: {lessonsCompleted} / 2
        </p>

        <p>
          Lesson 1:{' '}
          {lesson1Complete
            ? '✅ Completed'
            : '⬜ Not completed'}
        </p>

        <p>
          Lesson 2:{' '}
          {lesson2Complete
            ? '✅ Completed'
            : '⬜ Not completed'}
        </p>

        <h2>
          🧠 Quiz
        </h2>

        <p>
          Current score: {score} / 3
        </p>

        <h2>
          🏆 Achievements
        </h2>

        {lesson1Complete && (
          <p>
            ✓ First Lesson Completed
          </p>
        )}

        {lesson2Complete && (
          <p>
            ✓ Second Lesson Completed
          </p>
        )}

        {score > 0 && (
          <p>
            ✓ Quiz Progress Started
          </p>
        )}

        <button
          onClick={() =>
            setPage('dashboard')
          }
        >
          ← Back to Dashboard
        </button>

      </div>
    )
  }

  // ==========================================
  // QUIZ
  // ==========================================

  if (page === 'quiz') {

    if (!user || user.role !== 'student') {
      setPage(user ? 'teacherDashboard' : 'login')
      return null
    }

    const handleAnswer = (isCorrect) => {

      if (answered) return

      setCorrect(isCorrect)
      setAnswered(true)

      if (isCorrect) {
        setScore(score + 1)
      }
    }

    const nextQuestion = () => {

      setQuestion(question + 1)
      setAnswered(false)
      setCorrect(false)

    }

    const restartQuiz = () => {

      setQuestion(1)
      setScore(0)
      setAnswered(false)
      setCorrect(false)

    }

    return (

      <div className="quiz-page">

        <h1>
          🧠 AI Literacy Quiz
        </h1>

        <p>
          Question {question} of 3
        </p>

        {question === 1 && (

          <>

            <h2>
              What do AI systems learn from?
            </h2>

            <button onClick={() => handleAnswer(false)}>
              Random guesses
            </button>

            <button onClick={() => handleAnswer(true)}>
              Data and patterns
            </button>

            <button onClick={() => handleAnswer(false)}>
              Human emotions
            </button>

            <button onClick={() => handleAnswer(false)}>
              Nothing
            </button>

          </>
        )}

        {question === 2 && (

          <>

            <h2>
              Which of these is an example of AI?
            </h2>

            <button onClick={() => handleAnswer(false)}>
              A calculator doing 2 + 2
            </button>

            <button onClick={() => handleAnswer(true)}>
              A recommendation system suggesting videos
            </button>

            <button onClick={() => handleAnswer(false)}>
              A normal light switch
            </button>

            <button onClick={() => handleAnswer(false)}>
              A pencil
            </button>

          </>
        )}

        {question === 3 && (

          <>

            <h2>
              Why should we check information generated by AI?
            </h2>

            <button onClick={() => handleAnswer(true)}>
              AI can sometimes make mistakes or provide false information
            </button>

            <button onClick={() => handleAnswer(false)}>
              AI is always correct
            </button>

            <button onClick={() => handleAnswer(false)}>
              There is no reason to check it
            </button>

            <button onClick={() => handleAnswer(false)}>
              AI never produces information
            </button>

          </>
        )}

        {answered && question < 3 && (

          <div>

            <h2>
              {correct
                ? '🎉 Correct! Great job!'
                : '❌ Not quite. Keep learning!'}
            </h2>

            <p>
              Current score: {score}/3
            </p>

            <button onClick={nextQuestion}>
              Next Question →
            </button>

          </div>
        )}

        {answered && question === 3 && (

          <div>

            <h2>
              {correct
                ? '🎉 Correct! Great job!'
                : '❌ Not quite. Keep learning!'}
            </h2>

            <h2>
              🎊 Quiz Complete!
            </h2>

            <p>
              Your final score: {score}/3
            </p>

            <button onClick={restartQuiz}>
              🔄 Restart Quiz
            </button>

            <button
              onClick={() =>
                setPage('dashboard')
              }
            >
              ← Back
            </button>

          </div>
        )}

        {!answered && (

          <button
            onClick={() =>
              setPage('dashboard')
            }
          >
            ← Back
          </button>

        )}

      </div>
    )
  }

  // ==========================================
  // LESSON 2
  // ==========================================

  if (page === 'lesson2') {

    if (!user || user.role !== 'student') {
      setPage(user ? 'teacherDashboard' : 'login')
      return null
    }

    return (

      <div className="learning-page">

        <p className="dashboard-label">
          AI LITERACY LESSON
        </p>

        <h1>
          Lesson 2: How Does AI Learn?
        </h1>

        <p>
          AI systems learn by finding patterns in data.
          Instead of being programmed with an answer for every
          possible situation, an AI system can use examples to
          learn how to make predictions.
        </p>

        <h2>
          💡 An example
        </h2>

        <p>
          Imagine showing an AI thousands of pictures of cats
          and dogs. Over time, the system can learn patterns
          that help it distinguish between the two.
        </p>

        <h2>
          🧠 Remember
        </h2>

        <p>
          AI does not "think" exactly like a human. It uses
          patterns, algorithms and data to produce its results.
        </p>

        <button
          onClick={() =>
            setPage('learning')
          }
        >
          ← Previous Lesson
        </button>

        <button
          onClick={() => {

            setLesson2Complete(true)
            setPage('quiz')

          }}
        >
          Take Quiz →
        </button>

        <button
          onClick={() =>
            setPage('dashboard')
          }
        >
          ← Back
        </button>

      </div>
    )
  }

  // ==========================================
  // LESSON 1
  // ==========================================

  if (page === 'learning') {

    if (!user || user.role !== 'student') {
      setPage(user ? 'teacherDashboard' : 'login')
      return null
    }

    return (

      <div className="learning-page">

        <p className="dashboard-label">
          AI LITERACY LESSON
        </p>

        <h1>
          Lesson 1: What is Artificial Intelligence?
        </h1>

        <p>
          Artificial Intelligence, or AI, is technology that
          allows computers to perform tasks that normally require
          human intelligence.
        </p>

        <h2>
          💡 Think about this
        </h2>

        <p>
          You already interact with AI every day. Examples
          include recommendation systems on YouTube and Netflix,
          voice assistants, maps and navigation, and spam
          filters in your email.
        </p>

        <h2>
          🧠 Did you know?
        </h2>

        <p>
          AI systems can learn patterns from large amounts of
          data and use those patterns to make predictions or
          generate information.
        </p>

        <button
          onClick={() => {

            setLesson1Complete(true)
            setPage('lesson2')

          }}
        >
          Next Lesson →
        </button>

        <button
          onClick={() =>
            setPage('dashboard')
          }
        >
          ← Back
        </button>

      </div>
    )
  }

  // ==========================================
  // HOME PAGE
  // ==========================================
  // LOGGED OUT:
  // ONLY HOME + SIGN IN
  // ==========================================

  return (

    <>

      <nav className="navbar">

        <h2>
          AI LITERACY
        </h2>

        <div className="nav-links">

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setPage('home')
            }}
          >
            Home
          </a>

          {!user && (

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setLoginMessage('')
                setPage('login')
              }}
            >
              Sign In
            </a>

          )}

          {user && user.role === 'student' && (

            <>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  openStudentDashboard()
                }}
              >
                Student Dashboard
              </a>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleLogout()
                }}
              >
                Logout
              </a>

            </>

          )}

          {user && user.role === 'teacher' && (

            <>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  openTeacherPage()
                }}
              >
                Teacher Dashboard
              </a>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleLogout()
                }}
              >
                Logout
              </a>

            </>

          )}

        </div>

      </nav>

      <div className="hero">

        <h1>
          AI Literacy Platform
        </h1>

        <p>
          Learn. Think. Create responsibly with AI.
        </p>

        {!user ? (

          <>

            <p>
              Create an account to access lessons,
              quizzes and interactive activities.
            </p>

            <button
              onClick={() =>
                setPage('login')
              }
            >
              Sign In to Start Learning →
            </button>

          </>

        ) : (

          <>

            <p>
              Welcome back, {user.name}.
            </p>

            <button
              onClick={() => {

                if (user.role === 'teacher') {
                  setPage('teacherDashboard')
                } else {
                  setPage('dashboard')
                }

              }}
            >
              {user.role === 'teacher'
                ? 'Go to Teacher Dashboard →'
                : 'Go to Student Dashboard →'}
            </button>

          </>

        )}

      </div>

      <section className="features">

        <div className="feature-card">

          <h3>
            📚 Learn AI
          </h3>

          <p>
            Understand how artificial intelligence works and
            how it affects everyday life.
          </p>

        </div>

        <div className="feature-card">

          <h3>
            🧠 Think Critically
          </h3>

          <p>
            Learn how to identify misinformation, deepfakes
            and misleading AI content.
          </p>

        </div>

        <div className="feature-card">

          <h3>
            🛡️ Stay Safe
          </h3>

          <p>
            Build better digital habits and learn how to
            protect your information online.
          </p>

        </div>

        <div className="feature-card">

          <h3>
            👩‍🏫 For Teachers
          </h3>

          <p>
            Access teaching resources, academic integrity
            guidance and responsible AI tools.
          </p>

        </div>

      </section>

    </>

  )
}

export default App