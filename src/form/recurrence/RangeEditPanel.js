/*
 * 
 */

Ext.define('Extensible.form.recurrence.RangeEditPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.extensible.recurrence-rangeeditpanel',
    
    cls: 'extensible-recur-edit-options',
    
    headerText: 'There are multiple events in this series. How would you like your changes applied?',
    optionSingleButtonText: 'Single',
    optionSingleDescription: 'Apply to this event only. No other events in the series will be affected.',
    optionFutureButtonText: 'Future',
    optionFutureDescription: 'Apply to this and all following events only. Past events will be unaffected.',
    optionAllButtonText: 'All Events',
    optionAllDescription: 'Apply to every event in this series.',
    
    editModes: {
        SINGLE: 'single',
        FUTURE: 'future',
        ALL: 'all'
    },
    
    border: false,
    
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    
    // private
    initComponent: function() {
        var me = this;
        
        me.editMode = me.editMode || me.editModes.ALL;
        
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
            html: this.optionAllDescription,
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
            pressed: me.editMode === me.editModes.SINGLE
        }, defaultConfig),
        Ext.apply({
            itemId: me.id + '-future',
            text: me.optionFutureButtonText,
            iconCls: 'recur-edit-future',
            pressed: me.editMode === me.editModes.FUTURE
        }, defaultConfig),
        Ext.apply({
            itemId: me.id + '-all',
            text: me.optionAllButtonText,
            iconCls: 'recur-edit-all',
            pressed: me.editMode === me.editModes.ALL
        }, defaultConfig)];
        
        return items;
    },
    
    getEditMode: function() {
        return this.editMode;
    },
    
    showEditModes: function(modes) {
        modes = modes || [];
        
        var me = this,
            i = 0,
            btn,
            len = modes.length;
        
        // If modes were passed in hide all by default so we can only show the
        // passed ones, otherwise if nothing was passed in show all
        me.down('#' + me.id + '-single')[len ? 'hide' : 'show']();
        me.down('#' + me.id + '-future')[len ? 'hide' : 'show']();
        me.down('#' + me.id + '-all')[len ? 'hide' : 'show']();
        
        for (; i < len; i++) {
            btn = me.down('#' + me.id + '-' + modes[i]);
            if (btn) {
                btn.show();
            }
        }
    },
    
    onToggle: function(btn) {
        var me = this,
            summaryEl = me.getComponent(me.id + '-summary').getEl();
        
        if (btn.itemId === me.id + '-single') {
            summaryEl.update(me.optionSingleDescription);
            me.editMode = me.editModes.SINGLE;
        }
        else if (btn.itemId === me.id + '-future') {
            summaryEl.update(me.optionFutureDescription);
            me.editMode = me.editModes.FUTURE;
        }
        else {
            summaryEl.update(me.optionAllDescription);
            me.editMode = me.editModes.ALL;
        }
    }
});