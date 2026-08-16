import db from "../db";

const table = () => db("page_content");

export const PageContentModel = {
  async get(key: string): Promise<Record<string, any> | null> {
    const row = await table().where({ key }).first();
    if (!row) return null;
    try {
      return JSON.parse(row.value);
    } catch {
      return null;
    }
  },

  async set(key: string, data: Record<string, any>): Promise<Record<string, any>> {
    const json = JSON.stringify(data);
    const existing = await table().where({ key }).first();
    if (existing) {
      await table().where({ key }).update({ value: json, updated_at: db.fn.now() });
    } else {
      await table().insert({ key, value: json });
    }
    return data;
  },
};
