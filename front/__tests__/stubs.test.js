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
    // Arrange
    const fauxTodos = [{ id: 1, text: 'stub todo', done: false }];
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(fauxTodos)
    });

    // Act
    const todos = await getAllTodos();

    // Assert
    expect(todos).toEqual(fauxTodos);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/todos');
  });

  // Test pour createTodo
  test('createTodo envoie les bonnes données', async () => {
    // Arrange
    const text = 'nouvelle tâche';
    const created = { id: 2, text, done: false };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(created)
    });

    // Act
    const result = await createTodo(text);

    // Assert
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
    // Arrange
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({ message: 'Erreur serveur' })
    });

    // Act
    const result = await createTodo('Erreur');

    // Assert
    expect(result).toEqual({ message: 'Erreur serveur' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/todos',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Erreur' })
      })
    );
  });

  // Test pour updateTodo
  test('updateTodo envoie les modifications', async () => {
    // Arrange
    const updates = { text: 'modifié', done: true };
    const updated = { id: 1, ...updates };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(updated)
    });

    // Act
    const result = await updateTodo(1, updates);

    // Assert
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
    // Arrange
    fetch.mockResolvedValueOnce();

    // Act
    await deleteTodo(1);

    // Assert
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/todos/1', {
      method: 'DELETE'
    });
  });
});
