/**
 * @class Ext.ensible.cal.CalendarCombo
 * @extends Ext.form.ComboBox
 * <p>A custom combo used for choosing from the list of available calendars to assign an event to. You must
 * pass a populated calendar store as the store config or the combo will not work.</p>
 * <p>This is pretty much a standard combo that is simply pre-configured for the options needed by the
 * calendar components. The default configs are as follows:<pre><code>
fieldLabel: 'Calendar',
triggerAction: 'all',
queryMode: 'local',
forceSelection: true,
width: 200
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.ensible.cal.CalendarCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.calendarcombo',
    
    fieldLabel: 'Calendar',
    triggerAction: 'all',
    queryMode: 'local',
    forceSelection: true,
    selectOnFocus: true,
    width: 200,
    
    valueField: Ext.ensible.cal.CalendarMappings.CalendarId.name,
    displayField: Ext.ensible.cal.CalendarMappings.Title.name,
    
    // private
    defaultCls: 'x-cal-default',
    
    // private
    initComponent: function(){
        this.listConfig = Ext.apply(this.listConfig || {}, {
            getInnerTpl: this.getListItemTpl
        });
        this.callParent(arguments);
    },
    
    getListItemTpl: function(displayField) {
        return '<div class="x-combo-list-item x-cal-{' + Ext.ensible.cal.CalendarMappings.ColorId.name +
                '}"><div class="ext-cal-picker-icon">&#160;</div>{' + displayField + '}</div>';
    },
    
    // private
    afterRender: function(){
        this.callParent(arguments);
        
        this.wrap = this.el.down('.x-form-item-body');
        this.wrap.addCls('ext-calendar-picker');
        
        this.icon = Ext.DomHelper.append(this.wrap, {
            tag: 'div', cls: 'ext-cal-picker-icon ext-cal-picker-mainicon'
        });
    },
    
    // private
    // Seems like this might be fixed now in Ext 4
//    assertValue  : function(){
//        var val = this.getRawValue(),
//            rec = this.findRecord(this.displayField, val);
//
//        if(!rec && this.forceSelection){
//            if(val.length > 0 && val != this.emptyText){
//                // Override this method simply to fix the original logic that was here.
//                // The orignal method simply reverts the displayed text but the store remains
//                // filtered with the invalid query, meaning it contains no records. This causes
//                // problems with redisplaying the field -- much better to clear the filter and
//                // reset the original value so everything works as expected.
//                this.store.clearFilter();
//                this.setValue(this.value);
//                this.applyEmptyText();
//            }else{
//                this.clearValue();
//            }
//        }else{
//            if(rec){
//                if (val == rec.get(this.displayField) && this.value == rec.get(this.valueField)){
//                    return;
//                }
//                val = rec.get(this.valueField || this.displayField);
//            }
//            this.setValue(val);
//        }
//    },
    
    // private
    getStyleClass: function(calendarId){
        if(calendarId && calendarId !== ''){
            var rec = this.store.findRecord(Ext.ensible.cal.CalendarMappings.CalendarId.name, calendarId);
            return rec ? 'x-cal-' + rec.data[Ext.ensible.cal.CalendarMappings.ColorId.name] : '';
        }
    },
    
    // inherited docs
    setValue: function(value) {
        // ensure that a valid value is always set
        value = Ext.isEmpty(value) ? this.store.getAt(0).data[Ext.ensible.cal.CalendarMappings.CalendarId.name] : value;
        
        if (this.wrap) {
            this.wrap.replaceCls(this.getStyleClass(this.getValue()), this.getStyleClass(value));
        }
        
        this.callParent([value]);
    }
});