CREATE TABLE `categories` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`userid` int(11) DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `user` (`userid`),
CONSTRAINT `userid_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `users` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`first_name` varchar(255) NOT NULL,
`last_name` varchar(255) NOT NULL,
`email` varchar(255) NOT NULL,
`password` char(255) NOT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `tasks` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`task_time` int(50) NOT NULL,
`break_time` int(50) NOT NULL,
`userid` int(11) NOT NULL,
`categoryid` int(11) DEFAULT NULL
PRIMARY KEY (`id`),
KEY `user` (`userid`),
CONSTRAINT `userid_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`),
KEY `category` (`categoryid`),
CONSTRAINT `categoryid_ibfk_1` FOREIGN KEY (`category`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;