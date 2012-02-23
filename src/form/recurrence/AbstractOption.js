
// TODO: Create Extensible.form.recurrence.Parser and factor all
//       rrule value getting/setting out of these option classes
//       and into the parser.

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
    
    optionDelimiter: ';',
    
    initComponent: function() {
        var me = this;
        
        me.addEvents(
            /**
             * @event change
             * Fires when a user-initiated change is detected in the value of the field.
             * @param {Extensible.form.recurrence.AbstractOption} this
             * @param {Mixed} newValue The new value
             * @param {Mixed} oldValue The old value
             */
            'change'
        );
        me.startDate = me.startDate || new Date();
        me.items = me.getItemConfigs();
        
        me.callParent(arguments);
        
        me.initField();
    },
    
    formatDate: function(date) {
        return Ext.Date.format(date, this.dateValueFormat);
    },
    
    afterRender: function(){
        this.callParent(arguments);
        this.initRefs();
        this.updateLabel();
    },
    
    initRefs: Ext.emptyFn,
    
    updateLabel: Ext.emptyFn,
    
    setStartDate: function(dt) {
        this.startDate = dt;
        this.updateLabel();
        return this;
    },
    
    preSetValue: function(v, readyField) {
        var me = this;
        
        if (!v) {
            me.originalValue = me.lastValue = me.value = undefined;
            return false;
        }
        if (!readyField) {
            me.on('afterrender', function() {
                me.setValue(v);
            }, me, {single: true});
            return false;
        }
        return true;
    }
});