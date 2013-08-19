/**
 * @class Extensible.calendar.view.Week
 * @extends Extensible.calendar.view.MultiDay
 * Displays a calendar view by week. This class does not usually need to be used directly as you can
 * use a {@link Extensible.calendar.CalendarPanel CalendarPanel} to manage multiple calendar views at once including
 * the week view.
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Extensible.calendar.view.Week', {
    extend: 'Extensible.calendar.view.MultiDay',
    alias: 'widget.extensible.weekview',
    
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 7)
     */
    dayCount: 7
});