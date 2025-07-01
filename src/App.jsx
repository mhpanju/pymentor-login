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
  const checkSession = async () => {
    // Step 1: If on callback URL, extract session from URL hash
    if (window.location.pathname.includes('/auth/v1/callback')) {
      const { data, error } = await supabase.auth.getSessionFromUrl();
      if (error) {
        console.error('Error in OAuth callback:', error.message);
        return;
      }
      setSession(data.session);
      // ✅ Optional: redirect to root after setting session
      window.location.href = 'http://localhost:8501';
      return;
    }

    // Step 2: If on any other route, try to restore session
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return;
    }
    setSession(session);
  };

  checkSession();
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
      {!session ? (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="default"
          providers={['google']}
          redirectTo="http://localhost:8501/"
        />
      ) : (
        <div>
          <h2>Welcome, {session.user.email}</h2>
          <button onClick={() => supabase.auth.signOut().then(() => setSession(null))}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  </div>
    //   <div style={{ width: '100%', maxWidth: '400px' }}>
    //     <Auth
    //       supabaseClient={supabase}
    //       appearance={{ theme: ThemeSupa }}
    //       theme="default"
    //       providers={['google']}
    //       redirectTo="http://localhost:8501/"
    //     />
    //   </div>
    // </div>
  )
}

export default App