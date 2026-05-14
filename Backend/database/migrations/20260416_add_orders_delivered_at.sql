-- Run once on existing databases: mysql -u user -p essential_perfume < this file
ALTER TABLE orders
  ADD COLUMN delivered_at DATETIME NULL DEFAULT NULL COMMENT 'When admin/system marked order Delivered' AFTER status;
