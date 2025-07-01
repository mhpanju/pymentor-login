import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        // ✅ redirect to your app after login
        window.location.href = 'http://localhost:8501/'  // replace this!
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <div className="auth-wrapper" style={{ maxWidth: 400, margin: 'auto', paddingTop: '10%' }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        providers={['google']}
        redirectTo="https://auth.pymentor.ai"
      />
    </div>
  )
}

export default App
