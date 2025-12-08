import { useState, useEffect } from 'react'
import './App.css'
import Loader from './loading.jsx'
import warningIcon from './assets/warning.svg'
import gitlabIcon from './assets/gitlab.png'
import redirectIcon from './assets/redirect.svg'
import portfolioIcon from './assets/portfolio.png'
import repositoryIcon from './assets/github-mark-white.png'

function App() {
  const [status, setStatus] = useState('loading')
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const graphUrl = `${backendUrl}/api/contributions?gitlab=T4ko0522&github=T4ko0522&theme=pink`

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

  return (
    <>
      <h1>contributions-status</h1>
      {status === 'loading' && <Loader />}
      {status === 'success' && (
        <>
          <p style={{ color: '#00ff88' }}>contributions-status is Working!</p>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <a 
              href="https://contributions-status-server.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                cursor: 'pointer',
                display: 'inline-block'
              }}
            >
              <img 
                src={graphUrl} 
                alt="Contributions Graph" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  borderRadius: '8px'
                }}
              />
            </a>
          </div>
        </>
      )}
      {status === 'error' && (
      <div>
        <p style={{ color: 'red' }}>contributions-status is Not Working...</p>
        <p>多分バックエンドのサーバーに制限が来てるよ～；；</p>
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
    </>
  )
}

export default App
