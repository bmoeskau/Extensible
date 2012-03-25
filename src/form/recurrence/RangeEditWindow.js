Ext.define('Extensible.form.recurrence.RangeEditWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.extensible.recurrence-rangeeditwindow',
    
    requires: [
        'Extensible.form.recurrence.RangeEditPanel'
    ],
    
    // Locale configs
    title: 'Recurring Event Options',
    width: 400,
    height: 240,
    saveButtonText: 'Save',
    cancelButtonText: 'Cancel',
    
    // General configs
    closeAction: 'hide',
    modal: true,
    resizable: false,
    constrain: true,
    buttonAlign: 'right',
    layout: 'fit',
    
    formPanelConfig: {
        border: false
    },
    
    initComponent: function() {
        this.items = [{
            xtype: 'extensible.recurrence-rangeeditpanel',
            itemId: this.id + '-recur-panel'
        }];
        this.fbar = this.getFooterBarConfig();
        
        this.callParent(arguments);
    },
    
    prompt: function(callback, scope) {
        this.callbackFunction = Ext.bind(callback, scope || this);
        this.show();
    },
    
    getFooterBarConfig: function() {
        var cfg = ['->', {
                text: this.saveButtonText,
                itemId: this.id + '-save-btn',
                disabled: false,
                handler: this.onSaveAction,
                scope: this
            },{
                text: this.cancelButtonText,
                itemId: this.id + '-cancel-btn',
                disabled: false,
                handler: this.onCancelAction,
                scope: this
            }];
        
        return cfg;
    },
    
    onSaveAction: function() {
        this.callbackFunction({
            recurrenceEditMode: this.getComponent(this.id + '-recur-panel').getEditMode()
        });
        this.close();
    },
    
    onCancelAction: function() {
        this.callbackFunction();
        this.close();
    }
});