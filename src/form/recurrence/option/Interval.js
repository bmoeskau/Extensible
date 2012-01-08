Ext.define('Extensible.form.recurrence.option.Interval', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-interval',
    
    dateLabelFormat: 'l, F j',

    initComponent: function() {
        var me = this;
        
        me.startDate = me.startDate || new Date();
        me.items = me.getItemConfigs();
        me.callParent(arguments);
    },
    
    getItemConfigs: function() {
        return [{
            xtype: 'label',
            text: 'Repeat every'
        },{
            xtype: 'numberfield',
            itemId: this.id + '-interval',
            value: 1,
            width: 45,
            minValue: 1,
            maxValue: 99,
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                'change': {
                    fn: function(field, value) {
                        this.setValue(value);
                    },
                    scope: this
                }
            }
        },{
            xtype: 'label',
            itemId: this.id + '-date-label'
        }]
    },
    
    afterRender: function(){
        this.callParent(arguments);
        this.initRefs();
        this.updateLabel();
    },
    
    initRefs: function() {
        var me = this;
        me.intervalField = me.down('#' + me.id + '-interval');
        me.dateLabel = me.down('#' + me.id + '-date-label');
    },
    
    getValue: function() {
        if (this.intervalField) {
            var v = this.intervalField.getValue();
            return v > 1 ? 'INTERVAL=' + v : '';
        }
        return this.value;
    },
    
    setValue: function(v) {
        if (!v) {
            return;
        }
        var parts = Ext.isArray(v) ? v : (Ext.isString(v) ? v.split(';') : v),
            interval = Ext.isNumber(v) ? v : null,
            setValueFn = function(v) {
                this.value = 'INTERVAL=' + v;
                if (this.intervalField) {
                    this.intervalField.setValue(v);
                }
            }
        
        if (interval) {
            setValueFn(interval);
        }
        else {
            Ext.each(parts, function(part) {
                if (part.indexOf('INTERVAL') > -1) {
                    interval = p.split('=')[1];
                    setValueFn(interval);
                }
            }, this);
        }
        
        this.updateLabel();
        
        return this;
    },
    
    updateLabel: function(intervalType){
        var me = this;
        
        if (me.intervalField) {
            var s = me.intervalField.getValue() == 1 ? '' : 's';
            me.intervalType = intervalType ? intervalType.toLowerCase() : me.intervalType || 'day';
            
            if (me.dateLabel) {
                me.dateLabel.update(me.intervalType + s + ' beginning ' + Ext.Date.format(me.startDate, me.dateLabelFormat));
            }
        }
        return me;
    }
})
