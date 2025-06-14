import type { PageServerLoad } from './$types';
import { orderCache } from '$lib/serverUtils';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = ({ url }) => {
  const orderNo = url.searchParams.get('order') ?? '';
  const record = orderCache.get(orderNo);

  if (!record) {
    throw redirect(302, '/');
  }

  orderCache.delete(orderNo);

  return {
    status: record.status,
    message: record.message,
    shopProduct: record.shopProduct,
    account: record.account,
    amount: record.amount,
    tradeNo: record.tradeNo
  };
};