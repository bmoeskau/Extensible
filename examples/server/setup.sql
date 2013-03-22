/* Developed for MySQL v.5.0.3+ */

/*
 * Create calendars table
 */
DROP TABLE IF EXISTS `calendars`;
CREATE TABLE `calendars` (
  `id` INT NOT NULL ,
  `title` VARCHAR(255) NOT NULL ,
  `color` SMALLINT NOT NULL DEFAULT 0 ,
  `hidden` TINYINT(1) NOT NULL DEFAULT 0 ,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;


/*
 * Create events table
 */
DROP TABLE IF EXISTS `events`;
CREATE  TABLE `events` (
  /**
   * These fields are always required. They could be defined differently,
   * but they are the bare minimum attributes for a functional calendar.
   */
  `id` INT NOT NULL AUTO_INCREMENT ,
  `title` VARCHAR(255) NOT NULL ,
  `start` DATETIME NOT NULL ,
  `end` DATETIME NOT NULL ,
  
  /**
   * Technically optional at the DB level, but this flag is required in the UI
   * logic and is typically stored in the DB. If it was not needed it could be
   * defaulted in the UI code and omitted here.
   */
  `all_day` TINYINT(1) NULL DEFAULT 0 ,
  
  /**
   * Calendar id is technically optional, though to support multiple
   * calendars/colors it is required and should be a FK to the calendars table.
   */
  `calendar_id` INT NULL ,
  
  /**
   * App id is only used by the examples to allow for different examples to maintain
   * different sets of DB data at once (e.g. recurring and non-recurring examples).
   */
  `app_id` INT NULL ,
  
  /**
   * These fields are optional, and included only for the examples.
   * They could be omitted or replaced with other fields as needed
   */
  `location` VARCHAR(255) NULL ,
  `notes` TEXT NULL ,
  `url` VARCHAR(255) NULL ,
  `reminder` VARCHAR(255) NULL ,
  
  /**
   * The following are for required recurrence support only. If your application
   * back end does not support recurrence these can be omitted.
   */
  `rrule` VARCHAR(999) NULL,
  `duration` INT NULL,

  PRIMARY KEY (`id`) ,
  INDEX `calendar_id_idx` (`calendar_id` ASC) ,
  CONSTRAINT `calendar_id`
    FOREIGN KEY (`calendar_id` )
    REFERENCES `extensible_demo`.`calendars` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=MyISAM AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;


/*
 * Populate calendar test data
 */
INSERT INTO `calendars` (`id`, `title`, `color`, `hidden`)
VALUES
    (1, 'Home', 2, false),
    (2, 'Work', 22, false),
    (3, 'School', 7, false),
    (4, 'Sports', 26, false);


/*
 * Populate event test data
 */
SET @dt:=CURRENT_DATE();

INSERT INTO `events` (`calendar_id`,`app_id`,`title`,`start`,`end`,`location`,`notes`,`url`,`all_day`,`reminder`)
VALUES
    (1, 1, 'Vacation', DATE_ADD(@dt, INTERVAL -20 DAY), DATE_ADD(@dt, INTERVAL -10 DAY), '', 'Have fun', '', 0, ''),
    (2, 1, 'Lunch with Matt', DATE_ADD(@dt, INTERVAL '11:30' HOUR_MINUTE), DATE_ADD(@dt, INTERVAL 13 HOUR), 'Chuy\'s', 'Order the queso', 'http://chuys.com', 0, '15'),
    (3, 1, 'Project due', DATE_ADD(@dt, INTERVAL 15 MINUTE), DATE_ADD(@dt, INTERVAL 15 MINUTE), '', '', '', 0, ''),
    (1, 1, 'Sarah\'s birthday', @dt, @dt, '', 'Need to get a gift', '', 1, ''),
    (2, 1, 'A long one...', DATE_ADD(@dt, INTERVAL -12 DAY), DATE_ADD(@dt, INTERVAL 10 DAY), '', '', '', 1, '')
    


