"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { todos } from "../db/schema";

export async function addTodo(formData: FormData) {
	const title = formData.get("title") as string;
	if (!title || title.trim() === "") return;

	await db().insert(todos).values({ title: title.trim() });
}

export async function toggleTodo(formData: FormData) {
	const id = Number(formData.get("id"));
	const completed = formData.get("completed") === "true";
	if (Number.isNaN(id)) return;

	await db().update(todos).set({ completed }).where(eq(todos.id, id));
}

export async function removeTodo(formData: FormData) {
	const id = Number(formData.get("id"));
	if (Number.isNaN(id)) return;

	await db().delete(todos).where(eq(todos.id, id));
}
