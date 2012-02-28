Ext.define('Extensible.form.recurrence.option.Duration', {
    extend: 'Extensible.form.recurrence.AbstractOption',
    alias: 'widget.extensible.recurrence-duration',
    
    requires: [
        'Ext.form.Label',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Number',
        'Ext.form.field.Date'
    ],
    
    minOccurrences: 1,
    
    maxOccurrences: 999,
    
    maxEndDate: new Date('12/31/9999'),
    
    endDateWidth: 120,
    
    cls: 'extensible-recur-duration',
    
    //endDateFormat: null, // inherit by default
    
    getItemConfigs: function() {
        var me = this;
        
        return [{
            xtype: 'label',
            text: 'and continuing'
        },{
            xtype: 'combo',
            itemId: me.id + '-duration-combo',
            mode: 'local',
            width: 85,
            triggerAction: 'all',
            forceSelection: true,
            value: 'forever',
            store: ['forever', 'for', 'until'],
            listeners: {
                'change': Ext.bind(me.onComboChange, me)
            }
        },{
            xtype: 'datefield',
            itemId: me.id + '-duration-date',
            showToday: false,
            width: me.endDateWidth,
            format: me.endDateFormat || Ext.form.field.Date.prototype.format,
            maxValue: me.maxEndDate,
            allowBlank: false,
            hidden: true,
            listeners: {
                'change': Ext.bind(me.onEndDateChange, me)
            }
        },{
            xtype: 'numberfield',
            itemId: me.id + '-duration-num',
            value: 5,
            width: 55,
            minValue: me.minOccurrences,
            maxValue: me.maxOccurrences,
            allowBlank: false,
            hidden: true,
            listeners: {
                'change': Ext.bind(me.onOccurrenceCountChange, me)
            }
        },{
            xtype: 'label',
            itemId: me.id + '-duration-num-label',
            text: 'occurrences',
            hidden: true
        }];
    },
    
    initRefs: function() {
        var me = this;
        me.untilCombo = me.down('#' + me.id + '-duration-combo');
        me.untilDateField = me.down('#' + me.id + '-duration-date');
        me.untilNumberField = me.down('#' + me.id + '-duration-num');
        me.untilNumberLabel = me.down('#' + me.id + '-duration-num-label');
    },
    
    onComboChange: function(combo, value) {
        this.toggleFields(value);
        this.checkChange();
    },
    
    toggleFields: function(toShow) {
        var me = this;
        
        me.untilCombo.setValue(toShow);
        
        if (toShow === 'until') {
            if (!me.untilDateField.getValue()) {
                me.initUntilDate();
            }
            me.untilDateField.show();
        }
        else {
            me.untilDateField.hide();
        }
        
        if (toShow === 'for') {
            me.untilNumberField.show();
            me.untilNumberLabel.show();
        }
        else {
            // recur forever
            me.untilNumberField.hide();
            me.untilNumberLabel.hide();
        }
    },
    
    initUntilDate: function() {
        var dt = this.startDate || Extensible.Date.today;
        this.untilDateField.setValue(Ext.Date.add(dt, Ext.Date.DAY, 5));
        this.untilDateField.setMinValue(Ext.Date.add(dt, Ext.Date.DAY, 1));
    },
    
    onOccurrenceCountChange: function(field, value, oldValue) {
        this.checkChange();
    },
    
    onEndDateChange: function(field, value, oldValue) {
        this.checkChange();
    },
    
    getValue: function() {
        var me = this;
        
        // sanity check that child fields are available first
        if (me.untilCombo) {
            if (me.untilNumberField.isVisible()) {
                return 'COUNT=' + me.untilNumberField.getValue();
            }
            else if (me.untilDateField.isVisible()) {
                return 'UNTIL=' + me.formatDate(me.untilDateField.getValue());
            }
        }
        return '';
    },
    
    setValue: function(v) {
        var me = this;
        
        if (!me.preSetValue(v, me.untilCombo)) {
            return me;
        }
        var options = Ext.isArray(v) ? v : v.split(me.optionDelimiter),
            parts;

        Ext.each(options, function(option) {
            parts = option.split('=');
            
            if (parts[0] === 'COUNT') {
                me.untilNumberField.setValue(parts[1]);
                me.toggleFields('for');
                return;
            }
            else if (parts[0] === 'UNTIL') {
                me.untilDateField.setValue(me.formatDate(parts[1]));
                me.toggleFields('until');
                return;
            }
            else {
                me.toggleFields('forever');
            }
        }, me);
        
        return me;
    }
});
