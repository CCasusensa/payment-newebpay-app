import type { RequestHandler } from '@sveltejs/kit';
import { decryptTradeInfo, orderCache } from '$lib/serverUtils';
import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData();
  const encrypted = form.get('TradeInfo')?.toString() ?? '';
  const decrypted = decryptTradeInfo(encrypted);
  const data = JSON.parse(decrypted);

  const orderNo = data.Result?.MerchantOrderNo ?? '';
  const record = orderCache.get(orderNo);
  if (!record) {
    throw redirect(302, '/');
  }

  record.status = data.Status === 'SUCCESS' ? 'success' : 'fail';
  record.message = data.Message ?? '';
  record.tradeNo = data.Result?.TradeNo ?? '';
  record.shopProduct = data.Result?.ItemDesc ?? record.shopProduct;

  throw redirect(302, `/pay/result?order=${encodeURIComponent(orderNo)}`);
};

export const GET: RequestHandler = () => {
  throw redirect(302, '/');
};