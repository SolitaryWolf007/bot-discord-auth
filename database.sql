-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.8.3-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para auth
CREATE DATABASE IF NOT EXISTS `auth` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `auth`;

-- Copiando estrutura para tabela auth.admins
CREATE TABLE IF NOT EXISTS `admins` (
  `discord_id` varchar(50) NOT NULL,
  `perm` varchar(200) NOT NULL DEFAULT 'admin',
  PRIMARY KEY (`discord_id`),
  KEY `perm` (`perm`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela auth.licenses
CREATE TABLE IF NOT EXISTS `licenses` (
  `discord_id` varchar(50) NOT NULL,
  `script` varchar(200) NOT NULL,
  `adress` varchar(15) NOT NULL,
  `login` datetime NOT NULL DEFAULT current_timestamp(),
  `payment` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`discord_id`,`script`) USING BTREE,
  KEY `licenses_name_scripts` (`script`),
  CONSTRAINT `licenses_name_scripts` FOREIGN KEY (`script`) REFERENCES `scripts` (`name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela auth.scripts
CREATE TABLE IF NOT EXISTS `scripts` (
  `name` varchar(200) NOT NULL,
  `perm` varchar(200) NOT NULL,
  PRIMARY KEY (`name`),
  KEY `perm` (`perm`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
