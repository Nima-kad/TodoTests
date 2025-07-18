const {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo
} = require('../src/services/api');

// Mock global de fetch
global.fetch = jest.fn();

describe('MOCKS - Tests unitaires avec espionnage de fetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 – getAllTodos (succès)
  test('getAllTodos doit appeler fetch avec la bonne URL', async () => {
    // Arrange
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([])
    });

    // Act
    await getAllTodos();

    // Assert
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/todos');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  // Test 2 – createTodo (succès)
  test('createTodo doit envoyer une requête POST avec le bon body', async () => {
    // Arrange
    const text = 'Tâche mockée';
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({})
    });

    // Act
    await createTodo(text);

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/todos',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
    );
  });

  // Test 3 – updateTodo (succès)
  test('updateTodo doit envoyer une requête PUT avec les bonnes données', async () => {
    // Arrange
    const updates = { done: true };
    const id = 3;
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({})
    });

    // Act
    await updateTodo(id, updates);

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:5000/api/todos/${id}`,
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
    );
  });

  // Test 4 – deleteTodo (succès)
  test('deleteTodo doit envoyer une requête DELETE avec le bon id', async () => {
    // Arrange
    const id = 4;
    fetch.mockResolvedValueOnce({ json: jest.fn() });

    // Act
    await deleteTodo(id);

    // Assert
    expect(fetch).toHaveBeenCalledWith(`http://localhost:5000/api/todos/${id}`, {
      method: 'DELETE'
    });
  });

  // Test 5 – getAllTodos (erreur)
  test('getAllTodos doit gérer les erreurs (ex: fetch rejette)', async () => {
    // Arrange
    fetch.mockRejectedValueOnce(new Error('Erreur réseau'));

    // Act & Assert
    await expect(getAllTodos()).rejects.toThrow('Erreur réseau');
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/todos');
  });
});
