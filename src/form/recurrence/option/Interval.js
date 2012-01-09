Ext.define('Extensible.form.recurrence.option.Interval', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-interval',
    
    dateLabelFormat: 'l, F j',
    
    key: 'INTERVAL',

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
                    fn: this.onChange,
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
    
    setValue: function(v) {
        var me = this;
        
        if (!v) {
            me.value = undefined;
            return;
        }
        if (!me.intervalField) {
            me.on('afterrender', function() {
                me.setValue(v);
            }, me, {
                single: true
            });
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
