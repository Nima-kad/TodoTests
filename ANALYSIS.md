# KADRI NAIMA


# Audit de testabilité de l'application `todo-prf-idf-cda-ecf`

---------------

## Classification des fichiers testables

| Fichier / Composant                  | Type de test recommandé  | Outils utilisables        | Justification                                         |Priorité(1-3)|
|--------------------------------------|--------------------------|----------------------------------|-------------------------------------------------------------|
|back/src/controllers/todoController.js|Intégration + Mock        |Jest + Supertest       |Contient toute la logique des opérations TODO + dépendance directe à Mongoose|1|

|back/src/models/Todo.js               |Unitaire                  |Jest                   |Définition du modèle avec règles de validation, testable indépendamment| 2|

|back/src/routes/todoRoutes.js         |Intégration               |Jest + Supertest       |Fichier de routage, à tester avec les endpoints Express | 2 |

|back/src/app.js                       |Intégration(setup serveur)|Jest + Supertest       |Point d’entrée de l’app Express, important pour les tests API globaux| 3  |

|back/src/config/db.js                 |Aucun test direct         | —                     |Configuration de connexion, testée indirectement via les tests d'API /CRUDs| 3 |

|front/src/services/api.js             |Unitaire + Mock           | Jest                  |Contient les appels réseau fetch ou axios, à mocker pour isoler les tests| 1 |

|front/src/components/AddTodoForm.js   |Unitaire                  |Jest+React Testing Library  | Gère la soumission du formulaire, testable avec events/simulation | 2 |

|front/src/components/TodoList.js      |Unitaire (UI)             |Jest + React Testing Library| Affiche la liste, testable avec rendu conditionnel | 2 |

----------------------

## Stratégie de test adoptée

### Priorité 1 – Tests immédiats
- `todoController.js` : contient la logique centrale de l’application (CRUD, DB)
- `api.js` (frontend) : point de communication entre UI et API
- Objectif : valider le fonctionnement principal de l’application et ses points critiques

### Priorité 2 – Tests importants
- `Todo.js`, `TodoList.js`, `AddTodoForm.js`, `todoRoutes.js`
- Dépendances modérées, testables individuellement ou avec mocks
- Objectif : sécuriser l'affichage, les envois et les règles de structure de données

### Priorité 3 – Tests complexes ou indirects
- `app.js`, `db.js` : nécessitent le démarrage du serveur ou des services externes
- Objectif : couverture indirecte via les tests d’intégration

---------------------

## Difficultés identifiées

- Pas de séparation claire entre **logique métier** et **contrôleurs**(logique d'accès aux données)
    → Il manque une couche "service" qui permet de tester la logique indépendamment de la base

- Couplage fort entre contrôleur et Mongoose (difficile à tester sans mock)
    → Le fichier todoController.js utilise directement le modèle Mongoose, ce qui complique les tests unitaires sans mock

- Frontend en JS simple sans framework (pas de CRA ni structure dédiée aux tests)
    → Nécessite une configuration manuelle pour installer Jest et React Testing Library si on veut tester les composants

- Aucun test présent initialement dans le projet
    → Ni dans le backend, ni dans le frontend. Il faut donc tout mettre en place : Jest, structure de test, nommage...

- Absence de fichier `.test.js` ou de dossier `__tests__`

-----------------------

## Solutions proposées

- Créer des tests d’API via **Supertest** pour le backend (routes + contrôleur)
- Utiliser **Jest Mock Functions** pour isoler les appels à Mongoose
- Ajouter des tests unitaires frontend (composants + `api.js`) avec **React Testing Library**
- Ajouter un `mongodb-memory-server` pour les tests backend sans dépendre d’une vraie base
- Documenter la structure des tests pour guider l’équipe

