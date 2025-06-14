import { redirect, type RequestHandler } from '@sveltejs/kit';
import crypto from 'crypto';

import {
    HASHKEY,
    HASHIV
  } from '$env/static/private'
import { decryptTradeInfo } from '$lib/serverUtils';

export const POST: RequestHandler = async ({ request }) => {

    const form = await request.formData();
    const encrypted = form.get('TradeInfo')?.toString() ?? '';
    const sha = form.get('TradeSha')?.toString() ?? '';

    const checkPlain = `HashKey=${HASHKEY}&${encrypted}&HashIV=${HASHIV}`;
    const expectedSha = crypto
        .createHash('sha256')
        .update(checkPlain)
        .digest('hex')
        .toUpperCase();

    if (expectedSha !== sha) {
        console.error('Notify: invalid TradeSha', { expectedSha, sha });
        return new Response('Invalid signature', { status: 400 });
    }

    const decrypted = decryptTradeInfo(encrypted);
    let data: any;
    try {
        data = JSON.parse(decrypted);
    } catch (e) {
        console.error('Notify: failed to parse decrypted JSON', decrypted);
        return new Response('Bad data', { status: 400 });
    }

    // await db.updateOrder(data.Result.MerchantOrderNo, {
    //   status: data.Status,
    //   payTime: data.Result.PayTime,
    //   tradeNo: data.Result.TradeNo
    // });
    console.log('Notify received:', data);
    return new Response('1|OK', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
    });
};

export async function GET() {
    throw redirect(302, '/');
}