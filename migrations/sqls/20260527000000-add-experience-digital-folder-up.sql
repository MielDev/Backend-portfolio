SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'experiences'
    AND COLUMN_NAME = 'digital_folder_url'
);

SET @sql = IF(
  @column_exists = 0,
  'ALTER TABLE experiences ADD COLUMN digital_folder_url VARCHAR(500) NULL AFTER color',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
