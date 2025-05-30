export function extractErrorDetails(error: unknown) {
  let code = 'unknown'
  let message = 'Unexpected error'

  if (typeof error === 'object' && error !== null) {
    if ('code' in error && typeof error.code === 'string') code = error.code
    if ('message' in error && typeof error.message === 'string') message = error.message
  }

  return { code, message }
}
