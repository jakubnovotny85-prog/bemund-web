'use client';

import { motion } from 'framer-motion';
import type { VerifyResult as VerifyResultType } from '@/lib/types';

interface VerifyResultProps {
  data: VerifyResultType;
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between py-2.5 border-t border-[rgba(201,169,110,0.15)]">
      <span className="text-[8px] tracking-[2px] uppercase text-[rgba(245,242,236,0.3)]">
        {label}
      </span>
      <span className={`text-[10px] tracking-[1px] ${highlight ? 'text-success' : 'text-[rgba(245,242,236,0.6)]'}`}>
        {value}
      </span>
    </div>
  );
}

export function VerifyResult({ data }: VerifyResultProps) {
  const { object, currentOwnership, ownershipHistory, issuer } = data;

  const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
      className="bg-graphite border border-[rgba(201,169,110,0.4)] rounded-sm p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-champagne via-champagne-light to-transparent" />

      <p className="text-[7px] tracking-[3px] uppercase text-champagne mb-1.5">
        Certificate &middot; Be Mund &middot; #{object.qr_code}
      </p>

      <h3 className="font-display text-2xl font-normal mb-1">{object.title}</h3>

      <p className="text-[10px] text-[rgba(245,242,236,0.6)] mb-5">
        {issuer.name} &middot; {object.description.split('.')[0]} &middot; {object.year}
      </p>

      <InfoRow
        label="Edition"
        value={`#${String(object.edition_number).padStart(3, '0')} of ${String(object.edition_total).padStart(3, '0')}`}
      />
      <InfoRow
        label="Current owner"
        value={`${currentOwnership.owner_name} (verified)`}
      />
      <InfoRow
        label="Certificate issued"
        value={dateFormatter.format(new Date(currentOwnership.acquired_at))}
      />
      <InfoRow
        label="Transfers"
        value={ownershipHistory.length <= 1 ? '0 (original owner)' : `${ownershipHistory.length - 1}`}
      />
      <InfoRow
        label="Blockchain"
        value="Cardano mainnet"
        highlight
      />

      <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2.5 bg-[rgba(122,184,154,0.1)] border border-[rgba(122,184,154,0.3)] rounded-sm">
        <div className="w-2.5 h-2.5 rounded-full bg-success" />
        <span className="text-[10px] tracking-[1.5px] text-success font-medium uppercase">
          Original verified
        </span>
      </div>

      {ownershipHistory.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[rgba(201,169,110,0.15)]">
          <p className="text-[8px] tracking-[3px] uppercase text-champagne font-medium mb-3">
            Ownership history
          </p>
          <div className="flex flex-col gap-2">
            {ownershipHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-2 px-3 bg-[rgba(245,242,236,0.03)] rounded-sm"
              >
                <div>
                  <span className="text-[10px] text-ivory block">
                    {entry.owner_name}
                  </span>
                  <span className="text-[8px] text-[rgba(245,242,236,0.3)] tracking-[1px]">
                    {dateFormatter.format(new Date(entry.acquired_at))}
                  </span>
                </div>
                <span className={`text-[8px] tracking-[2px] uppercase ${entry.is_current ? 'text-success' : 'text-[rgba(245,242,236,0.3)]'}`}>
                  {entry.is_current ? 'Current' : 'Previous'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-[8px] text-[rgba(245,242,236,0.25)] tracking-[0.5px] font-mono break-all pt-3 border-t border-[rgba(201,169,110,0.1)]">
        TX: {currentOwnership.transaction_hash}
      </div>
    </motion.div>
  );
}
