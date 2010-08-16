Ext.ensible.cal.RecurrenceCombo = Ext.extend(Ext.form.ComboBox, {
    width: 160,
    fieldLabel: 'Repeats',
    mode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'pattern',
    valueField: 'id',
    
    recurrenceText: {
        'None': 'Does not repeat',
        'Daily': 'Daily',
        'Weekly': 'Weekly',
        'Monthly': 'Monthly',
        'Yearly': 'Yearly'
    },
    
    initComponent: function(){
        Ext.ensible.cal.RecurrenceCombo.superclass.initComponent.call(this);
        
        this.addEvents('recurrencechange');
        
        this.store = this.store || new Ext.data.ArrayStore({
            fields: ['id', 'pattern'],
            idIndex: 0,
            data: [
                ['NONE', this.recurrenceText.None],
                ['DAILY', this.recurrenceText.Daily],
                ['WEEKLY', this.recurrenceText.Weekly],
                ['MONTHLY', this.recurrenceText.Monthly],
                ['YEARLY', this.recurrenceText.Yearly]
            ]
        });
    },
    
    initValue : function(){
        Ext.ensible.cal.RecurrenceCombo.superclass.initValue.call(this);
        if(this.value != undefined){
            this.fireEvent('recurrencechange', this.value);
        }
    },
    
    setValue : function(v){
        var old = this.value;
        Ext.ensible.cal.RecurrenceCombo.superclass.setValue.call(this, v);
        if(old != v){
            this.fireEvent('recurrencechange', v);
        }
        return this;
    }
});

Ext.reg('extensible.recurrencecombo', Ext.ensible.cal.RecurrenceCombo);
