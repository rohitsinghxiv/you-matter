/**
 * Client-Side Web Crypto API Implementation (AES-GCM 256-bit)
 * Zero-Knowledge: Keys are derived locally in browser memory and never sent to any server.
 */

// Random anonymous pseudonyms
const ADJECTIVES = [
  'Gentle', 'Quiet', 'Serene', 'Calm', 'Brave', 'Kind', 'Patient', 
  'Resilient', 'Mindful', 'Hopeful', 'Steady', 'Warm', 'Tranquil', 'Silent'
];

const NOUNS = [
  'Cedar', 'River', 'Pine', 'Haven', 'Harbor', 'Meadow', 'Horizon', 
  'Willow', 'Brook', 'Sparrow', 'Summit', 'Fern', 'Lantern', 'Canyon'
];

const COLORS = [
  '#0d9488', // Teal
  '#0284c7', // Sky
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#d97706', // Amber
  '#ec4899', // Pink
];

export function generateAnonymousIdentity() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const id = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    id,
    alias: `${adj} ${noun} #${num}`,
    avatarColor: color,
    createdAt: new Date().toISOString(),
  };
}

// Convert ArrayBuffer to Hex String
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Hex String to Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Derive AES-GCM 256 Key from passphrase and salt using PBKDF2
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt plaintext string using AES-GCM 256-bit with PBKDF2 derived key
 */
export async function encryptText(plaintext: string, passphrase: string): Promise<{
  ciphertext: string;
  iv: string;
  salt: string;
}> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const enc = new TextEncoder();
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    enc.encode(plaintext)
  );

  return {
    ciphertext: bufferToHex(encryptedBuffer),
    iv: bufferToHex(iv.buffer),
    salt: bufferToHex(salt.buffer),
  };
}

/**
 * Decrypt ciphertext string using AES-GCM 256-bit
 */
export async function decryptText(
  ciphertextHex: string,
  ivHex: string,
  saltHex: string,
  passphrase: string
): Promise<string> {
  try {
    const salt = hexToUint8Array(saltHex);
    const iv = hexToUint8Array(ivHex);
    const ciphertextBytes = hexToUint8Array(ciphertextHex);
    const key = await deriveKey(passphrase, salt);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertextBytes
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (err) {
    console.error('Decryption failed:', err);
    throw new Error('Invalid passphrase or corrupted encrypted record.');
  }
}

/**
 * Generate a local session encryption secret if user doesn't want a custom password
 */
export function getOrCreateDeviceEncryptionKey(): string {
  const keyName = 'you_matter_anon_device_key';
  let existing = localStorage.getItem(keyName);
  if (!existing) {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    existing = bufferToHex(array.buffer);
    localStorage.setItem(keyName, existing);
  }
  return existing;
}
