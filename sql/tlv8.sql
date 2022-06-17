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
-- Table structure for table `oa_leave`
--

DROP TABLE IF EXISTS `oa_leave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oa_leave` (
  `fid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fcreatorname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fcreatorid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fcreatorfid` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fcreatorfname` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fcreatedate` datetime DEFAULT NULL,
  `fstartdate` datetime DEFAULT NULL,
  `fenddate` datetime DEFAULT NULL,
  `fday` int(11) DEFAULT NULL,
  `fleavetype` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fstate` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `freason` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` int(11) NOT NULL,
  `fenclosure` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_leave`
--

LOCK TABLES `oa_leave` WRITE;
/*!40000 ALTER TABLE `oa_leave` DISABLE KEYS */;
INSERT INTO `oa_leave` VALUES ('0F243D91B06446DF93ED0041A068A0B3','system','PSN01','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-06-09 10:16:43','2022-06-09 10:16:46','2022-06-09 10:16:47',1,'事假','','',0,NULL),('1B658382A55295130ECEB76A3E87ADB1','system','PSN01','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-06-13 10:12:21','2022-06-13 10:12:22','2022-06-14 10:12:24',2,'事假','','333',0,''),('40DA9136A31EF77121AE326205FE6B00','system','PSN01','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-06-09 18:14:52','2022-06-10 18:14:55','2022-06-11 18:14:58',2,'事假','','22',0,'');
/*!40000 ALTER TABLE `oa_leave` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_docnode`
--

DROP TABLE IF EXISTS `sa_docnode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_docnode` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sdocname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sparentid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sfileid` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ssize` float DEFAULT NULL,
  `skind` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sdocpath` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sdocdisplaypath` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorname` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatetime` datetime DEFAULT NULL,
  `seditorid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seditorname` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slastwritetime` datetime DEFAULT NULL,
  `sdescription` text COLLATE utf8mb4_unicode_ci,
  `skeywords` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `ix_sa_docnode_sfileid` (`sfileid`),
  KEY `ix_sa_docnode_skind` (`skind`),
  KEY `ix_sa_docnode_sparentid` (`sparentid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_docnode`
--

LOCK TABLES `sa_docnode` WRITE;
/*!40000 ALTER TABLE `sa_docnode` DISABLE KEYS */;
/*!40000 ALTER TABLE `sa_docnode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_docpath`
--

DROP TABLE IF EXISTS `sa_docpath`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_docpath` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extname` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` float DEFAULT NULL,
  `filetype` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addtime` datetime DEFAULT NULL,
  `updatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_docpath`
--

LOCK TABLES `sa_docpath` WRITE;
/*!40000 ALTER TABLE `sa_docpath` DISABLE KEYS */;
/*!40000 ALTER TABLE `sa_docpath` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_flowconclusion`
--

DROP TABLE IF EXISTS `sa_flowconclusion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_flowconclusion` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sorder` int(11) NOT NULL,
  `sconclusionname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `screatorid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorname` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatetime` datetime DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `ix_sa_flowconclusion_screatorid` (`screatorid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_flowconclusion`
--

LOCK TABLES `sa_flowconclusion` WRITE;
/*!40000 ALTER TABLE `sa_flowconclusion` DISABLE KEYS */;
/*!40000 ALTER TABLE `sa_flowconclusion` ENABLE KEYS */;
UNLOCK TABLES;


-- ----------------------------
-- Table structure for sa_flowrecord
-- ----------------------------

DROP TABLE IF EXISTS `sa_flowrecord`;
CREATE TABLE `sa_flowrecord`  (
  `sid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sbillid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `snodeid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `snodename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sagreetext` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sopviewid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `staskid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sflowid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatorid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatorname` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ssign` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `screatetime` datetime NULL DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE,
  INDEX `ix_sa_flowrecord_sbillid`(`sbillid`) USING BTREE,
  INDEX `ix_sa_flowrecord_screatorid`(`screatorid`) USING BTREE,
  INDEX `ix_sa_flowrecord_sopviewid`(`sopviewid`) USING BTREE,
  INDEX `ix_sa_flowrecord_staskid`(`staskid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `sa_flowdrawlg`
--

DROP TABLE IF EXISTS `sa_flowdrawlg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_flowdrawlg` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sfolderid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sprocessid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sprocessname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sdrawlg` text COLLATE utf8mb4_unicode_ci,
  `sprocessacty` text COLLATE utf8mb4_unicode_ci,
  `screatorid` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supdatorid` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supdatorname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatetime` datetime DEFAULT NULL,
  `supdatetime` datetime DEFAULT NULL,
  `fenabled` int(11) DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`),
  UNIQUE KEY `sprocessid` (`sprocessid`),
  KEY `ix_sa_flowdrawlg_sfolderid` (`sfolderid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_flowdrawlg`
--

LOCK TABLES `sa_flowdrawlg` WRITE;
/*!40000 ALTER TABLE `sa_flowdrawlg` DISABLE KEYS */;
INSERT INTO `sa_flowdrawlg` VALUES ('9C4F2C759AAD3B7DA2CD2A2D3BC1873B','root','/oa/leave/Process','请假流程','<v:line title=\"New Line\" style=\"position: absolute; z-index: 1; cursor: pointer; display: none;\"><v:stroke></v:stroke></v:line><div id=\"bizActivity\" title=\"New bizActivity\" style=\"border: 1px solid blue; position: absolute; left: 300px; top: 80px; width: 100px; height: 40px; cursor: default; z-index: 100; display: none;\"><v:stroke></v:stroke></div><div id=\"Activity1\" title=\"开始\" style=\"position: absolute; left: 300px; top: 80px; width: 40px; height: 40px; cursor: pointer; z-index: 1;\"><svg id=\"SvgjsSvg1000\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"100%\" height=\"100%\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><ellipse id=\"SvgjsEllipse1006\" rx=\"20\" ry=\"20\" cx=\"20\" cy=\"20\" stroke=\"#33cc00\" stroke-width=\"1\" fill=\"#33cc00\"></ellipse><defs id=\"SvgjsDefs1001\"></defs></svg><v:shadow></v:shadow><div style=\"position: inherit; left: 2px; top: 12px; z-index: 1; width: 100%; height: 100%; text-align: center; color: blue; font-size: 9pt;\">开始</div></div><div id=\"bizActivity2\" title=\"请假申请\" style=\"border: 1px solid green; position: absolute; left: 270px; top: 140px; width: 100px; height: 40px; z-index: 99999; background: rgb(255, 255, 255); box-shadow: green 5px 5px 5px;\"><div id=\"bizActivity2_Label\" style=\"width: 100%; height: 100%; margin-top: 6px; text-align: center; color: green; font-size: 10pt; line-height: 25px;\">请假申请</div></div><div id=\"bizActivity4\" title=\"部门审批\" style=\"border: 1px solid blue; position: absolute; left: 270px; top: 200px; width: 100px; height: 40px; cursor: default; z-index: 1; background: rgb(255, 255, 255); box-shadow: rgb(179, 179, 179) 5px 5px 5px;\"><div id=\"bizActivity4_Label\" style=\"width: 100%; height: 100%; margin-top: 6px; text-align: center; color: rgb(0, 0, 0); font-size: 10pt; line-height: 25px;\">部门审批</div></div><div id=\"bizActivity6\" title=\"领导审批\" style=\"border: 1px solid blue; position: absolute; left: 270px; top: 260px; width: 100px; height: 40px; cursor: default; z-index: 1; background: rgb(255, 255, 255); box-shadow: rgb(179, 179, 179) 5px 5px 5px;\"><div id=\"bizActivity6_Label\" style=\"width: 100%; height: 100%; margin-top: 6px; text-align: center; color: rgb(0, 0, 0); font-size: 10pt; line-height: 25px;\">领导审批</div></div><div id=\"bizActivity8\" title=\"返回申请人\" style=\"border: 1px solid blue; position: absolute; left: 270px; top: 320px; width: 100px; height: 40px; cursor: default; z-index: 1; background: rgb(255, 255, 255); box-shadow: rgb(179, 179, 179) 5px 5px 5px;\"><div id=\"bizActivity8_Label\" style=\"width: 100%; height: 100%; margin-top: 6px; text-align: center; color: rgb(0, 0, 0); font-size: 10pt; line-height: 25px;\">返回申请人</div></div><div id=\"Activity10\" title=\"结束\" style=\"position: absolute; left: 300px; top: 380px; width: 40px; height: 40px; cursor: pointer; z-index: 1;\"><svg id=\"SvgjsSvg1007\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"100%\" height=\"100%\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><ellipse id=\"SvgjsEllipse1009\" rx=\"20\" ry=\"20\" cx=\"20\" cy=\"20\" stroke=\"red\" stroke-width=\"1\" fill=\"red\"></ellipse><defs id=\"SvgjsDefs1008\"></defs></svg><v:shadow></v:shadow><div style=\"position: inherit; left: 2px; top: 12px; z-index: 1; width: 100%; height: 100%; text-align: center; color: blue; font-size: 9pt;\">结束</div></div><div id=\"line_3\" style=\"width: 100%; height: 100%; margin-top: 30px; position: absolute; left: 0px; top: 0px; z-index: 1; cursor: pointer;\"><svg id=\"SvgjsSvg1010\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"100%\" height=\"100%\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><polyline id=\"SvgjsPolyline1012\" points=\"320,90 320,102\" stroke=\"blue\" stroke-width=\"1\" fill=\"none\" marker-end=\"url(#idArrow)\"></polyline><defs id=\"SvgjsDefs1011\"></defs></svg></div><div id=\"line_5\" style=\"width: 100%; height: 100%; margin-top: 30px; position: absolute; left: 0px; top: 0px; z-index: 1; cursor: pointer;\"><svg id=\"SvgjsSvg1013\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"100%\" height=\"100%\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><polyline id=\"SvgjsPolyline1015\" points=\"320,150 320,162\" stroke=\"blue\" stroke-width=\"1\" fill=\"none\" marker-end=\"url(#idArrow)\"></polyline><defs id=\"SvgjsDefs1014\"></defs></svg></div><div id=\"line_7\" style=\"width: 100%; height: 100%; margin-top: 30px; position: absolute; left: 0px; top: 0px; z-index: 1; cursor: pointer;\"><svg id=\"SvgjsSvg1016\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"100%\" height=\"100%\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><polyline id=\"SvgjsPolyline1018\" points=\"320,210 320,222\" stroke=\"blue\" stroke-width=\"1\" fill=\"none\" marker-end=\"url(#idArrow)\"></polyline><defs id=\"SvgjsDefs1017\"></defs></svg></div><div id=\"line_9\" style=\"width: 100%; height: 100%; margin-top: 30px; position: absolute; left: 0px; top: 0px; z-index: 1; cursor: pointer;\"><svg id=\"SvgjsSvg1019\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"100%\" height=\"100%\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><polyline id=\"SvgjsPolyline1021\" points=\"320,270 320,282\" stroke=\"blue\" stroke-width=\"1\" fill=\"none\" marker-end=\"url(#idArrow)\"></polyline><defs id=\"SvgjsDefs1020\"></defs></svg></div><div id=\"line_11\" style=\"width: 100%; height: 100%; margin-top: 30px; position: absolute; left: 0px; top: 0px; z-index: 1; cursor: pointer;\"><svg id=\"SvgjsSvg1022\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"100%\" height=\"100%\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><polyline id=\"SvgjsPolyline1024\" points=\"320,330 320,342\" stroke=\"blue\" stroke-width=\"1\" fill=\"none\" marker-end=\"url(#idArrow)\"></polyline><defs id=\"SvgjsDefs1023\"></defs></svg></div><div id=\"/oa/leave/Process\" style=\"width: 100%; height: 100%; margin-top: 30px;\"><svg id=\"SvgjsSvg1025\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"100%\" height=\"100%\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><defs id=\"SvgjsDefs1026\"></defs></svg><svg id=\"SvgjsSvg1027\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"100%\" height=\"100%\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><defs id=\"SvgjsDefs1028\"></defs></svg><svg id=\"SvgjsSvg1029\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"100%\" height=\"100%\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><defs id=\"SvgjsDefs1030\"></defs></svg><svg id=\"SvgjsSvg1031\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"100%\" height=\"100%\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><defs id=\"SvgjsDefs1032\"></defs></svg><svg id=\"SvgjsSvg1033\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"100%\" height=\"100%\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><defs id=\"SvgjsDefs1034\"></defs></svg></div><div id=\"/oa/leave/Process\" style=\"width: 100%; height: 100%; margin-top: 30px;\"></div><div id=\"/oa/leave/Process\" style=\"width: 100%; height: 100%; margin-top: 30px;\"></div><div id=\"/oa/leave/Process\" style=\"width: 100%; height: 100%; margin-top: 30px;\"></div><div id=\"/oa/leave/Process\" style=\"width: 100%; height: 100%; margin-top: 30px;\"></div>','{\"id\":\"\\/oa\\/leave\\/Process\",\"name\":\"请假流程\",\"count\":11,\"nodes\":[{\"id\":\"Activity1\",\"name\":\"开始\",\"type\":\"start\",\"shape\":\"oval\",\"number\":1,\"left\":300,\"top\":80,\"width\":40,\"height\":40,\"property\":null},{\"id\":\"mainActivity\",\"name\":\"请假申请\",\"type\":\"node\",\"shape\":\"rect\",\"number\":2,\"left\":270,\"top\":140,\"width\":100,\"height\":40,\"property\":[{\"id\":\"n_p_id\",\"text\":\"input\",\"value\":\"mainActivity\"},{\"id\":\"n_p_name\",\"text\":\"input\",\"value\":\"请假申请\"},{\"id\":\"n_p_exepage\",\"text\":\"input\",\"value\":\"\\/oa\\/leave\\/mainActivity\"},{\"id\":\"n_p_label\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_desc\",\"text\":\"textarea\",\"value\":\"\"},{\"id\":\"n_p_group\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_roleID\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_role\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_r_grab\",\"text\":\"select\",\"value\":\"\"},{\"id\":\"n_r_grabway\",\"text\":\"select\",\"value\":\"\"},{\"id\":\"n_t_queryt\",\"text\":\"select\",\"value\":\"\"},{\"id\":\"n_p_back\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_note\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_r_transe\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_in\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_time\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_timetype\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call1\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call2\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call3\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call4\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call5\",\"text\":\"input\",\"value\":\"\"}]},{\"id\":\"bizActivity4\",\"name\":\"部门审批\",\"type\":\"node\",\"shape\":\"rect\",\"number\":4,\"left\":270,\"top\":200,\"width\":100,\"height\":40,\"property\":[{\"id\":\"n_p_id\",\"text\":\"input\",\"value\":\"bizActivity4\"},{\"id\":\"n_p_name\",\"text\":\"input\",\"value\":\"部门审批\"},{\"id\":\"n_p_exepage\",\"text\":\"input\",\"value\":\"\\/oa\\/leave\\/bizActivity4\"},{\"id\":\"n_p_label\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_desc\",\"text\":\"textarea\",\"value\":\"\"},{\"id\":\"n_p_group\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_roleID\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_role\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_r_grab\",\"text\":\"select\",\"value\":\"\"},{\"id\":\"n_r_grabway\",\"text\":\"select\",\"value\":\"\"},{\"id\":\"n_t_queryt\",\"text\":\"select\",\"value\":\"\"},{\"id\":\"n_p_back\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_note\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_r_transe\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_in\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_time\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_timetype\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call1\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call2\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call3\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call4\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call5\",\"text\":\"input\",\"value\":\"\"}]},{\"id\":\"bizActivity6\",\"name\":\"领导审批\",\"type\":\"node\",\"shape\":\"rect\",\"number\":6,\"left\":270,\"top\":260,\"width\":100,\"height\":40,\"property\":[{\"id\":\"n_p_id\",\"text\":\"input\",\"value\":\"bizActivity6\"},{\"id\":\"n_p_name\",\"text\":\"input\",\"value\":\"领导审批\"},{\"id\":\"n_p_exepage\",\"text\":\"input\",\"value\":\"\\/oa\\/leave\\/bizActivity6\"},{\"id\":\"n_p_label\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_desc\",\"text\":\"textarea\",\"value\":\"\"},{\"id\":\"n_p_group\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_roleID\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_role\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_r_grab\",\"text\":\"select\",\"value\":\"\"},{\"id\":\"n_r_grabway\",\"text\":\"select\",\"value\":\"\"},{\"id\":\"n_t_queryt\",\"text\":\"select\",\"value\":\"\"},{\"id\":\"n_p_back\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_note\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_r_transe\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_in\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_time\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_timetype\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call1\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call2\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call3\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call4\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call5\",\"text\":\"input\",\"value\":\"\"}]},{\"id\":\"bizActivity8\",\"name\":\"返回申请人\",\"type\":\"node\",\"shape\":\"rect\",\"number\":8,\"left\":270,\"top\":320,\"width\":100,\"height\":40,\"property\":[{\"id\":\"n_p_id\",\"text\":\"input\",\"value\":\"bizActivity8\"},{\"id\":\"n_p_name\",\"text\":\"input\",\"value\":\"返回申请人\"},{\"id\":\"n_p_exepage\",\"text\":\"input\",\"value\":\"\\/oa\\/leave\\/bizActivity8\"},{\"id\":\"n_p_label\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_desc\",\"text\":\"textarea\",\"value\":\"\"},{\"id\":\"n_p_group\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_roleID\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_role\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_r_grab\",\"text\":\"select\",\"value\":\"\"},{\"id\":\"n_r_grabway\",\"text\":\"select\",\"value\":\"\"},{\"id\":\"n_t_queryt\",\"text\":\"select\",\"value\":\"\"},{\"id\":\"n_p_back\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_note\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_r_transe\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_in\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_time\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_timetype\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call1\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call2\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call3\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call4\",\"text\":\"input\",\"value\":\"\"},{\"id\":\"n_p_call5\",\"text\":\"input\",\"value\":\"\"}]},{\"id\":\"Activity10\",\"name\":\"结束\",\"type\":\"end\",\"shape\":\"oval\",\"number\":10,\"left\":300,\"top\":380,\"width\":40,\"height\":40,\"property\":null}],\"lines\":[{\"id\":\"line_3\",\"name\":\"line_3\",\"type\":\"line\",\"shape\":\"line\",\"number\":3,\"from\":\"Activity1\",\"to\":\"mainActivity\",\"fromx\":320,\"fromy\":120,\"tox\":320,\"toy\":140,\"spwidth\":0,\"spheight\":0,\"polydot\":[],\"property\":null},{\"id\":\"line_5\",\"name\":\"line_5\",\"type\":\"line\",\"shape\":\"line\",\"number\":5,\"from\":\"mainActivity\",\"to\":\"bizActivity4\",\"fromx\":320,\"fromy\":180,\"tox\":320,\"toy\":200,\"spwidth\":0,\"spheight\":0,\"polydot\":[],\"property\":null},{\"id\":\"line_7\",\"name\":\"line_7\",\"type\":\"line\",\"shape\":\"line\",\"number\":7,\"from\":\"bizActivity4\",\"to\":\"bizActivity6\",\"fromx\":320,\"fromy\":240,\"tox\":320,\"toy\":260,\"spwidth\":0,\"spheight\":0,\"polydot\":[],\"property\":null},{\"id\":\"line_9\",\"name\":\"line_9\",\"type\":\"line\",\"shape\":\"line\",\"number\":9,\"from\":\"bizActivity6\",\"to\":\"bizActivity8\",\"fromx\":320,\"fromy\":300,\"tox\":320,\"toy\":320,\"spwidth\":0,\"spheight\":0,\"polydot\":[],\"property\":null},{\"id\":\"line_11\",\"name\":\"line_11\",\"type\":\"line\",\"shape\":\"line\",\"number\":11,\"from\":\"bizActivity8\",\"to\":\"Activity10\",\"fromx\":320,\"fromy\":360,\"tox\":320,\"toy\":380,\"spwidth\":0,\"spheight\":0,\"polydot\":[],\"property\":null}]}',NULL,'system',NULL,NULL,'2022-05-30 14:27:53',NULL,1,0);
/*!40000 ALTER TABLE `sa_flowdrawlg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_flowfolder`
--

DROP TABLE IF EXISTS `sa_flowfolder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_flowfolder` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scode` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sparent` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sidpath` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `ix_sa_flowfolder_sparent` (`sparent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_flowfolder`
--

LOCK TABLES `sa_flowfolder` WRITE;
/*!40000 ALTER TABLE `sa_flowfolder` DISABLE KEYS */;
/*!40000 ALTER TABLE `sa_flowfolder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_log`
--

DROP TABLE IF EXISTS `sa_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_log` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sdescription` text COLLATE utf8mb4_unicode_ci,
  `sprocessname` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sactivityname` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorpersonname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorpersonid` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorfid` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorfname` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sactionname` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stypename` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sip` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatetime` datetime DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_log`
--

LOCK TABLES `sa_log` WRITE;
/*!40000 ALTER TABLE `sa_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `sa_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_onlineinfo`
--

DROP TABLE IF EXISTS `sa_onlineinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_onlineinfo` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `suserid` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `susername` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suserfid` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suserfname` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sloginip` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slogindate` datetime DEFAULT NULL,
  `ssessionid` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sserviceip` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smachinecode` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE,
  UNIQUE KEY `ssessionid` (`ssessionid`) USING BTREE,
  KEY `ix_sa_onlineinfo_smachinecode` (`smachinecode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_onlineinfo`
--

LOCK TABLES `sa_onlineinfo` WRITE;
/*!40000 ALTER TABLE `sa_onlineinfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `sa_onlineinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_opauthorize`
--

DROP TABLE IF EXISTS `sa_opauthorize`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_opauthorize` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sorgid` varchar(65) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sorgname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sorgfid` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sorgfname` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sauthorizeroleid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sauthorizerolecode` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sdescription` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorfid` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorfname` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatetime` datetime DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE,
  KEY `ix_sa_opauthorize_sauthorizerolecode` (`sauthorizerolecode`) USING BTREE,
  KEY `ix_sa_opauthorize_sauthorizeroleid` (`sauthorizeroleid`) USING BTREE,
  KEY `ix_sa_opauthorize_sorgid` (`sorgid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_opauthorize`
--

LOCK TABLES `sa_opauthorize` WRITE;
/*!40000 ALTER TABLE `sa_opauthorize` DISABLE KEYS */;
INSERT INTO `sa_opauthorize` VALUES ('2551C11B97DB48210F2BD71401B039CE','PSN01@ORG01','system','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','RL01','opm','超级管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-05-22 16:40:52',0),('E5E4E4BB59C591C9A93546B1DC125303','3C0D1C2F08132B7EC6A3908BD662928E','测试机构','/3C0D1C2F08132B7EC6A3908BD662928E.ogn','/测试机构','62C986B66A97D0F6F251698A0553FC42','testrole','测试角色','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-06-06 18:34:03',0);
/*!40000 ALTER TABLE `sa_opauthorize` ENABLE KEYS */;
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
  PRIMARY KEY (`sid`) USING BTREE,
  KEY `ix_sa_oporg_sorgkindid` (`sorgkindid`) USING BTREE,
  KEY `ix_sa_oporg_sparent` (`sparent`) USING BTREE,
  KEY `ix_sa_oporg_spersonid` (`spersonid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_oporg`
--

LOCK TABLES `sa_oporg` WRITE;
/*!40000 ALTER TABLE `sa_oporg` DISABLE KEYS */;
INSERT INTO `sa_oporg` VALUES ('3C0D1C2F08132B7EC6A3908BD662928E','测试机构','testogn',NULL,'/测试机构','/testogn','/3C0D1C2F08132B7EC6A3908BD662928E.ogn','ogn',1,NULL,0,'','','',NULL,'',NULL,NULL,NULL,1,0),('7BA4523D57DB87BE42614FA76B34B122@97DA9DF40D94E4EDD350A1A0DC4C0917','测试人员1','test1',NULL,'/测试机构/测试部门1/测试岗位1/测试人员1','/testogn/testdpt/testpos/test1','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/7BA4523D57DB87BE42614FA76B34B122@3C0D1C2F08132B7EC6A3908BD662928E.psm','psm',1,'97DA9DF40D94E4EDD350A1A0DC4C0917',3,NULL,NULL,NULL,NULL,NULL,'7BA4523D57DB87BE42614FA76B34B122',NULL,NULL,1,0),('97DA9DF40D94E4EDD350A1A0DC4C0917','测试岗位1','testpos',NULL,'/测试机构/测试部门1/测试岗位1','/testogn/testdpt/testpos','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos','pos',1,'CD92B921EE135105A1D4856539B2D58A',2,'','','',NULL,'',NULL,NULL,NULL,1,0),('B8AE1E355B0F86B3CC80D35DC31C25C9','测试岗位2','testpos2',NULL,'/测试机构/测试部门2/测试岗位2','/testogn/testdpt2/testpos2','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/E21FD204D22403C8F010B849D6450D6A.dpt/B8AE1E355B0F86B3CC80D35DC31C25C9.pos','pos',1,'E21FD204D22403C8F010B849D6450D6A',2,'','','',NULL,'',NULL,NULL,NULL,1,0),('BB75847554AB9BEE10BE6770D8C24DE8@97DA9DF40D94E4EDD350A1A0DC4C0917','测试人员2','test2',NULL,'/测试机构/测试部门1/测试岗位1/测试人员2','/testogn/testdpt/testpos/test2','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/BB75847554AB9BEE10BE6770D8C24DE8@97DA9DF40D94E4EDD350A1A0DC4C0917.psm','psm',1,'97DA9DF40D94E4EDD350A1A0DC4C0917',0,NULL,NULL,NULL,NULL,NULL,'BB75847554AB9BEE10BE6770D8C24DE8',NULL,NULL,1,0),('CD92B921EE135105A1D4856539B2D58A','测试部门1','testdpt',NULL,'/测试机构/测试部门1','/testogn/testdpt','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt','dpt',1,'3C0D1C2F08132B7EC6A3908BD662928E',1,'','','',NULL,'',NULL,NULL,NULL,1,0),('D8B1FF9943C8C87CB1C8C8B9F94D0B16@B8AE1E355B0F86B3CC80D35DC31C25C9','测试人员3','test3',NULL,'/测试机构/测试部门2/测试岗位2/测试人员3','/testogn/testdpt2/testpos2/test3','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/E21FD204D22403C8F010B849D6450D6A.dpt/B8AE1E355B0F86B3CC80D35DC31C25C9.pos/D8B1FF9943C8C87CB1C8C8B9F94D0B16@B8AE1E355B0F86B3CC80D35DC31C25C9.psm','psm',1,'B8AE1E355B0F86B3CC80D35DC31C25C9',0,NULL,NULL,NULL,NULL,NULL,'D8B1FF9943C8C87CB1C8C8B9F94D0B16',NULL,NULL,1,0),('E21FD204D22403C8F010B849D6450D6A','测试部门2','testdpt2',NULL,'/测试机构/测试部门2','/testogn/testdpt2','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/E21FD204D22403C8F010B849D6450D6A.dpt','dpt',1,'3C0D1C2F08132B7EC6A3908BD662928E',1,'','','',NULL,'',NULL,NULL,NULL,1,0),('ORG01','管理员','TULIN',NULL,'/管理员','/TULIN','/ORG01','ogn',1,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0),('PSN01@ORG01','system','SYSTEM',NULL,'/管理员/system','/TULIN/SYSTEM','/ORG01.ogn/PSN01@ORG01.psm','psm',1,'ORG01',1,NULL,NULL,NULL,NULL,NULL,'PSN01',NULL,NULL,0,0);
/*!40000 ALTER TABLE `sa_oporg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_oppermission`
--

DROP TABLE IF EXISTS `sa_oppermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_oppermission` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `spermissionroleid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sprocess` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sactivityfname` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sactivity` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sactionsnames` text COLLATE utf8mb4_unicode_ci,
  `sactions` text COLLATE utf8mb4_unicode_ci,
  `spermissionkind` int(11) NOT NULL,
  `sdescription` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ssequence` int(11) DEFAULT NULL,
  `svalidstate` int(11) DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE,
  KEY `ix_sa_oppermission_spermissionroleid` (`spermissionroleid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_oppermission`
--

LOCK TABLES `sa_oppermission` WRITE;
/*!40000 ALTER TABLE `sa_oppermission` DISABLE KEYS */;
INSERT INTO `sa_oppermission` VALUES ('0CF6C83DE6FD16BEBF75D2A8FD056881','RL01','/SA/log/logProcess','/系统管理/系统工具/操作日志','mainActivity',NULL,NULL,0,'/system/logs',9,1,0),('17C6F4FE19E6A556F61A066164ACD546','RL01','/oa/leave/Process','/OA系统/人事管理/部门审批','bizActivity4',NULL,NULL,0,'/oa/leave/bizActivity4',2,1,0),('1CE9B0FF633B989E55BC6E793A851E32','RL02-doc','/SA/doc/docCenter/docCenterProcess','/系统管理/文档管理/文档中心','docCenter',NULL,NULL,0,'/system/doc/docCenter',1,1,0),('1DC3831C34AC8ED61524C41E177B67C4','RL01','/SA/OPM/authorization/authorizationProcess','/系统管理/组织机构/授权管理','mainActivity',NULL,NULL,0,'/system/OPM/authorization',3,1,0),('2BD4857CB8069793990F186B0E986439','62C986B66A97D0F6F251698A0553FC42','/oa/leave/Process','/OA系统/人事管理/返回申请人','bizActivity8',NULL,NULL,0,'/oa/leave/bizActivity8',4,1,0),('325BFA75C55FD1DB49075F44C4B72628','RL01','/SA/task/taskCenter/process','/系统管理/流程管理/流程监控','monitorActivity',NULL,NULL,0,'/system/flow/monitor',5,1,0),('36D5BF85AD5EEEEA7122F4069E0F204D','62C986B66A97D0F6F251698A0553FC42','/oa/leave/Process','/OA系统/人事管理/部门审批','bizActivity4',NULL,NULL,0,'/oa/leave/bizActivity4',2,1,0),('57EF14E4A669882A9843271C4EBA7E58','RL01','/SA/doc/docCenter/docCenterProcess','/系统管理/文档管理/文档中心','docCenter',NULL,NULL,0,'/system/doc/docCenter',7,1,0),('5C5DA17E97DFF3148C2CAAD054684473','RL01','/flw/dwr/process','/系统管理/流程管理/流程设计','vml-dwr-editor',NULL,NULL,0,'/system/flow/flow_design',6,1,0),('630E9DFA815B532F5C2D50253EB19DF2','RL02','/flw/dwr/process','/系统管理/流程管理/流程设计','vml-dwr-editor',NULL,NULL,0,'/system/flow/flow_design',2,1,0),('7A62182221B15DCE20F289F315680340','RL01','/SA/OPM/role/roleProcess','/系统管理/组织机构/角色管理','mainActivity',NULL,NULL,0,'/system/OPM/role',2,1,0),('8037E66DAD0A90DC4256EC9848E536AF','RL01','/SA/online/onlineProcess','/系统管理/系统工具/在线用户','mainActivity',NULL,NULL,0,'/system/online',10,1,0),('8091869B1201127C4B54F200AC7E878F','RL01','/SA/doc/docSearch/docSearchProcess','/系统管理/文档管理/文档检索','mainActivity',NULL,NULL,0,'/system/doc/docSearch',8,1,0),('8D4CBA9B74D45ABE5726D5E14A779DB0','62C986B66A97D0F6F251698A0553FC42','/oa/leave/Process','/OA系统/人事管理/请假申请','mainActivity',NULL,NULL,0,'/oa/leave/mainActivity',1,1,0),('A7FA204F027AF509F2762F4990F6F1CC','RL02-doc','/SA/doc/docSearch/docSearchProcess','/系统管理/文档管理/文档检索','mainActivity',NULL,NULL,0,'/system/doc/docSearch',2,1,0),('B1E719EBCCF8CEF030C083CFA7DF0966','RL01','/SA/OPM/organization/organizationProcess','/系统管理/组织机构/机构管理','mainActivity',NULL,NULL,0,'/system/OPM/organization',1,1,0),('BCB09BC3E99CD319DBF8009A9CBAB1AC','RL01','/oa/leave/Process','/OA系统/人事管理/请假申请','mainActivity',NULL,NULL,0,'/oa/leave/mainActivity',1,1,0),('CFA94636F5844609400AB0322D9C27DA','RL01','/oa/leave/Process','/OA系统/人事管理/返回申请人','bizActivity8',NULL,NULL,0,'/oa/leave/bizActivity8',4,1,0),('E572B9CCC095B962A41AE8D8B7878D54','RL02','/SA/task/taskCenter/process','/系统管理/流程管理/流程监控','monitorActivity',NULL,NULL,0,'/system/flow/monitor',1,1,0),('EAA850865197E41D5F597DAC4A0CAAFC','62C986B66A97D0F6F251698A0553FC42','/oa/leave/Process','/OA系统/人事管理/领导审批','bizActivity6',NULL,NULL,0,'/oa/leave/bizActivity6',3,1,0),('F3613C14223CFDE0396DC82D8D8F10CB','RL01','/oa/leave/Process','/OA系统/人事管理/领导审批','bizActivity6',NULL,NULL,0,'/oa/leave/bizActivity6',3,1,0),('F669B3828A5E307943559F69E938DD51','RL01','/SA/OPM/recycled/recycledProcess','/系统管理/组织机构/回收站','mainActivity',NULL,NULL,0,'/system/OPM/recycled',4,1,0);
/*!40000 ALTER TABLE `sa_oppermission` ENABLE KEYS */;
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
  `sbirthday` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smobilephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smail` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scasn` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ssignm` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE,
  UNIQUE KEY `scode` (`scode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_opperson`
--

LOCK TABLES `sa_opperson` WRITE;
/*!40000 ALTER TABLE `sa_opperson` DISABLE KEYS */;
INSERT INTO `sa_opperson` VALUES ('7BA4523D57DB87BE42614FA76B34B122','测试人员1','test1','','E10ADC3949BA59ABBE56E057F20F883E',NULL,1,'97DA9DF40D94E4EDD350A1A0DC4C0917','','','','',NULL,'','',0),('BB75847554AB9BEE10BE6770D8C24DE8','测试人员2','test2','','E10ADC3949BA59ABBE56E057F20F883E',NULL,1,'97DA9DF40D94E4EDD350A1A0DC4C0917','','','','',NULL,'','',0),('D8B1FF9943C8C87CB1C8C8B9F94D0B16','测试人员3','test3','','E10ADC3949BA59ABBE56E057F20F883E',NULL,1,'B8AE1E355B0F86B3CC80D35DC31C25C9','','','','',NULL,'','',0),('PSN01','system','SYSTEM',NULL,'C4CA4238A0B923820DCC509A6F75849B',0,1,'ORG01','','男','2022-06-15','','',NULL,NULL,0);
/*!40000 ALTER TABLE `sa_opperson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_oprole`
--

DROP TABLE IF EXISTS `sa_oprole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_oprole` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sname` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scode` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `srolekind` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sdescription` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ssequence` int(11) DEFAULT NULL,
  `svalidstate` int(11) DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_oprole`
--

LOCK TABLES `sa_oprole` WRITE;
/*!40000 ALTER TABLE `sa_oprole` DISABLE KEYS */;
INSERT INTO `sa_oprole` VALUES ('62C986B66A97D0F6F251698A0553FC42','测试角色','testrole','业务功能','',NULL,1,0),('RL01','超级管理员','opm','业务功能','请勿删除',9999,1,0),('RL02','任务','task','系统管理',NULL,9997,1,0),('RL02-doc','文档','doc','系统管理',NULL,9996,1,0);
/*!40000 ALTER TABLE `sa_oprole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_personal_docnode`
--

DROP TABLE IF EXISTS `sa_personal_docnode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_personal_docnode` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sparentid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sparentname` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sdescription` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spath` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorname` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatetime` datetime DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `ix_sa_personal_docnode_screatorid` (`screatorid`),
  KEY `ix_sa_personal_docnode_sparentid` (`sparentid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_personal_docnode`
--

LOCK TABLES `sa_personal_docnode` WRITE;
/*!40000 ALTER TABLE `sa_personal_docnode` DISABLE KEYS */;
/*!40000 ALTER TABLE `sa_personal_docnode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_personal_file`
--

DROP TABLE IF EXISTS `sa_personal_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_personal_file` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `smasterid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sfileid` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sfilename` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sfilesize` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saccessory` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatorname` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatetime` datetime DEFAULT NULL,
  `saccesscurrentid` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saccesscurrentname` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `ix_sa_personal_file_screatorid` (`screatorid`),
  KEY `ix_sa_personal_file_smasterid` (`smasterid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_personal_file`
--

LOCK TABLES `sa_personal_file` WRITE;
/*!40000 ALTER TABLE `sa_personal_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `sa_personal_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_psnschedule`
--

DROP TABLE IF EXISTS `sa_psnschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_psnschedule` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scaption` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spriority` int(11) DEFAULT NULL,
  `sstartdate` datetime NOT NULL,
  `senddate` datetime DEFAULT NULL,
  `scontent` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `swhouser` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saffairstype` int(11) DEFAULT NULL,
  `sstartdate_axis` int(11) DEFAULT NULL,
  `ssenddate_axis` int(11) DEFAULT NULL,
  `version` int(11) NOT NULL,
  `sstatus` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`sid`),
  KEY `ix_sa_psnschedule_sstatus` (`sstatus`),
  KEY `ix_sa_psnschedule_swhouser` (`swhouser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_psnschedule`
--

LOCK TABLES `sa_psnschedule` WRITE;
/*!40000 ALTER TABLE `sa_psnschedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `sa_psnschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sa_task`
--

DROP TABLE IF EXISTS `sa_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sa_task` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sparentid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sflowid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sprocess` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sactivity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sstatusid` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sstatusname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screatetime` datetime DEFAULT NULL,
  `slimittime` datetime DEFAULT NULL,
  `scpersonid` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scpersonname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scdeptid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scdeptname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scognid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scognname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scfid` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scfname` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sexecutetime` datetime DEFAULT NULL,
  `sepersonid` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sepersonname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sedeptid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sedeptname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seognid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seognname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sefid` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sefname` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slock` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scurl` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seurl` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sdata1` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skindid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scontent` text COLLATE utf8mb4_unicode_ci,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `ix_sa_task_sactivity` (`sactivity`),
  KEY `ix_sa_task_scpersonid` (`scpersonid`),
  KEY `ix_sa_task_sdata1` (`sdata1`),
  KEY `ix_sa_task_sepersonid` (`sepersonid`),
  KEY `ix_sa_task_sflowid` (`sflowid`),
  KEY `ix_sa_task_sparentid` (`sparentid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sa_task`
--

LOCK TABLES `sa_task` WRITE;
/*!40000 ALTER TABLE `sa_task` DISABLE KEYS */;
INSERT INTO `sa_task` VALUES ('07B039490F8D6203B7D6C3D4BD6717D2','3EA26484F5E662037B1A193308415611','请假申请:请假流程','3EA26484F5E662037B1A193308415611','/oa/leave/Process','bizActivity2','tesFinished','已完成','2022-06-06 18:19:35',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-06-06 18:19:40','PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system',NULL,'','/oa/leave/mainActivity','C9DA139CAC800001EDC2AD8010301A30','task',NULL,1),('0DF208464B9B0CE809F88AFC1C6ABF6A',NULL,'请假流程','0DF208464B9B0CE809F88AFC1C6ABF6A','/oa/leave/Process',NULL,'tesExecuting','正在处理','2022-06-06 18:34:23',NULL,'7BA4523D57DB87BE42614FA76B34B122','测试人员1','CD92B921EE135105A1D4856539B2D58A','测试部门1','3C0D1C2F08132B7EC6A3908BD662928E','测试机构','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/7BA4523D57DB87BE42614FA76B34B122@3C0D1C2F08132B7EC6A3908BD662928E.psm','/测试机构/测试部门1/测试岗位1/测试人员1',NULL,'7BA4523D57DB87BE42614FA76B34B122','测试人员1','CD92B921EE135105A1D4856539B2D58A','测试部门1','3C0D1C2F08132B7EC6A3908BD662928E','测试机构','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/7BA4523D57DB87BE42614FA76B34B122@3C0D1C2F08132B7EC6A3908BD662928E.psm','/测试机构/测试部门1/测试岗位1/测试人员1',NULL,NULL,NULL,'C9DA147589800001D43E109014601501','task',NULL,0),('0EFCE24A356C75D304895A231C557B4D','0DF208464B9B0CE809F88AFC1C6ABF6A','请假申请:请假流程','0DF208464B9B0CE809F88AFC1C6ABF6A','/oa/leave/Process','bizActivity2','tesReady','尚未处理','2022-06-06 18:34:23',NULL,'7BA4523D57DB87BE42614FA76B34B122','测试人员1','CD92B921EE135105A1D4856539B2D58A','测试部门1','3C0D1C2F08132B7EC6A3908BD662928E','测试机构','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/7BA4523D57DB87BE42614FA76B34B122@3C0D1C2F08132B7EC6A3908BD662928E.psm','/测试机构/测试部门1/测试岗位1/测试人员1',NULL,'7BA4523D57DB87BE42614FA76B34B122','测试人员1','CD92B921EE135105A1D4856539B2D58A','测试部门1','3C0D1C2F08132B7EC6A3908BD662928E','测试机构','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/7BA4523D57DB87BE42614FA76B34B122@3C0D1C2F08132B7EC6A3908BD662928E.psm','/测试机构/测试部门1/测试岗位1/测试人员1','7BA4523D57DB87BE42614FA76B34B122','','/oa/leave/mainActivity','C9DA147589800001D43E109014601501','task',NULL,1),('28771185FEEB6DC3EEB11594DCB3676D','8A13B81B2567FC2FCA689F6E71DC371D','部门审批:请假流程','6E5B1A5B244D3FA542B24481190079F7','/oa/leave/Process','bizActivity4','tesReady','尚未处理','2022-06-06 18:51:41',NULL,'7BA4523D57DB87BE42614FA76B34B122','测试人员1','CD92B921EE135105A1D4856539B2D58A','测试部门1','3C0D1C2F08132B7EC6A3908BD662928E','测试机构','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/7BA4523D57DB87BE42614FA76B34B122@3C0D1C2F08132B7EC6A3908BD662928E.psm','/测试机构/测试部门1/测试岗位1/测试人员1',NULL,'D8B1FF9943C8C87CB1C8C8B9F94D0B16','测试人员3','E21FD204D22403C8F010B849D6450D6A','测试部门2','3C0D1C2F08132B7EC6A3908BD662928E','测试机构','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/E21FD204D22403C8F010B849D6450D6A.dpt/B8AE1E355B0F86B3CC80D35DC31C25C9.pos/D8B1FF9943C8C87CB1C8C8B9F94D0B16@B8AE1E355B0F86B3CC80D35DC31C25C9.psm','/测试机构/测试部门2/测试岗位2/测试人员3',NULL,'/oa/leave/mainActivity','/oa/leave/bizActivity4','C9DA1478640000012F492E0A1F201696','task',NULL,2),('35F6C6A30F8720A6081F2145754EBE1B',NULL,'请假流程','35F6C6A30F8720A6081F2145754EBE1B','/oa/leave/Process',NULL,'tesExecuting','正在处理','2022-06-13 10:12:30',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system',NULL,NULL,NULL,'1B658382A55295130ECEB76A3E87ADB1','task',NULL,0),('3EA26484F5E662037B1A193308415611',NULL,'请假流程','3EA26484F5E662037B1A193308415611','/oa/leave/Process',NULL,'tesExecuting','正在处理','2022-06-06 18:19:35',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-06-09 16:27:11','PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system',NULL,NULL,NULL,'C9DA139CAC800001EDC2AD8010301A30','task',NULL,8),('6E5B1A5B244D3FA542B24481190079F7',NULL,'请假流程','6E5B1A5B244D3FA542B24481190079F7','/oa/leave/Process',NULL,'tesExecuting','正在处理','2022-06-06 18:34:35',NULL,'7BA4523D57DB87BE42614FA76B34B122','测试人员1','CD92B921EE135105A1D4856539B2D58A','测试部门1','3C0D1C2F08132B7EC6A3908BD662928E','测试机构','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/7BA4523D57DB87BE42614FA76B34B122@3C0D1C2F08132B7EC6A3908BD662928E.psm','/测试机构/测试部门1/测试岗位1/测试人员1','2022-06-09 15:23:49','7BA4523D57DB87BE42614FA76B34B122','测试人员1','CD92B921EE135105A1D4856539B2D58A','测试部门1','3C0D1C2F08132B7EC6A3908BD662928E','测试机构','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/7BA4523D57DB87BE42614FA76B34B122@3C0D1C2F08132B7EC6A3908BD662928E.psm','/测试机构/测试部门1/测试岗位1/测试人员1',NULL,NULL,NULL,'C9DA1478640000012F492E0A1F201696','task',NULL,2),('6FD1E81D86E2DA24242F5CAFB3AD24AA','D69B14BE69AB0F60A4288A9B63C81DE1','请假申请:请假流程','D69B14BE69AB0F60A4288A9B63C81DE1','/oa/leave/Process','bizActivity2','tesPause','已暂停','2022-06-09 10:18:55',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-06-09 13:48:32','PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','PSN01','','/oa/leave/mainActivity','0F243D91B06446DF93ED0041A068A0B3','task',NULL,1),('756281414288444A2555B2DAC6D57D63','07B039490F8D6203B7D6C3D4BD6717D2','部门审批:请假流程','3EA26484F5E662037B1A193308415611','/oa/leave/Process','bizActivity4','tesFinished','已完成','2022-06-06 18:19:40',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-06-09 16:38:56','PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','PSN01','/oa/leave/mainActivity','/oa/leave/bizActivity4','C9DA139CAC800001EDC2AD8010301A30','task',NULL,11),('76D4B52BB0CA98FA1918D494ADA63F24',NULL,'请假流程','76D4B52BB0CA98FA1918D494ADA63F24','/oa/leave/Process',NULL,'tesAborted','已终止','2022-06-06 18:19:21',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-06-09 14:08:14','PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system',NULL,NULL,NULL,'C9DA139941800001D2DF1100C7D619B4','task',NULL,3),('8A13B81B2567FC2FCA689F6E71DC371D','6E5B1A5B244D3FA542B24481190079F7','请假申请:请假流程','6E5B1A5B244D3FA542B24481190079F7','/oa/leave/Process','bizActivity2','tesFinished','已完成','2022-06-06 18:34:35',NULL,'7BA4523D57DB87BE42614FA76B34B122','测试人员1','CD92B921EE135105A1D4856539B2D58A','测试部门1','3C0D1C2F08132B7EC6A3908BD662928E','测试机构','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/7BA4523D57DB87BE42614FA76B34B122@3C0D1C2F08132B7EC6A3908BD662928E.psm','/测试机构/测试部门1/测试岗位1/测试人员1','2022-06-06 18:51:41','7BA4523D57DB87BE42614FA76B34B122','测试人员1','CD92B921EE135105A1D4856539B2D58A','测试部门1','3C0D1C2F08132B7EC6A3908BD662928E','测试机构','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/7BA4523D57DB87BE42614FA76B34B122@3C0D1C2F08132B7EC6A3908BD662928E.psm','/测试机构/测试部门1/测试岗位1/测试人员1','7BA4523D57DB87BE42614FA76B34B122','','/oa/leave/mainActivity','C9DA1478640000012F492E0A1F201696','task',NULL,1),('9ACE9E05A6D3AF9C5ABC5433CB4FB51B','756281414288444A2555B2DAC6D57D63','领导审批:请假流程','3EA26484F5E662037B1A193308415611','/oa/leave/Process','bizActivity6','tesReady','尚未处理','2022-06-09 16:38:56',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system',NULL,'7BA4523D57DB87BE42614FA76B34B122','测试人员1','CD92B921EE135105A1D4856539B2D58A','测试部门1','3C0D1C2F08132B7EC6A3908BD662928E','测试机构','/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/7BA4523D57DB87BE42614FA76B34B122@3C0D1C2F08132B7EC6A3908BD662928E.psm','/测试机构/测试部门1/测试岗位1/测试人员1','PSN01','/oa/leave/bizActivity4','/oa/leave/bizActivity6',NULL,'task',NULL,0),('9E1369FAD4E9D3FA8F453D61DE49E8F9','C9B05E5EBEDE6118A48AC326B25DB9D7','部门审批:请假流程','A38E985D92586D3E9A61FA8399EDEA5C','/oa/leave/Process','bizActivity4','tesReady','尚未处理','2022-06-09 18:15:09',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','PSN01','/oa/leave/mainActivity','/oa/leave/bizActivity4','40DA9136A31EF77121AE326205FE6B00','task',NULL,0),('A38E985D92586D3E9A61FA8399EDEA5C',NULL,'请假流程','A38E985D92586D3E9A61FA8399EDEA5C','/oa/leave/Process',NULL,'tesExecuting','正在处理','2022-06-09 18:15:04',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system',NULL,NULL,NULL,'40DA9136A31EF77121AE326205FE6B00','task',NULL,0),('A7B3525540D1A84CAFAE9E267207FA26','76D4B52BB0CA98FA1918D494ADA63F24','请假申请:请假流程','76D4B52BB0CA98FA1918D494ADA63F24','/oa/leave/Process','bizActivity2','tesAborted','已终止','2022-06-06 18:19:21',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-06-09 14:08:14','PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','PSN01','','/oa/leave/mainActivity','C9DA139941800001D2DF1100C7D619B4','task',NULL,3),('BAFF4F662365352923D92811A2B41A83','35F6C6A30F8720A6081F2145754EBE1B','请假申请:请假流程','35F6C6A30F8720A6081F2145754EBE1B','/oa/leave/Process','mainActivity','tesReady','尚未处理','2022-06-13 10:12:30',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','PSN01','','/oa/leave/mainActivity','1B658382A55295130ECEB76A3E87ADB1','task',NULL,0),('C9B05E5EBEDE6118A48AC326B25DB9D7','A38E985D92586D3E9A61FA8399EDEA5C','请假申请:请假流程','A38E985D92586D3E9A61FA8399EDEA5C','/oa/leave/Process','mainActivity','tesFinished','已完成','2022-06-09 18:15:04',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-06-09 18:15:09','PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system',NULL,'','/oa/leave/mainActivity','40DA9136A31EF77121AE326205FE6B00','task',NULL,1),('D69B14BE69AB0F60A4288A9B63C81DE1',NULL,'请假流程','D69B14BE69AB0F60A4288A9B63C81DE1','/oa/leave/Process',NULL,'tesPause','已暂停','2022-06-09 10:18:55',NULL,'PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system','2022-06-09 13:48:32','PSN01','system','','','ORG01','管理员','/ORG01.ogn/PSN01@ORG01.psm','/管理员/system',NULL,NULL,NULL,'0F243D91B06446DF93ED0041A068A0B3','task',NULL,1);
/*!40000 ALTER TABLE `sa_task` ENABLE KEYS */;
UNLOCK TABLES;

-- ----------------------------
-- Table structure for oa_dayreport
-- ----------------------------
DROP TABLE IF EXISTS `oa_dayreport`;
CREATE TABLE `oa_dayreport`  (
  `fid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ftitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `fcontext` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `ffile` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatorid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatorname` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `fcreatedeptid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `fcreatedeptname` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatetime` datetime NULL DEFAULT NULL,
  `fpushdatetime` datetime NULL DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`fid`) USING BTREE,
  INDEX `ix_oa_dayreport_screatorid`(`screatorid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-15 19:16:08
