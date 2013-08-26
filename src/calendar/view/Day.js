/**
 * Unlike other calendar views, is not actually a subclass of {@link Extensible.calendar.view.AbstractCalendar CalendarView}.
 * Instead it is a {@link Ext.container.Container Container} subclass that internally creates and manages the layouts of
 * a {@link Extensible.calendar.view.DayHeader DayHeaderView} and a {@link Extensible.calendar.view.DayBody DayBodyView}. As such
 * DayView accepts any config values that are valid for DayHeaderView and DayBodyView and passes those through
 * to the contained views. It also supports the interface required of any calendar view and in turn calls methods
 * on the contained views as necessary.
 */
Ext.define('Extensible.calendar.view.Day', {
    extend: 'Ext.container.Container',
    alias: 'widget.extensible.dayview',
    
    requires: [
        'Extensible.calendar.view.AbstractCalendar',
        'Extensible.calendar.view.DayHeader',
        'Extensible.calendar.view.DayBody'
    ],
    
    /**
     * @cfg {String} todayText
     * The text to display in the current day's box in the calendar when {@link #showTodayText} is true (defaults to 'Today')
     */
    /**
     * @cfg {Boolean} readOnly
     * True to prevent clicks on events or the view from providing CRUD capabilities, false to enable CRUD (the default).
     */

    /**
     * @cfg {Boolean} showTime
     * True to display the current time in today's box in the calendar, false to not display it (defaults to true)
     */
    showTime: true,
    /**
     * @cfg {Boolean} showTodayText
     * True to display the {@link #todayText} string in today's box in the calendar, false to not display it (defaults to true)
     */
    showTodayText: true,
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 1). Only values from 1 to 7 are allowed.
     */
    dayCount: 1,
    /**
     * @cfg {Boolean} enableEventResize
     * True to allow events in the view's scrolling body area to be updated by a resize handle at the
     * bottom of the event, false to disallow it (defaults to true). If {@link #readOnly} is true event
     * resizing will be disabled automatically.
     */
    enableEventResize: true,
    /**
     * @cfg {Integer} ddIncrement
     * The number of minutes between each step during various drag/drop operations in the view (defaults to 30).
     * This controls the number of times the dragged object will "snap" to the view during a drag operation, and does
     * not have to match with the time boundaries displayed in the view. E.g., the view could be displayed in 30 minute
     * increments (the default) but you could configure ddIncrement to 10, which would snap a dragged object to the
     * view at 10 minute increments.
     * 
     * This config currently applies while dragging to move an event, resizing an event by its handle or dragging
     * on the view to create a new event.
     */
    ddIncrement: 30,
    /**
     * @cfg {Integer} minEventDisplayMinutes
     * This is the minimum **display** height, in minutes, for events shown in the view (defaults to 30). This setting
     * ensures that events with short duration are still readable (e.g., by default any event where the start and end
     * times were the same would have 0 height). It also applies when calculating whether multiple events should be
     * displayed as overlapping. In datetime terms, an event that starts and ends at 9:00 and another event that starts
     * and ends at 9:05 do not overlap, but visually the second event would obscure the first in the view. This setting
     * provides a way to ensure that such events will still be calculated as overlapping and displayed correctly.
     */
    minEventDisplayMinutes: 30,
    /**
     * @cfg {Boolean} showHourSeparator
     * True to display a dotted line that separates each hour block in the scrolling body area at the half-hour mark
     * (the default), false to hide it.
     */
    showHourSeparator: true,
    /**
     * @cfg {Integer} viewStartHour
     * The hour of the day at which to begin the scrolling body area's times (defaults to 0, which equals early 12am / 00:00).
     * Valid values are integers from 0 to 24, but should be less than the value of {@link viewEndHour}.
     */
    viewStartHour: 0,
    /**
     * @cfg {Integer} viewEndHour
     * The hour of the day at which to end the scrolling body area's times (defaults to 24, which equals late 12am / 00:00).
     * Valid values are integers from 0 to 24, but should be greater than the value of {@link viewStartHour}.
     */
    viewEndHour: 24,
    /**
     * @cfg {Integer} scrollStartHour
     * The default hour of the day at which to set the body scroll position on view load (defaults to 7, which equals 7am / 07:00).
     * Note that if the body is not sufficiently overflowed to allow this positioning this setting will have no effect.
     * This setting should be equal to or greater than {@link viewStartHour}.
     */
    scrollStartHour: 7,
    /**
     * @cfg {Integer} hourHeight
     * The height, in pixels, of each hour block displayed in the scrolling body area of the view (defaults to 42).
     * 
     * **Important note:** 
     * While this config can be set to any reasonable integer value, note that it is also used to calculate the ratio used 
     * when assigning event heights. By default, an hour is 60 minutes and 42 pixels high, so the pixel-to-minute ratio is 
     * 42 / 60, or 0.7. This same ratio is then used when rendering events. When rendering a 30 minute event, the rendered 
     * height would be 30 minutes * 0.7 = 21 pixels (as expected).
     * 
     * This is important to understand when changing this value because some browsers may handle pixel rounding in different 
     * ways which could lead to inconsistent visual results in some cases. If you have any problems with pixel precision in 
     * how events are laid out, you might try to stick with hourHeight values that will generate discreet ratios. This is 
     * easily done by simply multiplying 60 minutes by different discreet ratios (.6, .8, 1.1, etc.) to get the corresponding 
     * hourHeight pixel values (36, 48, 66, etc.) that will map back to those ratios. By contrast, if you chose an hourHeight 
     * of 50 for example, the resulting height ratio would be 50 / 60 = .833333... This will work just fine, just be aware 
     * that browsers may sometimes round the resulting height values inconsistently.
     */
    hourHeight: 42,
    /**
     * @cfg {String} hideMode
     * How this component should be hidden. Supported values are <tt>'visibility'</tt>
     * (css visibility), <tt>'offsets'</tt> (negative offset position) and <tt>'display'</tt> (css display).
     * 
     * **Note:** For calendar views the default is 'offsets' rather than the Ext JS default of
     * 'display' in order to preserve scroll position after hiding/showing a scrollable view like Day or Week.
     */
    hideMode: 'offsets',
    /**
     * @cfg {Number} minBodyHeight
     * The minimum height for the scrollable body view (defaults to 150 pixels). By default the body is auto
     * height and simply fills the available area left by the overall layout. However, if the browser window
     * is too short and/or the header area contains a lot of events on a given day, the body area could
     * become too small to be usable. Because of that, if the body falls below this minimum height, the
     * layout will automatically adjust itself by fixing the body height to this minimum height and making the
     * overall Day view container vertically scrollable.
     */
    minBodyHeight: 150,

    isDayView: true,

    initComponent: function() {
        /**
         * @cfg {String} ddCreateEventText
         * The text to display inside the drag proxy while dragging over the calendar to create a new event (defaults to
         * 'Create event for {0}' where {0} is a date range supplied by the view)
         */
        this.ddCreateEventText = this.ddCreateEventText || Extensible.calendar.view.AbstractCalendar.prototype.ddCreateEventText;
        /**
         * @cfg {String} ddMoveEventText
         * The text to display inside the drag proxy while dragging an event to reposition it (defaults to
         * 'Move event to {0}' where {0} is the updated event start date/time supplied by the view)
         */
        this.ddMoveEventText = this.ddMoveEventText || Extensible.calendar.view.AbstractCalendar.prototype.ddMoveEventText;
        
        // day count is only supported between 1 and 7 days
        this.dayCount = this.dayCount > 7 ? 7 : (this.dayCount < 1 ? 1 : this.dayCount);
        
        var cfg = Ext.apply({}, this.initialConfig);
        cfg.showTime = this.showTime;
        cfg.showTodayText = this.showTodayText;
        cfg.todayText = this.todayText;
        cfg.dayCount = this.dayCount;
        cfg.weekCount = 1;
        cfg.readOnly = this.readOnly;
        cfg.ddIncrement = this.ddIncrement;
        cfg.minEventDisplayMinutes = this.minEventDisplayMinutes;
        
        var header = Ext.applyIf({
            xtype: 'extensible.dayheaderview',
            id: this.id+'-hd',
            ownerCalendarPanel: this.ownerCalendarPanel
        }, cfg);
        
        var body = Ext.applyIf({
            xtype: 'extensible.daybodyview',
            enableEventResize: this.enableEventResize,
            showHourSeparator: this.showHourSeparator,
            viewStartHour: this.viewStartHour,
            viewEndHour: this.viewEndHour,
            scrollStartHour: this.scrollStartHour,
            hourHeight: this.hourHeight,
            id: this.id+'-bd',
            ownerCalendarPanel: this.ownerCalendarPanel
        }, cfg);
        
        this.items = [header, body];
        this.addCls('ext-cal-dayview ext-cal-ct');
        
        this.callParent(arguments);
    },

    afterRender: function() {
        this.callParent(arguments);
        
        this.header = Ext.getCmp(this.id+'-hd');
        this.body = Ext.getCmp(this.id+'-bd');
        
        this.body.on('eventsrendered', this.forceSize, this);
        this.on('resize', this.onResize, this);
    },

    refresh: function(reloadData) {
        Extensible.log('refresh (DayView)');
        if (reloadData === undefined) {
            reloadData = false;
        }
        this.header.refresh(reloadData);
        this.body.refresh(reloadData);
    },

    forceSize: function() {
        var me = this;
        
        // The defer call is mainly for good ol' IE, but it doesn't hurt in
        // general to make sure that the window resize is good and done first
        // so that we can properly calculate sizes.
        Ext.defer(function() {
            var ct = me.el.up('.x-panel-body'),
                header = me.el.down('.ext-cal-day-header'),
                bodyHeight = ct ? ct.getHeight() - header.getHeight() : false;
            
            if (bodyHeight) {
                if (bodyHeight < me.minBodyHeight) {
                    bodyHeight = me.minBodyHeight;
                    me.addCls('ext-cal-overflow-y');
                }
                else {
                    me.removeCls('ext-cal-overflow-y');
                }
                me.el.down('.ext-cal-body-ct').setHeight(bodyHeight - 1);
            }
        }, Ext.isIE ? 1 : 0, me);
    },

    onResize: function() {
        this.forceSize();
        Ext.defer(this.refresh, Ext.isIE ? 1 : 0, this); //IE needs the defer
    },
    
    /*
     * We have to "relay" this Component method so that the hidden
     * state will be properly reflected when the views' active state changes
     */
    doHide: function() {
        this.header.doHide.apply(this, arguments);
        this.body.doHide.apply(this, arguments);
    },

    getViewBounds: function() {
        return this.header.getViewBounds();
    },
    
    /**
     * Returns the start date of the view, as set by {@link #setStartDate}. Note that this may not
     * be the first date displayed in the rendered calendar -- to get the start and end dates displayed
     * to the user use {@link #getViewBounds}.
     * @return {Date} The start date
     */
    getStartDate: function() {
        return this.header.getStartDate();
    },

    /**
     * Sets the start date used to calculate the view boundaries to display. The displayed view will be the
     * earliest and latest dates that match the view requirements and contain the date passed to this function.
     * @param {Date} dt The date used to calculate the new view boundaries
     */
    setStartDate: function(dt) {
        this.header.setStartDate(dt, false);
        this.body.setStartDate(dt, true);
    },

    renderItems: function() {
        this.header.renderItems();
        this.body.renderItems();
    },
    
    /**
     * Returns true if the view is currently displaying today's date, else false.
     * @return {Boolean} True or false
     */
    isToday: function() {
        return this.header.isToday();
    },
    
    /**
     * Updates the view to contain the passed date
     * @param {Date} dt The date to display
     * @return {Date} The new view start date
     */
    moveTo: function(dt) {
        dt = this.header.moveTo(dt, false);
        this.body.moveTo(dt, true);
        this.forceSize();
        
        return dt;
    },
    
    /**
     * Updates the view to the next consecutive date(s)
     * @return {Date} The new view start date
     */
    moveNext: function() {
        var dt = this.header.moveNext(false);
        this.body.moveNext(true);
        this.forceSize();
        
        return dt;
    },
    
    /**
     * Updates the view to the previous consecutive date(s)
     * @return {Date} The new view start date
     */
    movePrev: function(noRefresh) {
        var dt = this.header.movePrev(false);
        this.body.movePrev(true);
        this.forceSize();
        
        return dt;
    },

    /**
     * Shifts the view by the passed number of days relative to the currently set date
     * @param {Number} value The number of days (positive or negative) by which to shift the view
     * @return {Date} The new view start date
     */
    moveDays: function(value) {
        var dt = this.header.moveDays(value, false);
        this.body.moveDays(value, true);
        this.forceSize();
        
        return dt;
    },
    
    /**
     * Updates the view to show today
     * @return {Date} Today's date
     */
    moveToday: function() {
        var dt = this.header.moveToday(false);
        this.body.moveToday(true);
        this.forceSize();
        
        return dt;
    },
    
    /**
     * Show the currently configured event editor view (by default the shared instance of
     * {@link Extensible.calendar.form.EventWindow EventEditWindow}).
     * @param {Extensible.calendar.data.EventModel} rec The event record
     * @param {Ext.Element/HTMLNode} animateTarget The reference element that is being edited. By default this is
     * used as the target for animating the editor window opening and closing. If this method is being overridden to
     * supply a custom editor this parameter can be ignored if it does not apply.
     * @return {Extensible.calendar.view.Day} this
     */
    showEventEditor: function(rec, animateTarget) {
        return Extensible.calendar.view.AbstractCalendar.prototype.showEventEditor.apply(this, arguments);
    },
    
    /**
     * Dismiss the currently configured event editor view (by default the shared instance of
     * {@link Extensible.calendar.form.EventWindow EventEditWindow}, which will be hidden).
     * @param {String} dismissMethod (optional) The method name to call on the editor that will dismiss it
     * (defaults to 'hide' which will be called on the default editor window)
     * @return {Extensible.calendar.view.Day} this
     */
    dismissEventEditor: function(dismissMethod) {
        return Extensible.calendar.view.AbstractCalendar.prototype.dismissEventEditor.apply(this, arguments);
    }
});