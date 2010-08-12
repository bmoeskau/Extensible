/**
 * @class Ext.ensible.cal.CalendarPicker
 * @extends Ext.form.ComboBox
 * <p>A custom combo used for choosing from the list of available calendars to assign an event to.</p>
 * <p>This is pretty much a standard combo that is simply pre-configured for the options needed by the
 * calendar components. The default configs are as follows:<pre><code>
    fieldLabel: 'Calendar',
    valueField: 'CalendarId',
    displayField: 'Title',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    width: 200
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.CalendarPicker = Ext.extend(Ext.form.ComboBox, {
    fieldLabel: 'Calendar',
    valueField: 'CalendarId',
    displayField: 'Title',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    width: 200,
    
    // private
    initComponent: function(){
        Ext.ensible.cal.CalendarPicker.superclass.initComponent.call(this);
        this.tpl = this.tpl ||
              '<tpl for="."><div class="x-combo-list-item ext-color-{' + this.valueField +
              '}"><div class="ext-cal-picker-icon">&nbsp;</div>{' + this.displayField + '}</div></tpl>';
    },
    
    // private
    afterRender: function(){
        Ext.ensible.cal.CalendarPicker.superclass.afterRender.call(this);
        
        this.wrap = this.el.up('.x-form-field-wrap');
        this.wrap.addClass('ext-calendar-picker');
        
        this.icon = Ext.DomHelper.append(this.wrap, {
            tag: 'div', cls: 'ext-cal-picker-icon ext-cal-picker-mainicon'
        });
    },
    
    // inherited docs
    setValue: function(value) {
        this.wrap.removeClass('ext-color-'+this.getValue());
        if(!value && this.store !== undefined){
            // always default to a valid calendar
            value = this.store.getAt(0).data.CalendarId;
        }
        Ext.ensible.cal.CalendarPicker.superclass.setValue.call(this, value);
        this.wrap.addClass('ext-color-'+value);
    }
});

Ext.reg('calendarpicker', Ext.ensible.cal.CalendarPicker);
