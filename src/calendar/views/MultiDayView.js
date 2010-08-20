/**
 * @class Ext.ensible.cal.MultiDayView
 * @extends Ext.ensible.cal.DayView
 * <p>Displays a calendar view by day, more than one day at a time. This class does not usually need to be used directly as you can
 * use a {@link Ext.ensible.cal.CalendarPanel CalendarPanel} to manage multiple calendar views at once.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.MultiDayView = Ext.extend(Ext.ensible.cal.DayView, {
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 3).  Only values from 1 to 7 are allowed.
     */
    dayCount: 3
});

Ext.reg('extensible.multidayview', Ext.ensible.cal.MultiDayView);