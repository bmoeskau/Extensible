/* @private
 * Currently not used
 * Rrule info: http://www.kanzaki.com/docs/ical/rrule.html
 */
Ext.define('Extensible.form.recurrence.Fieldset', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.extensible.recurrencefield',
    
    mixins: {
        field: 'Ext.form.field.Field'
    },
    
    requires: [
        'Ext.form.Label',
        'Ext.form.field.ComboBox',
        'Extensible.form.recurrence.FrequencyCombo',
        'Extensible.form.recurrence.option.Interval',
        'Extensible.form.recurrence.option.ByDay',
        'Extensible.form.recurrence.option.Monthly',
        'Extensible.form.recurrence.option.Duration'
    ],
    
    fieldLabel: 'Repeats',
    startDate: Ext.Date.clearTime(new Date()),
    enableFx: true,
    monitorChanges: true,
    cls: 'extensible-recur-field',
    
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },
    
    initComponent : function() {
        var me = this;
        
        if (!me.height) {
            me.autoHeight = true;
        }
        
        me.items = [{
            xtype: 'extensible.recurrence-frequency',
            hideLabel: true,
            itemId: this.id + '-frequency',
            
            listeners: {
                'frequencychange': {
                    fn: this.onFrequencyChange,
                    scope: this
                }
            }
        },{
            xtype: 'container',
            itemId: this.id + '-inner-ct',
            cls: 'extensible-recur-inner-ct',
            autoHeight: true,
            layout: 'anchor',
            
            items: [{
                xtype: 'extensible.recurrence-interval',
                itemId: this.id + '-interval'
            },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                itemId: this.id + '-start-date',
                defaults: {
                    margins: '0 5 0 0'
                },
                items: [{
                    xtype: 'label',
                    text: 'beginning'
                },{
                    xtype: 'datefield'
                }]
            },{
                xtype: 'extensible.recurrence-byday',
                itemId: this.id + '-byday'
            },{
                xtype: 'extensible.recurrence-monthly',
                itemId: this.id + '-monthly'
            },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                itemId: this.id + '-yearly',
                defaults: {
                    margins: '0 5 0 0'
                },
                items: [{
                    xtype: 'label',
                    text: 'on the'
                },{
                    xtype: 'combobox',
                    store: []
                },{
                    xtype: 'label',
                    text: 'each year'
                }]
            },{
                xtype: 'extensible.recurrence-duration',
                itemId: this.id + '-duration'
            }]
        }];
        
        me.callParent(arguments);
        
        me.initField();
    },
    
    afterRender: function() {
        this.callParent(arguments);
        this.initRefs();
    },
    
    initRefs: function() {
        var me = this,
            id = me.id;
        
        me.innerContainer = me.down('#' + id + '-inner-ct');
        me.frequencyCombo = me.down('#' + id + '-frequency');
        me.intervalField = me.down('#' + id + '-interval');
        me.byDayField = me.down('#' + id + '-byday');
        me.monthlyField = me.down('#' + id + '-monthly');
        me.yearlyField = me.down('#' + id + '-yearly');
        me.startDateField = me.down('#' + id + '-start-date');
        me.durationField = me.down('#' + id + '-duration');
        
        me.initChangeEvents();
    },
    
    initChangeEvents: function() {
        var me = this;
        
        me.intervalField.on('change', me.onChange, me);
        me.byDayField.on('change', me.onChange, me);
    },
    
    onChange: function() {
        this.fireEvent('change', this, this.getValue());
    },
    
    onFrequencyChange: function(freq) {
        this.setFrequency(freq);
        this.onChange();
    },
    
    // private
    initValue: function(){
        var me = this;

        me.originalValue = me.lastValue = me.value;

        // Set the initial value - prevent validation on initial set
        me.suspendCheckChange++;
        
        me.setStartDate(me.startDate);
        
        if (me.value !== undefined) {
            me.setValue(me.value);
        }
        else if (me.frequency !== undefined) {
            me.setValue('FREQ=' + me.frequency);
        }
        else{
            me.setValue('');
        }
        me.suspendCheckChange--;
        
        me.onChange();
    },
    
    setStartDate: function(dt) {
        this.startDate = dt;
        
        if (this.innerContainer) {
            this.innerContainer.items.each(function(item) {
                if (item.setStartDate) {
                    item.setStartDate(dt);
                }
            });
        }
        else {
            this.on('afterrender', function() {
                this.setStartDate(dt);
            }, this, {single: true});
        }
    },
    
    getValue: function() {
        if (!this.innerContainer) {
            return this.value;
        }
        if (this.frequency == 'NONE') {
            return '';
        }
        
        var values = ['FREQ=' + this.frequency],
            itemValue;
        
        this.innerContainer.items.each(function(item) {
            if(item.isVisible() && item.getValue){
                itemValue = item.getValue();
                if (this.includeItemValue(itemValue)) {
                    values.push(itemValue);
                }
            }
        }, this);
        
        return values.length > 1 ? values.join(';') : values[0];
    },
    
    includeItemValue: function(value) {
        if (value) {
            if (value === 'INTERVAL=1') {
                // Interval is assumed to be 1 in the spec by default, no need to include it
                return false;
            }
            var day = Ext.Date.format(this.startDate, 'D').substring(0,2).toUpperCase();
            if (value === ('BYDAY=' + day)) {
                // BYDAY is only required if different from the pattern start date
                return false;
            }
            return true;
        }
        return false;
    },
    
    getDescription: function() {
        var value = this.getValue(),
            text = '';
        
        switch(value) {
            default:
                text = 'No recurrence';
        }
        return 'Friendly text : ' + text;
    },
    
    setValue: function(value){
        var me = this;
        
        me.value = (!value || value === 'NONE' ? '' : value); 
        
        if (!me.frequencyCombo || !me.innerContainer) {
            me.on('afterrender', function() {
                me.setValue(value);
            }, me, {
                single: true
            });
            return;
        }
        
        if (!value || value == 'NONE') {
            me.frequencyCombo.setValue('NONE');
            me.showOptions('NONE');
            return me;
        }
        
        var parts = value.split(';');
        
        Ext.each(parts, function(part) {
            if (part.indexOf('FREQ') > -1) {
                var freq = part.split('=')[1];
                me.setFrequency(freq);
                return;
            }
        }, me);
        
        me.innerContainer.items.each(function(item) {
            if (item.setValue) {
                item.setValue(parts);
            }
        });
        
        me.checkChange();
        
        return me;
    },
    
    setFrequency: function(freq) {
        var me = this;
        
        me.frequency = freq;
        
        if (me.frequencyCombo) {
            me.frequencyCombo.setValue(freq);
            me.showOptions(freq);
        }
        else {
            me.on('afterrender', function() {
                me.frequencyCombo.setValue(freq);
                me.showOptions(freq);
            }, me, {single: true});
        }
        return me;
    },
    
    showOptions: function(freq) {
        var me = this,
            unit = 'day';
        
        if(freq === 'NONE'){
            me.innerContainer.items.each(function(item) {
                item.hide();
            });
        }
        else {
            me.intervalField.show();
            me.durationField.show();
            //me.startDateField.show();
        }
        
        me.byDayField.hide();
        me.monthlyField.hide();
        me.yearlyField.hide();
        
        switch(freq){
            case 'DAILY':
                break;
            
            case 'WEEKDAYS':
                unit = 'week';
                break;
            
            case 'WEEKLY':
                me.byDayField.show();
                unit = 'week';
                break;
            
            case 'MONTHLY':
                me.monthlyField.show();
                unit = 'month';
                break;
            
            case 'YEARLY':
                me.yearlyField.show();
                unit = 'year';
                break;
        }
        
        me.doComponentLayout();
        me.intervalField.updateLabel(unit);
    },
});