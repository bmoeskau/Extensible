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
  `app_id` VARCHAR(20) NOT NULL ,
  
  /**
   * These fields are optional, and included only for the examples.
   * They could be omitted or replaced with other fields as needed
   */
  `location` VARCHAR(255) NULL ,
  `notes` TEXT NULL ,
  `url` VARCHAR(255) NULL ,
  `reminder` VARCHAR(255) NULL ,
  
  /**
   * The following are used for recurrence support only. If your application
   * business logic does not support recurrence these can be omitted.
   */
  `rrule` VARCHAR(999) NULL,
  `duration` INT NULL,

  PRIMARY KEY (`id`) ,
  INDEX `calendar_id_idx` (`calendar_id` ASC) ,
  CONSTRAINT `calendar_id`
    FOREIGN KEY (`calendar_id` )
    REFERENCES `calendars` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=MyISAM AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;


/*
 * Create recurrence exceptions table, only applicable for recurrence support
 */
DROP TABLE IF EXISTS `exceptions`;
CREATE  TABLE `exceptions` (
  /**
   * The exception id, auto-generated
   */
  `id` INT NOT NULL AUTO_INCREMENT ,
  /**
   * The event id from the events table
   */
  `event_id` INT NOT NULL ,
  /**
   * The exception date
   */
  `exdate` DATETIME NOT NULL ,
  
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `event_id_idx` (`event_id` ASC) ,
  CONSTRAINT `event_id`
    FOREIGN KEY (`event_id` )
    REFERENCES `events` (`id` )
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

INSERT INTO `events` (`calendar_id`,`app_id`,`title`,`start`,`end`,
			`location`,`notes`,`url`,`all_day`,`reminder`, `rrule`, `duration`)
VALUES
  /**
   * Default, non-recurring events
   */
    (1, 'remote', 'Vacation', DATE_ADD(@dt, INTERVAL -20 DAY),
    	DATE_ADD(@dt, INTERVAL -10 DAY), '', 'Have fun', '', 0, '', null, null),
    (2, 'remote', 'Lunch with Matt', DATE_ADD(@dt, INTERVAL '11:30' HOUR_MINUTE),
    	DATE_ADD(@dt, INTERVAL 13 HOUR), 'Chuy\'s', 'Order the queso',
    	'http://chuys.com', 0, '15', null, null),
    (3, 'remote', 'Project due', DATE_ADD(@dt, INTERVAL 15 MINUTE),
    	DATE_ADD(@dt, INTERVAL 15 MINUTE), '', '', '', 0, '', null, null),
    (1, 'remote', 'Sarah\'s birthday', @dt, @dt, '', 'Need to get a gift',
    	'', 1, '', null, null),
    (2, 'remote', 'A long one...', DATE_ADD(@dt, INTERVAL -12 DAY),
    	DATE_ADD(@dt, INTERVAL 10 DAY), '', '', '', 1, '', null, null),

  /**
   * Recurring events
   */
    (1, 'recurrence', 'Daily 10 times', DATE_ADD(@dt, INTERVAL 8 HOUR),
    	DATE_ADD(@dt, INTERVAL 10 DAY), '', '', '', 0, '',
    	'FREQ=DAILY;COUNT=10', 120),
    (2, 'recurrence', 'Weekly 8 times', DATE_ADD(@dt, INTERVAL 1 HOUR),
    	DATE_ADD(@dt, INTERVAL 56 DAY), '', '', '', 1, '',
    	'FREQ=WEEKLY;COUNT=8', 0),
	(3, 'recurrence', 'Weekdays', DATE_ADD(@dt, INTERVAL -3 WEEK) + INTERVAL 13 HOUR,
    	DATE('9999-12-31 11:59:59'), '', '', '', 0, '',
    	'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', 60),
	(4, 'recurrence', 'Last Friday of month', DATE_ADD(@dt, INTERVAL -5 WEEK),
    	DATE('9999-12-31 11:59:59'), '', '', '', 1, '',
    	'FREQ=MONTHLY;BYDAY=-1FR', 0),
	(1, 'recurrence', 'Weekend days', DATE_ADD(@dt, INTERVAL -3 WEEK),
    	DATE('9999-12-31 11:59:59'), '', '', '', 1, '',
    	'FREQ=WEEKLY;BYDAY=SU,SA', 0),
	(4, 'recurrence', 'Multi-day, every Tuesday', DATE_ADD(@dt, INTERVAL -5 WEEK),
    	DATE('9999-12-31 11:59:59'), '', '', '', 1, '',
    	'FREQ=WEEKLY;BYDAY=TU', 2879),
	(2, 'recurrence', 'First day of each month', DATE_ADD(@dt, INTERVAL -5 WEEK),
    	DATE('9999-12-31 11:59:59'), '', '', '', 1, '',
    	'FREQ=MONTHLY;BYMONTHDAY=1', 60),
	(3, 'recurrence', 'Every third Wednesday', DATE_ADD(@dt, INTERVAL -5 WEEK),
    	DATE('9999-12-31 11:59:59'), '', '', '', 1, '',
    	'FREQ=MONTHLY;BYDAY=3WE', 0)
