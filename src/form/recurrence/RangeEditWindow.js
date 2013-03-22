Ext.define('Extensible.form.recurrence.RangeEditWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.extensible.recurrence-rangeeditwindow',
    id: 'ext-cal-rangeeditwin',

    requires: [
        'Extensible.form.recurrence.RangeEditPanel'
    ],
    
    // Locale configs
    title: 'Recurring Event Options',
    width: 350,
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
    
    getRangeEditPanel: function() {
        return this.down('#' + this.id + '-recur-panel');
    },
    
    /**
     * Configure the window and show it
     * @param {Object} options Valid properties: editModes[], callback, scope
     */
    prompt: function(o) {
        this.callbackFunction = Ext.bind(o.callback, o.scope || this);
        this.getRangeEditPanel().showEditModes(o.editModes);
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
        var mode = this.getComponent(this.id + '-recur-panel').getEditMode();
        this.callbackFunction(mode);
        this.close();
    },
    
    onCancelAction: function() {
        this.callbackFunction(false);
        this.close();
    }
});