import { bindings } from "@rainfw/core";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function db() {
	return drizzle(bindings().DB, { schema });
}
