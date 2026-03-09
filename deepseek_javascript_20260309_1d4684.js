import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FiTrash2, FiEdit } from 'react-icons/fi';

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;
      const q = query(collection(db, 'notes'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchNotes();
  }, [user]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    const note = { content: newNote, userId: user.uid, createdAt: new Date() };
    const docRef = await addDoc(collection(db, 'notes'), note);
    setNotes([{ id: docRef.id, ...note }, ...notes]);
    setNewNote('');
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, 'notes', id));
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Notas</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Escribe una nota..."
          rows="4"
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={addNote}
          className="mt-3 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Guardar nota
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map(note => (
          <div key={note.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow relative group">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{note.content}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(note.createdAt?.toDate()).toLocaleString()}</p>
            <button
              onClick={() => deleteNote(note.id)}
              className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}