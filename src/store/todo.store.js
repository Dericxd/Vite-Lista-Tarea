import { Todo } from '../todos/models/todo.model';

export const Filters = {
	All: 'all',
	Completed: 'Completed',
	Pending: 'Pending',
}

const state = {
	todos: [
		new Todo('Piedra del alma'),
		new Todo('Piedra del infinito'),
		new Todo('Piedra del tiempo'),
		new Todo('Piedra del poder'),
		new Todo('Piedra del conocimiento'),
	],
	
	filter: Filters.All
}

const initStore = () => {
	loadStore();
	console.log('InitStore Durazno');
}

const loadStore = () => {
	if (!localStorage.getItem('state')) return;

	const { todos = [], filter = Filters.All } = JSON.parse(localStorage.getItem('state'));
	state.todos = todos;
	state.filter = filter;
}

const saveStateToLocalStore = () => {
	//console.log(JSON.stringify(state));
	localStorage.setItem('state',JSON.stringify(state));
}

const getTodos = ( filter = Filters.All) => {
	// throw new Error('No Implemented');
	switch (filter) {
		case Filters.All:
			return [...state.todos];

		case Filters.Completed:
			return state.todos.filter( todo => todo.done);

		case Filters.Pending:
			return state.todos.filter( todo => !todo.done);
		default:
			throw new Error(`Option ${ filter } is not valid`);

	}
}

/**
 * 
 * @param {String} description 
 */
const addTodo = (description) => {
	if (!description) throw new Error('Description is required');
	state.todos.push(new Todo(description));

	saveStateToLocalStore();
}

/**
 * 
 * @param {String} todoId Todo identificador
 */
const toggleTodo = (todoId) => {
	state.todos = state.todos.map(todo => {
		if (todo.id === todoId){
			todo.done = !todo.done;
		}
		return todo;
	});

	saveStateToLocalStore();
}

/**
 * 
 * @param {String} todoId 
 */
const deleteTodo = (todoId) => {
	state.todos = state.todos.filter(todo => todo.id !== todoId);
	saveStateToLocalStore();
}

const deleteCompleted = (todoId) => {
	state.todos = state.todos.filter(todo => !todo.done);
	saveStateToLocalStore();

}

/**
 * 
 * @param {Filters} newFilter 
 */
const setFilter = (newFilter = Filters.All) => {
	state.filter = newFilter;
	saveStateToLocalStore();
}

const getCurrentFilter = () => {
	return state.filter;
}

export default {
	addTodo,
	deleteCompleted,
	deleteTodo,
	getCurrentFilter,
	getTodos,
	initStore,
	loadStore,
	setFilter,
	toggleTodo,
}