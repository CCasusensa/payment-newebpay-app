import crypto from 'crypto';
import { HASHKEY, HASHIV } from '$env/static/private';
import { Buffer } from 'buffer';

export interface PayOrder {
    account: string;
    amount: number;
    shopProduct?: string;
    status?: 'success' | 'fail';
    message?: string;
    tradeNo?: string;
  }

export const orderCache = new Map<string, PayOrder>();

export function decryptTradeInfo(encrypted: string): string {
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(HASHKEY, 'utf8'),
        Buffer.from(HASHIV, 'utf8')
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export function createAesEncrypt(data: any): string {
    const dataStr = new URLSearchParams(data).toString();
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(HASHKEY, 'utf8'),
        Buffer.from(HASHIV, 'utf8')
    );
    let encrypted = cipher.update(dataStr, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function createShaEncrypt(encryptedText: string): string {
    const plainText = `HashKey=${HASHKEY}&${encryptedText}&HashIV=${HASHIV}`;
    return crypto.createHash('sha256').update(plainText).digest('hex').toUpperCase();
}