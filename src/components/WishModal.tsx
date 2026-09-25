import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface WishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wish: string, name: string) => Promise<void>;
}

export default function WishModal({ isOpen, onClose, onSubmit }: WishModalProps) {
  const [wish, setWish] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const wishRef = useRef<HTMLTextAreaElement>(null);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = wish.trim();
    if (!trimmed) {
      setError('Hãy viết điều bạn mong ước nhé.');
      wishRef.current?.focus();
      return;
    }
    if (trimmed.length > 300) {
      setError('Điều ước tối đa 300 ký tự.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(trimmed, name.trim());
      setWish('');
      setName('');
      onClose();
    } catch {
      setError('Không thể gửi. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 100 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center px-4 py-8"
            style={{ zIndex: 101 }}
            onKeyDown={handleKeyDown}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-card w-full max-w-md p-6 relative"
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="wish-modal-title"
            >
              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Đóng"
                className="absolute top-4 right-4 text-amber-300/60 hover:text-amber-300 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Title */}
              <div className="text-center mb-6">
                <div className="text-3xl mb-2">🌕</div>
                <h2 id="wish-modal-title" className="text-xl font-display text-gradient-gold font-semibold">
                  Gửi một điều ước lên ánh trăng
                </h2>
                <p className="text-amber-200/60 text-sm mt-1">
                  Ánh trăng sẽ lắng nghe điều bạn mong.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Wish textarea */}
                <div>
                  <label htmlFor="wish-message" className="block text-amber-200 text-sm mb-2">
                    Điều bạn mong ước
                  </label>
                  <textarea
                    ref={wishRef}
                    id="wish-message"
                    value={wish}
                    onChange={(e) => {
                      setWish(e.target.value);
                      setError('');
                    }}
                    placeholder="Viết điều bạn mong ước..."
                    rows={4}
                    maxLength={300}
                    className="w-full rounded-xl px-4 py-3 text-amber-50 placeholder-amber-300/40 resize-none outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                    style={{
                      background: 'rgba(255, 200, 100, 0.06)',
                      border: '1px solid rgba(255, 209, 102, 0.2)',
                      fontSize: '0.9rem',
                    }}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    <span className="text-amber-300/40 text-xs ml-auto">{wish.length}/300</span>
                  </div>
                </div>

                {/* Name field */}
                <div>
                  <label htmlFor="wish-name" className="block text-amber-200 text-sm mb-2">
                    Tên của bạn <span className="text-amber-300/40">(không bắt buộc)</span>
                  </label>
                  <input
                    id="wish-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tên hoặc biệt danh..."
                    maxLength={50}
                    className="w-full rounded-xl px-4 py-3 text-amber-50 placeholder-amber-300/40 outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                    style={{
                      background: 'rgba(255, 200, 100, 0.06)',
                      border: '1px solid rgba(255, 209, 102, 0.2)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-primary w-full mt-2"
                  disabled={submitting}
                  style={{ opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? '⏳ Đang gửi...' : '🏮 Thả đèn'}
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
