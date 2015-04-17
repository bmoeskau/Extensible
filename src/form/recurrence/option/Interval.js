/**
 * The widget that represents the interval portion of an RRULE.
 */
Ext.define('Extensible.form.recurrence.option.Interval', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-interval',
    
    dateLabelFormat: 'l, F j',
    unit: 'day',
    minValue: 1,
    maxValue: 999,
    startDateWidth: 120,
    
    strings: {
        repeatEvery: 'Repeat every',
        beginning: 'beginning',
        day: 'day',
        days: 'days',
        week: 'week',
        weeks: 'weeks',
        month: 'month',
        months: 'months',
        year: 'year',
        years: 'years'
    },
    
    cls: 'extensible-recur-interval',
    
    initComponent: function() {
        //this.addEvents(
        //    /**
        //     * @event startchange
        //     * Fires when the start date of the recurrence series is changed
        //     * @param {Extensible.form.recurrence.option.Interval} this
        //     * @param {Date} newDate The new start date
        //     * @param {Date} oldDate The previous start date
        //     */
        //    'startchange'
        //);
        this.callParent(arguments);
    },
    
    getItemConfigs: function() {
        return [
            this.getRepeatEveryLabelConfig(),
            this.getIntervalComboConfig(),
            this.getBeginDateLabelConfig(),
            this.getBeginDateFieldConfig()
        ];
    },
    
    getRepeatEveryLabelConfig: function() {
        return {
            xtype: 'label',
            text: this.strings.repeatEvery
        };
    },
    
    getIntervalComboConfig: function() {
        var me = this;
        
        return {
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
        };
    },
    
    getBeginDateLabelConfig: function() {
        return {
            xtype: 'label',
            itemId: this.id + '-date-label'
        };
    },
    
    getBeginDateFieldConfig: function() {
        var me = this,
            startDate = me.getStartDate();
        
        return {
            xtype: 'datefield',
            itemId: me.id + '-start-date',
            width: me.startDateWidth,
            // format: me.endDateFormat || Ext.form.field.Date.prototype.format,
            startDay: this.startDay,
            maxValue: me.maxEndDate,
            allowBlank: false,
            value: startDate,
            
            listeners: {
                'change': Ext.bind(me.onStartDateChange, me)
            }
        };
    },
    
    initRefs: function() {
        var me = this;
        me.intervalField = me.down('#' + me.id + '-interval');
        me.dateLabel = me.down('#' + me.id + '-date-label');
        me.startDateField = me.down('#' + me.id + '-start-date');
    },
    
    onIntervalChange: function(field, value, oldValue) {
        this.checkChange();
        this.updateLabel();
    },
    
    onStartDateChange: function(field, value, oldValue) {
        this.checkChange();
        this.fireEvent('startchange', this, value, oldValue);
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
        this.startDateField.setValue(dt);
        return this;
    },
    
    setUnit: function(unit) {
        this.unit = unit;
        this.updateLabel();
        return this;
    },
    
    updateLabel: function(unit) {
        var me = this;
        
        if (me.intervalField) {
            // TODO: Change this to support locale text
            var s = me.intervalField.getValue() === 1 ? '' : 's';
            me.unit = unit ? unit.toLowerCase() : me.unit || 'day';
            
            if (me.dateLabel) {
                me.dateLabel.update(me.strings[me.unit + s] + ' ' + me.strings.beginning);
            }
        }
        return me;
    }
});
