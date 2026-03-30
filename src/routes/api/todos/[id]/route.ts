import type { Handler } from "@rainfw/core";
import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { todos } from "../../../../db/schema";

// PUT /api/todos/:id - TODOの完了状態を切り替え
export const PUT: Handler = async (ctx) => {
	const id = Number(ctx.params.id);
	if (Number.isNaN(id)) {
		return ctx.json({ error: "invalid id" }, 400);
	}

	const body = await ctx.parseJson<{ completed?: boolean; title?: string }>();

	const existing = await db().select().from(todos).where(eq(todos.id, id));
	if (existing.length === 0) {
		return ctx.json({ error: "not found" }, 404);
	}

	const updates: Record<string, unknown> = {};
	if (typeof body.completed === "boolean") {
		updates.completed = body.completed;
	}
	if (typeof body.title === "string" && body.title.trim() !== "") {
		updates.title = body.title.trim();
	}

	if (Object.keys(updates).length === 0) {
		return ctx.json({ error: "no valid fields to update" }, 400);
	}

	const result = await db()
		.update(todos)
		.set(updates)
		.where(eq(todos.id, id))
		.returning();

	return ctx.json(result[0]);
};

// DELETE /api/todos/:id - TODOを削除
export const DELETE: Handler = async (ctx) => {
	const id = Number(ctx.params.id);
	if (Number.isNaN(id)) {
		return ctx.json({ error: "invalid id" }, 400);
	}

	const existing = await db().select().from(todos).where(eq(todos.id, id));
	if (existing.length === 0) {
		return ctx.json({ error: "not found" }, 404);
	}

	await db().delete(todos).where(eq(todos.id, id));

	return ctx.json({ ok: true });
};
