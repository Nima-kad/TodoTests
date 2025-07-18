# KADRI Naima 
# Tests unitaires – `todoController`

Ce fichier de test couvre l'ensemble des opérations CRUD liées aux tâches (Todos) dans le backend de l'application.  
Il utilise **Jest** pour les tests unitaires, avec des **mocks** du modèle `Todo` basé sur Mongoose.

---

## Fichier testé

J'ai testé : `src/controllers/todoController.js`

---

## Objectifs des tests

- Garantir que chaque fonction du contrôleur se comporte comme attendu (cas normal, erreurs, limites)
- Valider les codes de réponse HTTP (`200`, `201`, `400`, `404`, `500`)
- Simuler la base de données sans s’y connecter réellement (tests rapides et isolés)

---

## Outils utilisés

| Outil         | Utilisation                                                |
|---------------|------------------------------------------------------------|
| **Jest**      | Framework de test principal                                |
| `jest.mock()` | Pour simuler le comportement de `Todo.js`                  |
| `jest.fn()`   | Pour créer des fonctions simulées (`save`, `remove`)       |

---

## Liste des tests couverts

| Fonction             | Cas couvert                             | Type de test  |
|----------------------|------------------------------------------|----------------|
| `getAllTodos`        | ✅ Retourne tous les todos (200)         | Nominal        |
| `createTodo`         | ✅ Création réussie (201)                | Nominal        |
|                      | ✅ Échec si champ manquant (400)         | Erreur         |
| `updateTodo`         | ✅ Modification réussie (200)            | Nominal        |
|                      | ✅ Todo introuvable (404)                | Limite         |
| `deleteTodo`         | ✅ Suppression réussie (200)             | Nominal        |
|                      | ✅ Todo introuvable (404)                | Limite         |

---

## Mocks utilisés

| Méthode simulée      | Fonction mockée         |
|----------------------|--------------------------|
| `Todo.find()`        | Mocké avec `.sort()`     |
| `Todo.save()`        | Mock sur instance Todo   |
| `Todo.findById()`    | Simule présence/absence  |
| `todo.remove()`      | Simule suppression       |

---

## Bonnes pratiques appliquées

- Respect du **pattern AAA** : Arrange / Act / Assert
- Nettoyage entre chaque test avec `afterEach(() => jest.clearAllMocks())`
- Vérifications précises avec `toHaveBeenCalledWith()` et `toHaveBeenCalledTimes()`
- Utilisation de `expect.any(Date)` pour éviter les erreurs sur les horodatages dynamiques

---

## Lancer les tests

Depuis le dossier `back/` :

`npm test`

----

## Difficultés rencontrées & solutions apportées

### 1. Comprendre le fonctionnement des mocks (jest.mock, jest.fn)
- **Problème** : Au départ, je ne comprenais pas comment simuler les fonctions Mongoose comme `Todo.find()`, `save()`, `remove()`.
- **Solution** : "Je me suis appuyé sur les explications du **cours de notre formateur**, notamment sur la partie "La cuisine de test avec Jest : Mocks", et j'ai complété dans [Documentation Jest](https://jestjs.io/docs/mock-functions) 

- **Résultat** : J’ai utilisé `jest.mock()` pour simuler les modules, ainsi que `mockResolvedValue` et `mockRejectedValue`.

---

### 2. Tester les erreurs (champ manquant, Todo introuvable)
- **Problème** : Je ne savais pas comment tester un `save()` qui échoue ou un `findById()` qui retourne `null`.
- **Solution** : Grâce aux exemples vus en cours, j’ai su utiliser `mockRejectedValue()` pour simuler un échec de validation, et `mockResolvedValue(null)` pour simuler un Todo inexistant.
- **Ressource** : cours formateur + aide ponctuelle via ChatGPT pour la structure du test

---

### 3. Probleme des dates 
- **Problème** : J'avais une erreur en comparant deux `Date.now()` différentes dans les tests.
- **Solution** : J’ai remplacé `new Date()` par `expect.any(Date)` pour valider le type sans comparer la valeur exacte.
- **Outil utilisé** : J'ai demandé a ChatGPT

---

### 4. Mauvais chemin dans les imports au début
- **Problème** : Jest ne trouvait pas le fichier `../models/Todo` car mes tests étaient dans `/__tests__/`.
- **Solution** : En me basant sur la documentation du projet, j’ai corrigé tous les chemins en `../src/models/Todo`, `../src/controllers/...`, et plus de concentration 

---

## Aides et ressources utilisées

| Source                | Utilisation                                     |
|-----------------------|-------------------------------------------------|
| Cours du formateur    | Base pour tout le travail de test               |
| ChatGPT               | Structuration des tests, cas complexes, erreurs |
| Jest Documentation    | Référence sur les fonctions mockées             |

Merci maintenant on passe au deuxième fichier à tester 

