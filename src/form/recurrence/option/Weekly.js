Ext.define('Extensible.form.recurrence.option.Weekly', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-weekly',
    
    requires: [
        'Ext.form.field.Checkbox', // should be required by CheckboxGroup but isn't
        'Ext.form.CheckboxGroup'
    ],
    
    key: 'BYDAY',
    
    getItemConfigs: function() {
        var id = this.id;
        
        return [{
            xtype: 'label',
            text: 'on:'
        },{
            xtype: 'checkboxgroup',
            itemId: id + '-days',
            flex: 1,
            items: [
                //**************************************************
                // TODO: Support week start day !== Sunday
                //**************************************************
                { boxLabel: 'Sun', name: 'SU', id: id + '-SU' },
                { boxLabel: 'Mon', name: 'MO', id: id + '-MO' },
                { boxLabel: 'Tue', name: 'TU', id: id + '-TU' },
                { boxLabel: 'Wed', name: 'WE', id: id + '-WE' },
                { boxLabel: 'Thu', name: 'TH', id: id + '-TH' },
                { boxLabel: 'Fri', name: 'FR', id: id + '-FR' },
                { boxLabel: 'Sat', name: 'SA', id: id + '-SA' }
            ],
            listeners: {
                'change': {
                    fn: this.onChange,
                    scope: this
                }
            }
        }]
    },
    
    initRefs: function() {
        this.daysCheckboxGroup = this.down('#' + this.id + '-days');
    },
    
    selectByDate: function(dt) {
        var day = Ext.Date.format(dt, 'D').substring(0,2).toUpperCase(),
            value = {};
        
        this.clearValue();
        
        if (this.daysCheckboxGroup) {
            value[day] = true;
            this.daysCheckboxGroup.setValue(value);
        }
    },
    
    clearValue: function() {
        this.value = undefined;
        
        if (this.daysCheckboxGroup) {
            this.daysCheckboxGroup.setValue({
                SU:0, TU:0, WE:0, TH:0, FR:0, SA:0
            });
        }
    },
    
    setValue: function(v) {
        var me = this;
        
        if (!v) {
            me.value = undefined;
            return;
        }
        
        if (Ext.isObject(v)) {
            // If the value is an object, it's originating from the underlying CheckboxGroup's
            // getValue() function (e.g. {MON:"on", TUE:"on", FRI:"on"}). In this case there is
            // no need to set the underlying field's value again, just convert the object into
            // the appropriate iCal string value for this component.
            var prop,
                values = [];
            
            for (prop in v) {
                if (v.hasOwnProperty(prop)) {
                    values.push(prop)
                }
            }
            me.value = me.key + '=' + values.join(',');
            return;
        }
        // If the value is not an object then it's either an iCal-formatted recurrence
        // string or an array of recurrence name/value pairs. In this case the value must
        // be processed to see if it contains a BYDAY component to set as the field's value.
        var parts = Ext.isArray(v) ? v : v.split(';'),
            set = false,
            daysString,
            daysArray,
            parts,
            values = {}
        
        Ext.each(parts, function(part) {
            if (part.indexOf(me.key) > -1) {
                daysString = part.split('=')[1],
                daysArray = daysString.split(',');
                    
                Ext.each(daysArray, function(day) {
                    values[day] = true;
                }, me);
                
                me.value = me.key + '=' + daysString;
                
                if (me.daysCheckboxGroup) {
                    me.daysCheckboxGroup.setValue(values);
                }
                else {
                    me.on('afterrender', function() {
                        me.daysCheckboxGroup.setValue(values);
                    }, me, {single: true});
                }
                return set = true;
            }
        }, me);
        
        return me;
    }
})
