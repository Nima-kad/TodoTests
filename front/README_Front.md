# Tests Unitaires – Tester Frontend TODO

Ce dépôt contient les **tests unitaires complets** réalisés dans le cadre de la **Partie 2** de l’évaluation : testabilité du frontend React de l’application TODO.

---

## Fichier testé : `src/services/api.js`

Contient les fonctions pour consommer l’API :
- `getAllTodos()`
- `createTodo(text)`
- `updateTodo(id, updates)`
- `deleteTodo(id)`

---

## Tests réalisés

### `__tests__/stubs.test.js`
# Stubs (fetch remplacé pour retourner des données contrôlées)

Utilise des **stubs sur `global.fetch`** pour simuler les réponses de l’API.


| Fonction        | Type de test   | Description                                                                              |
|----------------|----------------|------------------------------------------------------------------------------------------|
| getAllTodos    | Nominal         | Vérifie que `fetch` est bien appelé à la bonne URL, avec des données simulées (stub)    |
| createTodo     | Nominal         | Envoie un `POST` avec le bon body JSON                                                  |
| updateTodo     | Nominal         | Envoie un `PUT` avec les données modifiées et l'ID correct                              |
| deleteTodo     | Nominal         | Envoie un `DELETE` sur l’ID correct                                                     |
| createTodo     | Erreur          | Simule un `fetch` qui échoue (ex: réponse vide ou incorrecte)                           |


### Techniques utilisées

- `global.fetch = jest.fn()` pour remplacer les appels réseau
- `mockResolvedValueOnce()` pour simuler la réponse de `fetch`
- `jest.clearAllMocks()` après chaque test

---

### `__tests__/mocks.test.js`
# Mocks (mêmes fonctions testées avec approche différente)
Ce fichier utilise également `jest.fn()` mais se concentre sur d'autres types de scénarios :

| Fonction        | Type de test   | Description                                                                              |
|----------------|----------------|------------------------------------------------------------------------------------------|
| getAllTodos    | Limite          | Simule une réponse vide (tableau vide)                                                  |
| createTodo     | Erreur          | Envoie un texte vide, simule comportement inattendu                                     |
| updateTodo     | Erreur          | Simule une erreur serveur avec `fetch` renvoyant une erreur                             |
| deleteTodo     | Nominal         | Vérifie l'appel de `DELETE` même sans retour de serveur                                 |
| getAllTodos    | Limite          | Vérifie comportement si l’API est indisponible (simule rejet de `fetch`)                |

## Pattern utilisé : AAA

Chaque test suit une structure claire :

1. **Arrange** : préparation des données (`const data = ...`)
2. **Act** : appel de la fonction (`await getAllTodos()`)
3. **Assert** : vérification avec `expect(...)`

---
## Contraintes respectées

- [x] **1 fichier testé avec mocks/stubs**
- [x] **5 tests minimum** sur ce fichier
- [x] **Cas nominal, erreur, limites**
- [x] **Structure Arrange / Act / Assert**
- [x] **Organisation claire et logique**

---

## Lancement des tests

```bash
npm test
# ou
npm test __tests__/stubs.test.js
