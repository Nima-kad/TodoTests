# Partie 3 : Tests d'intégration avec Base de Données (3 points bonus)

## Générale

Cette partie implémente des tests d'intégration pour vérifier l'interaction réelle entre l'API REST et la base de données MongoDB.  
J'ai utilisée **Supertest** pour simuler des requêtes HTTP et **vérifient la persistance des données**

---

## Objectifs atteints

- ✅ Test des routes API avec interaction BDD réelle
- ✅ Vérification de la persistance et récupération des données
- ✅ Isolation et nettoyage automatique entre les tests
---

## Fichier de test

`back/__tests__/todoRoutes.integration.test.js`

### Technologies utilisées :
- Jest
- Supertest
- Mongoose

---

## Tests implémentés (8) plus les tests d'isolation et nettoyage 

| N° | Route | Fonction | Objectif |
|----|-------|----------|----------|
| 1  | POST  | create   | Création + validation des données |
| 2  | GET   | findAll  | Récupération de tous les todos |
| 3  | PUT   | update   | Mise à jour existante + 404 |
| 4  | DELETE| remove   | Suppression existante + 404 |

---

## Configuration

### Base de test MongoDB

Utilise une base dédiée `test-todo-db` :

```js
const TEST_DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/test-todo-db?retryWrites=true&w=majority`;

