/**
 * A custom combo used for choosing from the list of available calendars to assign an event to. You must
 * pass a populated calendar store as the store config or the combo will not work.
 * 
 * This is pretty much a standard combo that is simply pre-configured for the options needed by the
 * calendar components. The default configs are as follows:
 *		fieldLabel: 'Calendar',
 *		triggerAction: 'all',
 *		queryMode: 'local',
 *		forceSelection: true,
 *		width: 200
 */
Ext.define('Extensible.calendar.form.field.CalendarCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.extensible.calendarcombo',
    
    requires: ['Extensible.calendar.data.CalendarMappings'],
    
    fieldLabel: 'Calendar',
    triggerAction: 'all',
    queryMode: 'local',
    forceSelection: true,
    selectOnFocus: true,
    
    defaultCls: Ext.baseCSSPrefix+'cal-default',
    hiddenCalendarCls: 'ext-cal-hidden',
    
    initComponent: function() {
        this.valueField = Extensible.calendar.data.CalendarMappings.CalendarId.name;
        this.displayField = Extensible.calendar.data.CalendarMappings.Title.name;
    
        this.listConfig = Ext.apply(this.listConfig || {}, {
            getInnerTpl: this.getListItemTpl
        });
        
        this.store.on('update', this.refreshColorCls, this);
        
        this.callParent(arguments);
    },
    
    getListItemTpl: function(displayField) {
        return '<div class="x-combo-list-item x-cal-{' + Extensible.calendar.data.CalendarMappings.ColorId.name +
                '}"><div class="ext-cal-picker-icon">&#160;</div>{' + displayField + '}</div>';
    },
    
    afterRender: function() {
        this.callParent(arguments);
        
        this.wrap = this.el.down('.'+Ext.baseCSSPrefix+'form-item-body');
        this.wrap.addCls('ext-calendar-picker');
        
        this.icon = Ext.core.DomHelper.append(this.wrap, {
            tag: 'div', cls: 'ext-cal-picker-icon ext-cal-picker-mainicon'
        });
    },
    
    /* @private
     * Refresh the color CSS class based on the current field value
     */
    refreshColorCls: function() {
        var me = this,
            calendarMappings = Extensible.calendar.data.CalendarMappings,
            colorCls = '',
            value = me.getValue();
        
        if (!me.wrap) {
            return me;
        }
        if (me.currentStyleClss !== undefined) {
            me.wrap.removeCls(me.currentStyleClss);
        }
        
        if (!Ext.isEmpty(value)) {
            if (Ext.isArray(value)) {
                value = value[0];
            }
            if (!value.data) {
                // this is a calendar id, need to get the record first then use its color
                value = this.store.findRecord(calendarMappings.CalendarId.name, value);
            }
            colorCls = Ext.baseCSSPrefix+'cal-' + (value.data ? value.data[calendarMappings.ColorId.name] : value);
        }
        
        me.currentStyleClss = colorCls;
        
//        if (value && value.data && value.data[calendarMappings.IsHidden.name] === true) {
//            colorCls += ' ' + me.hiddenCalendarCls;
//        }
        me.wrap.addCls(colorCls);
        
        return me;
    },
    
    /**
     * @protected 
     */
    setValue: function(value) {
        if (!value && this.store.getCount() > 0) {
            // ensure that a valid value is always set if possible
            value = this.store.getAt(0).data[Extensible.calendar.data.CalendarMappings.CalendarId.name];
        }
        
        this.callParent(arguments);
        
        this.refreshColorCls();
    }
});