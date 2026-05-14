import React, { useState } from 'react';
import { 
  Rocket, 
  Target, 
  ChevronRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { setSetting } from '../db/db';
import './Onboarding.css';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: "Bienvenido a FNix",
      desc: "Tu sistema de enfoque personal, 100% privado y offline.",
      icon: <Rocket size={48} className="icon-brand" />,
    },
    {
      title: "Jerarquía de Éxito",
      desc: "Las Tareas y Hábitos alimentan tus Metas. Si tus acciones diarias están alineadas, tus metas se cumplen solas.",
      icon: <Target size={48} className="icon-brand" />,
    },
    {
      title: "Motor de Enfoque",
      desc: "Nuestro asistente inteligente analiza tus datos localmente para decirte en qué enfocarte cada día.",
      icon: <Sparkles size={48} className="icon-brand" />,
    },
    {
      title: "Privacidad Total",
      desc: "Tu información está segura en la nube con encriptación de nivel bancario.",
      icon: <ShieldCheck size={48} className="icon-brand" />,
    }
  ];

  const handleNext = async () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      await setSetting('onboarding_completed', 'true');
      onComplete();
    }
  };

  const current = steps[step - 1];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card animate-slide-up">
        <div className="onboarding-icon">{current.icon}</div>
        <h2>{current.title}</h2>
        <p>{current.desc}</p>
        
        <div className="onboarding-progress">
          {steps.map((_, i) => (
            <div key={i} className={`dot ${step === i + 1 ? 'active' : ''}`}></div>
          ))}
        </div>

        <button onClick={handleNext} className="btn-primary full-width">
          {step === steps.length ? 'Empezar ahora' : 'Siguiente'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
