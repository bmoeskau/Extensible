/**
 * @class Ext.ensible.cal.ReminderField
 * @extends Ext.form.ComboBox
 * <p>A custom combo used for choosing a reminder setting for an event.</p>
 * <p>This is pretty much a standard combo that is simply pre-configured for the options needed by the
 * calendar components. The default configs are as follows:<pre><code>
width: 200,
fieldLabel: 'Reminder',
mode: 'local',
triggerAction: 'all',
forceSelection: true,
displayField: 'desc',
valueField: 'value',
noneText: 'None',
atStartTimeText: 'At start time',
minutesText: 'minutes',
hourText: 'hour',
hoursText: 'hours',
dayText: 'day',
daysText: 'days',
weekText: 'week',
weeksText: 'weeks',
reminderValueFormat: '{0} {1} before start'
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.ReminderField = Ext.extend(Ext.form.ComboBox, {
    width: 200,
    fieldLabel: 'Reminder',
    mode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'desc',
    valueField: 'value',
    noneText: 'None',
    atStartTimeText: 'At start time',
    minutesText: 'minutes',
    hourText: 'hour',
    hoursText: 'hours',
    dayText: 'day',
    daysText: 'days',
    weekText: 'week',
    weeksText: 'weeks',
    reminderValueFormat: '{0} {1} before start',
    
    /**
     * Returns the list of reminder values used as the contents of the combo list. This method is provided so that
     * the value list can be easily overridden as needed.
     * @return {Array} A 2-dimensional array of type [{String}, {String}] which contains the value and description
     * respectively of each item in the combo list. By default the value is the number of minutes for the selected 
     * time value (e.g., value 120 == '2 hours') with empty string for no value, but these can be set to anything.
     */
    getValueList: function(){
        return [
            ['', this.noneText],
            ['0', this.atStartTimeText],
            ['5', String.format(this.reminderValueFormat, '5', this.minutesText)],
            ['15', String.format(this.reminderValueFormat, '15', this.minutesText)],
            ['30', String.format(this.reminderValueFormat, '30', this.minutesText)],
            ['60', String.format(this.reminderValueFormat, '1', this.hourText)],
            ['90', String.format(this.reminderValueFormat, '1.5', this.hoursText)],
            ['120', String.format(this.reminderValueFormat, '2', this.hoursText)],
            ['180', String.format(this.reminderValueFormat, '3', this.hoursText)],
            ['360', String.format(this.reminderValueFormat, '6', this.hoursText)],
            ['720', String.format(this.reminderValueFormat, '12', this.hoursText)],
            ['1440', String.format(this.reminderValueFormat, '1', this.dayText)],
            ['2880', String.format(this.reminderValueFormat, '2', this.daysText)],
            ['4320', String.format(this.reminderValueFormat, '3', this.daysText)],
            ['5760', String.format(this.reminderValueFormat, '4', this.daysText)],
            ['7200', String.format(this.reminderValueFormat, '5', this.daysText)],
            ['10080', String.format(this.reminderValueFormat, '1', this.weekText)],
            ['20160', String.format(this.reminderValueFormat, '2', this.weeksText)]
        ]
    },
    
    // private
    initComponent: function(){
        Ext.ensible.cal.ReminderField.superclass.initComponent.call(this);
        this.store = this.store || new Ext.data.ArrayStore({
            fields: [this.valueField, this.displayField],
            idIndex: 0,
            data: this.getValueList()
        });
    },
    
    // inherited docs
    initValue : function(){
        if(this.value !== undefined){
            this.setValue(this.value);
        }
        else{
            this.setValue('');
        }
        this.originalValue = this.getValue();
    }
});

Ext.reg('extensible.reminderfield', Ext.ensible.cal.ReminderField);
