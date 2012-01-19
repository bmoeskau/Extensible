Ext.define('Extensible.form.recurrence.option.Monthly', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-monthly',
    
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
            nthDayNum = Math.ceil(dayNum / 7),
            nthDay = nthDayNum + Extensible.Number.getOrdinalSuffix(nthDayNum) + Ext.Date.format(dt, ' l'),
            data = [[nthDate],[nthDay]],
            idx
        
        if (last-dayNum < 7) {
            data.push(['last '+Ext.Date.format(dt, 'l')]);
        }
        if (last == dayNum) {
            data.push(['last day']);
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
        var me = this;
        
        if (!v) {
            me.value = undefined;
            return;
        }

        var parts = Ext.isArray(v) ? v : (Ext.isString(v) ? v.split(';') : v),
            value;

        Ext.each(parts, function(part) {
            if (part.indexOf('BYMONTH') > -1) {
                value = part.split('=')[1];
                me.untilCombo.setValue('for');
                me.untilNumberField.setValue(value).show();
                me.untilNumberLabel.show();
            }
            else if (part.indexOf('UNTIL') > -1) {
                value = part.split('=')[1];
                me.untilCombo.setValue('until');
                me.untilDateField.setValue(Date.parseDate(value, this.untilDateFormat)).show();
                me.untilNumberLabel.hide();
            }
        }, me);
        
        return me;
    }
})
