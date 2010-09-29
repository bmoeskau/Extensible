/**
 * @class Ext.ensible.cal.CalendarPicker
 * @extends Ext.form.ComboBox
 * <p>A custom combo used for choosing from the list of available calendars to assign an event to. You must
 * pass a populated calendar store as the store config or the combo will not work.</p>
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
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    width: 200,
    defaultCls: 'x-cal-default',
    
    valueField: Ext.ensible.cal.CalendarMappings.CalendarId.name,
    displayField: Ext.ensible.cal.CalendarMappings.Title.name,
    
    // private
    initComponent: function(){
        Ext.ensible.cal.CalendarPicker.superclass.initComponent.call(this);
        
        this.tpl = this.tpl ||
              '<tpl for="."><div class="x-combo-list-item {' + Ext.ensible.cal.CalendarMappings.StyleClass.name +
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
    
    getStyleClass: function(calendarId){
        if(calendarId && calendarId !== ''){
            var rec = this.store.getById(calendarId);
            return rec.data[Ext.ensible.cal.CalendarMappings.StyleClass.name];
        }
    },
    
    // inherited docs
    setValue: function(value) {
        this.wrap.removeClass(this.getStyleClass(this.getValue()));
        value = value || this.store.getAt(0).data[Ext.ensible.cal.CalendarMappings.CalendarId.name];
        Ext.ensible.cal.CalendarPicker.superclass.setValue.call(this, value);
        this.wrap.addClass(this.getStyleClass(value));
    }
});

Ext.reg('calendarpicker', Ext.ensible.cal.CalendarPicker);
