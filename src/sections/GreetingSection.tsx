import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Greeting } from '../types/wish';
import { MOON_MESSAGES } from '../data/wishes';
import { randomChoice } from '../utils/random';

interface GreetingSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
  onGreetingGenerated: (g: Greeting) => void;
}

export default function GreetingSection({ sectionRef, onGreetingGenerated }: GreetingSectionProps) {
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, { once: true, margin: '-50px' });

  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [senderError, setSenderError] = useState('');
  const [messageError, setMessageError] = useState('');

  // Moon wish generator
  const [moonWish, setMoonWish] = useState('');
  const [moonWishVisible, setMoonWishVisible] = useState(false);
  const [moonWishKey, setMoonWishKey] = useState(0);

  const handleGetMoonWish = () => {
    const msg = randomChoice(MOON_MESSAGES);
    setMoonWish(msg);
    setMoonWishKey((k) => k + 1);
    setMoonWishVisible(true);
  };

  const handleSubmitGreeting = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!sender.trim()) {
      setSenderError('Hãy cho biết tên của bạn.');
      valid = false;
    } else {
      setSenderError('');
    }

    if (!message.trim()) {
      setMessageError('Hãy viết lời chúc của bạn.');
      valid = false;
    } else {
      setMessageError('');
    }

    if (!valid) return;

    onGreetingGenerated({
      sender: sender.trim(),
      receiver: receiver.trim() || undefined,
      message: message.trim(),
    });
  };

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative py-20 px-4"
      style={{ zIndex: 10 }}
    >
      <div ref={inViewRef} className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-2xl sm:text-3xl text-gradient-gold font-semibold mb-3">
            💌 Gửi lời chúc Trung Thu
          </h2>
          <p className="text-amber-200/60 text-sm">
            Tạo một thiệp chúc đêm trăng rằm, chia sẻ đến người bạn yêu quý.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Greeting form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-amber-200 font-medium mb-4 text-sm uppercase tracking-wider">
              Soạn lời chúc
            </h3>
            <form onSubmit={handleSubmitGreeting} className="space-y-4">
              <FormField
                id="g-sender"
                label="Tên của bạn"
                required
                error={senderError}
              >
                <input
                  id="g-sender"
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Tên..."
                  maxLength={50}
                  className="form-input"
                />
              </FormField>

              <FormField
                id="g-receiver"
                label="Gửi đến"
                hint="không bắt buộc"
              >
                <input
                  id="g-receiver"
                  type="text"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  placeholder="Tên người nhận..."
                  maxLength={50}
                  className="form-input"
                />
              </FormField>

              <FormField
                id="g-message"
                label="Lời chúc"
                required
                error={messageError}
              >
                <textarea
                  id="g-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Viết lời chúc từ trái tim..."
                  rows={4}
                  maxLength={400}
                  className="form-input resize-none"
                />
              </FormField>

              <button type="submit" className="btn-primary w-full">
                💌 Tạo thiệp chúc
              </button>
            </form>
          </motion.div>

          {/* Moon wish generator */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="text-amber-200 font-medium mb-2 text-sm uppercase tracking-wider">
              ✨ Lời chúc từ ánh trăng
            </h3>
            <p className="text-amber-300/60 text-xs mb-5 leading-relaxed">
              Để ánh trăng chọn một lời nhắn riêng cho bạn.
            </p>

            <button
              onClick={handleGetMoonWish}
              className="btn-secondary w-full mb-5 text-sm"
            >
              ✨ Nhận lời chúc từ ánh trăng
            </button>

            <AnimatePresence mode="wait">
              {moonWishVisible && (
                <motion.div
                  key={moonWishKey}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-5 px-4 rounded-xl relative"
                  style={{
                    background: 'rgba(255, 209, 102, 0.06)',
                    border: '1px solid rgba(255, 209, 102, 0.15)',
                  }}
                >
                  {/* Sparkles */}
                  <div className="text-xl mb-3">🌕</div>
                  <p className="text-amber-300/80 text-xs mb-2 italic">Ánh trăng nói rằng:</p>
                  <p className="text-amber-100 text-sm leading-relaxed" style={{ fontStyle: 'italic' }}>
                    "{moonWish}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!moonWishVisible && (
              <div
                className="text-center py-8 text-amber-300/30 text-sm italic"
              >
                Bấm để nhận lời nhắn từ ánh trăng...
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  id,
  label,
  hint,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-amber-200 text-sm mb-1.5">
        {label}
        {hint && <span className="text-amber-300/40 ml-1">({hint})</span>}
        {required && <span className="text-amber-400 ml-0.5">*</span>}
      </label>
      <div
        className="w-full rounded-xl overflow-hidden"
        style={{
          background: 'rgba(255, 200, 100, 0.06)',
          border: `1px solid ${error ? 'rgba(248, 113, 113, 0.5)' : 'rgba(255, 209, 102, 0.2)'}`,
        }}
      >
        {children}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
