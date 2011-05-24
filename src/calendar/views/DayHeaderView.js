/**
 * @class Ext.ensible.cal.DayHeaderView
 * @extends Ext.ensible.cal.MonthView
 * <p>This is the header area container within the day and week views where all-day events are displayed.
 * Normally you should not need to use this class directly -- instead you should use {@link Ext.ensible.cal.DayView DayView}
 * which aggregates this class and the {@link Ext.ensible.cal.DayBodyView DayBodyView} into the single unified view
 * presented by {@link Ext.ensible.cal.CalendarPanel CalendarPanel}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.ensible.cal.DayHeaderView', {
    extend: 'Ext.ensible.cal.MonthView',
    alias: 'widget.dayheaderview',
    
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
     * @param {Ext.ensible.cal.DayHeaderView} this
     * @param {Date} dt The date/time that was clicked on
     * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
     * DayHeaderView always return true for this param.
     * @param {Ext.Element} el The Element that was clicked on
     */
    
    // private
    afterRender : function(){
        if(!this.tpl){
            this.tpl = new Ext.ensible.cal.DayHeaderTemplate({
                id: this.id,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime
            });
        }
        this.tpl.compile();
        this.addCls('ext-cal-day-header');
        
        Ext.ensible.cal.DayHeaderView.superclass.afterRender.call(this);
    },
    
    // private
    forceSize: Ext.emptyFn,
    
    // private
    refresh : function(reloadData){
        Ext.ensible.log('refresh (DayHeaderView)');
        Ext.ensible.cal.DayHeaderView.superclass.refresh.call(this, reloadData);
        this.recalcHeaderBox();
    },
    
    // private
    recalcHeaderBox : function(){
        var tbl = this.el.down('.ext-cal-evt-tbl'),
            h = tbl.getHeight();
        
        this.el.setHeight(h+7);
        
        // These should be auto-height, but since that does not work reliably
        // across browser / doc type, we have to size them manually
        this.el.down('.ext-cal-hd-ad-inner').setHeight(h+5);
        this.el.down('.ext-cal-bg-tbl').setHeight(h+5);
    },
    
    // private
    moveNext : function(){
        this.moveDays(this.dayCount);
    },

    // private
    movePrev : function(){
        this.moveDays(-this.dayCount);
    },
    
    // private
    onClick : function(e, t){
        if(el = e.getTarget('td', 3)){
            if(el.id && el.id.indexOf(this.dayElIdDelimiter) > -1){
                var parts = el.id.split(this.dayElIdDelimiter),
                    dt = parts[parts.length-1];
                    
                this.onDayClick(Date.parseDate(dt, 'Ymd'), true, Ext.get(this.getDayId(dt, true)));
                return;
            }
        }
        Ext.ensible.cal.DayHeaderView.superclass.onClick.apply(this, arguments);
    }
});