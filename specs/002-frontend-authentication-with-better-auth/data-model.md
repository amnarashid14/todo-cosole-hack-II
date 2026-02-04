# Data Model: Frontend Authentication with Better Auth

## User Entity
- **id**: string (unique identifier from Better Auth)
- **name**: string (user's display name)
- **email**: string (unique, validated email format)
- **username**: string (unique, alphanumeric with underscores/hyphens)
- **createdAt**: Date (account creation timestamp)
- **lastLoginAt**: Date (last login timestamp)
- **isActive**: boolean (account status)

### Validation Rules
- Email: Must be valid email format (RFC 5322 compliant)
- Username: 3-30 characters, alphanumeric with underscores and hyphens only
- Name: 1-100 characters, no special symbols
- Password: Minimum 8 characters with uppercase, lowercase, number, and special character

### State Transitions
- Unregistered → Registered (on successful registration)
- Active → Locked (after 5 failed login attempts)
- Locked → Active (after 30 minutes or admin unlock)
- Active → Inactive (on logout)

## Session Entity
- **sessionId**: string (unique session identifier)
- **userId**: string (reference to user.id)
- **expiresAt**: Date (session expiration timestamp)
- **createdAt**: Date (session creation timestamp)
- **isPersistent**: boolean (true if "Remember me" was selected)
- **lastAccessedAt**: Date (last activity timestamp)

### Validation Rules
- Session must not be expired when accessed
- Session must correspond to an active user account
- Persistent sessions expire after 7 days, non-persistent after 24 hours

## PasswordResetToken Entity
- **token**: string (unique, cryptographically secure token)
- **userId**: string (reference to user.id)
- **expiresAt**: Date (token expiration timestamp, 1 hour from creation)
- **usedAt**: Date (timestamp when token was consumed, null if unused)
- **createdAt**: Date (token creation timestamp)

### Validation Rules
- Token must not be expired when used
- Token must not have been previously used
- Only one active token per user at a time

## LoginAttempt Entity
- **id**: string (unique identifier)
- **email**: string (email used in the attempt)
- **success**: boolean (whether login was successful)
- **timestamp**: Date (when attempt occurred)
- **ipAddress**: string (IP address of the request)
- **userId**: string (optional, linked to user.id if successful)

### Validation Rules
- Failed attempts from same IP/email are rate limited
- After 5 failed attempts, account is temporarily locked