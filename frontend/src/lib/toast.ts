export function showError(message: string) {
  // Placeholder: integrate with aiq-design-system toast when available
  // For now, log and emit an event for observability/testing
  // eslint-disable-next-line no-console
  console.error('[toast:error]', message)
  window.dispatchEvent(new CustomEvent('toast:error', { detail: { message } }))
}

