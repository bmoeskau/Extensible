/**
 * @class Extensible.calendar.view.MultiWeek
 * @extends Extensible.calendar.view.Month
 * Displays a calendar view by week, more than one week at a time. This class does not usually need to be used directly as you can
 * use a {@link Extensible.calendar.CalendarPanel CalendarPanel} to manage multiple calendar views at once.
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Extensible.calendar.view.MultiWeek', {
    extend: 'Extensible.calendar.view.Month',
    alias: 'widget.extensible.multiweekview',
    
    /**
     * @cfg {Number} weekCount
     * The number of weeks to display in the view (defaults to 2)
     */
    weekCount: 2,
    
    // inherited docs
    moveNext: function() {
        return this.moveWeeks(this.weekCount, true);
    },
    
    // inherited docs
    movePrev: function() {
        return this.moveWeeks(-this.weekCount, true);
    }
});