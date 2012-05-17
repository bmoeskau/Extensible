/* @private
 * Currently not used
 */
Ext.define('Extensible.form.recurrence.FrequencyCombo', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.extensible.recurrence-frequency',
    
    requires: ['Ext.data.ArrayStore'],
    
    fieldLabel: 'Repeats',
    queryMode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'pattern',
    valueField: 'id',
    cls: 'extensible-recur-frequency',
    
    frequencyText: {
        none     : 'Does not repeat',
        daily    : 'Daily',
        weekdays : 'Every weekday (Mon-Fri)',
        weekly   : 'Weekly',
        monthly  : 'Monthly',
        yearly   : 'Yearly'
    },
    
    initComponent: function() {
        var me = this;
        
        /**
         * @event frequencychange
         * Fires when a frequency list item is selected.
         * @param {Extensible.form.recurrence.Combo} combo This combo box
         * @param {String} value The selected frequency value (one of the names
         * from {@link #frequencyOptions}, e.g. 'DAILY')
         */
        me.addEvents('frequencychange');
        
        /**
         * @cfg {Array} frequencyOptions
         * An array of arrays, each containing the name/value pair that defines a recurring
         * frequency option supported by the frequency combo. This array is bound to the underlying
         * {@link Ext.data.ArrayStore store} to provide the combo list items. Defaults to:
         *
         *    [
         *        ['NONE', this.frequencyText.none],
         *        ['DAILY', this.frequencyText.daily],
         *        ['WEEKDAYS', this.frequencyText.weekdays],
         *        ['WEEKLY', this.frequencyText.weekly],
         *        ['MONTHLY', this.frequencyText.monthly],
         *        ['YEARLY', this.frequencyText.yearly]
         *    ]
         */
        me.frequencyOptions = me.frequencyOptions || [
            ['NONE', me.frequencyText.none],
            ['DAILY', me.frequencyText.daily],
            ['WEEKDAYS', me.frequencyText.weekdays],
            ['WEEKLY', me.frequencyText.weekly],
            ['MONTHLY', me.frequencyText.monthly],
            ['YEARLY', me.frequencyText.yearly]
        ];
        
        me.store = me.store || Ext.create('Ext.data.ArrayStore', {
            fields: ['id', 'pattern'],
            idIndex: 0,
            data: me.frequencyOptions
        });
        
        me.on('select', me.onSelect, me);
        
        me.callParent(arguments);
    },
    
    onSelect: function(combo, records) {
        this.fireEvent('frequencychange', records[0].data.id);
    }
});