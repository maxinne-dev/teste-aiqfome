import React from 'react'
import { Route, Routes } from 'react-router-dom'

function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>aiqfome Frontend Ready</h1>
      <p>Welcome! This is the SPA bootstrap placeholder.</p>
    </main>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

