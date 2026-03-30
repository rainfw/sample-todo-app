import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
	id: int().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	completed: int({ mode: "boolean" }).notNull().default(false),
	createdAt: int({ mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});
