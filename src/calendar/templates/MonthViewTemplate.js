/**
 * @class Ext.ensible.cal.MonthViewTemplate
 * @extends Ext.XTemplate
 * <p>This is the template used to render the {@link Ext.ensible.cal.MonthView MonthView}. Internally this class defers to an
 * instance of {@link Ext.calerndar.BoxLayoutTemplate} to handle the inner layout rendering and adds containing elements around
 * that to form the month view.</p> 
 * <p>This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Ext.ensible.cal.EventRecord}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.ensible.cal.MonthViewTemplate', {
    extend: 'Ext.XTemplate',
    
    /**
     * @cfg {String} dayHeaderFormat
     * The date format to use for day headers, if used (defaults to 'D', e.g. 'Mon' for Monday)
     */
    dayHeaderFormat: 'D',
    /**
     * @cfg {String} dayHeaderTitleFormat
     * The date format to use for the day header's HTML title attribute displayed on mouseover 
     * (defaults to 'l, F j, Y', e.g. 'Monday, December 27, 2010')
     */
    dayHeaderTitleFormat: 'l, F j, Y',
    
    // private
    constructor: function(config){
        
        Ext.apply(this, config);
    
        this.weekTpl = new Ext.ensible.cal.BoxLayoutTemplate(config);
        this.weekTpl.compile();
        
        var weekLinkTpl = this.showWeekLinks ? '<div class="ext-cal-week-link-hd">&#160;</div>' : '';
        
        Ext.ensible.cal.MonthViewTemplate.superclass.constructor.call(this,
    	    '<div class="ext-cal-inner-ct {extraClasses}">',
                '<div class="ext-cal-hd-ct ext-cal-month-hd">',
                    weekLinkTpl,
    		        '<table class="ext-cal-hd-days-tbl" cellpadding="0" cellspacing="0">',
    		            '<tbody>',
                            '<tr>',
                                '<tpl for="days">',
    		                        '<th class="ext-cal-hd-day{[xindex==1 ? " ext-cal-day-first" : ""]}" title="{title}">{name}</th>',
    		                    '</tpl>',
                            '</tr>',
    		            '</tbody>',
    		        '</table>',
                '</div>',
    	        '<div class="ext-cal-body-ct">{weeks}</div>',
            '</div>'
        );
    },
    
    // private
    applyTemplate : function(o){
        var days = [],
            weeks = this.weekTpl.apply(o),
            dt = o.viewStart,
            D = Ext.ensible.Date;
        
        for(var i = 0; i < 7; i++){
            var d = D.add(dt, {days: i});
            days.push({
                name: Ext.Date.format(d, this.dayHeaderFormat),
                title: Ext.Date.format(d, this.dayHeaderTitleFormat)
            });
        }
        
        var extraClasses = this.showHeader === true ? '' : 'ext-cal-noheader';
        if(this.showWeekLinks){
            extraClasses += ' ext-cal-week-links';
        }
        
        return Ext.ensible.cal.MonthViewTemplate.superclass.applyTemplate.call(this, {
            days: days,
            weeks: weeks,
            extraClasses: extraClasses
        });
    }
});

Ext.ensible.cal.MonthViewTemplate.prototype.apply = Ext.ensible.cal.MonthViewTemplate.prototype.applyTemplate;
