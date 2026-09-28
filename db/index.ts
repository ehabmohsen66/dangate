import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  const globalEnv = (globalThis as unknown as { env?: { DB?: unknown } })?.env;
  if (!globalEnv?.DB) {
    throw new Error(
      "Database binding `DB` is unavailable."
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return drizzle(globalEnv.DB as any, { schema });
}
