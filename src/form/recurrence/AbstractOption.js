/**
 * The abstract base class for all of the recurrence option widgets. Intended to be subclassed.
 * 
 * @private
 */
Ext.define('Extensible.form.recurrence.AbstractOption', {
    
    // TODO: Create Extensible.form.recurrence.Parser and factor all
    //       rrule value getting/setting out of these option classes
    //       and into the parser.
    
    extend: 'Ext.form.FieldContainer',
    
    requires: [
        'Extensible.form.recurrence.Rule'
    ],
    
    mixins: {
        field: 'Ext.form.field.Field'
    },
    
    layout: 'hbox',
    
    defaults: {
        margins: '0 5 0 0'
    },
    
    /**
     * @cfg {Extensible.form.recurrence.Rule} rrule
     * The {@link Extensible.form.recurrence.Rule recurrence Rule} instance underlying this recurrence
     * option widget. This is typically set by the parent {@link Extensible.form.recurrence.Fieldset fieldset}
     * so that the same instance is shared across option widgets.
     */
    rrule: undefined,
    /**
     * @cfg {Date} startDate
     * The start date of the underlying recurrence series. This is not always required, depending on the specific
     * recurrence rules in effect, and will default to the current date if required and not supplied. Like the
     * {@link #rrule} config, this is typically set by the parent {@link Extensible.form.recurrence.Fieldset fieldset}.
     */
    startDate: undefined,
    /**
     * @cfg {Number} startDay
     * The 0-based index for the day on which the calendar week begins (0=Sunday, which is the default).
     * Used anytime a calendar or date picker is displayed within the recurrence options.
     */
    startDay: 0,
    /**
     * Maximum end date allowed when choosing dates from date fields (defaults to 12/31/9999).
     */
    maxEndDate: new Date('12/31/9999'),
    
    key: undefined,
    
    optionDelimiter: ';', //TODO: remove
    
    initComponent: function() {
        var me = this;

        //me.addEvents(
        //    /**
        //     * @event change
        //     * Fires when a user-initiated change is detected in the value of the field.
        //     * @param {Extensible.form.recurrence.AbstractOption} this
        //     * @param {Mixed} newValue The new value
        //     * @param {Mixed} oldValue The old value
        //     */
        //    'change'
        //);

        me.initRRule();
        me.items = me.getItemConfigs();
        
        me.callParent(arguments);
        
        me.initRefs();
        me.initField();
    },
    
    initRRule: function() {
        var me = this;
        
        me.rrule = me.rrule || Ext.create('Extensible.form.recurrence.Rule');
        me.startDate = me.startDate || me.rrule.startDate || Extensible.Date.today();
        
        if (!me.rrule.startDate) {
            me.rrule.setStartDate(me.startDate);
        }
    },
    
    afterRender: function() {
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