import html from './app.html?raw';
import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, renderPending } from './use-cases';


const ElementIds = {
	ClearCompletedButton: '.clear-completed',
	TodoList: '.todo-list',
	newTodoInput: '#new-todo-input',
	TodoFilters: '.filtro',
	PendingCountLabel: '#pending-count'
}

/**
* @param{String} elementId
*/
export const App = (elementId) => {

	const displayTodos = () => {
		const todos = todoStore.getTodos(todoStore.getCurrentFilter());
		renderTodos(ElementIds.TodoList, todos)
		updatePendingCount();
	}

	const updatePendingCount = () => {
		renderPending(ElementIds.PendingCountLabel);
	}

	// Funcion auto invocada para cuando la funcion App() se llama 
	(() => {
		const app = document.createElement('div');
		app.innerHTML = html;
		document.querySelector(elementId).append(app);
		displayTodos();
	})();

	/**
	 * se coloca despues de funcion invocada 
	 * si se coloca antes no las va a tomar 
	 * porque el elemento no existe
	 */
	// Referencia HTML
	const newDescriptionInput = document.querySelector(ElementIds.newTodoInput);
	const todoListUL = document.querySelector(ElementIds.TodoList);
	const clearCompletedButton = document.querySelector(ElementIds.ClearCompletedButton);
	const filtersLIs = document.querySelectorAll(ElementIds.TodoFilters);


	//listener
	newDescriptionInput.addEventListener('keyup', (event) => {
		// console.info(event);
		// console.warn(event.target.value);
		if (event.keyCode !== 13) return;
		if (event.target.value.trim().length === 0) return;

		todoStore.addTodo(event.target.value);
		displayTodos();
		event.target.value = '';
	})

	todoListUL.addEventListener('click', (event) => {
		const element = event.target.closest('[data-id]');
		todoStore.toggleTodo(element.getAttribute('data-id'));
		displayTodos();
	});

	todoListUL.addEventListener('click', (event) => {
		const isDestroyElement = event.target.className === 'destroy';
		const element = event.target.closest('[data-id]');
		if (!element || !isDestroyElement) return;

		todoStore.deleteTodo(element.getAttribute('data-id'));
		displayTodos();
	});

	//como hice el ejercicio
	/* clearCompletedButton.addEventListener('click', (event) => {
		const isCompleted = event.target.className === 'clear-completed';
		todoStore.deleteCompleted();
		displayTodos();
	}); */

	// Como lo hizo fermando
	clearCompletedButton.addEventListener('click', () => {
		todoStore.deleteCompleted();
		displayTodos();
	});

	filtersLIs.forEach(element => {

		element.addEventListener('click', (element) => {
			filtersLIs.forEach(el => el.classList.remove('selected'));
			element.target.classList.add('selected');

			//console.log(element.target.text);
			switch (element.target.text) {
				case 'Todos':
					todoStore.setFilter(Filters.All);
					break;

				case 'Pendientes':
					todoStore.setFilter(Filters.Pending);
					break;

				case 'Completados':
					todoStore.setFilter(Filters.Completed);
					break;
			}

			displayTodos();

		});

	})

}