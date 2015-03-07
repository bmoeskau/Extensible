/**
 * @class Extensible.calendar.view.AgendaBody
 * @extends Extensible.calendar.view.AbstractCalendar
 *
 * <p><b>This class is currently beta code and the API is still subject to change before the next release.</b></p>
 *
 * <p>This is the body area view within the agenda view. Normally you should not need to use this class directly
 * -- instead you should use {@link Extensible.calendar.view.Agenda Agenda} view which aggregates this class and the
 * {@link Extensible.calendar.view.AgendaHeader AgendaHeader} view into a single unified view
 * presented by {@link Extensible.calendar.CalendarPanel CalendarPanel}.</p>
 *
 * <p>This component displays the list of events and supports CRUD operations on events. The layout of the events
 * is controlled by template {@link Extensible.calendar.template.AgendaBody}.</p>
 *
 * @author Gabriel Sidler, sidler@teamup.com
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Extensible.calendar.view.AgendaBody', {
    extend: 'Extensible.calendar.view.AbstractCalendar',
    alias: 'widget.extensible.agendabodyview',

    requires: [
        'Ext.XTemplate',
        'Extensible.calendar.template.AgendaBody'
    ],

    /**
     * @cfg {Boolean} linkDatesToDayView
     * True to link dates to the {@link Extensible.calendar.view.Day day view}.
     */
    linkDatesToDayView: true,

    /**
     * @cfg {String} dateRangeDefault
     * Defines the default value for the date range. Supported values are: <i>day</i>, <i>week</i>, <i>month</i>,
     * <i>3months</i> and <i>year</i>. Defaults to <tt>month</tt>.
     */
    dateRangeDefault: 'month',

    /**
     * @cfg {Boolean} simpleList
     * <p>If true, a simple list of events is displayed, else, an agenda-style list is displayed.
     * Defaults to false.</p>
     */
    simpleList: false,

    /**
     * @cfg {String} groupBy
     * <p>Defines the grouping to be applied to the list of events. This property only has an effect if property
     * {@link #simpleList} is true. Supported values are <tt>month</tt>, <tt>week</tt> and <tt>none</tt>. Any other
     * values will disable grouping. Default value is <tt>none</tt>.</p>
     */
    groupBy: 'none',

    /**
     * @property ownerCalendarView
     * @type {Ext.Container}
     * A reference to the calendar view that hosts this view. Read-only.
     */

    // private properties
    /*
     * Private
     * @property filterConfig
     * @type {Object}
     * An object that contains key/value pairs to be used as the filtering configuration when loading events.
     * Use method {@link #setFilterConfig} to set this property. This ensures that the new filter configuration is put
     * into operation immediately.
     */
    dayLinkSelector: '.ext-cal-day-link',
    dayLinkIdDelimiter: 'ext-cal-day-',
    prevLinkSelector: 'ext-cal-agenda-bd-prev-link',
    nextLinkSelector: 'ext-cal-agenda-bd-next-link',
    flex: 1,
    autoScroll: true,
    padding: '10 0 10 0',

    // private
    initComponent : function(){

        this.filterConfig =  {
            period: this.dateRangeDefault,
            groupby: this.groupBy,
            details: false
        };

        this.addEvents({
            /**
             * @event dayclick
             * Fires after the user clicks on a day date
             * @param {Extensible.calendar.view.AgendaBody} this
             * @param {Date} dt The date that was clicked on.
             */
            dayclick: true
        });

        this.callParent(arguments);
    },

    // Private
    renderTemplate : function(){
        var templateParams = this.getTemplateParams();

        if (this.simpleList){
            templateParams.groups = this.getTemplateEventDataForSimpleList();
        } else {
            templateParams.days = this.getTemplateEventDataForAgenda();
        }
        if(this.tpl){
            this.tpl.overwrite(this.el, templateParams);
            this.lastRenderStart = Ext.Date.clone(this.viewStart);
            this.lastRenderEnd = Ext.Date.clone(this.viewEnd);
        }
    },

    /**
     * <p>Returns the template event data for rendering events as a simple list (property {@link #simpleList} is true).
     * Optionally, the events can be grouped by month or week. The grouping is controlled by parameter {@link #groupBy}.</p>
     *
     * <p>Returns an array of group objects containing an array of day objects containing and array of events.
     * If grouping is disabled, then the top-level array contains only one group object. The following illustrates the
     * returned data structure.</p>
     * <pre><code>
[
    group1,
    group2,
    {
        startDt: <Date instance>,
        endDt: <Date instance>,
        weekNo: <int>,   // Exists only if grouped by week
        weekYear: <int>, // Exists only if grouped by week
        days: [
            day1,
            day2,
            {
                date: date,
                events: [
                    event1,
                    event2,
                    ....
                ]
            },
            day3,
            ....
        ]
    },
    group3,
    ....
]
     * </code></pre>
     *
     * @return {Array}
     */
    getTemplateEventDataForSimpleList : function(){
        var M = Extensible.calendar.data.EventMappings,
            events,
            event,
            groups = {},
            groupsArray = [],
            daysArray,
            viewBounds = this.getViewBounds(),
            startDtView = viewBounds.start,
            endDtView = viewBounds.end,
            startDtGroup, endDtGroup,
            startDtEvent, endDtEvent,
            Dt = Extensible.Date,
            group,
            groupKey,
            dayKey,
            weekInfo;

        // Loop over all events of within view period.
        events = this.getEvents();
        for (var i=0; i<events.length; i++) {
            event = events.getAt(i);
            startDtEvent = Ext.Date.clearTime(event.data[M.StartDate.name], true);
            endDtEvent = Ext.Date.clearTime(event.data[M.EndDate.name], true);

            if (this.groupBy == 'month') {
                // Start date of group is the beginning of the current month
                startDtGroup = new Date(startDtEvent.getFullYear(), startDtEvent.getMonth(), 1);
            } else if (this.groupBy == 'week') {
                // Start date of group is the beginning of the current week. Take into consideration that week start day is configurable.
                dayOfWeek = startDtEvent.getDay();
                startDtGroup = Ext.Date.add(startDtEvent, Ext.Date.DAY, -((7 + dayOfWeek - this.startDay) % 7));
            } else {
                // Start date of the groups is the beginning of the view period
                startDtGroup = startDtView;
            }
            // If start date of group is before beginning of view period, move it to beginning of view period.
            if (startDtGroup.getTime() < startDtView.getTime()) {
                startDtGroup = startDtView;
            }
            // Setup startDtGroup and endDtGroup for looping over all group periods
            startDtGroup = Ext.Date.add(startDtGroup, Ext.Date.SECOND, -1);
            endDtGroup = startDtGroup;

            // Loop over all group periods. There are three cases:
            // - List is not grouped: entire view period is considered one group
            // - List is grouped by month: each time period is one month (first and last months may be partial month)
            // - List is grouped by week: each time period is one week (first and last weeks may be partial weeks)
            // The loop is limited to 53 cycles because there are at most 53 weeks per year. In most cases the
            // loop is terminated much earlier.
            for (var j=0; j<53; j++) {
                // Determine time period for next group (week, month, all).
                // First, set startDtGroup to the day following the current endDtGroup
                startDtGroup = Ext.Date.clearTime(Ext.Date.add(endDtGroup, Ext.Date.DAY, 1), true);
                // The end date depends on the selected grouping
                if (this.groupBy == 'month') {
                    // End date is the end of the current month or the end date of the view, whichever is earlier.
                    endDtGroup = Ext.Date.add(Ext.Date.add(new Date(startDtGroup.getFullYear(), startDtGroup.getMonth(), 1), Ext.Date.MONTH, 1), Ext.Date.SECOND, -1);
                    if (endDtGroup.getTime() > endDtView.getTime()) {
                        endDtGroup = endDtView;
                    }
                } else if (this.groupBy == 'week') {
                    // End date is the end of the current week or the end date of the view, whichever is earlier.
                    // Take into consideration that week start day is configurable.
                    dayOfWeek = startDtGroup.getDay();
                    endDtGroup = Ext.Date.add(Ext.Date.add(startDtGroup, Ext.Date.DAY, (6 - dayOfWeek + this.startDay) % 7 + 1), Ext.Date.SECOND, -1);
                    if (endDtGroup.getTime() > endDtView.getTime()) {
                        endDtGroup = endDtView;
                    }
                } else {
                    // There is only one group, therefore end date of group is end date of view
                    endDtGroup = endDtView;
                }

                // Check if we have reached the end of the viewing period
                if (startDtGroup.getTime() > endDtEvent.getTime() || startDtGroup.getTime() > endDtView.getTime()) {
                    break;
                }

                // Create group key. The group key is used to find a group in the list of groups. The
                // format of the group key depends on the configured grouping.
                if (this.groupBy == 'month') {
                    groupKey = Ext.Date.format(startDtGroup, 'my');
                } else if (this.groupBy == 'week') {
                    weekInfo = this.getWeekInfo(Ext.Date.clearTime(endDtGroup));
                    groupKey = weekInfo.weekNo + '_' + weekInfo.weekYear;
                } else {
                    groupKey = 'defaultKey';
                }

                // Create a day key
                dayKey = Ext.Date.format(startDtEvent, 'dmy');

                // Check if an array representing the current group already exists
                group = groups[groupKey];
                if (typeof group == 'undefined') {
                    group = {
                        startDt: startDtGroup,
                        endDt: endDtGroup,
                        days: {}
                    };
                    if (this.groupBy == 'week') {
                        group.weekNo = weekInfo.weekNo;
                        group.weekYear = weekInfo.weekYear;
                    }
                    groups[groupKey] = group;
                }

                // Add event to list of events for the day on which the event starts.
                day = group.days[dayKey];
                if (typeof day == 'undefined') {
                    day = {
                        date: startDtEvent,
                        events: Ext.create(Ext.util.MixedCollection) // Use a MixedCollection here such that we can use the existing event sorting function that works with MixedCollections
                    };
                    group.days[dayKey] = day;
                }
                day.events.add(event.data[M.EventId.name], event);
            }
        }

        // Sort events within days, days within groups and groups among themselves. To be able to sort, the groups and days
        // objects are converted to arrays.
        for (groupKey in groups) {
            group = groups[groupKey];

            daysArray = [];
            for (dayKey in group.days) {
                var day = group.days[dayKey];
                this.sortEventRecordsForDay(day.events);
                daysArray.push(day);
            }
            // Sort days within group
            daysArray.sort(function(a, b) {
                return Dt.compare(b.date, a.date);
            });
            group.days = daysArray;
            groupsArray.push(group);
        }
        // Sort groups
        groupsArray.sort(function(a, b) {
            return Dt.compare(b.startDt, a.startDt);
        });

        return groupsArray;
    },

    /**
    * <p>Returns the template event data for rendering events in agenda style (property {@link #simpleList} is false).</p>
    *
    * <p>Returns an array of day objects containing an array of events. The following illustrates the returned data structure.</p>
    * <pre><code>
[
    day1,
    day2,
    {
        date: date,
        events: [
            event1,
            event2,
            ....
        ]
    },
    day3,
    ....
]
    * </code></pre>
    *
    * @return {Array}
    */
    getTemplateEventDataForAgenda : function(){
        var M = Extensible.calendar.data.EventMappings,
            events,
            event,
            days = {},
            daysArray = [],
            viewBounds = this.getViewBounds(),
            startDtView = viewBounds.start,
            endDtView = viewBounds.end,
            startDtEvent, endDtEvent,
            currDt,
            Dt = Extensible.Date;

        // Loop over all events within view period. Single-day events produce one item per event.
        // Multi-day events produce multiple items, one for each day.
        events = this.getEvents();
        for (var i=0; i<events.length; i++) {
            event = events.getAt(i);
            startDtEvent = Ext.Date.clearTime(event.data[M.StartDate.name], true);
            endDtEvent = Ext.Date.clearTime(event.data[M.EndDate.name], true);

            // Determine the date for the first list item of event. This is either the start date of the event or the first date of the view period, whichever is later.
            Dt.compare(startDtEvent, startDtView) > 0 ? currDt = startDtView : currDt = startDtEvent;

            // Loop over each day the event spans and that is within the view period.
            while (Dt.compare(currDt, endDtEvent) >= 0 && Dt.compare(currDt, endDtView) >= 0) {
                var day;

                // Check if already a day record exists for the current day
                day = days[Ext.Date.format(currDt, 'dmy')];
                if (typeof day == 'undefined') {
                    day = {
                        date: currDt,
                        events: Ext.create(Ext.util.MixedCollection) // Use a MixedCollection here such that we can use the existing event sorting function that works with MixedCollections
                    };
                    days[Ext.Date.format(currDt, 'dmy')] = day;
                }
                day.events.add(event.data[M.EventId.name], event);

                currDt = Ext.Date.add(currDt, Ext.Date.DAY, 1);
            }
        }

        // Convert days from object to array and sort events within a day
        for (date in days) {
            this.sortEventRecordsForDay(days[date].events);
            daysArray.push(days[date]);
        }
        // Sort days
        daysArray.sort(function(a, b) {
            return Dt.compare(b.date, a.date);
        });

        return daysArray;
    },

    /**
     * Returns a list of events for the current view period. Attributes needed for processing the
     * template are applied to the events (event colors, custom classes).
     *
     * @return {Ext.util.MixedCollection} Returns a collection of events objects of class
     * Extensible.calendar.data.EventModel.
     */
    getEvents : function(){
        var M = Extensible.calendar.data.EventMappings,
            CM = Extensible.calendar.data.CalendarMappings,
            events,
            extraClasses,
            colorCls = 'x-cal-default',

        events = this.store.queryBy(function(rec){
            return this.isEventVisible(rec.data);
        }, this);

        // Loop over all events of view period and apply additional attributes to events that are needed for output.
        for (var i=0; i<events.length; i++) {
            var event = events.getAt(i);

            // Determine event classes to be applied
            extraClasses = [this.getEventSelectorCls(event.data[M.EventId.name])];

            // Determine event title color based on calendar color to which event belongs.
            if(this.calendarStore && event.data[M.CalendarId.name]){
                var calRec = this.calendarStore.findRecord(CM.CalendarId.name, event.data[M.CalendarId.name]);
                if(calRec){
                    colorCls = 'x-cal-' + calRec.data[CM.ColorId.name];
                }
            }
            extraClasses.push(colorCls);
            event.data['_colorCls'] = colorCls;

            // Add custom classes that the user added, if any.
            if(this.getEventClass){
                var cls = this.getEventClass(event, false, event.data, this.store);
                extraClasses.push(cls);
            }
            event.data['_extraCls'] = extraClasses.join(' ');
        }

        return events;
    },


    /**
     * <p>For a given date, returns the number of the week and the year to which the week belongs.</p>
     * <p>In different parts of the world weeks are numbered differently. This function covers the
     * three major conventions. The convention used is determined by the configuration of the first
     * day of the week.</p>
     * <pre>
     * First day of week  Convention                                     Region
     * Sunday             Week cont. Jan 1 is first week of year         USA, Canada, Mexico
     * Monday             Week cont. first Thur is first week of year    Most of Europe (ISO 8601 standard)
     * Saturday           Week cont. Jan 1 is first week of year         Most of the Middle East
     * </pre>
     *
     * <p>For more information see <a href="http://en.wikipedia.org/wiki/Week_number#Week_numbering">
     * http://en.wikipedia.org/wiki/Week_number#Week_numbering</a> and
     * <a href="http://www.pjh2.de/datetime/weeknumber/wnd.php?l=en#Legend">
     * http://www.pjh2.de/datetime/weeknumber/wnd.php?l=en#Legend.</a></p>
     *
     * @param {Date} date The date for which the week information is calculated.
     * @return {Object} An object literal with two attributes: weekNo and weekYear.
     */
    getWeekInfo : function(date){
        var weekNo,
            weekYear,
            oneJan;

        // Determine week number
        if (this.startDay == 0) {
            // Week starts on Sunday
            // Code from http://javascript.about.com/library/blweekyear.htm
            oneJan = new Date(date.getFullYear(), 0, 1);
            weekNo = Math.ceil((((date.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
        } else if (this.startDay == 6) {
            // Week starts on Saturday
            oneJan = new Date(date.getFullYear(), 0, 1);
            weekNo = Math.ceil((((date.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
        } else {
            // Week starts on Monday
            weekNo = parseInt(Ext.Date.format(date, 'W'), 10)
        }

        // Determine year to which week belongs.
        if (date.getMonth() == 11 && weekNo == 1) {
            // Date is at the end of December but week belongs to next year.
            weekYear = date.getFullYear() + 1;
        } else if (date.getMonth() == 0 && weekNo > 50) {
            // Date is at the beginning of January but week belongs to previous year.
            weekYear = date.getFullYear() - 1;
        } else {
            weekYear = date.getFullYear();
        }

        return {
            weekNo: weekNo,
            weekYear: weekYear
        }
    },


    // private
    afterRender : function(){
        if(!this.tpl){
            this.tpl = Ext.create('Extensible.calendar.template.AgendaBody', {
                id: this.id,
                simpleList: this.simpleList,
                groupBy: this.groupBy,
                linkDatesToDayView: this.linkDatesToDayView,
                defaultEventTitleText: this.defaultEventTitleText,
                prevLinkSelector: this.prevLinkSelector,
                nextLinkSelector: this.nextLinkSelector
            });
            this.tpl.compile();
        }
        this.addCls('ext-cal-agenda-bd ext-cal-ct');

        this.callParent(arguments);
    },

    /**
     * Returns an object containing all key/value params to be passed when loading the event store.
     * Override this function if you need to pass additional parameters when loading the store.
     * @return {Object} An object containing all params to be sent when loading the event store
     */
    getStoreParams : function(){
        // This is needed if you require the default start and end dates to be included
        var params = this.getStoreDateParams();

        // Apply filter settings from the header form
        Ext.applyIf(params, this.filterConfig);

        // Here is where you can add additional custom params, e.g.:
        // params.now = Ext.Date.format(new Date(), this.dateParamFormat);
        // params.foo = 'bar';
        // params.number = 123;

        return params;
    },

    // private
	refresh : function(reloadData){
        Extensible.log('refresh (AgendaView)');
		this.callParent(arguments);
	},

    /**
     * This method is here to fulfill the interface of {@link Extensible.view.AbstractCalendar}. It does not
     * do anything except to confirm that events have been rendered. For this view, events are rendered by method
     * {@link #renderTemplate}.
     */
    renderItems : function(){
        this.fireEvent('eventsrendered', this);
    },

    /**
    * Sets the filter configuration to be used when calculating view bounds and loading events.
    * @param {Object} filterConfig An object of key/value pairs representing filter conditions.
    */
    setFilterConfig: function(filterConfig) {
        this.filterConfig = filterConfig;
        this.tpl.showEventDetails = this.filterConfig.details ? true: false;
        this.groupBy = this.filterConfig.groupby;
        this.tpl.groupBy = this.filterConfig.groupby;
    },

    /**
     * Helper function that converts a string expressing a date period into an object that can be used as
     * parameter for the {@link Extensible.Date#add} function.
     * @param {String} period Supported values are: <i>day</i>, <i>week</i>, <i>month</i>, <i>3months</i> and
     * <i>year</i>. If an unknown value is passed for period, then <i>months</i> is used.
     * @param {Boolean} subtract If true, then the return object specifies a subtraction operation instead of an
     * addition operation. Defaults to <tt>false</tt>.
     */
    getDateAddParam: function(period, subtract) {
        subtract = subtract || false;

        if (period == 'day') {
            return subtract ? {days: -1} : {days: 1};
        } else if (period == 'week') {
            return  subtract ? {days: -7} : {days: 7};
        } else if (period == '3months') {
            return  subtract ? {months: -3} : {months: 3};
        } else if (period == 'year') {
            return  subtract ? {years: -1} : {years: 1};
        } else {
            return  subtract ? {months: -1} : {months: 1};
        }
    },

    // private
    setViewBounds : function(startDate){
        var me = this,
            Dt = Extensible.Date,
            start = startDate || me.startDate,
            period = me.filterConfig.period || this.dateRangeDefault,
            addParam;

        addParam = this.getDateAddParam(period, false);
        addParam.seconds = -1;

        me.viewStart = Dt.add(start, {days: 0, clearTime: true});
        me.viewEnd = Dt.add(me.viewStart, addParam);
    },

    // private
	getDayEl : function(dt){
		return Ext.get(this.getDayId(dt));
	},

    // private
	getDayId : function(dt){
		if(Ext.isDate(dt)){
            dt = Ext.Date.format(dt, 'Ymd');
		}
		return this.id + this.dayElIdDelimiter + dt;
	},

    /**
     * Moves the view one period forward.
     * @return {Date} The new view start date
     */
    moveNext : function(/*private*/reload){
        var me = this,
            period = me.filterConfig.period || this.dateRangeDefault,
            addParam;
        addParam = this.getDateAddParam(period);
        return this.moveTo(Extensible.Date.add(this.viewStart, addParam), reload);
    },

    /**
     * Moves the view one day backwards.
     * @return {Date} The new view start date
     */
    movePrev : function(/*private*/reload){
        var me = this,
            period = me.filterConfig.period || this.dateRangeDefault,
            addParam;
        addParam = this.getDateAddParam(period, true);
        return this.moveTo(Extensible.Date.add(this.viewStart, addParam), reload);
    },

    /**
     * Returns true if the view is currently displaying today's date, else false.
     * @return {Boolean} True or false
     */
    isToday : function(){
        var today = Ext.Date.clearTime(new Date()).getTime();
        return this.viewStart.getTime() == today;
    },

    // private
    onClick : function(e, t){
        var el;

        // Handle click on an existing event
        if(Extensible.calendar.view.AgendaBody.superclass.onClick.apply(this, arguments)){
            // The superclass handled the click already so exit
            return;
        }

        // Handle click on a date. Jump to day view if active.
        if(el = e.getTarget(this.dayLinkSelector, 3)){
            var dt = el.id.split(this.dayLinkIdDelimiter)[1];
            this.fireEvent('dayclick', this, Ext.Date.parseDate(dt, 'Ymd'));
        }

        // Handle click on next or previous links
        // ext-cal-bd-prev-link
        if(el = e.getTarget('.' + this.prevLinkSelector, 3)){
            this.ownerCalendarView.movePrev(true);
        }
        if(el = e.getTarget('.' + this.nextLinkSelector, 3)){
            this.ownerCalendarView.moveNext(true);
        }

    },

    // inherited docs
    isActiveView: function() {
        var calendarPanel = this.ownerCalendarPanel,
            calendarView = this.ownerCalendarView;
        return (calendarPanel && calendarView && calendarPanel.getActiveView().id === calendarView.id);
    }

});