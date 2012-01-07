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
    
    initComponent: function(){
        this.addEvents('recurrencechange');
        
        this.store = this.store || Ext.create('Ext.data.ArrayStore', {
            fields: ['id', 'pattern'],
            idIndex: 0,
            data: [
                ['NONE', this.recurrenceText.none],
                ['DAILY', this.recurrenceText.daily],
                ['WEEKLY', this.recurrenceText.weekly],
                ['MONTHLY', this.recurrenceText.monthly],
                ['YEARLY', this.recurrenceText.yearly]
            ]
        });
        
        this.callParent(arguments);
    },
    
    initValue : function(){
        this.callParent(arguments);
        
        if(this.value != undefined){
            this.fireEvent('recurrencechange', this.value);
        }
    },
    
    setValue : function(v){
        var old = this.value;
        
        this.callParent(arguments);
        
        if(old != v){
            this.fireEvent('recurrencechange', v);
        }
        return this;
    }
});