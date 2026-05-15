import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  Calendar, 
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { FinanceService } from '../services/FinanceService';
import type { FinanceRecord } from '../services/FinanceService';
import './Finanzas.css';

const Finanzas: React.FC = () => {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatorOpen, setCreatorOpen] = useState(false);
  
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newDay, setNewDay] = useState<number>(1);
  const [newCategory, setNewCategory] = useState('Servicios');

  useEffect(() => {
    loadFinances();
  }, []);

  const loadFinances = async () => {
    try {
      const data = await FinanceService.getAll();
      setRecords(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || newAmount <= 0) return;
    try {
      await FinanceService.addRecord(newDesc, newAmount, newCategory, newDay);
      setNewDesc('');
      setNewAmount(0);
      setCreatorOpen(false);
      loadFinances();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este registro?')) return;
    try {
      await FinanceService.deleteRecord(id);
      loadFinances();
    } catch (error) {
      console.error(error);
    }
  };

  const totalMonthly = records.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="finanzas-view animate-fade">
      <header className="view-header">
        <div>
          <h1>Presupuesto Mensual</h1>
          <p className="subtitle">Controla tus flujos para liberar recursos mentales.</p>
        </div>
        {!isCreatorOpen && (
          <button className="fab-button" onClick={() => setCreatorOpen(true)}>
            <Plus size={24} />
            <span>Nuevo Gasto</span>
          </button>
        )}
      </header>

      <div className="finance-summary-grid">
        <div className="premium-card summary-card main-sum">
          <div className="sum-header">
            <TrendingUp size={20} />
            <span>Presupuesto Total</span>
          </div>
          <div className="sum-value">
            <span className="currency">$</span>
            {totalMonthly.toLocaleString()}
          </div>
          <p className="sum-desc">Monto proyectado para el mes actual.</p>
        </div>
      </div>

      {isCreatorOpen && (
        <div className="creator-card premium-card animate-fade">
          <form onSubmit={handleAdd}>
            <div className="finance-inputs">
              <input 
                autoFocus
                className="creator-input desc-input"
                placeholder="Descripción del gasto..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <div className="amount-input-wrapper">
                <span className="prefix">$</span>
                <input 
                  type="number"
                  className="creator-input amount-input"
                  placeholder="0.00"
                  value={newAmount || ''}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="finance-meta-inputs">
              <div className="day-selector">
                <span className="group-label">Día de cobro</span>
                <input 
                  type="number" 
                  min="1" max="31" 
                  value={newDay} 
                  onChange={e => setNewDay(Number(e.target.value))} 
                />
              </div>
              <div className="category-select">
                 <span className="group-label">Categoría</span>
                 <select value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                    <option>Servicios</option>
                    <option>Suscripciones</option>
                    <option>Personal</option>
                    <option>Ahorro</option>
                 </select>
              </div>
            </div>

            <div className="creator-actions-footer">
              <button type="button" className="btn-ghost" onClick={() => setCreatorOpen(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={!newDesc.trim()}>
                <DollarSign size={16} />
                Registrar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="records-list">
        {loading ? (
          <div className="loading-state">Calculando estados financieros...</div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <Wallet size={48} />
            <p>No hay gastos registrados. ¡Excelente!</p>
          </div>
        ) : (
          records.map(record => (
            <div key={record.id} className="finance-card premium-card">
              <div className="record-day">
                 <span>Día</span>
                 <strong>{record.due_day}</strong>
              </div>
              <div className="record-main">
                <h3 className="record-desc">{record.description}</h3>
                <span className="record-cat">{record.category}</span>
              </div>
              <div className="record-amount">
                ${record.amount.toLocaleString()}
              </div>
              <button className="delete-btn" onClick={() => handleDelete(record.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Finanzas;
