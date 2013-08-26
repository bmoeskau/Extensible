/**
 * Displays a calendar view by day, more than one day at a time. This class does not usually need to be used directly as you can
 * use a {@link Extensible.calendar.CalendarPanel CalendarPanel} to manage multiple calendar views at once.
 */
Ext.define('Extensible.calendar.view.MultiDay', {
    extend: 'Extensible.calendar.view.Day',
    alias: 'widget.extensible.multidayview',
    
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 3).  Only values from 1 to 7 are allowed.
     */
    dayCount: 3,
    
    /**
     * @cfg {Boolean} startDayIsStatic
     * By default, any configuration of a multi-day view that contains fewer than 7 days will have a rolling
     * start day. If you view the next or previous views, the dates will be adjusted as needed so that each
     * view is contiguous (e.g., if the last day in the current view is Wednesday and you go to the next view
     * it will always begin with Thursday, regardless of the value of {@link #startDay}.
     * 
     * If you set <tt>startDayIsStatic</tt> to <tt>true</tt>, then the view will *always* begin on
     * {@link #startDay}. For any {@link #dayCount} less than 7, days outside the startDay + dayCount range
     * will not be viewable. If a date that is not in the viewable range is set into the view it will
     * automatically advance to the first viewable date for the current range.  This could be useful for
     * creating custom views like a weekday-only or weekend-only view.
     * 
     * Some example {@link Extensible.calendar.CalendarPanel CalendarPanel} configs:
     *
     *		// Weekdays only:
     *		showMultiDayView: true,
     *		multiDayViewCfg: {
     *			dayCount: 5,
     *			startDay: 1,
     *			startDayIsStatic: true
     *		}
     *
     *		// Weekends only:
     *		showMultiDayView: true,
     *		multiDayViewCfg: {
     *			dayCount: 2,
     *			startDay: 6,
     *			startDayIsStatic: true
     *		}
     */
    startDayIsStatic: false,
    
    /**
     * @protected 
     */
    moveNext: function(/*private*/reload) {
        return this.moveDays(this.startDayIsStatic ? 7 : this.dayCount, reload);
    },

    /**
     * @protected 
     */
    movePrev: function(/*private*/reload) {
        return this.moveDays(this.startDayIsStatic ? -7 : -this.dayCount, reload);
    }
});