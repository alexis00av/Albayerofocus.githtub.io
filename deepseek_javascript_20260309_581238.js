import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FiAward } from 'react-icons/fi';

export default function MonthlySummary() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user) return;
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

      // Consultar tareas del mes
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );
      const tasksSnap = await getDocs(tasksQuery);
      const tasks = tasksSnap.docs.map(doc => doc.data());

      const completedTasks = tasks.filter(t => t.done);
      const totalTasks = tasks.length;
      const completionRate = totalTasks ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

      // Obtener la tarea más importante completada (prioridad alta)
      const highPriorityCompleted = completedTasks.find(t => t.priority === 'alta');
      const bestTask = highPriorityCompleted ? highPriorityCompleted.text : (completedTasks[0]?.text || 'Ninguna');

      setSummary({
        totalTasks,
        completed: completedTasks.length,
        rate: completionRate,
        bestTask,
      });
    };
    fetchSummary();
  }, [user, selectedMonth]);

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setSelectedMonth(new Date(year, month - 1));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Resumen Mensual</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <input
          type="month"
          value={`${selectedMonth.getFullYear()}-${(selectedMonth.getMonth() + 1).toString().padStart(2, '0')}`}
          onChange={handleMonthChange}
          className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500">Tareas totales</p>
            <p className="text-3xl font-bold">{summary.totalTasks}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500">Completadas</p>
            <p className="text-3xl font-bold">{summary.completed}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500">Tasa de éxito</p>
            <p className="text-3xl font-bold">{summary.rate}%</p>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="flex items-center gap-3">
          <FiAward size={32} className="text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Lo mejor del mes</p>
            <p className="text-xl font-semibold">{summary?.bestTask || 'Nada destacado'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}