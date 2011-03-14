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
reminderValueFormat: '{0} {1} before start'
</code></pre>
 * <p>To customize the descriptions in the dropdown list override the following methods: 
 * {@link #getMinutesText}, {@link #getHoursText}, {@link #getDaysText} and {@link #getWeeksText}.</p>
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
    reminderValueFormat: '{0} {1} before start',
    
    // the following are all deprecated in favor of the corresponding get* template methods.
    // they are still here only for backwards-compatibility and will be removed in a future release.
    minutesText: 'minutes',
    hourText: 'hour',
    hoursText: 'hours',
    dayText: 'day',
    daysText: 'days',
    weekText: 'week',
    weeksText: 'weeks',
    
    /**
     * Returns the list of reminder values used as the contents of the combo list. This method is provided so that
     * the value list can be easily overridden as needed.
     * @return {Array} A 2-dimensional array of type [{String}, {String}] which contains the value and description
     * respectively of each item in the combo list. By default the value is the number of minutes for the selected 
     * time value (e.g., value 120 == '2 hours') with empty string for no value, but these can be set to anything.
     */
    getValueList: function(){
        var me = this,
            fmt = me.reminderValueFormat,
            stringFormat = String.format;
            
        return [
            ['', me.noneText],
            ['0', me.atStartTimeText],
            ['5', stringFormat(fmt, '5', me.getMinutesText(5))],
            ['15', stringFormat(fmt, '15', me.getMinutesText(15))],
            ['30', stringFormat(fmt, '30', me.getMinutesText(30))],
            ['60', stringFormat(fmt, '1', me.getHoursText(1))],
            ['90', stringFormat(fmt, '1.5', me.getHoursText(1.5))],
            ['120', stringFormat(fmt, '2', me.getHoursText(2))],
            ['180', stringFormat(fmt, '3', me.getHoursText(3))],
            ['360', stringFormat(fmt, '6', me.getHoursText(6))],
            ['720', stringFormat(fmt, '12', me.getHoursText(12))],
            ['1440', stringFormat(fmt, '1', me.getDaysText(1))],
            ['2880', stringFormat(fmt, '2', me.getDaysText(2))],
            ['4320', stringFormat(fmt, '3', me.getDaysText(3))],
            ['5760', stringFormat(fmt, '4', me.getDaysText(4))],
            ['7200', stringFormat(fmt, '5', me.getDaysText(5))],
            ['10080', stringFormat(fmt, '1', me.getWeeksText(1))],
            ['20160', stringFormat(fmt, '2', me.getWeeksText(2))]
        ]
    },
    
    /**
     * Returns the unit text to use for a reminder that has a specified number of minutes
     * prior to the due time (defaults to 'minute' when the passed value === 1, else 'minutes').
     * @param {Number} numMinutes The number of minutes prior to the due time
     * @return {String} The unit text
     */
    getMinutesText: function(numMinutes){
        return numMinutes === 1 ? this.minuteText : this.minutesText;
    },
    /**
     * Returns the unit text to use for a reminder that has a specified number of hours
     * prior to the due time (defaults to 'hour' when the passed value === 1, else 'hours').
     * @param {Number} numHours The number of hours prior to the due time
     * @return {String} The unit text
     */
    getHoursText: function(numHours){
        return numHours === 1 ? this.hourText : this.hoursText;
    },
    /**
     * Returns the unit text to use for a reminder that has a specified number of days
     * prior to the due time (defaults to 'day' when the passed value === 1, else 'days').
     * @param {Number} numDays The number of days prior to the due time
     * @return {String} The unit text
     */
    getDaysText: function(numDays){
        return numDays === 1 ? this.dayText : this.daysText;
    },
    /**
     * Returns the unit text to use for a reminder that has a specified number of weeks
     * prior to the due time (defaults to 'week' when the passed value === 1, else 'weeks').
     * @param {Number} numWeeks The number of weeks prior to the due time
     * @return {String} The unit text
     */
    getWeeksText: function(numWeeks){
        return numWeeks === 1 ? this.weekText : this.weeksText;
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
