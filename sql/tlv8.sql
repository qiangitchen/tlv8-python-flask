-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: tlv8
-- ------------------------------------------------------
-- Server version	5.7.12-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alembic_version`
--

DROP TABLE IF EXISTS `alembic_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alembic_version` (
  `version_num` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alembic_version`
--

LOCK TABLES `alembic_version` WRITE;
/*!40000 ALTER TABLE `alembic_version` DISABLE KEYS */;
INSERT INTO `alembic_version` VALUES ('cb97a51f5182');
/*!40000 ALTER TABLE `alembic_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_oporg`
--

DROP TABLE IF EXISTS `sa_oporg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_oporg` (
  `sid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sname` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scode` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slongname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sfname` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sfcode` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sfid` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sorgkindid` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `svalidstate` int(11) DEFAULT NULL,
  `sparent` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slevel` int(11) DEFAULT NULL,
  `sphone` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sfax` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saddress` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szip` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sdescription` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spersonid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `snodekind` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sshowname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ssequence` int(11) DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `ix_sa_oporg_sorgkindid` (`sorgkindid`),
  KEY `ix_sa_oporg_sparent` (`sparent`),
  KEY `ix_sa_oporg_spersonid` (`spersonid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_oporg`
--

LOCK TABLES `sa_oporg` WRITE;
/*!40000 ALTER TABLE `sa_oporg` DISABLE KEYS */;
INSERT INTO `sa_oporg` VALUES ('ORG01','管理员','TULIN',NULL,'/管理员','/TULIN','/ORG01','ogn',1,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0),('PSN01@ORG01','sa','SYSTEM',NULL,'/管理员/sa','/TULIN/SYSTEM','/ORG01.ogn/PSN01@ORG01.psm','psm',1,'ORG01',1,NULL,NULL,NULL,NULL,NULL,'PSN01',NULL,NULL,0,0);
/*!40000 ALTER TABLE `sa_oporg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_opperson`
--

DROP TABLE IF EXISTS `sa_opperson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_opperson` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sname` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scode` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sloginname` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spassword` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ssequence` int(11) DEFAULT NULL,
  `svalidstate` int(11) DEFAULT NULL,
  `smainorgid` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sdescription` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ssex` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sbirthday` date DEFAULT NULL,
  `fcasn` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fsignm` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`),
  UNIQUE KEY `scode` (`scode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_opperson`
--

LOCK TABLES `sa_opperson` WRITE;
/*!40000 ALTER TABLE `sa_opperson` DISABLE KEYS */;
INSERT INTO `sa_opperson` VALUES ('PSN01','sa','SYSTEM',NULL,'C4CA4238A0B923820DCC509A6F75849B',0,1,'ORG01',NULL,NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `sa_opperson` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-16 19:01:51
