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
     * <i>3months</i> and <i>year</i>.Defaults to <tt>month</tt>.
     */
    dateRangeDefault: 'month',

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

        templateParams.days = this.getTemplateEventData();
        if(this.tpl){
            this.tpl.overwrite(this.el, templateParams);
            this.lastRenderStart = Ext.Date.clone(this.viewStart);
            this.lastRenderEnd = Ext.Date.clone(this.viewEnd);
        }
    },

    /*
    * Returns the template event data for rendering. The returned value is an array of days containing an array of events.
    */
    getTemplateEventData : function(){
        var M = Extensible.calendar.data.EventMappings,
            calM = Extensible.calendar.data.CalendarMappings,
            events,
            days = {},
            daysArray = [],
            startDtView, endDtView,
            extraClasses,
            colorCls = 'x-cal-default',
            Dt = Extensible.Date,
            viewBounds;

        events = this.store.queryBy(function(rec){
            return this.isEventVisible(rec.data);
        }, this);

        // Get start and end date of view period
        viewBounds = this.getViewBounds();
        startDtView = viewBounds.start;
        endDtView = viewBounds.end;

        // Loop over all events of period and generate list items. Single-day events produce one item per event.
        // Multi-day events produce multiple items, one for each day.
        for (var i=0; i<events.length; i++) {
            var event = events.getAt(i),
                startDtEvent = Ext.Date.clearTime(event.data[M.StartDate.name], true),
                endDtEvent = Ext.Date.clearTime(event.data[M.EndDate.name], true),
                currDt;

            // Determine event classes to be applied
            extraClasses = [this.getEventSelectorCls(event.data[M.EventId.name])];
            // Determine event title color based on calendar color to which event belongs.
            if(this.calendarStore && event.data[M.CalendarId.name]){
                var calRec = this.calendarStore.findRecord(calM.CalendarId.name, event.data[M.CalendarId.name]);
                if(calRec){
                    colorCls = 'x-cal-' + calRec.data[calM.ColorId.name];
                }
            }
            extraClasses.push(colorCls);
            event.data['_colorCls'] = colorCls;
            // Add custom classes that the user added, if any
            if(this.getEventClass){
                var cls = this.getEventClass(event, false, event.data, this.store);
                extraClasses.push(cls);
            }
            event.data['_extraCls'] = extraClasses.join(' ');

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

    // private
    afterRender : function(){
        if(!this.tpl){
            this.tpl = Ext.create('Extensible.calendar.template.AgendaBody', {
                id: this.id,
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

    /*
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

    }
});