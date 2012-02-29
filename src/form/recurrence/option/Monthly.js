Ext.define('Extensible.form.recurrence.option.Monthly', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-monthly',
    
    requires: [
        'Ext.form.field.ComboBox',
        'Extensible.lang.Number'
    ],
    
    cls: 'extensible-recur-monthly',
    
    nthComboWidth: 150,
    
    unit: 'month',
    
    afterRender: function() {
        this.callParent(arguments);
        this.isYearly = (this.unit === 'year');
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
            text: 'of each ' + this.unit
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
            
            // e.g. 30 (for June):
            lastDayOfMonth = Ext.Date.getLastDateOfMonth(dt).getDate(),
            // e.g. "28th day":
            monthDayText = Ext.Date.format(dt, 'jS') + ' day',
            // e.g. 28:
            dayNum = dt.getDate(),
            // index in the month, e.g. 4 for the 4th Tuesday
            dayIndex = Math.ceil(dayNum / 7),
            // e.g. "TU":
            dayNameAbbreviated = Ext.Date.format(dt, 'D').substring(0,2).toUpperCase(),
            // e.g. "4th Tuesday":
            dayOfWeekText = dayIndex + Extensible.Number.getOrdinalSuffix(dayIndex) + Ext.Date.format(dt, ' l'),
            
            // year-specific additions to the resulting value string, used if we are currently
            // executing from within the Yearly option subclass.
            // e.g. "in 2012":
            yearlyText = me.isYearly ? ' in ' + Ext.Date.format(dt, 'F') : '',
            // e.g. "BYMONTH=2;":
            byMonthValue = me.isYearly ? 'BYMONTH=' + Ext.Date.format(dt, 'n') : '',
            // only use this if yearly:
            delimiter = me.isYearly ? me.optionDelimiter : '',
            
            // the first two combo items, which are always included:
            data = [
                [monthDayText + yearlyText, me.isYearly ? byMonthValue : 'BYMONTHDAY=' + dayNum],
                [dayOfWeekText + yearlyText, byMonthValue + delimiter +
                    'BYDAY=' + dayIndex + dayNameAbbreviated]
            ],
            
            // the currently selected index, which we will try to restore after refreshing the combo:
            idx = store.find('value', combo.getValue());
        
        if (lastDayOfMonth - dayNum < 7) {
            // the start date is the last of a particular day (e.g. last Tuesday) for the month
            data.push(['last ' + Ext.Date.format(dt, 'l') + yearlyText,
                byMonthValue + delimiter + 'BYDAY=-1' + dayNameAbbreviated]);
        }
        if (lastDayOfMonth === dayNum) {
            // the start date is the last day of the month
            data.push(['last day' + yearlyText, byMonthValue + delimiter + 'BYMONTHDAY=-1']);
        }
        
        store.removeAll();
        combo.clearValue();
        store.loadData(data);
        
        if (idx > data.length - 1) {
            // if the previously-selected index is now greater than the number of items in the
            // combo default to the last item in the new list
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
            parts,
            values = [];

        Ext.each(options, function(option) {
            parts = option.split('=');
            if (parts[0] === 'BYMONTH') {
                // if BYMONTH is present make sure it goes to the beginning of the value
                // string since that's the order the combo sets it in and they must match
                values.unshift(option);
            }
            if (parts[0] === 'BYMONTHDAY' || parts[0] === 'BYDAY') {
                // these go to the back of the value string
                values.push(option);
            }
        }, me);
        
        if (values.length) {
            me.nthCombo.setValue(values.join(me.optionDelimiter));
        }
        
        return me;
    }
});
