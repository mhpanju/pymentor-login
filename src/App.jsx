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

  // useEffect(() => {
  //   const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session)
  //     if (session) {
  //       // ✅ redirect to your app after login
  //       window.location.href = 'http://localhost:8501/'  // replace this!
  //     }
  //   })
  //   return () => listener.subscription.unsubscribe()
  // }, [])
      useEffect(() => {
      async function handleAuth() {
        // ✅ If redirected back from Supabase after OAuth
        if (window.location.pathname.includes('/auth/v1/callback')) {
          const { data, error } = await supabase.auth.getSessionFromUrl();
          if (error) {
            console.error('OAuth callback error:', error.message);
            return;
          }
          if (data?.session) {
            setSession(data.session);
            // ✅ After successful login, redirect to your main app
            window.location.href = 'http://localhost:8501/';
            return;
          }
        }

        // ✅ Otherwise, just fetch session as usual
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      }

  handleAuth();
}, []);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="default"
          providers={['google']}
          redirectTo="http://localhost:8501/"
        />
      </div>
    </div>
  )
}

export default App