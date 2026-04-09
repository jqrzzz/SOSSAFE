/**
 * Generate a human-readable verification code for certifications.
 * Format: SOS-XXXX (e.g., SOS-A7K2)
 *
 * Uses uppercase alphanumeric characters, excluding ambiguous ones
 * (0/O, 1/I/L) for readability on printed certificates and QR codes.
 */

const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"

export function generateVerificationCode(): string {
  let code = ""
  const array = new Uint8Array(6)
  crypto.getRandomValues(array)
  for (let i = 0; i < 6; i++) {
    code += CHARS[array[i] % CHARS.length]
  }
  return `SOS-${code}`
}
