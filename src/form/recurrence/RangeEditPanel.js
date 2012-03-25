Ext.define('Extensible.form.recurrence.RangeEditPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.extensible.recurrence-rangeeditpanel',
    
    cls: 'extensible-recur-edit-options',
    
    headerText: 'There are multiple events in this series. How would you like your changes applied?',
    optionSingleButtonText: 'This Only',
    optionSingleDescription: 'Only change this event. No other events in the series will be modified.',
    optionFutureButtonText: 'Future',
    optionFutureDescription: 'Change this and all following events. Past events will be unchanged.',
    optionAllButtonText: 'All Events',
    optionAllDescription: 'Change every event in this series.',
    
    editModes: {
        single: 'single',
        future: 'future',
        all: 'all'
    },
    
    border: false,
    
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    
    // private
    initComponent: function(){
        var me = this;
        
        me.editMode = me.editModes.single;
        
        me.items = [
            me.getHeaderConfig(),
            me.getOptionPanelConfig(),
            me.getSummaryConfig()
        ];
        me.callParent(arguments);
    },
    
    getHeaderConfig: function() {
        return {
            xtype: 'component',
            html: this.headerText,
            height: 55,
            padding: 15
        };
    },
    
    getSummaryConfig: function() {
        return {
            xtype: 'component',
            itemId: this.id + '-summary',
            html: this.optionSingleDescription,
            flex: 1,
            padding: 15
        };
    },
    
    getOptionPanelConfig: function() {
        return {
            xtype: 'panel',
            border: false,
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            items: this.getOptionButtonConfigs()
        };
    },
    
    getOptionButtonConfigs: function() {
        var me = this,
            defaultConfig = {
                xtype: 'button',
                iconAlign: 'top',
                enableToggle: true,
                scale: 'large',
                width: 80,
                toggleGroup: 'recur-toggle',
                toggleHandler: me.onToggle,
                scope: me
        },
        items = [Ext.apply({
            itemId: me.id + '-single',
            text: me.optionSingleButtonText,
            iconCls: 'recur-edit-single',
            pressed: me.editMode === me.editModes.single
        }, defaultConfig),
        Ext.apply({
            itemId: me.id + '-future',
            text: me.optionFutureButtonText,
            iconCls: 'recur-edit-future',
            pressed: me.editMode === me.editModes.future
        }, defaultConfig),
        Ext.apply({
            itemId: me.id + '-all',
            text: me.optionAllButtonText,
            iconCls: 'recur-edit-all',
            pressed: me.editMode === me.editModes.all
        }, defaultConfig)];
        
        return items;
    },
    
    getEditMode: function() {
        return this.editMode;
    },
    
    onToggle: function(btn) {
        var me = this,
            summaryEl = me.getComponent(me.id + '-summary').getEl();
        
        if (btn.itemId === me.id + '-single') {
            summaryEl.update(me.optionSingleDescription);
            me.editMode = me.editModes.single;
        }
        else if (btn.itemId === me.id + '-future') {
            summaryEl.update(me.optionFutureDescription);
            me.editMode = me.editModes.future;
        }
        else {
            summaryEl.update(me.optionAllDescription);
            me.editMode = me.editModes.all;
        }
    }
});