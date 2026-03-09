import { useState } from 'react';
import { FiX, FiSend } from 'react-icons/fi';

// Simulación de respuestas de IA
const suggestions = {
  tasks: [
    "Revisar correos pendientes",
    "Hacer ejercicio 30 minutos",
    "Leer 20 páginas de un libro",
    "Llamar a un familiar",
    "Organizar el escritorio",
    "Planificar la semana",
    "Meditar 10 minutos",
    "Escribir en el diario"
  ],
  notes: [
    "Hoy me siento motivado porque...",
    "Lo más importante que aprendí hoy...",
    "Mañana quiero lograr...",
    "Un pensamiento interesante: ..."
  ]
};

export default function AIAssistant({ onClose }) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = () => {
    if (!input.trim()) return;
    setLoading(true);
    // Simulamos una llamada a IA
    setTimeout(() => {
      const lower = input.toLowerCase();
      let reply = '';
      if (lower.includes('tarea') || lower.includes('hacer')) {
        reply = 'Te sugiero estas tareas: ' + suggestions.tasks.slice(0, 3).join(', ') + '.';
      } else if (lower.includes('nota') || lower.includes('escribir')) {
        reply = 'Puedes empezar así: "' + suggestions.notes[Math.floor(Math.random() * suggestions.notes.length)] + '"';
      } else {
        reply = 'Lo siento, no entendí. Puedes preguntarme sobre tareas o notas.';
      }
      setResponse(reply);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-96">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold">Asistente IA</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <FiX size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {response && (
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg text-sm">
            {response}
          </div>
        )}
        {loading && <p className="text-gray-500">Pensando...</p>}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Pide ayuda con tareas o notas..."
          className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={handleAsk}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
}