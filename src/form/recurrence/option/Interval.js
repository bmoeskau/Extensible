Ext.define('Extensible.form.recurrence.option.Interval', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-interval',
    
    dateLabelFormat: 'l, F j',
    
    key: 'INTERVAL',
    
    unit: 'day',
    
    minValue: 1,
    
    maxValue: 999,
    
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
                'change': {
                    fn: me.onChange,
                    scope: this
                }
            }
        },{
            xtype: 'label',
            itemId: me.id + '-date-label'
        }]
    },
    
    initRefs: function() {
        var me = this;
        me.intervalField = me.down('#' + me.id + '-interval');
        me.dateLabel = me.down('#' + me.id + '-date-label');
    },
    
    setValue: function(v) {
        var me = this;
        
        if (!v) {
            me.value = undefined;
            return;
        }
        if (!me.intervalField) {
            me.on('afterrender', function() {
                me.setValue(v);
            }, me, {single: true});
            return;
        }
        
        var parts = Ext.isArray(v) ? v : (Ext.isString(v) ? v.split(';') : v),
            interval = Ext.isNumber(v) ? v : null,
            setValueFn = function(v) {
                me.value = me.key + '=' + v;
                if (me.intervalField) {
                    me.intervalField.setValue(v);
                }
            }
        
        if (interval) {
            setValueFn(interval);
        }
        else {
            Ext.each(parts, function(part) {
                if (part.indexOf(me.key) > -1) {
                    interval = part.split('=')[1];
                    setValueFn(interval);
                    return;
                }
            }, me);
        }
        
        me.updateLabel();
        
        return me;
    },
    
    setUnit: function(unit) {
        this.unit = unit;
        return this;
    },
    
    updateLabel: function(unit){
        var me = this;
        
        if (me.intervalField) {
            //TODO: Refactor for localization
            var s = me.intervalField.getValue() == 1 ? '' : 's';
            me.unit = unit ? unit.toLowerCase() : me.unit || 'day';
            
            if (me.dateLabel) {
                me.dateLabel.update(me.unit + s + ' beginning ' + Ext.Date.format(me.startDate, me.dateLabelFormat));
            }
        }
        return me;
    }
})
