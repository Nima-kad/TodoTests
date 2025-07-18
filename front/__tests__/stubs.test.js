const {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo
} = require('../src/services/api');

global.fetch = jest.fn();

describe('STUBS - Tests basiques de l\'API avec fetch', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test pour getAllTodos
  test('getAllTodos retourne les données stubées', async () => {
    // Arrangement de fetch pour retourner des données stubées
    const fauxTodos = [{ 
        id: 1, 
        text: 'stub todo', 
        done: false 
    }];

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(fauxTodos)
    });

    const todos = await getAllTodos();
    expect(todos).toEqual(fauxTodos);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/todos');
  });

    // Tests pour createTodo
  test('createTodo envoie les bonnes données', async () => {
    const text = 'nouvelle tâche';
    const created = { id: 2, text, done: false };

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(created)
    });

    const result = await createTodo(text);
    expect(result).toEqual(created);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/todos',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
    );
  });

// Test d'erreur pour createTodo
  test('createTodo gère une erreur de fetch (ex: 500)', async () => {
    // Arrange : simulate a server error
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({ message: 'Erreur serveur' })
    });

    // Act + Assert : on s’attend à ce que l’appel échoue
    await expect(createTodo('Erreur')).resolves.toEqual({ message: 'Erreur serveur' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/todos',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Erreur' })
      })
    );
  });


// Tests pour updateTodo
  test('updateTodo envoie les modifications', async () => {
    const updates = { text: 'modifié', done: true };
    const updated = { id: 1, ...updates };

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(updated)
    });

    const result = await updateTodo(1, updates);
    expect(result).toEqual(updated);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/todos/1',
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
    );
  });

// Test pour deleteTodo
  test('deleteTodo appelle fetch avec DELETE', async () => {
    fetch.mockResolvedValueOnce();

    await deleteTodo(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/todos/1', {
      method: 'DELETE'
    });
  });
});
