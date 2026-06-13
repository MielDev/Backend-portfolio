SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'experiences'
    AND COLUMN_NAME = 'image'
);

SET @sql = IF(
  @column_exists = 0,
  'ALTER TABLE experiences ADD COLUMN image VARCHAR(255) NULL AFTER digital_folder_url',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
