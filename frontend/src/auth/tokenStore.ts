type Listener = (token: string | null) => void

class TokenStore {
  private token: string | null = null
  private listeners = new Set<Listener>()

  constructor() {
    const persisted = window.localStorage.getItem('auth-token')
    this.token = persisted || null
  }

  get(): string | null {
    return this.token
  }

  set(token: string | null) {
    this.token = token
    if (token) window.localStorage.setItem('auth-token', token)
    else window.localStorage.removeItem('auth-token')
    this.listeners.forEach((l) => l(token))
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

export const tokenStore = new TokenStore()

export function triggerLogout() {
  tokenStore.set(null)
  window.dispatchEvent(new CustomEvent('auth:logout'))
}

