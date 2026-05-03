/**
 * Wire format for encoding/decoding assessment results
 * 
 * Format:
 * - Byte 0: Wire format version (currently 1)
 * - Byte 1: Model version (currently 2)
 * - Bytes 2+: Answer values (2 bits each, 4 answers per byte)
 * 
 * Each answer is encoded as:
 * - 0: Traditional
 * - 1: Initial
 * - 2: Advanced
 * - 3: Optimal
 */

import { FormAnswers } from '../types';
import { maturityModel } from '../data/maturityModel';

const WIRE_FORMAT_VERSION = 1;
const MODEL_VERSION = 2;

/**
 * Generate ordered question keys from the maturity model
 */
function getOrderedQuestionKeys(): string[] {
  const keys: string[] = [];
  for (const pillar in maturityModel) {
    for (const fn in maturityModel[pillar]) {
      keys.push(`${pillar}:${fn}`);
    }
  }
  return keys;
}

/**
 * Encode answers into a hex string
 */
export function encodeAnswers(answers: FormAnswers): string {
  const orderedKeys = getOrderedQuestionKeys();
  const bytes: number[] = [];
  
  // Add header bytes
  bytes.push(WIRE_FORMAT_VERSION);
  bytes.push(MODEL_VERSION);
  
  // Pack answers into bytes (4 answers per byte, 2 bits each)
  let currentByte = 0;
  let bitPosition = 0;
  
  for (const key of orderedKeys) {
    const answer = answers[key] ?? 0; // Default to 0 if not answered
    
    // Ensure answer is in valid range (0-3)
    const value = Math.min(3, Math.max(0, answer));
    
    // Pack 2 bits into current byte (starting from most significant bits)
    currentByte |= (value << (6 - bitPosition));
    bitPosition += 2;
    
    // When we've filled a byte, add it and reset
    if (bitPosition === 8) {
      bytes.push(currentByte);
      currentByte = 0;
      bitPosition = 0;
    }
  }
  
  // Add remaining bits if any
  if (bitPosition > 0) {
    bytes.push(currentByte);
  }
  
  // Convert bytes to hex string
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Decode hex string into answers
 */
export function decodeAnswers(encoded: string): FormAnswers | null {
  try {
    // Validate hex string
    if (!/^[0-9a-fA-F]+$/.test(encoded)) {
      console.error('Invalid hex string');
      return null;
    }
    
    // Parse hex string into bytes
    const bytes: number[] = [];
    for (let i = 0; i < encoded.length; i += 2) {
      bytes.push(parseInt(encoded.substring(i, i + 2), 16));
    }
    
    // Validate minimum length (at least header bytes)
    if (bytes.length < 2) {
      console.error('Encoded string too short');
      return null;
    }
    
    // Check wire format version
    const wireVersion = bytes[0];
    if (wireVersion !== WIRE_FORMAT_VERSION) {
      console.error(`Unsupported wire format version: ${wireVersion}`);
      return null;
    }
    
    // Check model version
    const modelVersion = bytes[1];
    if (modelVersion !== MODEL_VERSION) {
      console.error(`Unsupported model version: ${modelVersion}`);
      return null;
    }
    
    // Unpack answers from bytes
    const orderedKeys = getOrderedQuestionKeys();
    const answers: FormAnswers = {};
    let byteIndex = 2;
    let bitPosition = 0;
    
    for (const key of orderedKeys) {
      if (byteIndex >= bytes.length) {
        console.error('Encoded string too short for all answers');
        return null;
      }
      
      // Extract 2 bits from current byte (starting from most significant bits)
      const value = (bytes[byteIndex] >> (6 - bitPosition)) & 0x03;
      answers[key] = value;
      
      bitPosition += 2;
      
      // Move to next byte when current is exhausted
      if (bitPosition === 8) {
        byteIndex++;
        bitPosition = 0;
      }
    }
    
    return answers;
  } catch (error) {
    console.error('Failed to decode answers:', error);
    return null;
  }
}

/**
 * Generate shareable URL for assessment results
 */
export function generateShareUrl(answers: FormAnswers): string {
  const encoded = encodeAnswers(answers);
  const baseUrl = window.location.origin + window.location.pathname;
  // Remove any existing /details/{encoded} path and trailing slash
  const cleanBaseUrl = baseUrl.replace(/\/details\/[0-9a-fA-F]+$/, '').replace(/\/$/, '');
  return `${cleanBaseUrl}/details/${encoded}`;
}

/**
 * Extract encoded string from current URL path
 */
export function getEncodedFromPath(): string | null {
  const path = window.location.pathname;
  const match = path.match(/\/details\/([0-9a-fA-F]+)$/);
  return match ? match[1] : null;
}
