import type { Knex } from "knex";

// Generic key→JSON store for full-page CMS content (Home / About / Services
// page text + images), edited from the admin panel and shown to every
// visitor. Kept separate from `app_settings` (which only holds the single
// theme/customization row) so each page's content can be its own row and
// evolve independently.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("page_content", (table) => {
    table.increments("id").primary();
    table.string("key", 50).notNullable().unique(); // "home" | "about" | "services"
    table.text("value", "longtext").notNullable(); // JSON blob for that page
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("page_content");
}
