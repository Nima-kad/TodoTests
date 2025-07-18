const todoController = require('../src/controllers/todoController');
const Todo = require('../src/models/Todo');

// Mock du module Todo
jest.mock('../src/models/Todo');

// Créer des objets de simulation pour req et res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn();
  return res;
};

describe('todoController', () => {

  afterEach(() => {
    jest.clearAllMocks(); // pour nettoyer apres chaque test
  });

   // Tester la récupération de tous les Todos
   // getAllTodos ou je vais utiliser le mock de Todo.find -cas nominal
  test('Test 1 : doit renvoyer tous les Todos (200)', async () => {

    // ARRANGER les données de test
    const req = {};
    const res = mockResponse();

    // pour simuler le comportement de Todo.find
    const mockSort = jest.fn().mockResolvedValue([
        { _id: '1', text: 'Todo 1' },
        { _id: '2', text: 'Todo 2' }
    ]);
    Todo.find.mockReturnValue({ sort: mockSort });

    // ACT
    await todoController.getAllTodos(req, res);

    // ASSERT

    expect(Todo.find).toHaveBeenCalledTimes(1);
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.json).toHaveBeenCalledWith([
        { _id: '1', text: 'Todo 1' },
        { _id: '2', text: 'Todo 2' }
    ]);
});

// Tester la mise à jour d'un Todo avec succès

test('Test 2 : doit créer un Todo avec succès (201)', async () => {
  // ARRANGE
  const req = {
    body: { text: 'Nouveau Todo' }
  };
  const res = mockResponse();

  // Simuler une date fixe pour createdAt
  const DateCreated = new Date();

  // Mock de .save()
  const mockSave = jest.fn().mockResolvedValue({
    _id: 'nima123',
    text: 'Nouveau Todo',
    completed: false,
    createdAt: DateCreated
  });

  // Remplacer le constructeur de Todo par un mock qui retourne un objet avec save()
  Todo.mockImplementation(() => ({ save: mockSave }));

  // ACT
  await todoController.createTodo(req, res);

  // ASSERT
  expect(mockSave).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    _id: 'nima123',
    text: 'Nouveau Todo',
    completed: false,
    createdAt: DateCreated
  });
});


test('Test 3 : doit retourner 400 si la création échoue (ex : champ manquant)', async () => {
  // ARRANGE
  const req = {
    body: {} // pas de texte fourni
  };
  const res = mockResponse();

  // Simuler le comportement de .save() qui échoue (ex : champ requis manquant)
  const mockSave = jest.fn().mockRejectedValue(
    new Error('Validation error'));

  // On retourne un objet avec la méthode save qui échoue
  Todo.mockImplementation(() => ({
    save: mockSave
  }));

  // ACT
  await todoController.createTodo(req, res);

  // ASSERT
  expect(mockSave).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
});

// Tester la modification d'un Todo avec succès
test('Test 4 : doit modifier un Todo existant avec succès (200)', async () => {
  // ARRANGE
  const req = {
    params: { id: '2' },
    body: { completed: true }
  };
  const res = mockResponse();

  // Simuler un todo existant avec une méthode save()
  const mockSave = jest.fn().mockResolvedValue({
    _id: '2',
    text: 'Todo modifié',
    completed: true,
    createdAt: new Date()
  });

  const fauxTodo = {
    completed: false,
    save: mockSave
  };

  Todo.findById.mockResolvedValue(fauxTodo);

  // ACT
  await todoController.updateTodo(req, res);

  // ASSERT
  expect(Todo.findById).toHaveBeenCalledWith('2');
  expect(fauxTodo.completed).toBe(true);
  expect(mockSave).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith({
    _id: '2',
    text: 'Todo modifié',
    completed: true,
    createdAt: expect.any(Date)
  });
});
// Tester la modification d'un Todo qui n'existe pas
test('Test 5 : doit retourner 404 si le Todo à modifier n\'existe pas (404)', async () => {
  // ARRANGE
  const req = { params: { id: 'nonexistent' } };
  const res = mockResponse();

  Todo.findById.mockResolvedValue(null);

  // ACT
  await todoController.updateTodo(req, res);

  // ASSERT
  expect(Todo.findById).toHaveBeenCalledWith('nonexistent');
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
});

// Tester la suppression d'un Todo existant
test('Test 6 : doit supprimer un Todo existant (200)', async () => {
  // ARRANGE
  const req = { params: { id: '3' } };
  const res = mockResponse();

  const mockRemove = jest.fn(); // simulateur de suppression

  // Simuler que Todo.findById retourne un objet avec une méthode .remove()
  Todo.findById.mockResolvedValue({ 
    remove: mockRemove
  });

  // ACT
  await todoController.deleteTodo(req, res);

  // ASSERT
  expect(Todo.findById).toHaveBeenCalledWith('3');
  expect(mockRemove).toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith({ 
    message: 'Todo removed' });
});

// Tester la suppression d'un Todo qui n'existe pas
test('Test 7 : doit retourner 404 si le Todo à supprimer n\'existe pas (404)', async () => {
  // ARRANGE
  const req = { params: { id: 'nonexistent' } };
  const res = mockResponse();

  Todo.findById.mockResolvedValue(null);

  // ACT
  await todoController.deleteTodo(req, res);

  // ASSERT
  expect(Todo.findById).toHaveBeenCalledWith('nonexistent');
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
});
}
);