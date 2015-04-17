/**
 * The widget that represents the weekly recurrence options of an RRULE.
 */
Ext.define('Extensible.form.recurrence.option.Weekly', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-weekly',
    
    requires: [
        'Ext.form.field.Checkbox', // should be required by CheckboxGroup but isn't
        'Ext.form.CheckboxGroup',
        'Extensible.form.recurrence.Parser'
    ],

    /**
     * @cfg {Number} startDay
     * The 0-based index for the day on which the calendar week begins (0=Sunday, which is the default)
     */
    startDay: 0,

    dayValueDelimiter: ',',
    
    cls: 'extensible-recur-weekly',

    strings: {
        on: 'on'
    },

    /**
     * Creates the item configuration for the checkbox group. Takes into account the week start day.
     * For example:
     *		[
     *			{ boxLabel: 'Sun', name: 'SU', id: this.id + '-SU' },
     *			{ boxLabel: 'Mon', name: 'MO', id: this.id + '-MO' },
     *			{ boxLabel: 'Tue', name: 'TU', id: this.id + '-TU' },
     *			{ boxLabel: 'Wed', name: 'WE', id: this.id + '-WE' },
     *			{ boxLabel: 'Thu', name: 'TH', id: this.id + '-TH' },
     *			{ boxLabel: 'Fri', name: 'FR', id: this.id + '-FR' },
     *			{ boxLabel: 'Sat', name: 'SA', id: this.id + '-SA' }
     *		];
     * @return {Array}
     */
    getCheckboxGroupItems: function() {
        var weekdaysId = Extensible.form.recurrence.Parser.byDayNames,
            weekdaysText = Extensible.form.recurrence.Parser.config.strings.dayNamesShortByIndex,
            checkboxArray = [],
            i = this.startDay;

        for (var n=0; n<7; n++) {
            checkboxArray[n] = {boxLabel: weekdaysText[i], name: weekdaysId[i], id: this.id + '-' + weekdaysId[i]};
            i = i === 6 ? 0 : i+1;
        }
        return checkboxArray;
    },


    getItemConfigs: function() {
        var id = this.id;

        return [{
            xtype: 'label',
            text: this.strings.on + ':'
        },{
            xtype: 'checkboxgroup',
            itemId: id + '-days',
            flex: 1,
            items: this.getCheckboxGroupItems(),
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
        // Clear all checkboxes
        me.daysCheckboxGroup.setValue(null);
        if (!v) {
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