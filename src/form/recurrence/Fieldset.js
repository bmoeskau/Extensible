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
        'Extensible.form.recurrence.FrequencyCombo',
        'Extensible.form.recurrence.option.Interval',
        'Extensible.form.recurrence.option.Weekly',
        'Extensible.form.recurrence.option.Monthly',
        'Extensible.form.recurrence.option.Yearly',
        'Extensible.form.recurrence.option.Duration'
    ],
    
    //TODO: implement code to use this config.
    // Maybe use xtypes instead for dynamic loading of custom options?
    // Include secondly/minutely/hourly, plugins for M-W-F, T-Th, weekends
    options: [
        'daily', 'weekly', 'weekdays', 'monthly', 'yearly'
    ],
    
    //TODO: implement
    displayStyle: 'field', // or 'dialog'
    
    fieldLabel: 'Repeats',
    startDate: Ext.Date.clearTime(new Date()),
    enableFx: true,
    monitorChanges: true,
    cls: 'extensible-recur-field',
    
    frequencyWidth: null, // defaults to the anchor value
    
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },
    
    initComponent : function() {
        var me = this;
        
        if (!me.height || me.displayStyle === 'field') {
            delete me.height;
            me.autoHeight = true;
        }
        
        me.items = [{
            xtype: 'extensible.recurrence-frequency',
            hideLabel: true,
            width: this.frequencyWidth,
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
            hideMode: 'offsets',
            hidden: true,
            defaults: {
                hidden: true
            },
            items: [{
                xtype: 'extensible.recurrence-interval',
                itemId: this.id + '-interval'
            },{
                xtype: 'extensible.recurrence-weekly',
                itemId: this.id + '-weekly'
            },{
                xtype: 'extensible.recurrence-monthly',
                itemId: this.id + '-monthly'
            },{
                xtype: 'extensible.recurrence-yearly',
                itemId: this.id + '-yearly'
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
        me.weeklyField = me.down('#' + id + '-weekly');
        me.monthlyField = me.down('#' + id + '-monthly');
        me.yearlyField = me.down('#' + id + '-yearly');
        me.durationField = me.down('#' + id + '-duration');
        
        me.initChangeEvents();
    },
    
    initChangeEvents: function() {
        var me = this;
        
        me.intervalField.on('change', me.onChange, me);
        me.weeklyField.on('change', me.onChange, me);
        me.monthlyField.on('change', me.onChange, me);
        me.yearlyField.on('change', me.onChange, me);
        me.durationField.on('change', me.onChange, me);
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
        
        Ext.defer(me.doLayout, 1, me);
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
        if (this.frequency === 'NONE') {
            return '';
        }
        
        var values,
            itemValue;
        
        if (this.frequency === 'WEEKDAYS') {
            values = ['FREQ=WEEKLY','BYDAY=MO,TU,WE,TH,FR'];
        }
        else {
            values = ['FREQ=' + this.frequency];
        }
        
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
        
        // switch(value) {
            // default:
                // text = 'No recurrence';
        // }
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
        
        if (!value || value === 'NONE') {
            me.frequencyCombo.setValue('NONE');
            me.showOptions('NONE');
            me.checkChange();
            return me;
        }
        
        var parts = value.split(';');
        
        Ext.each(parts, function(part) {
            if (part.indexOf('FREQ') > -1) {
                var freq = part.split('=')[1];
                me.setFrequency(freq);
                me.checkChange();
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
        
        if (freq === 'NONE') {
            // me.innerContainer.items.each(function(item) {
                // item.hide();
            // });
            me.innerContainer.hide();
        }
        else {
            me.intervalField.show();
            me.durationField.show();
            me.innerContainer.show();
        }
        
        switch(freq){
            case 'DAILY':
            case 'WEEKDAYS':
                me.weeklyField.hide();
                me.monthlyField.hide();
                me.yearlyField.hide();
                
                if (freq === 'WEEKDAYS') {
                    unit = 'week';
                }
                break;
            
            case 'WEEKLY':
                me.weeklyField.show();
                me.monthlyField.hide();
                me.yearlyField.hide();
                unit = 'week';
                break;
            
            case 'MONTHLY':
                me.monthlyField.show();
                me.weeklyField.hide();
                me.yearlyField.hide();
                unit = 'month';
                break;
            
            case 'YEARLY':
                me.yearlyField.show();
                me.weeklyField.hide();
                me.monthlyField.hide();
                unit = 'year';
                break;
        }

        me.intervalField.updateLabel(unit);
    }
});