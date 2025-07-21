/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddTodoForm from '../src/components/AddTodoForm';

describe('AddTodoForm Component', () => {
  let mockAddTodo;

  beforeEach(() => {
    // Arrange - Configuration commune
    mockAddTodo = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Ajout de tâches', () => {
    test('devrait ajouter une tâche valide et réinitialiser le champ', () => {
      // Arrange
      render(<AddTodoForm addTodo={mockAddTodo} />);
      const input = screen.getByPlaceholderText(/ajouter une nouvelle tâche/i);
      const button = screen.getByRole('button', { name: /add todo/i });

      // Act
      fireEvent.change(input, { target: { value: 'Faire les courses' } });
      fireEvent.click(button);

      // Assert
      expect(mockAddTodo).toHaveBeenCalledTimes(1);
      expect(mockAddTodo).toHaveBeenCalledWith('Faire les courses');
      expect(input).toHaveValue('');
    });

    test('devrait gérer la soumission par la touche Enter', () => {
      // Arrange
      render(<AddTodoForm addTodo={mockAddTodo} />);
      const input = screen.getByPlaceholderText(/ajouter une nouvelle tâche/i);
      const form = input.closest('form');

      // Act
      fireEvent.change(input, { target: { value: 'Nouvelle tâche' } });
      fireEvent.submit(form);

      // Assert
      expect(mockAddTodo).toHaveBeenCalledWith('Nouvelle tâche');
      expect(input).toHaveValue('');
    });
  });

  describe('Validation des entrées', () => {
    test('ne devrait pas ajouter une tâche vide', () => {
      // Arrange
      render(<AddTodoForm addTodo={mockAddTodo} />);
      const button = screen.getByRole('button', { name: /add todo/i });

      // Act
      fireEvent.click(button);

      // Assert
      expect(mockAddTodo).not.toHaveBeenCalled();
    });

    test('ne devrait pas ajouter une tâche contenant uniquement des espaces', () => {
      // Arrange
      render(<AddTodoForm addTodo={mockAddTodo} />);
      const input = screen.getByPlaceholderText(/ajouter une nouvelle tâche/i);
      const button = screen.getByRole('button', { name: /add todo/i });

      // Act
      fireEvent.change(input, { target: { value: '     ' } });
      fireEvent.click(button);

      // Assert
      expect(mockAddTodo).not.toHaveBeenCalled();
      expect(input).toHaveValue('     '); // Le champ garde les espaces si non soumis
    });

    test('devrait gérer correctement les espaces avant et après le texte', () => {
      // Arrange
      render(<AddTodoForm addTodo={mockAddTodo} />);
      const input = screen.getByPlaceholderText(/ajouter une nouvelle tâche/i);
      const button = screen.getByRole('button', { name: /add todo/i });

      // Act
      fireEvent.change(input, { target: { value: '  Tâche avec espaces  ' } });
      fireEvent.click(button);

      // Assert
      expect(mockAddTodo).toHaveBeenCalledWith('  Tâche avec espaces  ');
      expect(input).toHaveValue('');
    });
  });

  describe('État du formulaire', () => {
    test('devrait permettre de saisir du texte dans le champ', () => {
      // Arrange
      render(<AddTodoForm addTodo={mockAddTodo} />);
      const input = screen.getByPlaceholderText(/ajouter une nouvelle tâche/i);

      // Act
      fireEvent.change(input, { target: { value: 'Test de saisie' } });

      // Assert
      expect(input).toHaveValue('Test de saisie');
    });

    test('devrait conserver la valeur saisie si non soumise', () => {
      // Arrange
      render(<AddTodoForm addTodo={mockAddTodo} />);
      const input = screen.getByPlaceholderText(/ajouter une nouvelle tâche/i);

      // Act
      fireEvent.change(input, { target: { value: 'Tâche non soumise' } });

      // Assert - Sans cliquer sur le bouton
      expect(input).toHaveValue('Tâche non soumise');
      expect(mockAddTodo).not.toHaveBeenCalled();
    });
  });

  describe('Gestion des erreurs et cas limites', () => {
    test('devrait gérer des caractères spéciaux', () => {
      // Arrange
      render(<AddTodoForm addTodo={mockAddTodo} />);
      const input = screen.getByPlaceholderText(/ajouter une nouvelle tâche/i);
      const button = screen.getByRole('button', { name: /add todo/i });
      const specialText = 'Tâche avec @#$%^&*() caractères spéciaux!';

      // Act
      fireEvent.change(input, { target: { value: specialText } });
      fireEvent.click(button);

      // Assert
      expect(mockAddTodo).toHaveBeenCalledWith(specialText);
      expect(input).toHaveValue('');
    });

    test('devrait gérer une très longue tâche', () => {
      // Arrange
      render(<AddTodoForm addTodo={mockAddTodo} />);
      const input = screen.getByPlaceholderText(/ajouter une nouvelle tâche/i);
      const button = screen.getByRole('button', { name: /add todo/i });
      const longText = 'A'.repeat(200);

      // Act
      fireEvent.change(input, { target: { value: longText } });
      fireEvent.click(button);

      // Assert
      expect(mockAddTodo).toHaveBeenCalledWith(longText);
    });
  });
});