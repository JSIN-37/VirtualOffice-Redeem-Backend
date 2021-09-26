START TRANSACTION;

DROP DATABASE IF EXISTS virtualoffice; 
CREATE DATABASE virtualoffice;
DROP USER IF EXISTS 'virtualoffice'@'localhost';
CREATE USER 'virtualoffice'@'localhost';
GRANT ALL PRIVILEGES ON virtualoffice.* To 'virtualoffice'@'localhost' IDENTIFIED BY 'virtualoffice@123';

COMMIT;
