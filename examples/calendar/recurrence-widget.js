Ext.require([
    'Ext.form.Panel',
    'Ext.Button',
    'Ext.form.field.Date',
    'Extensible.form.recurrence.Fieldset'
]);

Ext.onReady(function(){
    var recurField = Ext.createWidget('extensible.recurrencefield', {
        xtype: 'extensible.recurrencefield',
        id: 'recurrence',
        frequency: 'WEEKLY',
        anchor: '90%',
        
        //value: 'FREQ=WEEKLY;INTERVAL=3;BYDAY=MO,FR'
        //value: 'FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=4;COUNT=10'
        value: 'FREQ=MONTHLY;INTERVAL=3;BYDAY=1FR'
        //value: 'FREQ=MONTHLY;INTERVAL=6;BYMONTHDAY=7;COUNT=8'
        //value: 'FREQ=MONTHLY;INTERVAL=6;BYMONTHDAY=7;UNTIL=20110531T000000Z'
        
        // optionally specify the recurrence start date:
        //startDate: new Date().add(Date.DAY, 10),
        
        // defaults to autoHeight, but you can optionally fix the height:
        //height: 110,
        
        // disable slide effect when hiding/showing sub-fields:
        //enableFx: false
    });
    
    Ext.create('Ext.form.Panel', {
        renderTo: 'recur-panel',
        title: 'Recurrence Pattern',
        border: true,
        labelWidth: 70,
        width: 600,
        bodyStyle: 'padding:10px 15px;',
        autoHeight: true,
        items: [recurField, {
            xtype: 'textfield',
            disabled: true,
            anchor: '90%',
            fieldLabel: 'Dummy Field',
            value: 'Just to test positioning'
        }]
    });
    
    var startDt = Ext.create('Ext.form.field.Date', {
        renderTo: 'recur-dt',
        value: new Date()
    });
    
    Ext.create('Ext.Button', {
        text: 'Refresh Panel',
        renderTo: 'recur-dt',
        handler: function(){
            recurField.setStartDate(startDt.getValue());
        }
    });
    
    var btn = Ext.create('Ext.Button', {
        text: 'Show the iCal string',
        renderTo: Ext.getBody(),
        
        handler: function(){
            var pattern = Ext.get('recur-pattern');
            if(!pattern.isVisible()){
                pattern.slideIn('t', {duration:.25});
                btn.setText('Refresh the iCal string');
            }
            var v = recurField.getValue();
            pattern.update(v.length > 0 ? v : '(Empty)');
        }
    });
});