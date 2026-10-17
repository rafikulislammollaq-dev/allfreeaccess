import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-8 py-6 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
      <div className="flex items-center justify-center gap-1 mb-1">
        Made with <Heart size={12} className="text-[var(--bad)]" /> by Aurora · Free & Open Source (MIT)
      </div>
      <div>
        Powered by free public APIs. No tracking, no accounts, no payment.
      </div>
    </footer>
  );
}
