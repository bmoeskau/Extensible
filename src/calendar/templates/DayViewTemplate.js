/**
 * @class Ext.ensible.cal.DayViewTemplate
 * @extends Ext.XTemplate
 * <p>This is the template used to render the all-day event container used in {@link Ext.ensible.cal.DayView DayView} and 
 * {@link Ext.ensible.cal.WeekView WeekView}. Internally this class simply defers to instances of {@link Ext.calerndar.DayHeaderTemplate}
 * and  {@link Ext.calerndar.DayBodyTemplate} to perform the actual rendering logic, but it also provides the overall calendar view
 * container that contains them both.  As such this is the template that should be used when rendering day or week views.</p> 
 * <p>This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Ext.ensible.cal.EventRecord}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.DayViewTemplate = function(config){
    
    Ext.apply(this, config);
    
    this.headerTpl = new Ext.ensible.cal.DayHeaderTemplate(config);
    this.headerTpl.compile();
    
    this.bodyTpl = new Ext.ensible.cal.DayBodyTemplate(config);
    this.bodyTpl.compile();
    
    Ext.ensible.cal.DayViewTemplate.superclass.constructor.call(this,
        '<div class="ext-cal-inner-ct">',
            '{headerTpl}',
            '{bodyTpl}',
        '</div>'
    );
};

Ext.extend(Ext.ensible.cal.DayViewTemplate, Ext.XTemplate, {
    // private
    applyTemplate : function(o){
        return Ext.ensible.cal.DayViewTemplate.superclass.applyTemplate.call(this, {
            headerTpl: this.headerTpl.apply(o),
            bodyTpl: this.bodyTpl.apply(o)
        });
    }
});

Ext.ensible.cal.DayViewTemplate.prototype.apply = Ext.ensible.cal.DayViewTemplate.prototype.applyTemplate;
