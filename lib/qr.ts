export function generateQRId(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BM-${year}-${seq}-${rand}`;
}

export function getClaimUrl(qrId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.bemund.cz';
  return `${baseUrl}/claim/${qrId}`;
}
