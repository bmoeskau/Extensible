/**
 * The widget that represents the yearly recurrence options of an RRULE.
 */
Ext.define('Extensible.form.recurrence.option.Yearly', {
    extend: 'Extensible.form.recurrence.option.Monthly',
    alias: 'widget.extensible.recurrence-yearly',
    
    cls: 'extensible-recur-yearly',
    
    nthComboWidth: 200,
    
    isYearly: true,
    
    getPeriodString: function() {
        return this.strings.year;
    }
});