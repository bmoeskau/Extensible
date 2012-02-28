Ext.define('Extensible.form.recurrence.option.Monthly', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-monthly',
    
    requires: [
        'Ext.form.field.ComboBox',
        'Extensible.lang.Number'
    ],
    
    cls: 'extensible-recur-monthly',
    
    nthComboWidth: 150,
    
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
            queryMode: 'local',
            width: this.nthComboWidth,
            triggerAction: 'all',
            forceSelection: true,
            displayField: 'text',
            valueField: 'value',
            store: Ext.create('Ext.data.ArrayStore', {
                fields: ['text', 'value'],
                idIndex: 0,
                data: []
            }),
            listeners: {
                'change': Ext.bind(this.onComboChange, this)
            }
        },{
            xtype: 'label',
            text: 'of each month'
        }];
    },
    
    initRefs: function() {
        this.nthCombo = this.down('#' + this.id + '-nth-combo');
    },
    
    onComboChange: function(combo, value) {
        this.checkChange();
    },
    
    setStartDate: function(dt) {
        if (dt !== this.startDate) {
            this.callParent(arguments);
            this.initNthCombo();
        }
        return this;
    },
    
    initNthCombo: function(){
        var me = this,
            combo = me.nthCombo,
            store = combo.store,
            dt = me.startDate,
            lastDayOfMonth = Ext.Date.getLastDateOfMonth(dt).getDate(),
            monthDayText = Ext.Date.format(dt, 'jS') + ' day',
            dayNum = dt.getDate(),
            dayIndex = Math.ceil(dayNum / 7),
            dayNameAbbreviated = Ext.Date.format(dt, 'D').substring(0,2).toUpperCase(),
            dayOfWeekText = dayIndex + Extensible.Number.getOrdinalSuffix(dayIndex) + Ext.Date.format(dt, ' l'),
            data = [
                [monthDayText, 'BYMONTHDAY=' + dayNum],
                [dayOfWeekText, 'BYDAY=' + dayIndex + dayNameAbbreviated]
            ],
            idx = store.find('value', combo.getValue());
        
        if (lastDayOfMonth - dayNum < 7) {
            data.push(['last ' + Ext.Date.format(dt, 'l'), 'BYDAY=-1' + dayNameAbbreviated]);
        }
        if (lastDayOfMonth === dayNum) {
            data.push(['last day', 'BYMONTHDAY=-1']);
        }
        
        store.removeAll();
        combo.clearValue();
        store.loadData(data);
        
        if (idx > data.length - 1) {
            idx = data.length - 1;
        }
        
        combo.setValue(store.getAt(idx > -1 ? idx : 0).data.value);
        
        return me;
    },
    
    getValue: function() {
        var me = this;
        
        if (me.nthCombo) {
            return me.nthCombo.getValue();
        }
        return '';
    },
    
    setValue: function(v) {
        var me = this;
        
        if (!me.preSetValue(v, me.nthCombo)) {
            return me;
        }
        var options = Ext.isArray(v) ? v : v.split(me.optionDelimiter),
            parts;

        Ext.each(options, function(option) {
            parts = option.split('=');
            if (parts[0] === 'BYMONTHDAY' || parts[0] === 'BYDAY') {
                me.nthCombo.setValue(option);
                return;
            }
        }, me);
        
        return me;
    }
});
