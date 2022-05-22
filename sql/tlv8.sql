/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50737
 Source Host           : localhost:3306
 Source Schema         : tlv8

 Target Server Type    : MySQL
 Target Server Version : 50737
 File Encoding         : 65001

 Date: 22/05/2022 20:18:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sa_log
-- ----------------------------
DROP TABLE IF EXISTS `sa_log`;
CREATE TABLE `sa_log`  (
  `sid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sdescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `sprocessname` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sactivityname` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatorpersonname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatorpersonid` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatorfid` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatorfname` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sactionname` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `stypename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sip` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatetime` datetime(0) NULL DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;


-- ----------------------------
-- Table structure for sa_onlineinfo
-- ----------------------------
DROP TABLE IF EXISTS `sa_onlineinfo`;
CREATE TABLE `sa_onlineinfo`  (
  `sid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `suserid` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `susername` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `suserfid` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `suserfname` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sloginip` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `slogindate` datetime(0) NULL DEFAULT NULL,
  `ssessionid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sserviceip` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `smachinecode` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE,
  UNIQUE INDEX `ssessionid`(`ssessionid`) USING BTREE,
  INDEX `ix_sa_onlineinfo_smachinecode`(`smachinecode`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;


-- ----------------------------
-- Table structure for sa_opauthorize
-- ----------------------------
DROP TABLE IF EXISTS `sa_opauthorize`;
CREATE TABLE `sa_opauthorize`  (
  `sid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sorgid` varchar(65) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sorgname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sorgfid` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sorgfname` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sauthorizeroleid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sauthorizerolecode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sdescription` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatorfid` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatorfname` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `screatetime` datetime(0) NULL DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE,
  INDEX `ix_sa_opauthorize_sauthorizerolecode`(`sauthorizerolecode`) USING BTREE,
  INDEX `ix_sa_opauthorize_sauthorizeroleid`(`sauthorizeroleid`) USING BTREE,
  INDEX `ix_sa_opauthorize_sorgid`(`sorgid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sa_opauthorize
-- ----------------------------
INSERT INTO `sa_opauthorize` VALUES ('2551C11B97DB48210F2BD71401B039CE', 'PSN01@ORG01', 'system', '/ORG01.ogn/PSN01@ORG01.psm', '/管理员/system', 'RL01', 'opm', '超级管理员', '/ORG01.ogn/PSN01@ORG01.psm', '/管理员/system', '2022-05-22 16:40:52', 0);

-- ----------------------------
-- Table structure for sa_oporg
-- ----------------------------
DROP TABLE IF EXISTS `sa_oporg`;
CREATE TABLE `sa_oporg`  (
  `sid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sname` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `scode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `slongname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sfname` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sfcode` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sfid` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sorgkindid` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `svalidstate` int(11) NULL DEFAULT NULL,
  `sparent` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `slevel` int(11) NULL DEFAULT NULL,
  `sphone` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sfax` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `saddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `szip` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sdescription` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `spersonid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `snodekind` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sshowname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ssequence` int(11) NULL DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE,
  INDEX `ix_sa_oporg_sorgkindid`(`sorgkindid`) USING BTREE,
  INDEX `ix_sa_oporg_sparent`(`sparent`) USING BTREE,
  INDEX `ix_sa_oporg_spersonid`(`spersonid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sa_oporg
-- ----------------------------
INSERT INTO `sa_oporg` VALUES ('3C0D1C2F08132B7EC6A3908BD662928E', '测试机构', 'testogn', NULL, '/测试机构', '/testogn', '/3C0D1C2F08132B7EC6A3908BD662928E.ogn', 'ogn', 1, NULL, 0, '', '', '', NULL, '', NULL, NULL, NULL, 1, 0);
INSERT INTO `sa_oporg` VALUES ('7BA4523D57DB87BE42614FA76B34B122@97DA9DF40D94E4EDD350A1A0DC4C0917', '测试人员1', 'test1', NULL, '/测试机构/测试部门1/测试岗位1/测试人员1', '/testogn/testdpt/testpos/test1', '/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/7BA4523D57DB87BE42614FA76B34B122@3C0D1C2F08132B7EC6A3908BD662928E.psm', 'psm', 1, '97DA9DF40D94E4EDD350A1A0DC4C0917', 3, NULL, NULL, NULL, NULL, NULL, '7BA4523D57DB87BE42614FA76B34B122', NULL, NULL, 1, 0);
INSERT INTO `sa_oporg` VALUES ('97DA9DF40D94E4EDD350A1A0DC4C0917', '测试岗位1', 'testpos', NULL, '/测试机构/测试部门1/测试岗位1', '/testogn/testdpt/testpos', '/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos', 'pos', 1, 'CD92B921EE135105A1D4856539B2D58A', 2, '', '', '', NULL, '', NULL, NULL, NULL, 1, 0);
INSERT INTO `sa_oporg` VALUES ('B8AE1E355B0F86B3CC80D35DC31C25C9', '测试岗位2', 'testpos2', NULL, '/测试机构/测试部门2/测试岗位2', '/testogn/testdpt2/testpos2', '/3C0D1C2F08132B7EC6A3908BD662928E.ogn/E21FD204D22403C8F010B849D6450D6A.dpt/B8AE1E355B0F86B3CC80D35DC31C25C9.pos', 'pos', 1, 'E21FD204D22403C8F010B849D6450D6A', 2, '', '', '', NULL, '', NULL, NULL, NULL, 1, 0);
INSERT INTO `sa_oporg` VALUES ('BB75847554AB9BEE10BE6770D8C24DE8@97DA9DF40D94E4EDD350A1A0DC4C0917', '测试人员2', 'test2', NULL, '/测试机构/测试部门1/测试岗位1/测试人员2', '/testogn/testdpt/testpos/test2', '/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt/97DA9DF40D94E4EDD350A1A0DC4C0917.pos/BB75847554AB9BEE10BE6770D8C24DE8@97DA9DF40D94E4EDD350A1A0DC4C0917.psm', 'psm', 1, '97DA9DF40D94E4EDD350A1A0DC4C0917', 0, NULL, NULL, NULL, NULL, NULL, 'BB75847554AB9BEE10BE6770D8C24DE8', NULL, NULL, 1, 0);
INSERT INTO `sa_oporg` VALUES ('CD92B921EE135105A1D4856539B2D58A', '测试部门1', 'testdpt', NULL, '/测试机构/测试部门1', '/testogn/testdpt', '/3C0D1C2F08132B7EC6A3908BD662928E.ogn/CD92B921EE135105A1D4856539B2D58A.dpt', 'dpt', 1, '3C0D1C2F08132B7EC6A3908BD662928E', 1, '', '', '', NULL, '', NULL, NULL, NULL, 1, 0);
INSERT INTO `sa_oporg` VALUES ('D8B1FF9943C8C87CB1C8C8B9F94D0B16@B8AE1E355B0F86B3CC80D35DC31C25C9', '测试人员3', 'test3', NULL, '/测试机构/测试部门2/测试岗位2/测试人员3', '/testogn/testdpt2/testpos2/test3', '/3C0D1C2F08132B7EC6A3908BD662928E.ogn/E21FD204D22403C8F010B849D6450D6A.dpt/B8AE1E355B0F86B3CC80D35DC31C25C9.pos/D8B1FF9943C8C87CB1C8C8B9F94D0B16@B8AE1E355B0F86B3CC80D35DC31C25C9.psm', 'psm', 1, 'B8AE1E355B0F86B3CC80D35DC31C25C9', 0, NULL, NULL, NULL, NULL, NULL, 'D8B1FF9943C8C87CB1C8C8B9F94D0B16', NULL, NULL, 1, 0);
INSERT INTO `sa_oporg` VALUES ('E21FD204D22403C8F010B849D6450D6A', '测试部门2', 'testdpt2', NULL, '/测试机构/测试部门2', '/testogn/testdpt2', '/3C0D1C2F08132B7EC6A3908BD662928E.ogn/E21FD204D22403C8F010B849D6450D6A.dpt', 'dpt', 1, '3C0D1C2F08132B7EC6A3908BD662928E', 1, '', '', '', NULL, '', NULL, NULL, NULL, 1, 0);
INSERT INTO `sa_oporg` VALUES ('ORG01', '管理员', 'TULIN', NULL, '/管理员', '/TULIN', '/ORG01', 'ogn', 1, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0);
INSERT INTO `sa_oporg` VALUES ('PSN01@ORG01', 'system', 'SYSTEM', NULL, '/管理员/system', '/TULIN/SYSTEM', '/ORG01.ogn/PSN01@ORG01.psm', 'psm', 1, 'ORG01', 1, NULL, NULL, NULL, NULL, NULL, 'PSN01', NULL, NULL, 0, 0);

-- ----------------------------
-- Table structure for sa_oppermission
-- ----------------------------
DROP TABLE IF EXISTS `sa_oppermission`;
CREATE TABLE `sa_oppermission`  (
  `sid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `spermissionroleid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sprocess` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sactivityfname` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sactivity` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sactionsnames` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `sactions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `spermissionkind` int(11) NOT NULL,
  `sdescription` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ssequence` int(11) NULL DEFAULT NULL,
  `svalidstate` int(11) NULL DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE,
  INDEX `ix_sa_oppermission_spermissionroleid`(`spermissionroleid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sa_oppermission
-- ----------------------------
INSERT INTO `sa_oppermission` VALUES ('0CF6C83DE6FD16BEBF75D2A8FD056881', 'RL01', '/SA/log/logProcess', '/系统管理/系统工具/操作日志', 'mainActivity', NULL, NULL, 0, '/system/logs', 9, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('1CE9B0FF633B989E55BC6E793A851E32', 'RL02-doc', '/SA/doc/docCenter/docCenterProcess', '/系统管理/文档管理/文档中心', 'docCenter', NULL, NULL, 0, '/system/doc/docCenter', 1, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('1DC3831C34AC8ED61524C41E177B67C4', 'RL01', '/SA/OPM/authorization/authorizationProcess', '/系统管理/组织机构/授权管理', 'mainActivity', NULL, NULL, 0, '/system/OPM/authorization', 3, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('325BFA75C55FD1DB49075F44C4B72628', 'RL01', '/SA/task/taskCenter/process', '/系统管理/流程管理/流程监控', 'monitorActivity', NULL, NULL, 0, '/system/flow/monitor', 5, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('57EF14E4A669882A9843271C4EBA7E58', 'RL01', '/SA/doc/docCenter/docCenterProcess', '/系统管理/文档管理/文档中心', 'docCenter', NULL, NULL, 0, '/system/doc/docCenter', 7, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('5C5DA17E97DFF3148C2CAAD054684473', 'RL01', '/flw/dwr/process', '/系统管理/流程管理/流程设计', 'vml-dwr-editor', NULL, NULL, 0, '/system/flow/flow_design', 6, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('630E9DFA815B532F5C2D50253EB19DF2', 'RL02', '/flw/dwr/process', '/系统管理/流程管理/流程设计', 'vml-dwr-editor', NULL, NULL, 0, '/system/flow/flow_design', 2, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('7A62182221B15DCE20F289F315680340', 'RL01', '/SA/OPM/role/roleProcess', '/系统管理/组织机构/角色管理', 'mainActivity', NULL, NULL, 0, '/system/OPM/role', 2, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('8037E66DAD0A90DC4256EC9848E536AF', 'RL01', '/SA/online/onlineProcess', '/系统管理/系统工具/在线用户', 'mainActivity', NULL, NULL, 0, '/system/online', 10, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('8091869B1201127C4B54F200AC7E878F', 'RL01', '/SA/doc/docSearch/docSearchProcess', '/系统管理/文档管理/文档检索', 'mainActivity', NULL, NULL, 0, '/system/doc/docSearch', 8, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('A7FA204F027AF509F2762F4990F6F1CC', 'RL02-doc', '/SA/doc/docSearch/docSearchProcess', '/系统管理/文档管理/文档检索', 'mainActivity', NULL, NULL, 0, '/system/doc/docSearch', 2, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('B1E719EBCCF8CEF030C083CFA7DF0966', 'RL01', '/SA/OPM/organization/organizationProcess', '/系统管理/组织机构/机构管理', 'mainActivity', NULL, NULL, 0, '/system/OPM/organization', 1, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('E572B9CCC095B962A41AE8D8B7878D54', 'RL02', '/SA/task/taskCenter/process', '/系统管理/流程管理/流程监控', 'monitorActivity', NULL, NULL, 0, '/system/flow/monitor', 1, 1, 0);
INSERT INTO `sa_oppermission` VALUES ('F669B3828A5E307943559F69E938DD51', 'RL01', '/SA/OPM/recycled/recycledProcess', '/系统管理/组织机构/回收站', 'mainActivity', NULL, NULL, 0, '/system/OPM/recycled', 4, 1, 0);

-- ----------------------------
-- Table structure for sa_opperson
-- ----------------------------
DROP TABLE IF EXISTS `sa_opperson`;
CREATE TABLE `sa_opperson`  (
  `sid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `scode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sloginname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `spassword` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ssequence` int(11) NULL DEFAULT NULL,
  `svalidstate` int(11) NULL DEFAULT NULL,
  `smainorgid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sdescription` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ssex` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sbirthday` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `smobilephone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `smail` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `scasn` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ssignm` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE,
  UNIQUE INDEX `scode`(`scode`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sa_opperson
-- ----------------------------
INSERT INTO `sa_opperson` VALUES ('7BA4523D57DB87BE42614FA76B34B122', '测试人员1', 'test1', '', 'E10ADC3949BA59ABBE56E057F20F883E', NULL, 1, '97DA9DF40D94E4EDD350A1A0DC4C0917', '', '', '', '', NULL, '', '', 0);
INSERT INTO `sa_opperson` VALUES ('BB75847554AB9BEE10BE6770D8C24DE8', '测试人员2', 'test2', '', 'E10ADC3949BA59ABBE56E057F20F883E', NULL, 1, '97DA9DF40D94E4EDD350A1A0DC4C0917', '', '', '', '', NULL, '', '', 0);
INSERT INTO `sa_opperson` VALUES ('D8B1FF9943C8C87CB1C8C8B9F94D0B16', '测试人员3', 'test3', '', 'E10ADC3949BA59ABBE56E057F20F883E', NULL, 1, 'B8AE1E355B0F86B3CC80D35DC31C25C9', '', '', '', '', NULL, '', '', 0);
INSERT INTO `sa_opperson` VALUES ('PSN01', 'system', 'SYSTEM', NULL, 'C4CA4238A0B923820DCC509A6F75849B', 0, 1, 'ORG01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);

-- ----------------------------
-- Table structure for sa_oprole
-- ----------------------------
DROP TABLE IF EXISTS `sa_oprole`;
CREATE TABLE `sa_oprole`  (
  `sid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sname` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `scode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `srolekind` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sdescription` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ssequence` int(11) NULL DEFAULT NULL,
  `svalidstate` int(11) NULL DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sa_oprole
-- ----------------------------
INSERT INTO `sa_oprole` VALUES ('RL01', '超级管理员', 'opm', '业务功能', '请勿删除', 9999, 1, 0);
INSERT INTO `sa_oprole` VALUES ('RL02', '任务', 'task', '系统管理', NULL, 9997, 1, 0);
INSERT INTO `sa_oprole` VALUES ('RL02-doc', '文档', 'doc', '系统管理', NULL, 9996, 1, 0);

SET FOREIGN_KEY_CHECKS = 1;
