import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function LogoutListener() {
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => {
      navigate('/login', { replace: true })
    }
    window.addEventListener('auth:logout', handler as EventListener)
    return () => window.removeEventListener('auth:logout', handler as EventListener)
  }, [navigate])

  return null
}

