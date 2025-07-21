const request = require('supertest');
const mongoose = require('mongoose');
const { app, startServer, closeServer } = require('../../src/app');
const Todo = require('../../src/models/Todo');
require('dotenv').config();

// Configuration de la base de données de test
const TEST_DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/test-todo-db?retryWrites=true&w=majority`;

describe('Todo Routes - Test d\'intégration avec base de données', () => {
  // Avant tous les tests
  beforeAll(async () => {
    // Se connecter à la base de données de test
    await mongoose.disconnect(); // Déconnecter toute connexion existante
    await mongoose.connect(TEST_DB_URI);
  }, 30000); // 30 secondes pour la connexion

  // Après tous les tests
  afterAll(async () => {
    // Fermer la connexion DB
    await mongoose.connection.close();
  });

  // Avant chaque test
  beforeEach(async () => {
    // Nettoyer la collection todos
    await Todo.deleteMany({});
  });

  describe('POST /api/todos - Création avec persistance BDD', () => {
    test('devrait créer et persister un nouveau todo dans la BDD', async () => {
      // Arrange
      const newTodoData = {
        text: 'Test todo pour intégration'
      };

      // Act - Créer le todo via l'API
      const response = await request(app)
        .post('/api/todos')
        .send(newTodoData)
        .expect('Content-Type', /json/)
        .expect(201);

      // Assert - Vérifier la réponse
      expect(response.body).toMatchObject({
        _id: expect.any(String),
        text: newTodoData.text,
        completed: false,
        createdAt: expect.any(String)
      });

      // Vérifier la persistance dans la BDD
      const todoInDb = await Todo.findById(response.body._id);
      expect(todoInDb).toBeTruthy();
      expect(todoInDb.text).toBe(newTodoData.text);
      expect(todoInDb.completed).toBe(false);
    });

    test('devrait valider les données avant la persistance', async () => {
      // Arrange - Todo sans texte
      const invalidTodoData = {
        text: ''
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodoData)
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('message');
      
      // Vérifier qu'aucun todo n'a été créé dans la BDD
      const count = await Todo.countDocuments();
      expect(count).toBe(0);
    });
  });

  describe('GET /api/todos - Récupération depuis la BDD', () => {
    test('devrait récupérer tous les todos de la BDD triés par date', async () => {
      // Arrange - Insérer des todos directement dans la BDD
      const todos = [
        { text: 'Premier todo', completed: false, createdAt: new Date('2024-01-01') },
        { text: 'Deuxième todo', completed: true, createdAt: new Date('2024-01-02') },
        { text: 'Troisième todo', completed: false, createdAt: new Date('2024-01-03') }
      ];
      await Todo.insertMany(todos);

      // Act
      const response = await request(app)
        .get('/api/todos')
        .expect('Content-Type', /json/)
        .expect(200);

      // Assert
      expect(response.body).toHaveLength(3);
      // Vérifier le tri (plus récent en premier)
      expect(response.body[0].text).toBe('Troisième todo');
      expect(response.body[1].text).toBe('Deuxième todo');
      expect(response.body[2].text).toBe('Premier todo');
    });

    test('devrait retourner un tableau vide si aucun todo dans la BDD', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      // Assert
      expect(response.body).toEqual([]);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PUT /api/todos/:id - Mise à jour avec persistance', () => {
    test('devrait mettre à jour un todo existant dans la BDD', async () => {
      // Arrange - Créer un todo dans la BDD
      const todo = new Todo({
        text: 'Todo à mettre à jour',
        completed: false
      });
      await todo.save();

      // Act - Mettre à jour via l'API
      const response = await request(app)
        .put(`/api/todos/${todo._id}`)
        .send({ completed: true })
        .expect(200);

      // Assert - Vérifier la réponse
      expect(response.body.completed).toBe(true);
      expect(response.body._id).toBe(todo._id.toString());

      // Vérifier la persistance dans la BDD
      const updatedTodo = await Todo.findById(todo._id);
      expect(updatedTodo.completed).toBe(true);
    });

    test('devrait retourner 404 pour un todo inexistant', async () => {
      // Arrange - ID valide mais inexistant
      const fakeId = new mongoose.Types.ObjectId();

      // Act
      const response = await request(app)
        .put(`/api/todos/${fakeId}`)
        .send({ completed: true })
        .expect(404);

      // Assert
      expect(response.body).toHaveProperty('message', 'Todo not found');
    });
  });

  describe('DELETE /api/todos/:id - Suppression de la BDD', () => {
    test('devrait supprimer un todo de la BDD', async () => {
      // Arrange - Créer un todo
      const todo = await Todo.create({
        text: 'Todo à supprimer'
      });

      // Vérifier qu'il existe
      const beforeDelete = await Todo.findById(todo._id);
      expect(beforeDelete).toBeTruthy();

      // Act - Supprimer via l'API
      await request(app)
        .delete(`/api/todos/${todo._id}`)
        .expect(200);

      // Assert - Vérifier la suppression dans la BDD
      const afterDelete = await Todo.findById(todo._id);
      expect(afterDelete).toBeNull();
    });

    test('devrait retourner 404 pour un todo déjà supprimé', async () => {
      // Arrange
      const fakeId = new mongoose.Types.ObjectId();

      // Act
      const response = await request(app)
        .delete(`/api/todos/${fakeId}`)
        .expect(404);

      // Assert
      expect(response.body).toHaveProperty('message', 'Todo not found');
    });
  });

  describe('Tests d\'isolation et de nettoyage', () => {
    test('chaque test devrait avoir une BDD propre', async () => {
      // Vérifier que la BDD est vide au début
      const initialCount = await Todo.countDocuments();
      expect(initialCount).toBe(0);

      // Créer des todos
      await Todo.create([
        { text: 'Test 1' },
        { text: 'Test 2' },
        { text: 'Test 3' }
      ]);

      // Vérifier qu'ils sont créés
      const afterCreateCount = await Todo.countDocuments();
      expect(afterCreateCount).toBe(3);

    });

    test('la BDD devrait être vide après le test précédent', async () => {
      // Assert
      const count = await Todo.countDocuments();
      expect(count).toBe(0);
    });
  });
});