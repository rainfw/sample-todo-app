"use client";

import { useState } from "@rainfw/core/client";

type Todo = {
	id: number;
	title: string;
	completed: boolean;
};

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
	const [todos, setTodos] = useState<Todo[]>(initialTodos);
	const [title, setTitle] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const completed = todos.filter((t: Todo) => t.completed).length;

	async function refresh() {
		const res = await fetch("/api/todos");
		setTodos(await res.json());
	}

	async function addTodo(e: Event) {
		e.preventDefault();
		if (!title.trim() || submitting) return;
		setSubmitting(true);
		try {
			await fetch("/api/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: title.trim() }),
			});
			setTitle("");
			await refresh();
		} finally {
			setSubmitting(false);
		}
	}

	async function toggle(id: number, checked: boolean) {
		await fetch(`/api/todos/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ completed: checked }),
		});
		await refresh();
	}

	async function remove(id: number) {
		await fetch(`/api/todos/${id}`, { method: "DELETE" });
		await refresh();
	}

	return (
		<div className="todo-inner">
			<form onSubmit={addTodo} className="add-form">
				<input
					value={title}
					onInput={(e: Event) => setTitle((e.target as HTMLInputElement).value)}
					placeholder="新しいTODOを入力..."
				/>
				<button type="submit" disabled={submitting}>
					追加
				</button>
			</form>

			<ul className="todo-list">
				{todos.length === 0 ? (
					<li className="empty">TODOがありません。追加してみましょう！</li>
				) : (
					todos.map((todo: Todo) => (
						<li key={todo.id} className="todo-item">
							<input
								type="checkbox"
								checked={todo.completed}
								onChange={(e: Event) =>
									toggle(todo.id, (e.target as HTMLInputElement).checked)
								}
							/>
							<span className={`title${todo.completed ? " completed" : ""}`}>
								{todo.title}
							</span>
							<button
								type="button"
								onClick={() => remove(todo.id)}
								className="delete-btn"
							>
								✕
							</button>
						</li>
					))
				)}
			</ul>

			{todos.length > 0 && (
				<div className="stats">
					{completed} / {todos.length} 完了
				</div>
			)}
		</div>
	);
}
