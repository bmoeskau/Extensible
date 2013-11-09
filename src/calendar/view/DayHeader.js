/**
 * This is the header area container within the day and week views where all-day events are displayed.
 * Normally you should not need to use this class directly -- instead you should use {@link Extensible.calendar.view.Day DayView}
 * which aggregates this class and the {@link Extensible.calendar.view.DayBody DayBodyView} into the single unified view
 * presented by {@link Extensible.calendar.CalendarPanel CalendarPanel}
 */
Ext.define('Extensible.calendar.view.DayHeader', {
    extend: 'Extensible.calendar.view.Month',
    alias: 'widget.extensible.dayheaderview',
    
    requires: [
        'Extensible.calendar.template.DayHeader'
    ],
    
    // private configs
    weekCount: 1,
    dayCount: 1,
    allDayOnly: true,
    monitorResize: false,
    isHeaderView: true,
    
    // The event is declared in MonthView but we're just overriding the docs:
    /**
     * @event dayclick
     * Fires after the user clicks within the view container and not on an event element. This is a cancelable event, so
     * returning false from a handler will cancel the click without displaying the event editor view. This could be useful
     * for validating that a user can only create events on certain days.
     * @param {Extensible.calendar.view.DayHeader} this
     * @param {Date} dt The date/time that was clicked on
     * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the
     * DayHeaderView always return true for this param.
     * @param {Ext.Element} el The Element that was clicked on
     */

    afterRender: function() {
        if(!this.tpl) {
            this.tpl = Ext.create('Extensible.calendar.template.DayHeader', {
                id: this.id,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime
            });
        }
        this.tpl.compile();
        this.addCls('ext-cal-day-header');
        
        this.callParent(arguments);
    },

    forceSize: Ext.emptyFn,

    refresh: function(reloadData) {
        Extensible.log('refresh (DayHeaderView)');
        this.callParent(arguments);
        this.recalcHeaderBox();
    },

    recalcHeaderBox: function() {
        var tbl = this.el.down('.ext-cal-evt-tbl'),
            h = tbl.getHeight();
        
        this.el.setHeight(h+7);
        
        // These should be auto-height, but since that does not work reliably
        // across browser / doc type, we have to size them manually
        this.el.down('.ext-cal-hd-ad-inner').setHeight(h+5);
        this.el.down('.ext-cal-bg-tbl').setHeight(h+5);
    },

    moveNext: function() {
        return this.moveDays(this.dayCount, false);
    },

    movePrev: function() {
        return this.moveDays(-this.dayCount, false);
    },

    onClick: function(e, t) {
        var el = e.getTarget('td', 3);
        
        if (el) {
            if (el.id && el.id.indexOf(this.dayElIdDelimiter) > -1) {
                var parts = el.id.split(this.dayElIdDelimiter),
                    dt = parts[parts.length-1];
                    
                this.onDayClick(Ext.Date.parseDate(dt, 'Ymd'), true, Ext.get(this.getDayId(dt, true)));
                return;
            }
        }
        this.callParent(arguments);
    },
    
    /**
     * @protected 
     */
    isActiveView: function() {
        var calendarPanel = this.ownerCalendarPanel;
        return (calendarPanel && calendarPanel.getActiveView().isDayView);
    }
});