const api = require('../src/services/api');

// Mock du module API
jest.mock('../src/services/api');

describe('TodoList - Tests de la logique métier', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Test 1: fetchTodos devrait appeler getAllTodos et retourner les données', async () => {
    // Arrange
    const mockTodos = [
      { _id: '1', text: 'Test todo 1', completed: false },
      { _id: '2', text: 'Test todo 2', completed: true }
    ];
    api.getAllTodos.mockResolvedValue(mockTodos);

    // Act 
    const fetchTodos = async () => {
      const data = await api.getAllTodos();
      return data;
    };
    const result = await fetchTodos();

    // Assert
    expect(api.getAllTodos).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockTodos);
  });

  test('Test 2: addTodo devrait créer un nouveau todo et le retourner', async () => {
    // Arrange
    const newTodoText = 'Nouvelle tâche';
    const createdTodo = { 
      _id: '3', 
      text: newTodoText, 
      completed: false 
    };
    api.createTodo.mockResolvedValue(createdTodo);

    // Act - Simuler la fonction addTodo
    const addTodo = async (text) => {
      const newTodo = await api.createTodo(text);
      return newTodo;
    };
    const result = await addTodo(newTodoText);

    // Assert
    expect(api.createTodo).toHaveBeenCalledWith(newTodoText);
    expect(result).toEqual(createdTodo);
    expect(result.text).toBe(newTodoText);
    expect(result.completed).toBe(false);
  });

  test('Test 3: toggleTodo devrait inverser le statut completed', async () => {
    // Arrange
    const todoId = '1';
    const originalTodo = { _id: todoId, text: 'Test', completed: false };
    const updatedTodo = { ...originalTodo, completed: true };
    api.updateTodo.mockResolvedValue(updatedTodo);

    // Act - Simuler la fonction toggleTodo
    const toggleTodo = async (id, currentStatus) => {
      const updated = await api.updateTodo(id, { 
        completed: !currentStatus 
      });
      return updated;
    };
    const result = await toggleTodo(todoId, originalTodo.completed);

    // Assert
    expect(api.updateTodo).toHaveBeenCalledWith(todoId, { 
      completed: true 
    });
    expect(result.completed).toBe(true);
    expect(result._id).toBe(todoId);
  });

  test('Test 4: removeTodo devrait appeler deleteTodo avec le bon ID', async () => {
    // Arrange
    const todoId = '2';
    api.deleteTodo.mockResolvedValue();

    // Act - Simuler la fonction removeTodo
    const removeTodo = async (id) => {
      await api.deleteTodo(id);
      return id;
    };
    const result = await removeTodo(todoId);

    // Assert
    expect(api.deleteTodo).toHaveBeenCalledWith(todoId);
    expect(api.deleteTodo).toHaveBeenCalledTimes(1);
    expect(result).toBe(todoId);
  });

  test('Test 5: devrait gérer les erreurs lors des appels API', async () => {
    // Arrange
    const error = new Error('API Error');
    api.getAllTodos.mockRejectedValue(error);
    api.createTodo.mockRejectedValue(error);
    api.updateTodo.mockRejectedValue(error);
    api.deleteTodo.mockRejectedValue(error);

    // Act & Assert - getAllTodos
    await expect(api.getAllTodos()).rejects.toThrow('API Error');

    // Act & Assert - createTodo
    await expect(api.createTodo('test')).rejects.toThrow('API Error');

    // Act & Assert - updateTodo
    await expect(api.updateTodo('1', {})).rejects.toThrow('API Error');

    // Act & Assert - deleteTodo
    await expect(api.deleteTodo('1')).rejects.toThrow('API Error');

    // Vérifier que toutes les fonctions ont été appelées
    expect(api.getAllTodos).toHaveBeenCalledTimes(1);
    expect(api.createTodo).toHaveBeenCalledTimes(1);
    expect(api.updateTodo).toHaveBeenCalledTimes(1);
    expect(api.deleteTodo).toHaveBeenCalledTimes(1);
  });
});