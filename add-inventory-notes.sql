-- Bug 10: add a notes column to inventory_items so additional item info can be stored & displayed.
-- Run this against your MySQL database, or run `npm run db:push` to sync the Drizzle schema.
ALTER TABLE `inventory_items` ADD COLUMN `notes` TEXT NULL;
