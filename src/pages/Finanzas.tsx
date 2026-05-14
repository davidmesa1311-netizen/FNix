import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  Calendar, 
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import { supabase } from '../db/db';
import './Finanzas.css';

interface Payment {
  id: number;
  title: string;
  amount: number;
  due_day: number;
  status: string;
}

const Finanzas: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalNeeded, setTotalNeeded] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDay, setNewDueDay] = useState('1');

  const loadFinances = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('monthly_payments')
        .select('*')
        .order('due_day', { ascending: true });
      
      const mapped = (data || []).map((p: any) => ({
        id: p.id, 
        title: p.title, 
        amount: Number(p.amount), 
        due_day: p.due_day, 
        status: p.status
      }));
      setPayments(mapped);
      
      const total = mapped.reduce((acc: number, curr: any) => acc + curr.amount, 0);
      setTotalNeeded(total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinances();
  }, []);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount) return;

    await supabase
      .from('monthly_payments')
      .insert({ 
        title: newTitle, 
        amount: parseFloat(newAmount), 
        due_day: parseInt(newDueDay) 
      });

    setNewTitle('');
    setNewAmount('');
    setNewDueDay('1');
    setIsAdding(false);
    loadFinances();
  };

  const handleDeletePayment = async (id: number, title: string) => {
    if (window.confirm(`¿Eliminar el pago de "${title}"?`)) {
      await supabase.from('monthly_payments').delete().eq('id', id);
      loadFinances();
    }
  };

  return (
    <div className="finanzas-view animate-fade-in">
      <header className="view-header">
        <div className="header-info">
          <h1>Finanzas Mensuales</h1>
          <p>Visualiza tus compromisos económicos del mes.</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn-fab">
            <Plus size={20} />
            <span>Añadir Pago</span>
          </button>
        )}
      </header>

      <section className="finance-summary-card animate-slide-up">
        <div className="summary-main">
          <div className="summary-label">
            <Wallet size={20} />
            <span>Presupuesto Necesario</span>
          </div>
          <div className="summary-value">
            ${totalNeeded.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
          </div>
          <div className="summary-badge">
            <ArrowUpRight size={14} />
            <span>{payments.length} obligaciones</span>
          </div>
        </div>
        <div className="summary-visual">
          <div className="visual-circle"></div>
        </div>
      </section>

      {isAdding && (
        <div className="creator-card animate-slide-up">
          <form onSubmit={handleAddPayment}>
            <div className="input-group">
              <span className="input-label">Descripción</span>
              <input 
                type="text" 
                placeholder="Ej. Arriendo, Internet, Gimnasio..." 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)}
                className="creator-title-input"
                autoFocus
              />
            </div>
            
            <div className="finance-options">
              <div className="option-item">
                <span className="input-label"><DollarSign size={12} /> Monto</span>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={newAmount} 
                  onChange={e => setNewAmount(e.target.value)}
                  className="finance-input"
                />
              </div>
              <div className="option-item">
                <span className="input-label"><Calendar size={12} /> Día de Pago</span>
                <input 
                  type="number" 
                  min="1" max="31"
                  value={newDueDay} 
                  onChange={e => setNewDueDay(e.target.value)}
                  className="finance-input"
                />
              </div>
            </div>

            <div className="creator-actions">
              <button type="button" onClick={() => setIsAdding(false)} className="btn-ghost">Cancelar</button>
              <button type="submit" className="btn-primary" disabled={!newTitle.trim() || !newAmount}>Registrar Obligación</button>
            </div>
          </form>
        </div>
      )}

      <div className="payments-list-premium">
        <div className="list-header">
          <h2>Pagos del Mes</h2>
        </div>
        
        {loading ? (
          <div className="loading-state">Actualizando saldos...</div>
        ) : payments.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={64} strokeWidth={1} />
            <p>No tienes pagos registrados para este periodo.</p>
          </div>
        ) : (
          payments.map(p => (
            <div key={p.id} className="payment-card-premium">
              <div className="payment-day-badge">
                <span className="day-num">{p.due_day}</span>
                <span className="day-label">Día</span>
              </div>
              <div className="payment-details">
                <h3>{p.title}</h3>
                <span className="payment-status">Mensual Recurrente</span>
              </div>
              <div className="payment-amount-side">
                <span className="amount-val">${p.amount.toLocaleString('es-CO')}</span>
                <button onClick={() => handleDeletePayment(p.id, p.title)} className="payment-delete-btn">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Finanzas;
