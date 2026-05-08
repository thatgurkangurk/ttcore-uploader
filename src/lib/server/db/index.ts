import { env } from "../../env.js";
import { drizzle } from "drizzle-orm/postgres-js";

import { relations } from "./relations";
import { schema } from "./schema";

export const db = drizzle(env.DATABASE_URL, { schema: schema, relations: relations });
