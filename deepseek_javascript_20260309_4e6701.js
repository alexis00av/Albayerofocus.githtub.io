import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function CalendarView() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    };
    fetchTasks();
  }, [user]);

  // Obtener tareas para una fecha específica
  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.date === dateStr);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Calendario</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={({ date, view }) => {
            if (view === 'month') {
              const tasksForDate = getTasksForDate(date);
              if (tasksForDate.length > 0) {
                return (
                  <div className="flex justify-center mt-1">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  </div>
                );
              }
            }
          }}
          className="border-0 w-full"
        />
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Tareas para {date.toLocaleDateString()}</h3>
        {getTasksForDate(date).length === 0 ? (
          <p className="text-gray-500">No hay tareas para este día.</p>
        ) : (
          <ul className="space-y-2">
            {getTasksForDate(date).map(task => (
              <li key={task.id} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${task.priority === 'alta' ? 'bg-red-500' : task.priority === 'media' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <span className={task.done ? 'line-through text-gray-400' : ''}>{task.text}</span>
                <span className="text-xs text-gray-500 ml-auto">{task.category}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}