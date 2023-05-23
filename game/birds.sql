-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Sam 01 Mars 2014 à 13:59
-- Version du serveur: 5.6.12-log
-- Version de PHP: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `birds`
--
CREATE DATABASE IF NOT EXISTS `birds` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `birds`;

-- --------------------------------------------------------

--
-- Structure de la table `highscores`
--

CREATE TABLE IF NOT EXISTS `highscores` (
  `hs_id` int(11) NOT NULL AUTO_INCREMENT,
  `hs_player` varchar(8) NOT NULL,
  `hs_score` int(11) NOT NULL,
  PRIMARY KEY (`hs_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
