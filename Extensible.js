/**
 * @class Ext.ensible
 * Extensible core utilities and functions.
 * @singleton
 */
(function(){
    
    Ext.ns('Ext.ensible.ux', 'Ext.ensible.sample', 'Ext.ensible.plugins', 'Ext.ensible.cal');
    
    Ext.onReady(function() {
        if (Ext.getScrollBarWidth() < 3) {
            // OSX Lion introduced dynamic scrollbars that do not take up space in the
            // body. Since certain aspects of the layout are calculated and rely on
            // scrollbar width, we add this class if needed so that we can apply
            // static style rules rather than recalculate sizes on each resize.
            Ext.getBody().addClass('x-no-scrollbar');
        }
        if (Ext.isWindows) {
            Ext.getBody().addClass('x-win');
        }
    });
    
    Ext.apply(Ext.ensible, {
        /**
         * The version of the framework
         * @type String
         */
        version : '1.0.2',
        /**
         * The version of the framework, broken out into its numeric parts. This returns an
         * object that contains the following integer properties: major, minor and patch.
         * @type Object
         */
        versionDetails : {
            major: 1,
            minor: 0,
            patch: 2
        },
        /**
         * The minimum version of Ext required to work with this version of Extensible, currently
         * 3.2.0. Note that this version of Extensible will not work under Ext 4.x (Extensible 1.5+
         * is required for Ext 4.x compatibility).
         * @type String
         */
        extVersion : '3.2.0',
        
        hasBorderRadius : !(Ext.isIE || Ext.isOpera),
        
        log : function(s){
            //console.log(s);
        },
    
       /**
        * @class Ext.ensible.cal.Date
        * @extends Object
        * <p>Contains utility date functions used by the calendar components.</p>
        * @singleton
        */
	    Date : {
            /**
             * Determines whether times used throughout all Extensible components should be displayed as
             * 12 hour times with am/pm (default) or 24 hour / military format. Note that some locale files
             * may override this value by default.
             * @type Boolean
             * @property use24HourTime
             */
            use24HourTime : false,
            
            /**
             * Returns the time duration between two dates in the specified units. For finding the number
             * of calendar days (ignoring time) between two dates use {@link Ext.ensible.Date.diffDays diffDays} instead.
             * @param {Date} start The start date
             * @param {Date} end The end date
             * @param {String} unit (optional) The time unit to return. Valid values are 'ms' (milliseconds, the default), 's' (seconds),
             * 'm' (minutes) or 'h' (hours).
             * @return {Number} The time difference between the dates in the units specified by the unit param
             */
            diff : function(start, end, unit){
                var denom = 1,
                    diff = end.getTime() - start.getTime();
                
                if(unit == 's'){ 
                    denom = 1000;
                }
                else if(unit == 'm'){
                    denom = 1000*60;
                }
                else if(unit == 'h'){
                    denom = 1000*60*60;
                }
                return Math.round(diff/denom);
            },
            
            /**
             * Calculates the number of calendar days between two dates, ignoring time values. 
             * A time span that starts at 11pm (23:00) on Monday and ends at 1am (01:00) on Wednesday is 
             * only 26 total hours, but it spans 3 calendar days, so this function would return 3. For the
             * exact time difference, use {@link Ext.ensible.Date.diff diff} instead.
             * @param {Date} start The start date
             * @param {Date} end The end date
             * @return {Number} The number of calendar days difference between the dates
             */
            diffDays : function(start, end){
                var day = 1000*60*60*24,
                    diff = end.clearTime(true).getTime() - start.clearTime(true).getTime();
                
                return Math.ceil(diff/day);
            },
            
            /**
             * Copies the time value from one date object into another without altering the target's 
             * date value. This function returns a new Date instance without modifying either original value.
             * @param {Date} fromDt The original date from which to copy the time
             * @param {Date} toDt The target date to copy the time to
             * @return {Date} The new date/time value
             */
            copyTime : function(fromDt, toDt){
                var dt = toDt.clone();
                dt.setHours(
                    fromDt.getHours(),
                    fromDt.getMinutes(),
                    fromDt.getSeconds(),
                    fromDt.getMilliseconds());
                
                return dt;
            },
            
            /**
             * Compares two dates and returns a value indicating how they relate to each other.
             * @param {Date} dt1 The first date
             * @param {Date} dt2 The second date
             * @param {Boolean} precise (optional) If true, the milliseconds component is included in the comparison,
             * else it is ignored (the default).
             * @return {Number} The number of milliseconds difference between the two dates. If the dates are equal
             * this will be 0.  If the first date is earlier the return value will be positive, and if the second date
             * is earlier the value will be negative.
             */
            compare : function(dt1, dt2, precise){
                var d1 = dt1, d2 = dt2;
                if(precise !== true){
                    d1 = dt1.clone();
                    d1.setMilliseconds(0);
                    d2 = dt2.clone();
                    d2.setMilliseconds(0);
                }
                return d2.getTime() - d1.getTime();
            },

	        // private helper fn
	        maxOrMin : function(max){
	            var dt = (max ? 0 : Number.MAX_VALUE), i = 0, args = arguments[1], ln = args.length;
	            for(; i < ln; i++){
	                dt = Math[max ? 'max' : 'min'](dt, args[i].getTime());
	            }
	            return new Date(dt);
	        },
	        
            /**
             * Returns the maximum date value passed into the function. Any number of date 
             * objects can be passed as separate params.
             * @param {Date} dt1 The first date
             * @param {Date} dt2 The second date
             * @param {Date} dtN (optional) The Nth date, etc.
             * @return {Date} A new date instance with the latest date value that was passed to the function
             */
			max : function(){
	            return this.maxOrMin.apply(this, [true, arguments]);
	        },
	        
            /**
             * Returns the minimum date value passed into the function. Any number of date 
             * objects can be passed as separate params.
             * @param {Date} dt1 The first date
             * @param {Date} dt2 The second date
             * @param {Date} dtN (optional) The Nth date, etc.
             * @return {Date} A new date instance with the earliest date value that was passed to the function
             */
			min : function(){
	            return this.maxOrMin.apply(this, [false, arguments]);
	        },
            
            isInRange : function(dt, rangeStart, rangeEnd) {
                return  (dt >= rangeStart && dt <= rangeEnd);
            },
            
            /**
             * Returns true if two date ranges overlap (either one starts or ends within the other, or one completely
             * overlaps the start and end of the other), else false if they do not.
             * @param {Date} start1 The start date of range 1
             * @param {Date} end1   The end date of range 1
             * @param {Date} start2 The start date of range 2
             * @param {Date} end2   The end date of range 2
             * @return {Booelan} True if the ranges overlap, else false
             */
            rangesOverlap : function(start1, end1, start2, end2){
                var startsInRange = (start1 >= start2 && start1 <= end2),
                    endsInRange = (end1 >= start2 && end1 <= end2),
                    spansRange = (start1 <= start2 && end1 >= end2);
                
                return (startsInRange || endsInRange || spansRange);
            },
            
            /**
             * Returns true if the specified date is a Saturday or Sunday, else false.
             * @param {Date} dt The date to test
             * @return {Boolean} True if the date is a weekend day, else false 
             */
            isWeekend : function(dt){
                return dt.getDay() % 6 === 0;
            },
            
            /**
             * Returns true if the specified date falls on a Monday through Fridey, else false.
             * @param {Date} dt The date to test
             * @return {Boolean} True if the date is a week day, else false 
             */
            isWeekday : function(dt){
                return dt.getDay() % 6 !== 0;
            }
	    }
    });
})();
