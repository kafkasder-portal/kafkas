import { useState, useEffect } from 'react';
import './TodosList.css';

const TodosList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const savedTodos = localStorage.getItem('todos');
      const data = savedTodos ? JSON.parse(savedTodos) : [];
      setTodos(data);
    } catch (err) {
      setError('Todos yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const saveTodos = newTodos => {
    localStorage.setItem('todos', JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  const addTodo = async text => {
    try {
      const newTodo = {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      const newTodos = [...todos, newTodo];
      saveTodos(newTodos);
    } catch (err) {
      setError('Todo eklenirken hata oluştu');
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const newTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      );
      saveTodos(newTodos);
    } catch (err) {
      setError('Todo güncellenirken hata oluştu');
    }
  };

  const deleteTodo = async id => {
    try {
      const newTodos = todos.filter(todo => todo.id !== id);
      saveTodos(newTodos);
    } catch (err) {
      setError('Todo silinirken hata oluştu');
    }
  };

  if (loading) return <div className='loading'>Todos yükleniyor...</div>;
  if (error) return <div className='error'>Hata: {error}</div>;

  return (
    <div className='todos-container'>
      <h2>Yapılacaklar Listesi</h2>

      <div className='add-todo'>
        <input
          type='text'
          placeholder='Yeni todo ekle...'
          onKeyPress={e => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              addTodo(e.target.value.trim());
              e.target.value = '';
            }
          }}
        />
      </div>

      <div className='todos-list'>
        {todos.length === 0 ? (
          <p>Henüz todo yok</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className='todo-item'>
              <input
                type='checkbox'
                checked={todo.completed}
                onChange={e => toggleTodo(todo.id, e.target.checked)}
              />
              <span className={todo.completed ? 'completed' : ''}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className='delete-todo'
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodosList;
