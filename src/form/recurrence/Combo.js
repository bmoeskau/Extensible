/* @private
 * Currently not used
 */
Ext.define('Extensible.form.recurrence.Combo', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.extensible.recurrencecombo',
    
    requires: ['Ext.data.ArrayStore'],
    
    width: 160,
    fieldLabel: 'Repeats',
    mode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'pattern',
    valueField: 'id',
    
    recurrenceText: {
        none: 'Does not repeat',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        yearly: 'Yearly'
    },
    
    initComponent: function() {
        var me = this;
        
        /**
         * @event recurrencechange
         * Fires when a recurrence list item is selected.
         * @param {Extensible.form.recurrence.Combo} combo This combo box
         * @param {String} value The selected recurrence value (one of the values from )
         */
        me.addEvents('recurrencechange');
        
        /**
         * @cfg {Array} recurrenceOptions
         * An array of arrays, each containing the name/value pair that defines a recurrence
         * option supported by the recurrence combo. This array is bound to the underlying
         * {@link Ext.data.ArrayStore store} to provide the combo list items. Defaults to:
         * 
         *    [
         *        ['NONE', this.recurrenceText.none],
         *        ['DAILY', this.recurrenceText.daily],
         *        ['WEEKLY', this.recurrenceText.weekly],
         *        ['MONTHLY', this.recurrenceText.monthly],
         *        ['YEARLY', this.recurrenceText.yearly]
         *    ]
         */
        me.recurrenceOptions = me.recurrenceOptions || [
            ['NONE', me.recurrenceText.none],
            ['DAILY', me.recurrenceText.daily],
            ['WEEKLY', me.recurrenceText.weekly],
            ['MONTHLY', me.recurrenceText.monthly],
            ['YEARLY', me.recurrenceText.yearly]
        ];
        
        me.store = me.store || Ext.create('Ext.data.ArrayStore', {
            fields: ['id', 'pattern'],
            idIndex: 0,
            data: me.recurrenceOptions
        });
        
        me.on('select', me.onSelect, me);
        
        me.callParent(arguments);
    },
    
    onSelect: function(combo, records) {
        this.fireEvent('recurrencechange', records[0].data.id);
    }
});