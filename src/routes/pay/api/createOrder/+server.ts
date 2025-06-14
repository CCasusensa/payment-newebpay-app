import type { RequestHandler } from '@sveltejs/kit';
import crypto from 'crypto';
import { json } from '@sveltejs/kit';
import { orderCache, type PayOrder } from '$lib/serverUtils';
import {
  MerchantID,
  HASHKEY,
  HASHIV,
  ReturnUrl,
  NotifyUrl
} from '$env/static/private';
import { Buffer } from 'buffer';

const Version = '2.0';
const RespondType = 'JSON';

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData();
  const account = form.get('username')?.toString() ?? '';
  const amount = Number(form.get('amount')?.toString() ?? '0');

  const TimeStamp = Math.floor(Date.now() / 1000);
  const MerchantOrderNo = `ORDER_${TimeStamp}`;

  const po: PayOrder = { account, amount };
  orderCache.set(MerchantOrderNo, po);

  const tradeInfoObj = {
    MerchantID,
    RespondType,
    TimeStamp,
    Version,
    MerchantOrderNo,
    Email: account + "@gmail.com",
    Amt: amount,
    ItemDesc: '贊助支持',
    ReturnURL: ReturnUrl,
    NotifyURL: NotifyUrl
  };

  const dataStr = new URLSearchParams(tradeInfoObj as any).toString();
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(HASHKEY, 'utf8'),
    Buffer.from(HASHIV, 'utf8')
  );
  let aes = cipher.update(dataStr, 'utf8', 'hex');
  aes += cipher.final('hex');
  const sha = crypto
    .createHash('sha256')
    .update(`HashKey=${HASHKEY}&${aes}&HashIV=${HASHIV}`)
    .digest('hex')
    .toUpperCase();

  return json({
    MerchantID,
    TradeInfo: aes,
    TradeSha: sha,
    Version,
    MerchantOrderNo
  });
};