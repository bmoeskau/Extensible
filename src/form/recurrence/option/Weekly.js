Ext.define('Extensible.form.recurrence.option.Weekly', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-weekly',
    
    requires: [
        'Ext.form.field.Checkbox', // should be required by CheckboxGroup but isn't
        'Ext.form.CheckboxGroup'
    ],
    
    dayValueDelimiter: ',',
    
    cls: 'extensible-recur-weekly',
    
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
                'change': Ext.bind(this.onSelectionChange, this)
            }
        }];
    },
    
    initValue: function() {
        this.callParent(arguments);
        
        if (!this.value) {
            this.selectByDate();
        }
    },
    
    initRefs: function() {
        this.daysCheckboxGroup = this.down('#' + this.id + '-days');
    },
    
    onSelectionChange: function(field, value, oldValue) {
        this.checkChange();
        this.updateLabel();
    },
    
    selectByDate: function(dt) {
        var day = Ext.Date.format(dt || this.getStartDate(), 'D').substring(0,2).toUpperCase();
        this.setValue('BYDAY=' + day);
    },
    
    clearValue: function() {
        this.value = undefined;
        
        if (this.daysCheckboxGroup) {
            this.daysCheckboxGroup.setValue({
                SU:0, MO:0, TU:0, WE:0, TH:0, FR:0, SA:0
            });
        }
    },
    
    getValue: function() {
        var me = this;
        
        if (me.daysCheckboxGroup) {
            // Checkbox group value will look like {MON:"on", TUE:"on", FRI:"on"}
            var fieldValue = me.daysCheckboxGroup.getValue(),
                days = [],
                property;
            
            for (property in fieldValue) {
                if (fieldValue.hasOwnProperty(property)) {
                    // Push the name ('MON') not the value ('on')
                    days.push(property);
                }
            }
            return days.length > 0 ? 'BYDAY=' + days.join(me.dayValueDelimiter) : '';
        }
        return '';
    },
    
    setValue: function(v) {
        var me = this;
        
        if (!me.preSetValue(v, me.daysCheckboxGroup)) {
            return me;
        }
        if (!v) {
            me.daysCheckboxGroup.setValue(null);
            return me;
        }
        var options = Ext.isArray(v) ? v : v.split(me.optionDelimiter),
            compositeValue = {},
            parts, days;

        Ext.each(options, function(option) {
            parts = option.split('=');
            
            if (parts[0] === 'BYDAY') {
                days = parts[1].split(me.dayValueDelimiter);
                    
                Ext.each(days, function(day) {
                    compositeValue[day] = true;
                }, me);
                
                me.daysCheckboxGroup.setValue(compositeValue);
                return;
            }
        }, me);
        
        return me;
    }
});