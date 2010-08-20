/**
 * @class Ext.ensible.cal.WeekView
 * @extends Ext.ensible.cal.DayView
 * <p>Displays a calendar view by week. This class does not usually need to be used directly as you can
 * use a {@link Ext.ensible.cal.CalendarPanel CalendarPanel} to manage multiple calendar views at once including
 * the week view.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.WeekView = Ext.extend(Ext.ensible.cal.DayView, {
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 7)
     */
    dayCount: 7
});

Ext.reg('extensible.weekview', Ext.ensible.cal.WeekView);