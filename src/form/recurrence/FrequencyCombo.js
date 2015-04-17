/**
 * The widget used to choose the frequency of recurrence. While this could be created
 * as a standalone widget, it is typically created automatically as part of a
 * Extensible.form.recurrence.Fieldset and does not normally need to be configured directly.
 */
Ext.define('Extensible.form.recurrence.FrequencyCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.extensible.recurrence-frequency',
    
    requires: [
        'Ext.data.ArrayStore',
        'Extensible.form.recurrence.Parser'
    ],
    
    fieldLabel: 'Repeats',
    queryMode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'pattern',
    valueField: 'id',
    cls: 'extensible-recur-frequency',
    
    initComponent: function() {
        var me = this;

        /**
         * @event frequencychange
         * Fires when a frequency list item is selected.
         * @param {Extensible.form.recurrence.Combo} combo This combo box
         * @param {String} value The selected frequency value (one of the names
         * from {@link #frequencyOptions}, e.g. 'DAILY')
         */
        //me.addEvents('frequencychange');

        var freq = Extensible.form.recurrence.Parser.config.strings.frequency;

        /**
         * @cfg {Array} frequencyOptions
         * An array of arrays, each containing the name/value pair that defines a recurring
         * frequency option supported by the frequency combo. This array is bound to the underlying
         * {@link Ext.data.ArrayStore store} to provide the combo list items. The string descriptions
         * are defined in the {@link Extensible.form.recurrence.Parser#strings} config.
         * Defaults to:
         *
         *		[
         *			['NONE', 'Does not repeat'],
         *			['DAILY', 'Daily'],
         *			['WEEKDAYS', 'Every weekday (Mon-Fri)'],
         *			['WEEKLY', 'Weekly'],
         *			['MONTHLY', 'Monthly'],
         *			['YEARLY', 'Yearly']
         *		]
         */
        me.frequencyOptions = me.frequencyOptions || [
            ['NONE',     freq.none],
            ['DAILY',    freq.daily],
            ['WEEKDAYS', freq.weekdays],
            ['WEEKLY',   freq.weekly],
            ['MONTHLY',  freq.monthly],
            ['YEARLY',   freq.yearly]
        ];
        
        me.store = me.store || Ext.create('Ext.data.ArrayStore', {
            fields: ['id', 'pattern'],
            idIndex: 0,
            data: me.frequencyOptions
        });
        
        me.on('select', me.onSelect, me);
        
        me.callParent(arguments);
    },
    
    onSelect: function(combo, record) {
        this.fireEvent('frequencychange', record.data.id);
    }
});