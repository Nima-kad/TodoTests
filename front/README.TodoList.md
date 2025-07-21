# Tests du composant TodoList

## Vue

Ce document décrit les tests unitaires du composant `TodoList` et de sa logique métier. Les tests se concentrent sur la logique de gestion des todos sans dépendre du rendu React.

## Fichier de test

### `TodoList.test.js`

**Emplacement** : `front/__tests__/TodoList.test.js`

**Type** : Tests unitaires de la logique métier

**Approche** : Tests des fonctions métier isolées sans rendu de composant

## Tests implémentés (5 tests)

### 1. **fetchTodos - Récupération des données**

```javascript
test('fetchTodos devrait appeler getAllTodos et retourner les données')
```

* Vérifie l'appel à l'API
* Vérifie le retour des données
* Mock : `api.getAllTodos`

### 2. **addTodo - Ajout d'un todo**

```javascript
test('addTodo devrait créer un nouveau todo et le retourner')
```

* Teste la création via l'API
* Vérifie les données du nouveau todo
* Mock : `api.createTodo`

### 3. **toggleTodo - Modification du statut**

```javascript
test('toggleTodo devrait inverser le statut completed')
```

* Teste l'inversion du statut
* Vérifie l'appel avec les bons paramètres
* Mock : `api.updateTodo`

### 4. **removeTodo - Suppression**

```javascript
test('removeTodo devrait appeler deleteTodo avec le bon ID')
```

* Teste la suppression via l'API
* Vérifie l'ID passé
* Mock : `api.deleteTodo`

### 5. **Gestion des erreurs API**

```javascript
test('devrait gérer les erreurs lors des appels API')
```

* Teste tous les cas d'erreur
* Vérifie la propagation des erreurs
* Tous les mocks rejettent des promesses


##  Stratégie de test

### Pourquoi cette approche ?

1. **Simplicité** : Pas de configuration Babel/React nécessaire
2. **Focus** : Test de la logique métier uniquement
3. **Rapidité** : Tests synchrones et rapides
4. **Isolation** : Chaque fonction testée indépendamment

### Pattern utilisé

```javascript
// Arrange - Préparer les données
const mockData = [...];
api.method.mockResolvedValue(mockData);

// Act - Exécuter la fonction
const result = await functionToTest();

// Assert - Vérifier le résultat
expect(api.method).toHaveBeenCalled();
expect(result).toEqual(expected);
```

## Configuration requise

### Dependencies

```json
{
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

### Structure des mocks

```javascript
// Mock du module API
jest.mock('../src/services/api');

// Configuration dans beforeEach
api.getAllTodos.mockResolvedValue(mockTodos);
api.createTodo.mockResolvedValue(newTodo);
api.updateTodo.mockResolvedValue(updatedTodo);
api.deleteTodo.mockResolvedValue();
```

## Exécution

```bash
cd front

# Exécuter les tests TodoList
npm test TodoList.test.js

# Mode watch
npm test TodoList.test.js -- --watch

# Avec couverture
npm test TodoList.test.js -- --coverage
```

## Exemple de sortie

```
PASS  __tests__/TodoList.test.js
  TodoList - Tests de la logique métier
    ✓ fetchTodos devrait appeler getAllTodos et retourner les données (3ms)
    ✓ addTodo devrait créer un nouveau todo et le retourner (1ms)
    ✓ toggleTodo devrait inverser le statut completed (1ms)
    ✓ removeTodo devrait appeler deleteTodo avec le bon ID (1ms)
    ✓ devrait gérer les erreurs lors des appels API (2ms)
    ✓ devrait gérer correctement les listes de todos (1ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

## Résolution des problèmes

### Erreur "Cannot find module"

* Vérifier les chemins d'import
* Structure attendue : `front/__tests__/` et `front/src/`

### Erreur "TodoList is not a function"

* Le composant React n'est pas testé directement
* On teste uniquement la logique métier

### Tests qui échouent

```javascript
// Vérifier les mocks dans beforeEach
beforeEach(() => {
  jest.clearAllMocks();
  // Réinitialiser les mocks
});
```

## Concepts testés

### 1. **Appels API mockés**

* getAllTodos : récupération
* createTodo : création avec données
* updateTodo : modification partielle
* deleteTodo : suppression par ID

### 2. **Gestion d'état**

* Ajout en début de liste
* Mise à jour d'un élément spécifique
* Filtrage pour suppression
* Maintien de l'ordre

### 3. **Gestion d'erreurs**

* Propagation des erreurs API
* Tests de résilience
* Vérification des appels même en erreur

## Critères ECF validés

* [x] 5 tests unitaires
* [x] Utilisation de mocks
* [x] Pattern AAA respecté
* [x] Cas nominal, limites, erreurs
* [x] Tests indépendants et isolés

##  Points clés à retenir

1. **Isolation** : Chaque test est indépendant
2. **Mocks** : Contrôle total sur les réponses API
3. **Simplicité** : Focus sur la logique, pas l'UI
4. **Couverture** : Tous les cas d'usage testés
5. **Maintenabilité** : Tests faciles à comprendre et modifier
