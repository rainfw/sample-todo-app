import type { Handler } from "@rainfw/core";
import { db } from "../../../db";
import { todos } from "../../../db/schema";

// GET /api/todos - 全TODOを取得
export const GET: Handler = async (ctx) => {
	const allTodos = await db().select().from(todos).orderBy(todos.createdAt);
	return ctx.json(allTodos);
};

// POST /api/todos - 新しいTODOを作成
export const POST: Handler = async (ctx) => {
	const body = await ctx.parseJson<{ title: string }>();

	if (
		!body.title ||
		typeof body.title !== "string" ||
		body.title.trim() === ""
	) {
		return ctx.json({ error: "title is required" }, 400);
	}

	const result = await db()
		.insert(todos)
		.values({ title: body.title.trim() })
		.returning();

	return ctx.json(result[0], 201);
};
