/**
 * @class Extensible.calendar.template.BoxLayout
 * @extends Ext.XTemplate
 * <p>This is the template used to render calendar views based on small day boxes within a non-scrolling container (currently
 * the {@link Extensible.calendar.view.Month MonthView} and the all-day headers for {@link Extensible.calendar.view.Day DayView} and 
 * {@link Extensible.calendar.view.Week WeekView}. This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Extensible.calendar.data.EventModel}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Extensible.calendar.template.BoxLayout', {
    extend: 'Ext.XTemplate',
    
    /**
     * @cfg {String} firstWeekDateFormat
     * The date format used for the day boxes in the first week of the view only (subsequent weeks
     * use the {@link #otherWeeksDateFormat} config). Defaults to 'D j'. Note that if the day names header is displayed
     * above the first row (e.g., {@link Extensible.calendar.view.Month#showHeader MonthView.showHeader} = true)
     * then this value is ignored and {@link #otherWeeksDateFormat} will be used instead.
     */
    firstWeekDateFormat: 'D j',
    /**
     * @cfg {String} otherWeeksDateFormat
     * The date format used for the date in day boxes (other than the first week, which is controlled by
     * {@link #firstWeekDateFormat}). Defaults to 'j'.
     */
    otherWeeksDateFormat: 'j',
    /**
     * @cfg {String} singleDayDateFormat
     * The date format used for the date in the header when in single-day view (defaults to 'l, F j, Y').
     */
    singleDayDateFormat: 'l, F j, Y',
    /**
     * @cfg {String} multiDayFirstDayFormat
     * The date format used for the date in the header when more than one day are visible (defaults to 'M j, Y').
     */
    multiDayFirstDayFormat: 'M j, Y',
    /**
     * @cfg {String} multiDayMonthStartFormat
     * The date format to use for the first day in a month when more than one day are visible (defaults to 'M j').
     * Note that if this day falls on the first day within the view, {@link #multiDayFirstDayFormat} takes precedence.
     */
    multiDayMonthStartFormat: 'M j',
    
    // private
    constructor: function(config){
        
        Ext.apply(this, config);
    
        var weekLinkTpl = this.showWeekLinks ? '<div id="{weekLinkId}" class="ext-cal-week-link">{weekNum}</div>' : '';
        
        Extensible.calendar.template.BoxLayout.superclass.constructor.call(this,
            '<tpl for="weeks">',
                '<div id="{[this.id]}-wk-{[xindex-1]}" class="ext-cal-wk-ct" style="top:{[this.getRowTop(xindex, xcount)]}%; height:{[this.getRowHeight(xcount)]}%;">',
                    weekLinkTpl,
                    '<table class="ext-cal-bg-tbl" cellpadding="0" cellspacing="0">',
                        '<tbody>',
                            '<tr>',
                                '<tpl for=".">',
                                     '<td id="{[this.id]}-day-{date:date("Ymd")}" class="{cellCls}">&#160;</td>',
                                '</tpl>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                    '<table class="ext-cal-evt-tbl" cellpadding="0" cellspacing="0">',
                        '<tbody>',
                            '<tr>',
                                '<tpl for=".">',
                                    '<td id="{[this.id]}-ev-day-{date:date("Ymd")}" class="{titleCls}"><div>{title}</div></td>',
                                '</tpl>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                '</div>',
            '</tpl>', {
                getRowTop: function(i, ln){
                    return ((i-1)*(100/ln));
                },
                getRowHeight: function(ln){
                    return 100/ln;
                }
            }
        );
    },
    
    // private
    applyTemplate : function(o){
        
        Ext.apply(this, o);
        
        var w = 0, title = '', first = true, isToday = false, showMonth = false, 
            prevMonth = false, nextMonth = false, isWeekend = false,
            weekendCls = o.weekendCls,
            prevMonthCls = o.prevMonthCls,
            nextMonthCls = o.nextMonthCls,
            todayCls = o.todayCls,
            weeks = [[]],
            today = Ext.ensible.Date.today(),
            dt = Ext.Date.clone(this.viewStart),
            thisMonth = this.startDate.getMonth();
        
        for(; w < this.weekCount || this.weekCount == -1; w++){
            if(dt > this.viewEnd){
                break;
            }
            weeks[w] = [];
            
            for(var d = 0; d < this.dayCount; d++){
                isToday = dt.getTime() === today.getTime();
                showMonth = first || (dt.getDate() == 1);
                prevMonth = (dt.getMonth() < thisMonth) && this.weekCount == -1;
                nextMonth = (dt.getMonth() > thisMonth) && this.weekCount == -1;
                isWeekend = dt.getDay() % 6 === 0;
                
                if(dt.getDay() == 1){
                    // The ISO week format 'W' is relative to a Monday week start. If we
                    // make this check on Sunday the week number will be off.
                    weeks[w].weekNum = this.showWeekNumbers ? Ext.Date.format(dt, 'W') : '&#160;';
                    weeks[w].weekLinkId = 'ext-cal-week-'+Ext.Date.format(dt, 'Ymd');
                }
                
                if(showMonth){
                    if(isToday){
                        title = this.getTodayText();
                    }
                    else{
                        title = Ext.Date.format(dt, this.dayCount == 1 ? this.singleDayDateFormat : 
                                (first ? this.multiDayFirstDayFormat : this.multiDayMonthStartFormat));
                    }
                }
                else{
                    var dayFmt = (w == 0 && this.showHeader !== true) ? this.firstWeekDateFormat : this.otherWeeksDateFormat;
                    title = isToday ? this.getTodayText() : Ext.Date.format(dt, dayFmt);
                }
                
                weeks[w].push({
                    title: title,
                    date: Ext.Date.clone(dt),
                    titleCls: 'ext-cal-dtitle ' + (isToday ? ' ext-cal-dtitle-today' : '') + 
                        (w==0 ? ' ext-cal-dtitle-first' : '') +
                        (prevMonth ? ' ext-cal-dtitle-prev' : '') + 
                        (nextMonth ? ' ext-cal-dtitle-next' : ''),
                    cellCls: 'ext-cal-day ' + (isToday ? ' '+todayCls : '') + 
                        (d==0 ? ' ext-cal-day-first' : '') +
                        (prevMonth ? ' '+prevMonthCls : '') +
                        (nextMonth ? ' '+nextMonthCls : '') +
                        (isWeekend && weekendCls ? ' '+weekendCls : '')
                });
                dt = Ext.ensible.Date.add(dt, {days: 1});
                first = false;
            }
        }
        
        return Extensible.calendar.template.BoxLayout.superclass.applyTemplate.call(this, {
            weeks: weeks
        });
    },
    
    // private
    getTodayText : function(){
        var timeFmt = Ext.ensible.Date.use24HourTime ? 'G:i ' : 'g:ia ',
            todayText = this.showTodayText !== false ? this.todayText : '',
            timeText = this.showTime !== false ? ' <span id="'+this.id+'-clock" class="ext-cal-dtitle-time">' + 
                    Ext.Date.format(new Date(), timeFmt) + '</span>' : '',
            separator = todayText.length > 0 || timeText.length > 0 ? ' &#8212; ' : ''; // &#8212; == &mdash;
        
        if(this.dayCount == 1){
            return Ext.Date.format(new Date(), this.singleDayDateFormat) + separator + todayText + timeText;
        }
        fmt = this.weekCount == 1 ? this.firstWeekDateFormat : this.otherWeeksDateFormat;
        return todayText.length > 0 ? todayText + timeText : Ext.Date.format(new Date(), fmt) + timeText;
    }
});

Extensible.calendar.template.BoxLayout.prototype.apply = Extensible.calendar.template.BoxLayout.prototype.applyTemplate;
