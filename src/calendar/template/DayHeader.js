/**
 * This is the template used to render the all-day event container used in
 * {@link Extensible.calendar.view.Day DayView} and {@link Extensible.calendar.view.Week WeekView}. Internally
 * the majority of the layout logic is deferred to an instance of {@link Extensible.calendar.template.BoxLayout}.
 * 
 * This template is automatically bound to the underlying event store by the calendar components and expects
 * records of type {@link Extensible.calendar.data.EventModel}.
 * 
 * Note that this template would not normally be used directly. Instead you would use the
 * {@link Extensible.calendar.view.DayTemplate} that internally creates an instance of this template along with
 * a {@link Extensible.calendar.template.DayBody}.
 */
Ext.define('Extensible.calendar.template.DayHeader', {
    extend: 'Ext.XTemplate',
    
    requires: ['Extensible.calendar.template.BoxLayout'],
    
    constructor: function(config) {
        
        Ext.apply(this, config);
    
        this.allDayTpl = Ext.create('Extensible.calendar.template.BoxLayout', config);
        this.allDayTpl.compile();
        
        Extensible.calendar.template.DayHeader.superclass.constructor.call(this,
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
    },
    
    applyTemplate: function(o) {
        var templateConfig = {
            allDayTpl: this.allDayTpl.apply(o)
        };
         
        if (Ext.getVersion('extjs').isLessThan('4.1')) {
            return Extensible.calendar.template.DayHeader.superclass.applyTemplate.call(this, templateConfig);
        }
        else {
            return this.applyOut(templateConfig, []).join('');
        }
    }
},
function() {
    this.createAlias('apply', 'applyTemplate');
});