SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'experiences'
    AND COLUMN_NAME = 'digital_folder_url'
);

SET @sql = IF(
  @column_exists = 1,
  'ALTER TABLE experiences DROP COLUMN digital_folder_url',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
