START TRANSACTION;

CREATE DATABASE virtualoffice;
CREATE USER 'virtualoffice'@'localhost';
GRANT ALL PRIVILEGES ON VO.* To 'virtualoffice'@'localhost' IDENTIFIED BY 'virtualoffice@123';

USE virtualoffice;

CREATE TABLE `vo_settings` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `vo_option` varchar(255),
  `vo_value` varchar(255)
);

INSERT INTO `vo_settings` (`vo_option`, `vo_value`) VALUES
('admin_password','38b2575d2f3cec6d1c8296ee22bdf4bcc658c3bf371d10259b249c5a308f1480bad087d72cf026b78b9ea609a6eb49f3f61ca1ab6540286f36edc3875354f3de'),
('admin_setup',''),
('org_name','VirtualOffice'),
('org_country','Sri Lanka');

COMMIT;
