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
        'Ext.form.CheckboxGroup',
        'Ext.form.Label',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Checkbox',
        'Ext.layout.container.Card',
        'Extensible.form.recurrence.FrequencyCombo',
        'Extensible.form.recurrence.option.Interval'
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
                defaults: {
                    margins: '0 5 0 0'
                },
                items: [{
                    xtype: 'label',
                    text: 'on:'
                },{
                    xtype: 'checkboxgroup',
                    flex: 1,
                    items: [
                        {boxLabel: 'Sun', inputValue: 'SU', name: this.id + 'SU'},
                        {boxLabel: 'Mon', inputValue: 'MO', name: this.id + 'MO'},
                        {boxLabel: 'Tue', inputValue: 'TU', name: this.id + 'TU'},
                        {boxLabel: 'Wed', inputValue: 'WE', name: this.id + 'WE'},
                        {boxLabel: 'Thu', inputValue: 'TH', name: this.id + 'TH'},
                        {boxLabel: 'Fri', inputValue: 'FR', name: this.id + 'FR'},
                        {boxLabel: 'Sat', inputValue: 'SA', name: this.id + 'SA'}
                    ]
                }]
            },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
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
                    text: 'of each month'
                }]
            },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
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
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    margins: '0 5 0 0'
                },
                items: [{
                    xtype: 'label',
                    text: 'starting on'
                },{
                    xtype: 'datefield'
                }]
            },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    margins: '0 5 0 0'
                },
                items: [{
                    xtype: 'label',
                    text: 'and continuing'
                },{
                    xtype: 'combobox',
                    store: []
                }]
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
        var me = this;
        
        me.innerContainer = me.down('#' + me.id + '-inner-ct');
        me.frequencyCombo = me.down('#' + me.id + '-frequency');
        me.intervalField = me.down('#' + me.id + '-interval');
        
        me.initChangeEvents();
    },
    
    initChangeEvents: function() {
        var me = this;
        
        me.intervalField.on('change', me.onChange, me);
    },
    
    onChange: function() {
        this.fireEvent('change', this, this.getValue());
    },
    
    onFrequencyChange: function(freq) {
        this.showOptions(freq);
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
            me.setValue('NONE');
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
            }, this, {
                single: true
            });
        }
    },
    
    getValue: function(){
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
                if (this.isItemValueValid(itemValue)) {
                    values.push(itemValue);
                }
            }
        }, this);
        
        return values.length > 1 ? values.join(';') : values[0];
    },
    
    getDescription: function() {
        return 'Friendly text : ' + this.getValue();
    },
    
    isItemValueValid: function(value) {
        if (value) {
            if (value === 'INTERVAL=1') {
                // Interval is assumed to be 1 in the spec by default, no need to include it
                return false;
            }
            return true;
        }
        return false;
    },
    
    setValue: function(value){
        var me = this;
        
        me.value = value;
        
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
                me.setFrequency(freq);
            }, me, {
                single: true
            });
        }
        return me;
    },
    
    showOptions: function(o) {
        console.log('selected '+o);
        // var layoutChanged = false,
            // unit = 'day';
//         
        // if(o != 'NONE'){
            // this.hideSubPanels();
        // }
//         
        // switch(o){
            // case 'DAILY':
                // layoutChanged = this.showSubPanel(this.repeatEvery);
                // layoutChanged |= this.showSubPanel(this.until);
                // break;
//                 
            // case 'WEEKLY':
                // layoutChanged = this.showSubPanel(this.repeatEvery);
                // layoutChanged |= this.showSubPanel(this.weekly);
                // layoutChanged |= this.showSubPanel(this.until);
                // unit = 'week';
                // break;
//                 
            // case 'MONTHLY':
                // layoutChanged = this.showSubPanel(this.repeatEvery);
                // layoutChanged |= this.showSubPanel(this.monthly);
                // layoutChanged |= this.showSubPanel(this.until);
                // unit = 'month';
                // break;
//                 
            // case 'YEARLY':
                // layoutChanged = this.showSubPanel(this.repeatEvery);
                // layoutChanged |= this.showSubPanel(this.yearly);
                // layoutChanged |= this.showSubPanel(this.until);
                // unit = 'year';
                // break;
//             
            // default:
                // // case NONE
                // this.hideInnerCt();
                // return; 
        // }
//         
        // if(layoutChanged){
            // this.innerCt.doLayout();
        // }
//         
        // this.showInnerCt();
        // this.repeatEvery.updateLabel(unit);
    },
});