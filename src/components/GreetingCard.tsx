import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Share2, Check } from 'lucide-react';
import { Greeting } from '../types/wish';

interface GreetingCardProps {
  greeting: Greeting | null;
  onClose: () => void;
}

export default function GreetingCard({ greeting, onClose }: GreetingCardProps) {
  const [copied, setCopied] = useState(false);

  if (!greeting) return null;

  const cardText = [
    greeting.receiver ? `Gửi đến ${greeting.receiver} 🌙` : '🌙',
    '',
    greeting.message,
    '',
    greeting.sender ? `— ${greeting.sender}` : '',
  ].filter((_, i, arr) => !(i === arr.length - 1 && arr[i] === '')).join('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    const shareUrl = greeting.id
      ? `${window.location.origin}${window.location.pathname}?g=${greeting.id}`
      : undefined;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lời chúc Trung Thu 🏮',
          text: cardText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or not supported
        handleCopy();
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl ? `${cardText}\n\n${shareUrl}` : cardText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { handleCopy(); }
    }
  };

  return (
    <AnimatePresence>
      {greeting && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 100 }}
            onClick={onClose}
          />
          <div
            className="fixed inset-0 flex items-center justify-center px-4 py-8"
            style={{ zIndex: 101 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="glass-card w-full max-w-sm p-8 relative text-center"
              role="dialog"
              aria-modal="true"
              aria-label="Thiệp lời chúc"
            >
              <button
                onClick={onClose}
                aria-label="Đóng"
                className="absolute top-4 right-4 text-amber-300/60 hover:text-amber-300 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Decorative top */}
              <div className="text-3xl mb-4">🌙</div>

              {greeting.receiver && (
                <p className="text-amber-300 text-sm mb-1">Gửi đến</p>
              )}
              {greeting.receiver && (
                <h3 className="font-display text-2xl text-gradient-gold font-semibold mb-4">
                  {greeting.receiver}
                </h3>
              )}

              {/* Divider */}
              <div className="w-16 h-px mx-auto mb-5" style={{ background: 'rgba(255,209,102,0.3)' }} />

              {greeting.imageUrl && (
                <img src={greeting.imageUrl} alt="Ảnh đính kèm lời chúc" className="w-full max-h-52 object-cover rounded-xl mb-5" />
              )}

              {/* Message */}
              <p className="text-amber-100 text-sm leading-loose whitespace-pre-line mb-5" style={{ fontStyle: 'italic' }}>
                {greeting.message}
              </p>

              {/* Divider */}
              <div className="w-16 h-px mx-auto mb-4" style={{ background: 'rgba(255,209,102,0.3)' }} />

              {greeting.sender && (
                <p className="text-amber-400 text-sm">— {greeting.sender}</p>
              )}

              {/* Lantern decorations */}
              <div className="flex justify-center gap-3 my-4 text-lg">
                🏮 🌟 🏮
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleCopy}
                  className="btn-secondary flex items-center gap-2 flex-1 justify-center"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Đã sao chép' : 'Sao chép'}
                </button>
                <button
                  onClick={handleShare}
                  className="btn-primary flex items-center gap-2 flex-1 justify-center"
                >
                  <Share2 size={16} />
                  Chia sẻ
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
