Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        "Extensible": "../../src",
        "Extensible.example": ".."
    }
});
Ext.require([
    'Ext.form.Panel',
    'Ext.Button',
    'Ext.form.field.Date',
    'Extensible.form.recurrence.Fieldset'
]);

Ext.onReady(function(){
    var recurField = Ext.createWidget('extensible.recurrencefield', {
        xtype: 'extensible.recurrencefield',
        anchor: '90%',
        listeners: {
            'change': function(field, value) {
                Ext.get('recur-value').update(field.getValue() || '(Empty string)');
                //Ext.get('recur-desc').update(field.getDescription() || '(Empty string)');
            }
        },
        
        // You can provide an explicit width for the frequency combo, or omit it to allow the
        // default anchor setting (as defined in Extensible.form.recurrence.Fieldset) to take effect.
        // Note that this sets the width of the frequency combo ONLY, not the entire enclosing
        // field container (which can be set separately via the standard width or anchor configs).
        frequencyWidth: 181
        
        // You can set the frequency value explicitly, which will also display the
        // associated sub-fields with their default values. If you are using the value
        // config to populate the recurrence field values then this config is not needed
        // (and will be overridden if the value contains a different frequency).
        //, frequency: 'WEEKLY'
        
        // Optionally specify the recurrence start date. It will default to the browser's
        // current date, but in most cases if this recurrence rule is tied to some existing
        // event, the event start date would typically be used to initialize the recurrence field.
        //, startDate: Extensible.Date.add(Extensible.Date.today(), {days: 10})
        
        // You can easily initialize the recurrence field with any supported iCal-formatted
        // RRULE string. This takes the exact same value format as what is saved from the
        // field via getValue() and sets all of the internal fields automatically. Note that
        // certain options like BYDAY, BYMONTHDAY, etc. rely on the corresponding start date
        // to match the expected day -- if they do not match the value for that field will
        // simply be left blank.
        //, value: 'FREQ=WEEKLY;INTERVAL=3;BYDAY=MO,FR'
        //, value: 'FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=4;COUNT=10'
        //, value: 'FREQ=MONTHLY;INTERVAL=3;BYDAY=-1WE'
        //, value: 'FREQ=YEARLY;INTERVAL=3;BYMONTH=2;BYDAY=-1WE'
        //, value: 'FREQ=MONTHLY;INTERVAL=6;BYMONTHDAY=29;UNTIL=20120531T000000Z'
        //, value: 'FREQ=MONTHLY;INTERVAL=6;BYMONTHDAY=29;COUNT=10'
    });
    
    var panel = Ext.create('Ext.form.Panel', {
        renderTo: 'recur-panel',
        title: 'Recurrence Field Tester',
        border: true,
        labelWidth: 70,
        width: 600,
        bodyStyle: 'padding:10px 15px;',
        autoHeight: true,
        frame: true,
        collapsible: true,
        
        items: [{
            xtype: 'datefield',
            fieldLabel: 'Start Date',
            value: new Date(),
            width: 285,
            listeners: {
                'change': function(field) {
                    recurField.setStartDate(field.getValue());
                }
            }
        },
            recurField,
        {
            xtype: 'textfield',
            anchor: '90%',
            fieldLabel: 'Dummy Field',
            emptyText: 'Just to test positioning'
        }],
        
        fbar: [{
            text: 'Disable form',
            handler: function(btn) {
                var disable = (btn.text === 'Disable form');
                
                panel.items.each(function(item) {
                    item[disable ? 'disable' : 'enable']();
                });
                btn.setText(disable ? 'Enable form' : 'Disable form');
            }
        },{
            text: 'Reset form',
            handler: function() {
                panel.items.each(function(item) {
                    item.reset();
                });
            }
        }]
    });
});