/**
 * @class Extensible.form.recurrence.Rule
 * 
 * <p>Class Rule represents a iCalendar recurrence rule and offers functionality to parse a recurrence rule string,
 * to generate a recurrence rule string and to compile a textual description of a recurrence rule for display in the
 * user interface.</p>
 *
 * <p>Note that currently only a subset of the iCalendar recurrence rule attributes are supported. They are FREQ,
 * INTERVAL, BYDAY, BYMONTHDAY, BYMONTH, COUNT and UNTIL.</p>
 *
 * <p>The implementation was inspired by the recurrence rule parser of Vincent Romagnoli at
 * https://github.com/skyporter/rrule_parser</p>
 *
 * <p>Reference documentation is at http://www.ietf.org/rfc/rfc2445.txt</p>
 *
 * @author Gabriel Sidler, http://teamup.com
 */
Ext.define('Extensible.form.recurrence.Rule', {
    extend: 'Ext.Base',
    
    config: {
        /**
         * @cfg {String} dateValueFormat
         * The date string format to return in the RRULE. This is the standard ISO-style iCalendar
         * date format, e.g. January 31, 2012, 14:00 would be formatted as: "20120131T140000Z".
         */
        dateValueFormat: 'Ymd\\THis\\Z',
        /**
         * @cfg {String} rule
         * A recurrence rule string conforming to the standard iCalendar RRULE/EXRULE format, e.g.
         * "FREQ=WEEKLY;INTERVAL=2;COUNT=10;"
         */
        rule: null,
        /**
         * @cfg {Date/String} startDate
         * Optional start date for the recurrence rule. Not required just to parse the RRULE values, but it
         * is required in conjunction with the RRULE to calculate specific recurrence dates from the RRULE,
         * or to provide accurate textual descriptions for certain rules when calling {@link #getDescription}.
         * May be provided as a Date object, or as a string that can be parsed as a valid date.
         */
        startDate: null,
        /**
         * @cfg {Number} frequency
         * The value of the FREQ attribute of the recurrence rule, or null if no recurrence rule has been set.
         * Supported string values are "DAILY", "WEEKLY", "MONTHLY" and "YEARLY".
         */
        frequency: null,
        /**
         * @cfg {Number} 
         * The value of the COUNT attribute of the recurrence rule, or null if the recurrence rule has no COUNT
         * attribute or if no recurrence rule has been set. Supported values are any integer >= 1.
         */
        count: null,
        /**
         * @cfg {Date} 
         * The value of the UNTIL attribute of the recurrence rule as a Date object, or null if the recurrence
         * rule has no UNTIL attribute or if no recurrence rule has been set.
         */
        until: null,
        /**
         * @cfg {Number} 
         * The value of the INTERVAL attribute of the recurrence rule, defaults to 1. Supported values are
         * any integer >= 1.
         */
        interval: 1,
        /**
         * @cfg {String} 
         * <p>The value of the BYDAY attribute of the recurrence rule, or null if the recurrence rule has no
         * BYDAY attribute or if no recurrence rule has been set.</p>
         * <p>The BYDAY attribute can contain 3 different types of values:
         * - A comma-delimited string of 2-character weekday abbreviations, e.g. 'MO,TU,FR,SU'
         * - A numbered weekday abbreviation that can be positive or negative, e.g. '4TH' or '-1FR'
         * - An integer day offset from the start or end of the period, e.g. 3, 20 or -10.
         * See also functions {@link #getByDayWeekdays} and {@link #getByDayNumberedWeekday} for more
         * specific information about how these values are used.</p>
         */
        byDay: null,
        /*
         * @cfg {String} 
         * 
         */
        byDayWeekdays: null,
        /*
         * @cfg {String} 
         * 
         */
        byDayNthWeekday: null,
        /*
         * @cfg {String} 
         * 
         */
        byMonthDay: null,
        /*
         * @cfg {String} 
         * 
         */
        byMonth: null,
        
        // Map day names to day numbers and vice versa
        dayFromDayNo: [ "SU", "MO", "TU", "WE", "TH", "FR", "SA" ],
        dayNoFromDay: { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 },
        
        // Strings used to generate textual descriptions of the recurrence pattern. Need to be translated.
        strings: {
            dayNamesShort: {
                SU: 'Sun',
                MO: 'Mon',
                TU: 'Tue',
                WE: 'Wed',
                TH: 'Thu',
                FR: 'Fri',
                SA: 'Sat'
            },
            
            dayNamesLong: {
                SU: 'Sunday',
                MO: 'Monday',
                TU: 'Tuesday',
                WE: 'Wednesday',
                TH: 'Thursday',
                FR: 'Friday',
                SA: 'Saturday'
            },
            
            ordinals: ['', 'first', 'second', 'third', 'fourth', 'fifth'],
            
            frequency: {
                none: 'Does not repeat',
                daily: 'Daily',
                weekly: 'Weekly',
                weekdays: 'Every weekday (Mon-Fri)',
                monthly: 'Monthly',
                yearly: 'Yearly'
            },
            
            every: 'Every',       // e.g. Every 2 days
            days: 'days',
            weeks: 'weeks',
            weekdays: 'weekdays',
            months: 'months',
            years: 'years',
            times: 'times',      // e.g. Daily, 5 times
            until: 'until',      // e.g. Daily, until Dec, 31 2012
            untilFormat: 'M j, Y', // e.g. Dec 10, 2012
            and: 'and',          // e.g. Weekly on Tuesday and Friday
            on: 'on',            // e.g. Weekly on Thursday
            onDay: 'on day',     // e.g. Monthly on day 23
            onDayPostfix: '',    // In some languages a postfix is need for the onDay term,
                                 // for example in German: 'Monatlich am 23.'
                                 // Here the postfix would be '.'
            onThe: 'on the',     // e.g. Monthly on the first Thursday
            onTheLast: 'on the last', // e.g. Monthly on the last Friday
            onTheLastDay: 'on the last day', // e.g. Monthly on the last day
            of: 'of',            // e.g. Annually on the last day of November
            monthFormat: 'F',    // e.g. November
            monthDayFormat: 'F j', // e.g. November 10
        }
    },

    constructor: function(config) {
        // Have to do this manually since we are not extending Ext.Component, otherwise
        // the configs will never get initialized:
        return this.initConfig(config);
    },

    /**
     * Initializes recurrence rule and attributes
     */
    init: function()  {
        var me = this;

        me.startDate = null;
        me.frequency = null;
        me.count = null;
        me.until = null;
        me.interval = 1;
        me.byDay = null;
        me.byDayWeekdays = null;
        me.byDayNthWeekday = null;
        me.byMonthDay = null;
        me.byMonth = null;
    },

    /**
     * @private
     */
    applyStartDate: function(dt) {
        this.startDate = new Date(dt);
    },
    
    /**
     * @private
     */
    applyFrequency: function(freq) {
        this.init();
        this.frequency = freq;
    },

    /**
     * @private
     */
    applyCount: function(count) {
        // Only one of UNTIL and COUNT are allowed. Therefore need to clear UNTIL attribute.
        this.until = null;
        this.count = count;
    },
    
    /**
     * @private
     * Transforms the string value of the UNTIL attribute to a Date object if needed.
     * @param {Date/String} until A Date object or a string in the standard ISO-style iCalendar
     * date format, e.g. January 31, 2012, 14:00 would be formatted as: "20120131T140000Z". See section 4.3.5 in
     * the iCalendar specification at http://www.ietf.org/rfc/rfc2445.txt.
     */
    applyUntil: function(until) {
        // Only one of UNTIL and COUNT are allowed. Therefore, clear COUNT attribute.
        this.count = null;

        if (Ext.isDate(until)) {
            this.until = until;
        }
        else if (typeof until === 'string') {
            // Value is a date in format YYYYMMDDTHHMMSSZ
            var y = until.substr(0, 4);
            var m = until.substr(4, 2) - 1; // js Date month -> 0 to 11
            var d = until.substr(6, 2);
            var h = until.substr(9, 2);
            var min = until.substr(11, 2);
            var s = until.substr(13, 2);
            this.until = new Date(y, m, d, h, min, s);
        }
    },

    /**
     * @private
     * Applies the value of the BYDAY attribute to the underlying RRULE.
     * @param {String/Array/Object} byDay The new value of the BYDAY attribute. There are three ways to pass a
     * parameter value: 1) As a string, e.g. 'MO,TU,WE' or '3TH' or '-1FR'. 2) As an array of weekday identifiers, e.g.
     * ['MO', 'TU', 'WE']. 3) As an object with two attributes <i>number</i> and <i>weekday</i>, e.g. {number:
     * 4, weekday:'TH'} or {number: -1, weekday:'WE'}.
     */
    applyByDay: function(byDay) {
        var me = this;
        // Only one of BYDAY and BYMONTHDAY are allowed. Clear BYMONTHDAY.
        me.byMonthDay = null;

        // Reset derived attributes
        me.byDayWeekdays = null;
        me.byDayNthWeekday = null;

        if (typeof byDay === 'string') {
            me.byDay = byDay;

            // There are three cases to consider.
            var n = parseInt(byDay);
            
            if (Ext.isNumber(n)) {
                if (n == -1 ) {
                    // The last weekday of period was specified, e.g. -1SU, -1MO, ... -1SA.
                    me.byDayNthWeekday = {number: n, weekday: byDay.substr(2, 2)}
                }
                else {
                    // A numbered weekday was specified, e.g. 1SU, 2SU, ... 5SA
                    me.byDayNthWeekday = {number: n, weekday: byDay.substr(1, 2)}
                }
            }
            else {
                // A comma separated list of weekdays was specified, e.g. MO,TU,FR
                me.byDayWeekdays = byDay.split(",");
            }
        }
        else if (Array.isArray(byDay)) {
            // byDay is an array with a list of weekdays, e.g. ['MO', 'TU', 'FR']
            me.byDay = byDay.join(',');
            me.byDayWeekdays = byDay;
        }
        else if (typeof byDay === 'object') {
            // byDay is an object with two properties number and weekday, e.g. {number: 4, weekday: 'TH'}
            me.byDay = byDay.number + byDay.weekday;
            me.byDayNthWeekday = byDay;
        }
    },

    /*
     * If attribute BYDAY of the recurrence rule holds a comma separated list of weekdays, then this function
     * returns an Array of strings where each array element holds a weekday identifier, e.g. ['TU', 'TH', 'FR'].
     * Otherwise it returns false. Use function {@link #setByDay setBy Day}
     * to set BYDAY attributes.
     */
    // getByDayWeekdays: function() {
        // return this.byDayWeekdays;
    // },

    /*
     * If attribute BYDAY of the recurrence rule holds a numbered weekday, e.g. '4TH', then this function returns
     * an Object with two attributes <i>number</i> and <i>weekday</i>, e.g. {number: 4, weekday: 'TH'}. Otherwise
     * this property is false. Use function {@link #setByDay setBy Day}
     * to set BYDAY attributes.
     */
    // getByDayNthWeekday: function() {
        // return this.byDayNthWeekday;
    // },

    /*
     * Returns the value of the BYMONTHDAY attribute of the recurrence rule or false if the recurrence rule has no
     * BYMONTHDAY attribute or if no recurrence rule has been set. Supported integer values are -1 and 1 to 31.
     * @returns {int}
     */
    // getByMonthDay: function() {
        // return this.byMonthDay;
    // },

    /**
     * @private
     * Sets the value of the BYMONTHDAY attribute of the RRULE.
     * @param {int} day Supported values are -1 and 1 to 31.
     */
    applyByMonthDay: function(day) {
        // Only one of BYDAY and BYMONTHDAY are allowed. Clear BYDAY and derived attributes.
        this.byDay = null;
        this.byDayWeekdays = null;
        this.byDayNthWeekday = null;
        this.byMonthDay = day;
    },
    
    /**
     * Returns a text representation of the underlying iCalendar rule, e.g. "FREQ=WEEKLY;INTERVAL=2;".
     * @returns {string}
     */
    getRule: function() {
        var rule = [],
            me = this;

        rule.push('FREQ=' + me.frequency);
        
        if (me.interval != 1) {
            rule.push('INTERVAL=' + me.interval);
        }
        if (me.byDay) {
            rule.push('BYDAY=' + me.byDay);
        }
        if (me.byMonthDay) {
            rule.push('BYMONTHDAY=' + me.byMonthDay);
        }
        if (me.byMonth) {
            rule.push('BYMONTH=' + me.byMonth);
        }
        if (me.count) {
            rule.push('COUNT=' + me.count);
        }
        if (me.until) {
            rule.push('UNTIL=' + Ext.Date.format(me.until, me.dateValueFormat));
        }
        return rule.join(';') + ';';
    },

    /**
     * @private
     * <p>Parses a recurrence rule string conforming to the iCalendar standard. Note that currently only the following
     * recurrence rule attributes are supported: FREQ, INTERVAL, BYDAY, BYMONTHDAY, BYMONTH, COUNT and UNTIL.</p>
     *
     * <p>This function can be used to set a new rule or update an existing rule. If rule attribute FREQ is present
     * in the passed recurrence rule string, then the rule is initialized first before rule properties are set. If
     * rule attribute FREQ is not present, then the rule properties are updated without first initializing the rule.
     * </p>
     *
     * @param {String} rRule iCalendar recurrence rule as a text string. E.g. "FREQ=WEEKLY;INTERVAL=2;"
     */
    applyRule: function(rRule) {
        var rrParams, nbParams, p, v,
            me = this;

        rrParams = rRule.split(";");
        nbParams = rrParams.length;

        // Process the FREQ attribute first because this initializes the rule.
        for (var i = 0; i < nbParams; i++) {
            p = rrParams[i].split("=");
            if (p[0] == "FREQ") {
                me.setFrequency(p[1]); // This will initialize the rule.
                break;
            }
        }

        // Now process all attributes except the FREQ attribute.
        for (var i = 0; i < nbParams; i++) {
            p = rrParams[i].split("=");
            v = p[1];
            
            switch (p[0]) {
                case 'INTERVAL':
                    me.setInterval(parseInt(v));
                    break;
                case 'COUNT':
                    me.setCount(parseInt(v));
                    break;
                case 'UNTIL':
                    me.setUntil(v);
                    break;
                case 'BYDAY':
                    me.setByDay(v);
                    break;
                case 'BYMONTHDAY':
                    me.setByMonthDay(parseInt(v));
                    break;
                case 'BYMONTH':
                    me.setByMonth(parseInt(v));
                    break;
            }
        }
    },

    /**
     * Return a textual description of the iCalendar recurrence rule. E.g. the rule "FREQ=DAILY;INTERVAL=2;COUNT=5"
     * is returned as the text "Every 2 days, 5 times".
     * @param {Date} [startDate] Optional start date of the event series, only required for certain rule types
     * (e.g., any rule that is specified as date-relative like "BYDAY=-1FR" can only be represented relative
     * to a specific start date).
     * @return String
     */
    getDescription: function(startDate) {
        var me = this,
            desc = [],
            freq = me.frequency ? Ext.String.capitalize(me.frequency.toLowerCase()) : '';

        startDate = startDate || this.startDate;
        
        if (freq && me['getDescription' + freq]) {
            me['getDescription' + freq](desc, startDate);
        }
        me.getDescriptionCount(desc, startDate);
        me.getDescriptionUntil(desc, startDate);

        return desc.join('');
    },
    
    /**
     * @protected
     * Returns the description if the rule is of type "FREQ=DAILY".
     * May be overridden to customize the output strings, especially for localization.
     * @param {Array[String]} desc An array of strings representing the rule description parts collected
     * so far. This array is passed around, and each method should typically append any needed strings to
     * it. After all logic is complete, the array will be joined and the final description returned.
     * @param {Date} [startDate] The start date of the recurring series (optional).
     */
    getDescriptionDaily: function(desc, startDate) {
        var me = this,
            strings = me.strings;
        
        if (me.interval == 1) {
            // E.g. Daily
            desc.push(strings.frequency.daily);
        }
        else {
            // E.g. Every 2 days
            desc.push(strings.every, ' ', me.interval, ' ', strings.days);
        }
    },
    
    /**
     * @protected
     * Returns the description if the rule is of type "FREQ=WEEKLY".
     * May be overridden to customize the output strings, especially for localization.
     * @param {Array[String]} desc An array of strings representing the rule description parts collected
     * so far. This array is passed around, and each method should typically append any needed strings to
     * it. After all logic is complete, the array will be joined and the final description returned.
     * @param {Date} [startDate] The start date of the recurring series (optional).
     */
    getDescriptionWeekly: function(desc, startDate) {
        var me = this,
            strings = me.strings;
        
        if (me.interval == 1) {
            // E.g. Weekly
            desc.push(strings.frequency.weekly);
        }
        else {
            // E.g. Every 2 weeks
            desc.push(strings.every, ' ', me.interval, ' ', strings.weeks);
        }

        // Have specific weekdays been specified? E.g. Weekly on Tuesday, Wednesday and Thursday
        if (me.byDayWeekdays) {
            var len = me.byDayWeekdays.length;
            
            desc.push(' ', strings.on, ' ');
            
            for (var i=0; i < len; i++) {
                if (i > 0 && i < len-1) {
                    desc.push(', ');
                }
                else if (len > 1 && i === len-1) {
                    desc.push(' ', strings.and, ' ');
                }
                // If more than 2 weekdays have been specified, use short day names, otherwise long day names.
                if (len > 2) {
                    desc.push(strings.dayNamesShort[me.byDayWeekdays[i]]);
                }
                else {
                    desc.push(strings.dayNamesLong[me.byDayWeekdays[i]]);
                }
            }
        }
        else if (startDate){
            // No weekdays are specified. Use weekday of parameter startDate as the weekday. E.g. Weekly on Monday
            desc.push(' ', strings.on, ' ', strings.dayNamesLong[me.dayFromDayNo[startDate.getDay()]]);
        }
    },
    
    /**
     * @protected
     * Returns the description if the rule is of type "FREQ=WEEKDAYS". Note that WEEKDAYS is not
     * part of the iCal standard -- it is a special frequency value supported by Extensible as a shorthand
     * that is commonly used in applications. May be overridden to customize the output strings, especially
     * for localization.
     * @param {Array[String]} desc An array of strings representing the rule description parts collected
     * so far. This array is passed around, and each method should typically append any needed strings to
     * it. After all logic is complete, the array will be joined and the final description returned.
     * @param {Date} [startDate] The start date of the recurring series (optional).
     */
    getDescriptionWeekdays: function(desc, startDate) {
        if (this.interval === 1) {
            desc.push(this.strings.frequency.weekdays);
        }
        else {
            // E.g. Every two weekdays
            desc.push(this.strings.every, ' ', this.interval, ' ', this.strings.weekdays);
        }
    },
    
    /**
     * @protected
     * Returns the description if the rule is of type "FREQ=MONTHLY".
     * May be overridden to customize the output strings, especially for localization.
     * @param {Array[String]} desc An array of strings representing the rule description parts collected
     * so far. This array is passed around, and each method should typically append any needed strings to
     * it. After all logic is complete, the array will be joined and the final description returned.
     * @param {Date} [startDate] The start date of the recurring series (optional).
     */
    getDescriptionMonthly: function(desc, startDate) {
        var me = this,
            strings = me.strings;
        
        if (me.interval === 1) {
            // E.g. Monthly
            desc.push(strings.frequency.monthly);
        }
        else {
            // E.g. Every 2 months
            desc.push(strings.every, ' ', me.interval, ' ', strings.months);
        }

        if (me.byMonthDay > 0) {
            // A specific month day has been selected, e.g. Monthly on day 23.
            desc.push(' ' + strings.onDay + ' ' + me.byMonthDay + strings.onDayPostfix);
        }
        else if (me.byMonthDay === -1) {
            // The last day of the month has been selected, e.g. Monthly on the last day.
            desc.push(' ' + strings.onTheLastDay);
        }
        else if (me.byDayNthWeekday) {
            // A numbered weekday of the month has been selected, e.g. Monthly on the first Monday
            if (me.byDayNthWeekday.number > 0) {
                desc.push(' ', strings.onThe, ' ', strings.ordinals[me.byDayNthWeekday.number], ' ', strings.dayNamesLong[me.byDayNthWeekday.weekday]);
            }
            else {
                // Last weekday of the month has been selected, e.g. Monthly on the last Sunday
                desc.push(' ' + strings.onTheLast + ' ' + strings.dayNamesLong[me.byDayNthWeekday.weekday]);
            }
        }
    },
    
    /**
     * @protected
     * Returns the description if the rule is of type "FREQ=YEARLY".
     * May be overridden to customize the output strings, especially for localization.
     * @param {Array[String]} desc An array of strings representing the rule description parts collected
     * so far. This array is passed around, and each method should typically append any needed strings to
     * it. After all logic is complete, the array will be joined and the final description returned.
     * @param {Date} [startDate] The start date of the recurring series (optional).
     */
    getDescriptionYearly: function(desc, startDate) {
        var me = this,
            strings = me.strings;
        
        if (me.interval === 1) {
            // E.g. Yearly
            desc.push(strings.frequency.yearly);
        }
        else {
            // E.g. Every two years
            desc.push(strings.every, ' ', me.interval, ' ', strings.years);
        }
        
        if (!startDate) {
            // StartDate is required for formatting beyond this point
            return;
        }
        
        if (me.byMonthDay === -1) {
            // The last day of the month, e.g. Annually on the last day of November.
            desc.push(' ', strings.onTheLastDay, ' ', strings.of, ' ', Ext.Date.format(startDate, strings.monthFormat));
        }
        else if (me.byDayNthWeekday) {
            // A numbered weekday of the month has been selected, e.g. Monthly on the first Monday
            if (me.byDayNthWeekday.number > 0) {
                // A numbered weekday of the month, e.g. Annually on the second Wednesday of November.
                desc.push(' ', strings.onThe, ' ', strings.ordinals[me.byDayNthWeekday.number], ' ',
                    strings.dayNamesLong[me.byDayNthWeekday.weekday], ' ', strings.of, ' ', Ext.Date.format(startDate, strings.monthFormat));
            }
            else {
                // Last weekday of the month, e.g. Annually on the last Sunday of November
                desc.push(' ', strings.onTheLast, ' ', strings.dayNamesLong[me.byDayNthWeekday.weekday], ' ',
                    strings.of, ' ', Ext.Date.format(startDate, strings.monthFormat));
            }
        }
        else {
            // Yearly on the current start date of the current start month, e.g. Annually on November 27
            desc.push(' ', strings.on, ' ', Ext.Date.format(startDate, strings.monthDayFormat));
        }
    },
    
    /**
     * @protected
     * Returns the description only for the "COUNT=5" portion of the rule (e.g., "5 times").
     * May be overridden to customize the output strings, especially for localization.
     * @param {Array[String]} desc An array of strings representing the rule description parts collected
     * so far. This array is passed around, and each method should typically append any needed strings to
     * it. After all logic is complete, the array will be joined and the final description returned.
     * @param {Date} [startDate] The start date of the recurring series (optional).
     */
    getDescriptionCount: function(desc, startDate) {
        if (this.count) {
            // E.g. Daily, 5 times
            desc.push(', ', this.count, ' ', this.strings.times);
        }
    },
    
    /**
     * @protected
     * Returns the description only for the "UNTIL" portion of the rule.
     * May be overridden to customize the output strings, especially for localization.
     * @param {Array[String]} desc An array of strings representing the rule description parts collected
     * so far. This array is passed around, and each method should typically append any needed strings to
     * it. After all logic is complete, the array will be joined and the final description returned.
     * @param {Date} [startDate] The start date of the recurring series (optional).
     */
    getDescriptionUntil: function(desc, startDate) {
        if (this.until) {
            // E.g. Daily, until December 31, 2012
            desc.push(', ', this.strings.until, ' ', Ext.Date.format(this.until, this.strings.untilFormat));
        }
    }
});
