import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Wind, 
  Music, 
  Volume2,
  VolumeX,
  Trophy
} from 'lucide-react';
import './ZenFocus.css';

interface ZenFocusProps {
  onClose: () => void;
}

const ZenFocus: React.FC<ZenFocusProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'rest'>('focus');
  const [isMuted, setIsMuted] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  }, [mode]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      if (mode === 'focus') {
        setShowReward(true);
        // Play success sound logic here if available
      }
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'focus' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className="zen-focus-overlay animate-fade-in">
      <div className="zen-header">
        <button onClick={onClose} className="btn-close-zen"><X size={24} /></button>
        <div className="zen-mode-badge">{mode === 'focus' ? 'Enfoque Profundo' : 'Descanso'}</div>
        <div className="zen-actions">
          <button className="btn-icon-zen"><Music size={20} /></button>
          <button onClick={() => setIsMuted(!isMuted)} className="btn-icon-zen">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>

      <div className="zen-content">
        <div className="timer-container">
          <svg className="timer-svg" viewBox="0 0 100 100">
            <circle className="timer-bg" cx="50" cy="50" r="45" />
            <circle 
              className="timer-progress" 
              cx="50" cy="50" r="45" 
              style={{ strokeDasharray: 283, strokeDashoffset: 283 - (283 * progress) / 100 }}
            />
          </svg>
          <div className="timer-display">
            <span className="time-numbers">{formatTime(timeLeft)}</span>
            <span className="time-label">{mode === 'focus' ? 'minutos de enfoque' : 'tiempo de respiro'}</span>
          </div>
        </div>

        {/* Logo Breathing Animation Placeholder */}
        <div className={`phoenix-breathing ${isActive ? 'active' : ''}`}>
           <img src="/favicon.svg" alt="Phoenix" className="breathing-logo" />
        </div>

        <div className="timer-controls">
          <button onClick={resetTimer} className="btn-secondary-zen"><RotateCcw size={24} /></button>
          <button onClick={toggleTimer} className="btn-main-zen">
            {isActive ? <Pause size={32} /> : <Play size={32} fill="white" />}
          </button>
          <button onClick={() => setMode(mode === 'focus' ? 'rest' : 'focus')} className="btn-secondary-zen">
            <Wind size={24} />
          </button>
        </div>
      </div>

      {showReward && (
        <div className="reward-overlay animate-slide-up">
          <div className="reward-card">
            <Trophy size={48} className="icon-trophy" />
            <h2>¡Enfoque Completado!</h2>
            <p>Has ganado 10 Plumas de Fénix. Tu disciplina se fortalece.</p>
            <button onClick={() => { setShowReward(false); setMode('rest'); resetTimer(); }} className="btn-primary">
              Tomar un respiro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZenFocus;
