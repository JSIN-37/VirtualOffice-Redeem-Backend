CREATE TABLE `vo_user` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `email` varchar(255),
  `contact_number` char(10),
  `password` varchar(255),
  `dob` date,
  `gender` char(1),
  `address` varchar(400),
  `division_id` int(11),
  `role_id` int(11),
  `invite_status` varchar(255)
);