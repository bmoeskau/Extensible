/**
 * Represents an iCalendar recurrence rule and parses recurrence rule strings
 * to generate a textual description of each recurrence rule for human readability.
 *
 * Note that currently only a subset of the iCalendar recurrence rule attributes are supported.
 * They are `FREQ`, `INTERVAL`, `BYDAY`, `BYMONTHDAY`, `BYMONTH`, `COUNT` and `UNTIL`.
 *
 * Portions of this implementation were inspired by the recurrence rule parser of [Vincent Romagnoli][1].
 *
 * Reference documentation is at [http://www.ietf.org/rfc/rfc2445.txt][2],
 * although a more practical guide can be found at [http://www.kanzaki.com/docs/ical/rrule.html][3].
 *
 * Authored by [Gabriel Sidler][4]
 *
 * [1]: https://github.com/skyporter/rrule_parser
 * [2]: http://www.ietf.org/rfc/rfc2445.txt
 * [3]: http://www.kanzaki.com/docs/ical/rrule.html
 * [4]: http://teamup.com
 *
 * @author Gabriel Sidler
 */
Ext.define('Extensible.form.recurrence.Rule', {
    config: {
        /**
         * @cfg {String} dateValueFormat
         * The date string format to return in the RRULE (defaults to 'Ymd\\THis\\Z'). This is the standard
         * ISO-style iCalendar date format (e.g. January 31, 2012, 14:00 would be formatted as: "20120131T140000Z")
         * and should not typically be changed. Note that per the iCal specification, date values should always be
         * specified in UTC time format, which is why the format string ends with 'Z'.
         */
        dateValueFormat: 'Ymd\\THis\\Z',
        /**
         * @cfg {String} rule
         * A recurrence rule string conforming to the standard iCalendar RRULE/EXRULE format, e.g.
         * "FREQ=WEEKLY;INTERVAL=2;COUNT=10;" (default is null).
         */
        rule: null,
        /**
         * @cfg {Date/String} startDate
         * Optional start date for the recurrence rule (default is null). Not required just to parse the RRULE
         * values, but it is required in conjunction with the RRULE to calculate specific recurring date instances,
         * or to provide accurate textual descriptions for certain rules when calling {@link #getDescription}.
         * May be provided as a Date object, or as a string that can be parsed as a valid date.
         */
        startDate: null,
        /**
         * @cfg {Number} frequency
         * The value of the FREQ attribute of the recurrence rule, or null if no recurrence rule has been set
         * (default is null). Supported string values are "DAILY", "WEEKLY", "MONTHLY" and "YEARLY".
         */
        frequency: null,
        /**
         * @cfg {Number} count
         * The value of the COUNT attribute of the recurrence rule, or null if the recurrence rule has no COUNT
         * attribute or if no recurrence rule has been set (default is null). Supported values are any integer >= 1.
         */
        count: null,
        /**
         * @cfg {Date} until
         * The value of the UNTIL attribute of the recurrence rule as a Date object, or null if the recurrence
         * rule has no UNTIL attribute or if no recurrence rule has been set (default is null).
         * Note that per the iCal specification, this date should always be specified in UTC time format (which
         * is why the {@link #dateValueFormat} always ends with 'Z').
         */
        until: null,
        /**
         * @cfg {Number} interval
         * The value of the INTERVAL attribute of the recurrence rule, defaults to 1. Supported values are
         * any integer >= 1.
         */
        interval: 1,
        /**
         * @cfg {String} byDay
         * The value of the BYDAY attribute of the recurrence rule, or null if the recurrence rule has no
         * BYDAY attribute or if no recurrence rule has been set (default is null).
         *
         * The BYDAY attribute can contain 3 different types of values:
         *
         *	* A comma-delimited string of 2-character weekday abbreviations, e.g. 'MO,TU,FR,SU'
         *	* A numbered weekday abbreviation that can be positive or negative, e.g. '4TH' or '-1FR'
         *	* An integer day offset from the start or end of the period, e.g. 3, 20 or -10.
         *
         * See also {@link #byDayWeekdays} and {@link #byDayNumberedWeekday} for more
         * information about how these values are used.
         */
        byDay: null,
        /**
         * @cfg {String} byDayWeekdays
         * A comma separated list of abbreviated weekday names representing the days of the week on which
         * the recurrence pattern should repeat (e.g. ['TU', 'TH', 'FR']), or null if not applicable (default).
         */
        byDayWeekdays: null,
        /**
         * @cfg {Number} byMonthDay
         * The value of the BYMONTHDAY attribute of the recurrence rule or null if the recurrence rule has no
         * BYMONTHDAY attribute, or if no recurrence rule has been set (default is null). This value is an integer
         * relative offset from the start or end of the month (e.g. 10 means "the 10th day of the month", or -5
         * means "the 5th to last day of the month"). Supported values are between 1 and 31, or between -31 and -1.
         */
        byMonthDay: null,
        /**
         * @cfg {Number} byMonth
         * The value of the BYMONTH attribute of the recurrence rule or null if the recurrence rule has no
         * BYMONTH attribute, or if no recurrence rule has been set (default is null). Supported values are
         * integers between 1 and 12 corresponding to the months of the year from January to December.
         */
        byMonth: null,
        /**
         * @cfg {Object} strings
         * Strings used to generate plain text descriptions of the recurrence rule. There are a lot of strings and
         * they are not individually documented since typically they will be defined in locale files, and not
         * overridden as typical configs (though you could also do that). For complete details see the source code
         * or look at the locale files.
         */
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

            dayNamesShortByIndex: {
                0: 'Sun',
                1: 'Mon',
                2: 'Tue',
                3: 'Wed',
                4: 'Thu',
                5: 'Fri',
                6: 'Sat'
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

            ordinals: {
                1: 'first',
                2: 'second',
                3: 'third',
                4: 'fourth',
                5: 'fifth',
                6: 'sixth'
            },

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
            time: 'time',        // e.g. Daily, 1 time
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
            monthDayFormat: 'F j' // e.g. November 10
        }
    },

    /**
     * @private
     * @property byDayNames
     * @type Array[String]
     * The abbreviated day names used in "by*Day" recurrence rules. These values are used when creating
     * the RRULE strings and should not be modified (they are not used for localization purposes).
     */
    byDayNames: [ "SU", "MO", "TU", "WE", "TH", "FR", "SA" ],

    /**
     * @private
     */
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
        this.count = this.until = null;

        if (Ext.isDate(until)) {
            this.until = until;
        }
        else if (typeof until === 'string') {
            this.until = this.parseDate(until);
        }
    },

    /**
     * Parses a date string in {@link #dateValueFormat iCal format} and returns a Date object if possible. This
     * method is the inverse of {@link #formatDate}.
     * @param {String} dateString A date string in {@link #dateValueFormat iCal format}
     * @param {Object} options An optional options object. This can contain:
     *
     *	A String <tt>format</tt> property to override the default {@link #dateValueFormat} used
     *    when parsing the string (not recommended). If you pass in a custom format it should be
     *    a full date/time format to avoid parsing ambiguity.
     *	A Boolean <tt>strict</tt> property that gets passed to the {@link Ext.Date.parse} method
     *    to determine whether or not strict date parsing should be used (defaults to false)
     *	A Date <tt>defaultValue</tt> property to be used in case the string cannot be parsed as
     *    a valid date (defaults to the current date)
     *
     * @returns {Date} The corresponding Date object
     */
    parseDate: function(dateString, options) {
        options = options || {};

        try {
            var date = Ext.Date.parse(dateString, options.format || this.dateValueFormat, options.strict);
            if (date) {
                return date;
            }
        }
        catch(ex) {}

        return options.defaultValue || new Date();
    },

    /**
     * Formats a Date object into a date string in {@link #dateValueFormat iCal format}. This method is the
     * inverse of {@link #parseDate}.
     * @param {Date} date The Date object to format
     * @returns {String} The corresponding date string
     */
    formatDate: function(date) {
        return Ext.Date.format(date, this.dateValueFormat);
    },

    /**
     * @private
     * Applies the value of the BYDAY attribute to the underlying RRULE.
     * @param {String/Array/Object} byDay The new value of the BYDAY attribute. There are three ways to pass a
     * parameter value:
     *
     *	1. As a string, e.g. 'MO,TU,WE' or '3TH' or '-1FR'
     *	2. As an array of weekday identifiers, e.g. ['MO', 'TU', 'WE'].
     *	3. As an object with two attributes *number* and *weekday*, e.g.
     *
     *			{ number: 4, weekday:'TH' }
     *
     *	or
     *
     *			{ number: -1, weekday:'WE' }
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
            var n = parseInt(byDay, 10);

            if (Ext.isNumber(n)) {
                if (n === -1 ) {
                    // The last weekday of period was specified, e.g. -1SU, -1MO, ... -1SA.
                    me.byDayNthWeekday = {number: n, weekday: byDay.substr(2, 2)};
                }
                else {
                    // A numbered weekday was specified, e.g. 1SU, 2SU, ... 5SA
                    me.byDayNthWeekday = {number: n, weekday: byDay.substr(1, 2)};
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
        else if (Ext.isObject(byDay)) {
            // byDay is an object with two properties number and weekday, e.g. {number: 4, weekday: 'TH'}
            me.byDay = byDay.number + byDay.weekday;
            me.byDayNthWeekday = byDay;
        }
    },

    /**
     * If attribute BYDAY of the recurrence rule holds a numbered weekday following iCal relative syntax
     * (e.g. '4TU' meaning "the fourth Tuesday of the month") then this function returns an Object with two
     * attributes *number* and *weekday* (e.g. {number: 4, weekday: 'TU'}), otherwise this method
     * returns null. This object is provided as a convenience when accessing the individual parts of the value.
     * For iCal RRULE representation the {@link #getByDay BYDAY} string should always be used instead.
     * Use function {@link #setByDay} to set the underlying values.
     */
    getByDayNthWeekday: function() {
        return this.byDayNthWeekday;
    },

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
     * Returns a textual representation of the underlying rules in [iCal RRULE format](http://www.kanzaki.com/docs/ical/rrule.html),
     * e.g. "FREQ=WEEKLY;INTERVAL=2;". This is the standard format that is typically
     * used to store and transmit recurrence rules between systems.
     * @returns {String} The iCal-formatted RRULE string, or empty string if a valid RRULE cannot be returned
     */
    getRule: function() {
        var rule = [],
            me = this;

        if (!me.frequency) {
            return '';
        }
        rule.push('FREQ=' + me.frequency);

        if (me.interval !== 1) {
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
     * Parses a recurrence rule string conforming to the iCalendar standard. Note that currently only the following
     * recurrence rule attributes are supported: FREQ, INTERVAL, BYDAY, BYMONTHDAY, BYMONTH, COUNT and UNTIL.
     *
     * This function can be used to set a new rule or update an existing rule. If rule attribute FREQ is present
     * in the passed recurrence rule string, then the rule is initialized first before rule properties are set. If
     * rule attribute FREQ is not present, then the rule properties are updated without first initializing the rule.
     *
     * @param {String} rRule iCalendar recurrence rule as a text string. E.g. "FREQ=WEEKLY;INTERVAL=2;"
     */
    applyRule: function(rRule) {
        var rrParams, nbParams, p, v,
            i = 0,
            me = this;

        if (!rRule) {
            this.init();
            return;
        }
        rrParams = rRule.split(";");
        nbParams = rrParams.length;

        // Process the FREQ attribute first because this initializes the rule.
        for (; i < nbParams; i++) {
            p = rrParams[i].split("=");
            if (p[0] === "FREQ") {
                me.setFrequency(p[1]); // This will initialize the rule.
                break;
            }
        }

        // Now process all attributes except the FREQ attribute.
        for (i = 0; i < nbParams; i++) {
            p = rrParams[i].split("=");
            v = p[1];

            switch (p[0]) {
                case 'INTERVAL':
                    me.setInterval(parseInt(v, 10));
                    break;
                case 'COUNT':
                    me.setCount(parseInt(v, 10));
                    break;
                case 'UNTIL':
                    me.setUntil(v);
                    break;
                case 'BYDAY':
                    me.setByDay(v);
                    break;
                case 'BYMONTHDAY':
                    me.setByMonthDay(parseInt(v, 10));
                    break;
                case 'BYMONTH':
                    me.setByMonth(parseInt(v, 10));
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
     * @return {String} The textual description
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
            strings = me.config.strings;

        if (me.interval === 1) {
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
            strings = me.config.strings;

        if (me.interval === 1) {
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
        else if (startDate) {
            // No weekdays are specified. Use weekday of parameter startDate as the weekday. E.g. Weekly on Monday
            desc.push(' ', strings.on, ' ', strings.dayNamesLong[me.byDayNames[startDate.getDay()]]);
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
            desc.push(this.config.strings.frequency.weekdays);
        }
        else {
            // E.g. Every two weekdays
            desc.push(this.config.strings.every, ' ', this.interval, ' ', this.config.strings.weekdays);
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
            strings = me.config.strings;

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
                desc.push(' ', strings.onThe, ' ', strings.ordinals[me.byDayNthWeekday.number], ' ',
                    strings.dayNamesLong[me.byDayNthWeekday.weekday]);
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
            strings = me.config.strings;

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
                    strings.dayNamesLong[me.byDayNthWeekday.weekday], ' ', strings.of, ' ',
                    Ext.Date.format(startDate, strings.monthFormat));
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
            desc.push(', ', this.count, ' ', (this.count === 1 ? this.config.strings.time : this.config.strings.times));
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
            desc.push(', ', this.config.strings.until, ' ', Ext.Date.format(this.until, this.config.strings.untilFormat));
        }
    }
});
