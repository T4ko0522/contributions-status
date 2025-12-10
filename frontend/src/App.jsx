import { useState, useEffect } from 'react'
import './App.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from './loading.jsx'
import warningIcon from './assets/warning.svg'
import gitlabIcon from './assets/gitlab.png'
import redirectIcon from './assets/redirect.svg'
import portfolioIcon from './assets/portfolio.png'
import repositoryIcon from './assets/github-mark-white.png'

function App() {
  const [status, setStatus] = useState('loading')
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  
  // URLパラメータから初期値を取得
  const searchParams = new URLSearchParams(window.location.search)
  const initialGithub = searchParams.get('github') || ''
  const initialGitlab = searchParams.get('gitlab') || ''
  const initialTheme = searchParams.get('theme') || 'default'
  
  const [github, setGithub] = useState(initialGithub)
  const [gitlab, setGitlab] = useState(initialGitlab)
  const [theme, setTheme] = useState(initialTheme)
  const [generatedUrl, setGeneratedUrl] = useState(null)
  
  // APIのURLを自動生成
  const generateGraphUrl = (gh, gl, th) => {
    const params = new URLSearchParams()
    if (gh) params.append('github', gh)
    if (gl) params.append('gitlab', gl)
    if (th) params.append('theme', th)
    return `${backendUrl}/api/contributions?${params.toString()}`
  }
  
  // ボタンが押されたときにURLを生成
  const handleGenerate = () => {
    if (github || gitlab) {
      const url = generateGraphUrl(github, gitlab, theme)
      setGeneratedUrl(url)
    }
  }

  useEffect(() => {
    const fetchBackendStatus = async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 10000)

      try {
        const response = await fetch(`${backendUrl}/`, {
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          if (data.message === 'Backend API is running') {
            setStatus('success')
          } else {
            setStatus('error')
          }
        } else {
          setStatus('error')
        }
      } catch (error) {
        clearTimeout(timeoutId)
        if (error instanceof Error && error.name === 'AbortError') {
          console.error('Request timeout')
        } else {
          console.error('Backend connection error:', error)
        }
        setStatus('error')
      }
    }

    fetchBackendStatus()
  }, [backendUrl])

  const themes = ['default', 'gitlab', 'orange', 'red', 'pink']
  
  return (
    <>
      <h1>contributions-status</h1>
      {status === 'loading' && <Loader />}
      {status === 'success' && (
        <>
          <p style={{ color: '#00ff88' }}>contributions-status is Working!</p>
          
          {/* 入力フォーム */}
          <div style={{ 
            marginTop: '20px', 
            maxWidth: '600px', 
            margin: '20px auto',
            padding: '20px',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#8b949e', fontSize: '14px' }}>GitHub Username</label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="GitHub username"
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  color: '#c9d1d9',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#8b949e', fontSize: '14px' }}>GitLab Username</label>
              <input
                type="text"
                value={gitlab}
                onChange={(e) => setGitlab(e.target.value)}
                placeholder="GitLab username"
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  color: '#c9d1d9',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#8b949e', fontSize: '14px' }}>Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  color: '#c9d1d9',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {themes.map((t) => (
                  <option key={t} value={t} style={{ backgroundColor: '#0d1117' }}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 生成ボタン */}
            <button
              onClick={handleGenerate}
              disabled={!github && !gitlab}
              style={{
                padding: '10px 20px',
                backgroundColor: (github || gitlab) ? '#238636' : '#30363d',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                cursor: (github || gitlab) ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500',
                marginTop: '10px',
                opacity: (github || gitlab) ? 1 : 0.5
              }}
            >
              Generate a Graph
            </button>
          </div>
          
          {/* 画像とURLの表示 */}
          {generatedUrl && (
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <a 
                  href={generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    cursor: 'pointer',
                    display: 'inline-block'
                  }}
                >
                  <img 
                    src={generatedUrl} 
                    alt="Contributions Graph" 
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      borderRadius: '8px',
                      border: '1px solid #30363d'
                    }}
                  />
                </a>
              </div>
              
              {/* URL表示 */}
              <div style={{
                maxWidth: '600px',
                width: '100%',
                padding: '12px',
                backgroundColor: '#0d1117',
                borderRadius: '6px',
                border: '1px solid #30363d'
              }}>
                <p style={{ color: '#8b949e', fontSize: '12px', margin: '0 0 8px 0' }}>API URL:</p>
                <code style={{
                  color: '#58a6ff',
                  fontSize: '12px',
                  wordBreak: 'break-all',
                  display: 'block'
                }}>
                  {generatedUrl}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedUrl)
                    toast.success('URL has been copied to the clipboard')
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '6px 12px',
                    backgroundColor: '#238636',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Copy URL
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {status === 'error' && (
      <div>
        <p style={{ color: 'red' }}>contributions-status is Not Working...</p>
        <p>Probably the server of the backend is limited... TT</p>
      </div>
      )}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        left: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '10px'
      }}>
        <p style={{ color: 'orange', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img 
            src={warningIcon} 
            alt="Warning" 
            width="20" 
            height="20"
            style={{ display: 'block' }}
          />
          Please enable Private contributions in GitLab
        </p>
        <button 
          onClick={() => window.location.href = 'https://gitlab.com/-/user_settings/profile'}
          style={{ 
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          title="GitLab Setting"
        >
          <img 
            src={gitlabIcon} 
            alt="GitLab" 
            width="22" 
            height="22"
            style={{ display: 'block' }}
          />
          <span style={{ color: '#99c3ff' }}>GitLab Setting</span>
          <img 
            src={redirectIcon} 
            alt="Redirect" 
            width="16" 
            height="16"
            style={{ flexShrink: 0 }}
          />
        </button>
      </div>
      <div>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
          <button 
            onClick={() => window.location.href = 'https://t4ko.vercel.app'}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <img 
              src={portfolioIcon} 
              alt="Portfolio" 
              width="22" 
              height="22"
              style={{ display: 'block', borderRadius: '50%', objectFit: 'cover' }}
            />
            t4ko.vercel.app
          </button>
          <button 
            onClick={() => window.location.href = 'https://github.com/t4ko0522'}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <img 
              src="https://avatars.githubusercontent.com/u/108514947?v=" 
              alt="GitHub" 
              width="22" 
              height="22"
              style={{ display: 'block', borderRadius: '50%', objectFit: 'cover' }}
            />
            github.com/T4ko0522
          </button>
          <button 
            onClick={() => window.location.href = 'https://github.com/T4ko0522/contributions-status'}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <img 
              src={repositoryIcon} 
              alt="GitHub Repository" 
              width="22" 
              height="22"
              style={{ display: 'block', borderRadius: '50%', objectFit: 'cover' }}
            />
            Repository
          </button>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

export default App
