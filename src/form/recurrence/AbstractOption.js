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
    
    dateValueFormat: 'Ymd\\T000000\\Z',
    
    initComponent: function() {
        var me = this;
        
        me.addEvents(
            /**
             * @event change
             * Fires when a user-initiated change is detected in the value of the field.
             * @param {Extensible.form.recurrence.AbstractOption} this
             * @param {Mixed} newValue The new value
             */
            'change'
        );
        me.startDate = me.startDate || new Date();
        me.items = me.getItemConfigs();
        
        me.callParent(arguments);
        
        me.initField();
    },
    
    afterRender: function(){
        this.callParent(arguments);
        this.initRefs();
        this.updateLabel();
    },
    
    initRefs: Ext.emptyFn,
    
    updateLabel: Ext.emptyFn,
    
    onChange: function(field, value, oldValue) {
        this.setValue(value);
        this.fireEvent('change', this, this.getValue());
    },
    
    setStartDate: function(dt) {
        this.startDate = dt;
        this.updateLabel();
        return this;
    }
});