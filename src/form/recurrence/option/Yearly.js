Ext.define('Extensible.form.recurrence.option.Yearly', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-yearly',
    
    requires: [
        'Ext.form.field.ComboBox',
        'Extensible.lang.Number'
    ],
    
    nthComboWidth: 200,
    
    cls: 'extensible-recur-yearly',
    
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
            width: this.nthComboWidth,
            triggerAction: 'all',
            forceSelection: true,
            store: [],
            listeners: {
                'change': Ext.bind(this.onComboChange, this)
            }
        },{
            xtype: 'label',
            text: 'each year'
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
            yearlyText = ' in ' + Ext.Date.format(dt, 'F'),
            lastDayOfMonth = Ext.Date.getLastDateOfMonth(dt).getDate(),
            monthDay = Ext.Date.format(dt, 'jS') + ' day' + yearlyText,
            dayNum = dt.getDate(),
            dayIndex = Math.ceil(dayNum / 7),
            dayOfWeek = dayIndex + Extensible.Number.getOrdinalSuffix(dayIndex) +
                    Ext.Date.format(dt, ' l') + yearlyText,
            data = [[monthDay],[dayOfWeek]],
            idx = store.find('field1', combo.getValue());
        
        if (lastDayOfMonth - dayNum < 7) {
            data.push(['last ' + Ext.Date.format(dt, 'l') + yearlyText]);
        }
        if (lastDayOfMonth === dayNum) {
            data.push(['last day' + yearlyText]);
        }
        
        store.removeAll();
        combo.clearValue();
        store.loadData(data);
        
        if (idx > data.length - 1) {
            idx = data.length - 1;
        }
        combo.setValue(store.getAt(idx > -1 ? idx : 0).data.field1);
        
        return me;
    },
    
    getValue: function() {
        var me = this;
        
        if (me.nthCombo) {
            var combo = me.nthCombo,
                idx = combo.store.find('field1', combo.getValue()),
                day = Ext.Date.format(me.startDate, 'D').substring(0,2).toUpperCase(),
                value = 'BYMONTH=' + Ext.Date.format(me.startDate, 'n');
            
            switch (idx) {
                case 0:
                    // return value as above
                    break;
                
                case 1:
                    value += ';BYDAY=' + combo.getValue()[0].substring(0,1) + day;
                    break;
                
                case 2:
                    value += ';BYDAY=-1' + day;
                    break;
                
                default:
                    value += ';BYMONTHDAY=-1';
                    break;
            }
            return value;
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
            
            /*
             * TODO ********************************
             */
            if (parts[0] === 'BYMONTHDAY') {
                
                return;
            }
            else if (parts[0] === 'BYDAY') {
                
                return;
            }
        }, me);
        
        return me;
    }
});
