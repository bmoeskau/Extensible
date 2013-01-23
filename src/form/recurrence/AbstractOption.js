
// TODO: Create Extensible.form.recurrence.Parser and factor all
//       rrule value getting/setting out of these option classes
//       and into the parser.

Ext.define('Extensible.form.recurrence.AbstractOption', {
    extend: 'Ext.form.FieldContainer',
    
    requires: [
        'Extensible.form.recurrence.Parser'
    ],
    
    mixins: {
        field: 'Ext.form.field.Field'
    },
    
    layout: 'hbox',
    
    defaults: {
        margins: '0 5 0 0'
    },
    
    key: undefined,
    
    optionDelimiter: ';', //TODO: remove
    
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
        
        me.initRefs();
        me.initField();
    },
    
    getDateValueFormat: function() {
        return Extensible.form.recurrence.Parser.dateValueFormat;
    },
    
    formatDate: function(date) {
        return Ext.Date.format(date, this.getDateValueFormat());
    },
    
    parseDate: function(dateString, options) {
        options = options || {};
        
        try {
            var date = Ext.Date.parse(dateString, options.format || this.getDateValueFormat(), options.strict);
            if (date) {
                return date;
            }
        }
        catch(ex) {}
        
        return options.defaultValue || new Date();
    },
    
    afterRender: function(){
        this.callParent(arguments);
        this.updateLabel();
    },
    
    initRefs: Ext.emptyFn,
    
    setFrequency: function(freq) {
        this.frequency = freq;
    },
    
    setStartDate: function(dt) {
        this.startDate = dt;
        return this;
    },
    
    getStartDate: function() {
        return this.startDate || Extensible.Date.today();
    },
    
    getDefaultValue: function() {
        return '';
    },
    
    preSetValue: function(v, readyField) {
        var me = this;
        
        if (!v) {
            v = me.getDefaultValue();
        }
        if (!readyField) {
            me.on('afterrender', function() {
                me.setValue(v);
            }, me, {single: true});
            return false;
        }
        
        me.value = v;
        
        return true;
    }
});