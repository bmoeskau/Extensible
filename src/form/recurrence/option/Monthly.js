Ext.define('Extensible.form.recurrence.option.Monthly', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-monthly',
    
    requires: [
        'Ext.form.field.ComboBox',
        'Extensible.lang.Number'
    ],
    
    initComponent: function() {
        var me = this;
        
        me.startDate = me.startDate || new Date();
        me.items = me.getItemConfigs();
        me.callParent(arguments);
    },
    
    afterRender: function() {
        this.callParent(arguments);
        this.initNthCombo();
    },
    
    getItemConfigs: function() {
        return [{
            xtype: 'label',
            text: 'on the'
        },{
            xtype: 'combobox',
            itemId: this.id + '-nth-combo',
            mode: 'local',
            width: 170,
            triggerAction: 'all',
            forceSelection: true,
            store: []
        },{
            xtype: 'label',
            text: 'of each month'
        }]
    },
    
    initRefs: function() {
        this.nthCombo = this.down('#' + this.id + '-nth-combo');
    },
    
    initNthCombo: function(){
        var me = this,
            cbo = me.nthCombo,
            store = cbo.store,
            dt = me.startDate,
            last = Ext.Date.getLastDateOfMonth(dt).getDate(),
            dayNum = dt.getDate(),
            nthDate = Ext.Date.format(dt, 'jS') + ' day',
            s = '',
            nthDayNum, nthDay, lastDay, idx, data;
            
        nthDayNum = Math.ceil(dayNum / 7);
        nthDay = nthDayNum + Extensible.Number.getOrdinalSuffix(nthDayNum) + Ext.Date.format(dt, ' l');
        data = [[nthDate],[nthDay]];
        
        if (last-dayNum < 7) {
            data.push(['last '+Ext.Date.format(dt, 'l')+s]);
        }
        if (last == dayNum) {
            data.push(['last day'+s]);
        }
        
        idx = store.find('field1', cbo.getValue());
        store.removeAll();
        cbo.clearValue();
        store.loadData(data);
        
        if (idx > data.length-1) {
            idx = data.length-1;
        }
        cbo.setValue(store.getAt(idx > -1 ? idx : 0).data.field1);
        
        return me;
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
