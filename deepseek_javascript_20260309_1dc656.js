import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { FiTrash2, FiCheck, FiPlus } from 'react-icons/fi';

const CATEGORIES = ['Personal', 'Trabajo', 'Salud', 'Aprendizaje', 'Finanzas'];
const PRIORITIES = ['baja', 'media', 'alta'];

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ text: '', category: 'Personal', priority: 'media', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTasks();
  }, [user]);

  const addTask = async () => {
    if (!newTask.text.trim()) return;
    const task = { ...newTask, userId: user.uid, done: false, createdAt: new Date() };
    const docRef = await addDoc(collection(db, 'tasks'), task);
    setTasks([{ id: docRef.id, ...task }, ...tasks]);
    setNewTask({ text: '', category: 'Personal', priority: 'media', date: new Date().toISOString().split('T')[0] });
  };

  const toggleTask = async (id, done) => {
    await updateDoc(doc(db, 'tasks', id), { done: !done });
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !done } : t));
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tareas</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva tarea</label>
            <input
              type="text"
              value={newTask.text}
              onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
              placeholder="Ej: Comprar leche"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
            <select
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
            <input
              type="date"
              value={newTask.date}
              onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <button
            onClick={addTask}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1"
          >
            <FiPlus size={18} /> Añadir
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {['alta', 'media', 'baja'].map(priority => {
          const filtered = tasks.filter(t => t.priority === priority);
          if (filtered.length === 0) return null;
          return (
            <div key={priority} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h3 className="font-semibold capitalize mb-4">Prioridad {priority}</h3>
              <ul className="space-y-2">
                {filtered.map(task => (
                  <li key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <button
                      onClick={() => toggleTask(task.id, task.done)}
                      className={`w-5 h-5 rounded border flex items-center justify-center ${task.done ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400'}`}
                    >
                      {task.done && <FiCheck size={14} className="text-white" />}
                    </button>
                    <span className={`flex-1 ${task.done ? 'line-through text-gray-400' : ''}`}>{task.text}</span>
                    <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">{task.category}</span>
                    <span className="text-xs text-gray-500">{task.date}</span>
                    <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}