import { createHmac } from "node:crypto";

function isDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function getDateTrx(body: unknown) {
  if (body && typeof body === "object" && isDate((body as { date_trx?: unknown }).date_trx)) {
    return (body as { date_trx: string }).date_trx;
  }

  return new Date().toISOString().slice(0, 10);
}

export async function postSignedDateRequest(endpoint: string, key: string, dateTrx: string) {
  const body = JSON.stringify({ date_trx: dateTrx });
  const signature = createHmac("sha512", key).update(body).digest("hex");

  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${signature}`,
    },
    body,
    cache: "no-store",
  });
}
