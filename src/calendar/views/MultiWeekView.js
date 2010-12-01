/**
 * @class Ext.ensible.cal.MultiWeekView
 * @extends Ext.ensible.cal.MonthView
 * <p>Displays a calendar view by week, more than one week at a time. This class does not usually need to be used directly as you can
 * use a {@link Ext.ensible.cal.CalendarPanel CalendarPanel} to manage multiple calendar views at once.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.MultiWeekView = Ext.extend(Ext.ensible.cal.MonthView, {
    /**
     * @cfg {Number} weekCount
     * The number of weeks to display in the view (defaults to 2)
     */
    weekCount: 2,
    
    // inherited docs
    moveNext : function(){
        return this.moveWeeks(this.weekCount, true);
    },
    
    // inherited docs
    movePrev : function(){
        return this.moveWeeks(-this.weekCount, true);
    }
});

Ext.reg('extensible.multiweekview', Ext.ensible.cal.MultiWeekView);