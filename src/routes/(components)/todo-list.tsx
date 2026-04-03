"use client";

import { useState } from "@rainfw/core/client";

type Todo = {
	id: number;
	title: string;
	completed: boolean;
};

type Props = {
	initialTodos: Todo[];
	addTodo: (formData: FormData) => Promise<void>;
	toggleTodo: (formData: FormData) => Promise<void>;
	removeTodo: (formData: FormData) => Promise<void>;
};

export default function TodoList({
	initialTodos,
	addTodo,
	toggleTodo,
	removeTodo,
}: Props) {
	const [todos, setTodos] = useState<Todo[]>(initialTodos);
	const [title, setTitle] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const completed = todos.filter((t: Todo) => t.completed).length;

	async function handleAdd(e: Event) {
		e.preventDefault();
		if (!title.trim() || submitting) return;
		setSubmitting(true);
		try {
			const formData = new FormData();
			formData.set("title", title.trim());
			await addTodo(formData);
			setTitle("");
			// 楽観的更新: サーバーから返る前にUIを更新
			setTodos((prev: Todo[]) => [
				...prev,
				{
					id: Date.now(),
					title: title.trim(),
					completed: false,
				},
			]);
		} finally {
			setSubmitting(false);
		}
	}

	async function handleToggle(id: number, checked: boolean) {
		const formData = new FormData();
		formData.set("id", String(id));
		formData.set("completed", String(checked));
		await toggleTodo(formData);
		setTodos((prev: Todo[]) =>
			prev.map((t: Todo) => (t.id === id ? { ...t, completed: checked } : t)),
		);
	}

	async function handleRemove(id: number) {
		const formData = new FormData();
		formData.set("id", String(id));
		await removeTodo(formData);
		setTodos((prev: Todo[]) => prev.filter((t: Todo) => t.id !== id));
	}

	return (
		<div className="todo-inner">
			<form onSubmit={handleAdd} className="add-form">
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
									handleToggle(todo.id, (e.target as HTMLInputElement).checked)
								}
							/>
							<span className={`title${todo.completed ? " completed" : ""}`}>
								{todo.title}
							</span>
							<button
								type="button"
								onClick={() => handleRemove(todo.id)}
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
