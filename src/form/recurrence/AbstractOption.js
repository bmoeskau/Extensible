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
        this.addEvents(
            /**
             * @event change
             * Fires when a user-initiated change is detected in the value of the field.
             * @param {Extensible.form.recurrence.AbstractOption} this
             * @param {Mixed} newValue The new value
             */
            'change'
        );
        this.callParent();
        this.initField();
    },
    
    onChange: function(field, value, oldValue) {
        this.setValue(value);
        this.fireEvent('change', this, this.getValue());
    },
    
    setStartDate: function(dt) {
        this.startDate = dt;
        
        if (this.updateLabel) {
            this.updateLabel();
        }
        return this;
    }
});