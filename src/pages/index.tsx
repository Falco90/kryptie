import { useEffect, useState } from 'react'
import Login from '@/components/magic/Login'
import PaymentPage from '@/components/PaymentPage'

export default function Home() {
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token') ?? '');
  }, [setToken]);

  return (
    <main>
      {
        process.env.NEXT_PUBLIC_MAGIC_API_KEY ? (
          token.length > 0 ? (
            <PaymentPage token={token} setToken={setToken} />
          ) : (
            <Login token={token} setToken={setToken} />
          )
        ) : (
          <p>dashboard redirect</p>
        )
      }
    </main>
  )
}
