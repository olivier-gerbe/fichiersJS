-- MySQL dump 10.19  Distrib 10.3.34-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: karuta-backend
-- ------------------------------------------------------
-- Server version	10.3.34-MariaDB-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `vector_table`
--

DROP TABLE IF EXISTS `vector_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vector_table` (
  `lineid` bigint(20) NOT NULL AUTO_INCREMENT,
  `userid` bigint(20) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `a1` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `a2` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `a3` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `a4` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `a5` varchar(5000) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `a6` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `a7` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `a8` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `a9` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `a10` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`lineid`)
) ENGINE=MyISAM AUTO_INCREMENT=151 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vector_rights`
--

DROP TABLE IF EXISTS `vector_rights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vector_rights` (
  `groupid` bigint(20) NOT NULL,
  `RD` tinyint(1) NOT NULL DEFAULT 1,
  `WR` tinyint(1) NOT NULL DEFAULT 0,
  `DL` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vector_usergroup`
--

DROP TABLE IF EXISTS `vector_usergroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vector_usergroup` (
  `groupid` bigint(20) NOT NULL AUTO_INCREMENT,
  `userid` bigint(20) NOT NULL,
  `lineid` bigint(20) NOT NULL,
  PRIMARY KEY (`groupid`,`userid`,`lineid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-09-16  7:39:35
