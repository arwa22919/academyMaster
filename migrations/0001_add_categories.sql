-- Add new Sports activities and Expense categories to the MySQL enum columns.
-- Additive & non-destructive: it only extends the allowed value lists, so all
-- existing rows are preserved. Safe to run once against the database.

-- Activities: added muay_thai, special_needs, aqua_aerobics, basketball, volleyball
-- (gymnastics already existed and is not repeated).
ALTER TABLE `subscriptions`
  MODIFY COLUMN `activity` ENUM(
    'karate','kickboxing','football','swimming','zumba','aerobics','crossfit',
    'gymnastics','quran_memorization','kindergarten',
    'muay_thai','special_needs','aqua_aerobics','basketball','volleyball'
  ) NOT NULL;

ALTER TABLE `trainers`
  MODIFY COLUMN `activity` ENUM(
    'karate','kickboxing','football','swimming','zumba','aerobics','crossfit',
    'gymnastics','quran_memorization','kindergarten',
    'muay_thai','special_needs','aqua_aerobics','basketball','volleyball'
  ) NOT NULL;

-- Expense categories: added water, electricity, license_fees, residency_fees, sewage.
ALTER TABLE `expenses`
  MODIFY COLUMN `category` ENUM(
    'rent','utilities','maintenance','equipment','salary','marketing',
    'transportation','other',
    'water','electricity','license_fees','residency_fees','sewage'
  ) NOT NULL;
