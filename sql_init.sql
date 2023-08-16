CREATE TABLE `amenities` (
                             `Amenities_ID` int NOT NULL,
                             `Type` varchar(30) DEFAULT NULL,
                             `Description` varchar(200) DEFAULT NULL,
                             `RentableUnit_ID` int DEFAULT NULL,
                             `Property_ID` int DEFAULT NULL,
                             PRIMARY KEY (`Amenities_ID`),
                             KEY `RentableUnit_ID` (`RentableUnit_ID`),
                             KEY `Property_ID` (`Property_ID`),
                             CONSTRAINT `amenities_ibfk_1` FOREIGN KEY (`RentableUnit_ID`) REFERENCES `rentableunit` (`RentableUnit_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
                             CONSTRAINT `amenities_ibfk_2` FOREIGN KEY (`Property_ID`) REFERENCES `property` (`Property_ID`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `amenities` VALUES (1,'Pool','20 sq foot pool in lobby',1,NULL),(2,'Lounge','Amazing lounge in the lobby of our building',NULL,2),(3,'Cafeteria','Free breakfast',NULL,3),(4,'Pool','Outdoor large pool',3,NULL),(5,'Theater','In house movie theater',1,NULL);

DROP TABLE IF EXISTS `bookableunit`;
CREATE TABLE `bookableunit` (
                                `Property_ID` int NOT NULL,
                                `RoomNum` int NOT NULL,
                                `NumPeople` int DEFAULT NULL,
                                `NumBeds` int DEFAULT NULL,
                                PRIMARY KEY (`Property_ID`,`RoomNum`)
);

INSERT INTO `bookableunit` VALUES (1,142,1,1),(2,364,2,2),(3,2000,5,2),(4,234,2,1),(5,446,2,1);

CREATE TABLE `customer` (
                            `ID` int NOT NULL,
                            `Name` char(30) DEFAULT NULL,
                            PRIMARY KEY (`ID`)
);

INSERT INTO `customer` VALUES (1,'Fairmont Hotel'),(2,'Hyatt Regency'),(3,'Sandman Hotel'),(4,'Mariott'),(5,'Rosewood');

CREATE TABLE `hotellisting` (
                                `HotelListing_ID` int NOT NULL,
                                `Cost` int DEFAULT NULL,
                                `Description` varchar(100) DEFAULT NULL,
                                `Property_ID` int NOT NULL,
                                `RoomNumber` int NOT NULL,
                                PRIMARY KEY (`HotelListing_ID`),
                                KEY `Property_ID` (`Property_ID`,`RoomNumber`),
                                CONSTRAINT `hotellisting_ibfk_1` FOREIGN KEY (`Property_ID`, `RoomNumber`) REFERENCES `bookableunit` (`Property_ID`, `RoomNum`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `hotellisting` VALUES (1,200,'Twin bed',1,142),(2,250,'Two twin',2,364),(3,1000,'2x king bed + jacuzzi + balcony',3,2000),(4,300,'water bed 2 bedroom 1 bathroom',4,234),(5,200,'bunk bed and canoe',5,446);

CREATE TABLE `hotelorganization` (
                                     `ID` int NOT NULL,
                                     `Name` char(30) DEFAULT NULL,
                                     PRIMARY KEY (`ID`),
                                     UNIQUE KEY `Name` (`Name`)
);

INSERT INTO `hotelorganization` VALUES (1,'Fairmont Hotel'),(2,'Hyatt Regency'),(4,'Mariott'),(5,'Rosewood'),(3,'Sandman Hotel');

CREATE TABLE `location_1` (
                              `PostalCode` char(6) NOT NULL,
                              `City` varchar(20) DEFAULT NULL,
                              `Province` varchar(50) DEFAULT NULL,
                              PRIMARY KEY (`PostalCode`)
);

INSERT INTO `location_1` VALUES ('A5B3C7','Richmond Knoll','Allofit'),('B2D3S6','Eastminster','Twotario'),('B2S5D3','Canada','Oldfoundland'),('B3G6S2','Vanscooter','Princess Edwardo Land'),('S2B5D3','Boronto','French Columbia');

DROP TABLE IF EXISTS `location_2`;
CREATE TABLE `location_2` (
                              `PostalCode` char(6) NOT NULL,
                              `Street` varchar(50) NOT NULL,
                              `UnitNumber` int NOT NULL,
                              PRIMARY KEY (`PostalCode`,`Street`,`UnitNumber`)
);

INSERT INTO `location_2` VALUES ('A5B3C7','Second St',2),('B2D3S6','Dinger Rd',2633),('B2S5D3','Lane Rd',555),('B3G6S2','West St E',69),('S2B5D3','Schule St',562);

DROP TABLE IF EXISTS `makesreservation_1`;
CREATE TABLE `makesreservation_1` (
                                      `reservation_ID` int NOT NULL,
                                      `CustomerID` int NOT NULL,
                                      `StartDate` date DEFAULT NULL,
                                      `Duration` int DEFAULT NULL,
                                      `BookableUnitID` int DEFAULT NULL,
                                      `RentableUnitID` int DEFAULT NULL,
                                      PRIMARY KEY (`reservation_ID`),
                                      KEY `CustomerID` (`CustomerID`),
                                      KEY `StartDate` (`StartDate`,`Duration`),
                                      KEY `makesreservation_1_bookableunit_Property_ID_fk` (`BookableUnitID`),
                                      CONSTRAINT `makesreservation_1_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
                                      CONSTRAINT `makesreservation_1_ibfk_2` FOREIGN KEY (`StartDate`, `Duration`) REFERENCES `makesreservation_2` (`StartDate`, `Duration`) ON DELETE CASCADE ON UPDATE CASCADE,
                                      CONSTRAINT `makesreservation_1_ibfk_3` FOREIGN KEY (`BookableUnitID`) REFERENCES `bookableunit` (`Property_ID`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `makesreservation_1` VALUES (1,2,'2023-02-13',7,1,NULL),(2,3,'2023-06-18',2,2,NULL),(3,5,'2023-12-23',4,3,NULL),(4,4,'2023-09-08',10,4,NULL),(5,2,'2023-02-23',5,5,NULL);

DROP TABLE IF EXISTS `makesreservation_2`;
CREATE TABLE `makesreservation_2` (
                                      `StartDate` date NOT NULL,
                                      `Duration` int NOT NULL,
                                      `EndDate` date DEFAULT NULL,
                                      PRIMARY KEY (`StartDate`,`Duration`)
);

INSERT INTO `makesreservation_2` VALUES ('2023-02-13',7,'2023-02-20'),('2023-02-23',5,'2023-02-28'),('2023-06-18',2,'2023-06-20'),('2023-09-08',10,'2023-09-18'),('2023-12-23',4,'2023-12-27');

DROP TABLE IF EXISTS `membership_1`;
CREATE TABLE `membership_1` (
                                `HotelOrganization_ID` int NOT NULL,
                                `DiscountRate` int DEFAULT NULL,
                                PRIMARY KEY (`HotelOrganization_ID`)
);

INSERT INTO `membership_1` VALUES (1,20),(2,45),(3,12),(4,15),(5,15);

DROP TABLE IF EXISTS `membership_2`;
CREATE TABLE `membership_2` (
                                `HotelOrganization_ID` int NOT NULL,
                                `CustomerID` int NOT NULL,
                                PRIMARY KEY (`HotelOrganization_ID`,`CustomerID`),
                                KEY `CustomerID` (`CustomerID`),
                                CONSTRAINT `membership_2_ibfk_1` FOREIGN KEY (`HotelOrganization_ID`) REFERENCES `membership_1` (`HotelOrganization_ID`),
                                CONSTRAINT `membership_2_ibfk_2` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`ID`)
);

INSERT INTO `membership_2` VALUES (5,1),(1,2),(2,2),(4,3),(3,4);

DROP TABLE IF EXISTS `privatelister`;
CREATE TABLE `privatelister` (
                                 `ID` int NOT NULL,
                                 `Name` char(30) DEFAULT NULL,
                                 PRIMARY KEY (`ID`)
);

INSERT INTO `privatelister` VALUES (1,'Vicki'),(2,'Ayush'),(3,'Jeffrey'),(4,'Frank'),(5,'Sam');


DROP TABLE IF EXISTS `privatelisting`;
CREATE TABLE `privatelisting` (
                                  `PrivateListing_ID` int NOT NULL,
                                  `Cost` int DEFAULT NULL,
                                  `Description` varchar(200) DEFAULT NULL,
                                  `RentableUnit_ID` int NOT NULL,
                                  PRIMARY KEY (`PrivateListing_ID`),
                                  KEY `RentableUnit_ID` (`RentableUnit_ID`),
                                  CONSTRAINT `privatelisting_ibfk_1` FOREIGN KEY (`RentableUnit_ID`) REFERENCES `rentableunit` (`RentableUnit_ID`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `privatelisting` VALUES (1,600,'small house, 3 bedrooms, kitchen',1),(2,100,'singular room with shared bathroom',2),(3,200,'singular room with private bathroom',3),(4,300,'small apartment, 2 bedroom 1 bathroom',4),(5,200,'treehouse',5),(6,4,'3',2),(7,4,'3',2);

DROP TABLE IF EXISTS `property`;
CREATE TABLE `property` (
                            `Property_ID` int NOT NULL,
                            `HotelOrganization_ID` int NOT NULL,
                            `Name` varchar(30) DEFAULT NULL,
                            `NumRooms` int DEFAULT NULL,
                            PRIMARY KEY (`Property_ID`),
                            KEY `HotelOrganization_ID` (`HotelOrganization_ID`),
                            CONSTRAINT `property_ibfk_1` FOREIGN KEY (`HotelOrganization_ID`) REFERENCES `hotelorganization` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `property` VALUES (1,1,'Fairmont Vancouver',100),(2,1,'Fairmont Whistler',200),(3,3,'Hyatt Vancouver',150),(4,4,'Mariott Vancouver',100),(5,5,'Rosewood Burnaby',50);

DROP TABLE IF EXISTS `rentableunit`;
CREATE TABLE `rentableunit` (
                                `RentableUnit_ID` int NOT NULL,
                                `NumPeople` int DEFAULT NULL,
                                `NumBeds` int DEFAULT NULL,
                                `PrivateOrganization_ID` int NOT NULL,
                                PRIMARY KEY (`RentableUnit_ID`),
                                KEY `PrivateOrganization_ID` (`PrivateOrganization_ID`),
                                CONSTRAINT `rentableunit_ibfk_1` FOREIGN KEY (`PrivateOrganization_ID`) REFERENCES `privatelister` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `rentableunit` VALUES (1,6,3,1),(2,3,2,2),(3,1,1,3),(4,3,2,4),(5,3,2,5);