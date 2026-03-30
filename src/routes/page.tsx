import type { PageHandler } from "@rainfw/core";
import { db } from "../db";
import { todos } from "../db/schema";
import TodoList from "./(components)/todo-list";

const Home: PageHandler = async (_ctx) => {
	const allTodos = await db().select().from(todos).orderBy(todos.createdAt);

	return (
		<div>
			<h1>📝 TODO App</h1>
			<TodoList initialTodos={allTodos} />
		</div>
	);
};

export default Home;
