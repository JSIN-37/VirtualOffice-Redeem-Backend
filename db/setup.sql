START TRANSACTION;

CREATE DATABASE virtualoffice;
CREATE USER 'virtualoffice'@'localhost';
GRANT ALL PRIVILEGES ON virtualoffice.* To 'virtualoffice'@'localhost' IDENTIFIED BY 'virtualoffice@123';

COMMIT;
