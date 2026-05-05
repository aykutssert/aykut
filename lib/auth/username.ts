const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase()
}

export function validateUsername(username: string) {
  if (!USERNAME_PATTERN.test(username)) {
    return 'Username must be 3-24 characters and use only lowercase letters, numbers, and underscores.'
  }

  return null
}
