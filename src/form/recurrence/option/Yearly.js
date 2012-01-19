Ext.define('Extensible.form.recurrence.option.Yearly', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-yearly',
    
    requires: [
        'Ext.form.field.ComboBox',
        'Extensible.lang.Number'
    ],
    
    afterRender: function() {
        this.callParent(arguments);
        this.initNthCombo();
    },
    
    getItemConfigs: function() {
        return [{
            xtype: 'label',
            text: 'on the'
        },{
            xtype: 'combo',
            itemId: this.id + '-nth-combo',
            mode: 'local',
            width: 170,
            triggerAction: 'all',
            forceSelection: true,
            store: []
        },{
            xtype: 'label',
            text: 'each year'
        }]
    },
    
    initRefs: function() {
        this.nthCombo = this.down('#' + this.id + '-nth-combo');
    },
    
    initNthCombo: function(){

    },
    
    setValue: function(v) {
        // var me = this;
//         
        // if (!v) {
            // me.value = undefined;
            // return;
        // }
        // var parts = Ext.isArray(v) ? v : (Ext.isString(v) ? v.split(';') : v),
            // interval = Ext.isNumber(v) ? v : null,
            // setValueFn = function(v) {
                // me.value = me.key + '=' + v;
                // if (me.intervalField) {
                    // me.intervalField.setValue(v);
                // }
            // }
//         
        // if (interval) {
            // setValueFn(interval);
        // }
        // else {
            // Ext.each(parts, function(part) {
                // if (part.indexOf(me.key) > -1) {
                    // interval = part.split('=')[1];
                    // setValueFn(interval);
                    // return;
                // }
            // }, me);
        // }
//         
        // me.updateLabel();
//         
        // return me;
    }
})
