Ext.define('Extensible.form.recurrence.AbstractOption', {
    extend: 'Ext.form.FieldContainer',
    
    mixins: {
        field: 'Ext.form.field.Field'
    },
    
    layout: 'hbox',
    defaults: {
        margins: '0 5 0 0'
    },
    
    key: undefined,
    
    initComponent: function() {
        this.callParent();
        this.initField();
    },
    
    setStartDate: function(dt) {
        this.startDate = dt;
        
        if (this.updateLabel) {
            this.updateLabel();
        }
        return this;
    }
});