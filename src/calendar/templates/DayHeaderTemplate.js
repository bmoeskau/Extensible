/**
 * @class Ext.ensible.cal.DayHeaderTemplate
 * @extends Ext.XTemplate
 * <p>This is the template used to render the all-day event container used in {@link Ext.ensible.cal.DayView DayView} and 
 * {@link Ext.ensible.cal.WeekView WeekView}. Internally the majority of the layout logic is deferred to an instance of
 * {@link Ext.ensible.cal.BoxLayoutTemplate}.</p> 
 * <p>This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Ext.ensible.cal.EventRecord}.</p>
 * <p>Note that this template would not normally be used directly. Instead you would use the {@link Ext.ensible.cal.DayViewTemplate}
 * that internally creates an instance of this template along with a {@link Ext.ensible.cal.DayBodyTemplate}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.DayHeaderTemplate = function(config){
    
    Ext.apply(this, config);
    
    this.allDayTpl = new Ext.ensible.cal.BoxLayoutTemplate(config);
    this.allDayTpl.compile();
    
    Ext.ensible.cal.DayHeaderTemplate.superclass.constructor.call(this,
        '<div class="ext-cal-hd-ct">',
            '<table class="ext-cal-hd-days-tbl" cellspacing="0" cellpadding="0">',
                '<tbody>',
                    '<tr>',
                        '<td class="ext-cal-gutter"></td>',
                        '<td class="ext-cal-hd-days-td"><div class="ext-cal-hd-ad-inner">{allDayTpl}</div></td>',
                        '<td class="ext-cal-gutter-rt"></td>',
                    '</tr>',
                '</tbody>',
            '</table>',
        '</div>'
    );
};

Ext.extend(Ext.ensible.cal.DayHeaderTemplate, Ext.XTemplate, {
    // private
    applyTemplate : function(o){
        return Ext.ensible.cal.DayHeaderTemplate.superclass.applyTemplate.call(this, {
            allDayTpl: this.allDayTpl.apply(o)
        });
    }
});

Ext.ensible.cal.DayHeaderTemplate.prototype.apply = Ext.ensible.cal.DayHeaderTemplate.prototype.applyTemplate;
