Ext.define('Extensible.form.recurrence.option.Interval', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-interval',
    
    dateLabelFormat: 'l, F j',
    
    unit: 'day',
    
    minValue: 1,
    
    maxValue: 999,
    
    cls: 'extensible-recur-interval',
    
    getItemConfigs: function() {
        var me = this;
        
        return [{
            xtype: 'label',
            text: 'Repeat every'
        },{
            xtype: 'numberfield',
            itemId: me.id + '-interval',
            value: 1,
            width: 55,
            minValue: me.minValue,
            maxValue: me.maxValue,
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                'change': Ext.bind(me.onIntervalChange, me)
            }
        },{
            xtype: 'label',
            itemId: me.id + '-date-label'
        }];
    },
    
    initRefs: function() {
        var me = this;
        me.intervalField = me.down('#' + me.id + '-interval');
        me.dateLabel = me.down('#' + me.id + '-date-label');
    },
    
    onIntervalChange: function(field, value, oldValue) {
        this.checkChange();
        this.updateLabel();
    },
    
    getValue: function() {
        if (this.intervalField) {
            return 'INTERVAL=' + this.intervalField.getValue();
        }
        return '';
    },
    
    setValue: function(v) {
        var me = this;
        
        if (!me.preSetValue(v, me.intervalField)) {
            return me;
        }
        if (!v) {
            me.intervalField.setValue(me.minValue);
            return me;
        }
        var options = Ext.isArray(v) ? v : v.split(me.optionDelimiter),
            parts;

        Ext.each(options, function(option) {
            parts = option.split('=');
            
            if (parts[0] === 'INTERVAL') {
                me.intervalField.setValue(parts[1]);
                me.updateLabel();
                return;
            }
        }, me);
        
        return me;
    },
    
    setStartDate: function(dt) {
        this.startDate = dt;
        this.updateLabel();
        return this;
    },
    
    setUnit: function(unit) {
        this.unit = unit;
        this.updateLabel();
        return this;
    },
    
    updateLabel: function(unit){
        var me = this;
        
        if (me.intervalField) {
            //TODO: Refactor for localization
            var s = me.intervalField.getValue() === 1 ? '' : 's';
            me.unit = unit ? unit.toLowerCase() : me.unit || 'day';
            
            if (me.dateLabel) {
                me.dateLabel.update(me.unit + s + ' beginning ' +
                    Ext.Date.format(me.getStartDate(), me.dateLabelFormat));
            }
        }
        return me;
    }
});
