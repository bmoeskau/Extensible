Ext.onReady(function(){
    var recurField = new Ext.ensible.cal.RecurrenceField({
        id: 'recurrence',
        frequency: 'WEEKLY',
        
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
    
    new Ext.form.FormPanel({
        renderTo: 'recur-panel',
        title: 'Recurrence Pattern',
        border: true,
        labelWidth: 70,
        width: 600,
        bodyStyle: 'padding:10px 15px;',
        autoHeight: true,
        items: recurField
    })
    
    var startDt = new Ext.form.DateField({
        renderTo: 'recur-dt',
        value: new Date()
    });
    
    new Ext.Button({
        text: 'Refresh Panel',
        renderTo: 'recur-dt',
        handler: function(){
            recurField.setStartDate(startDt.getValue());
        }
    });
    
    var pattern = new Ext.form.TextField({
        id: 'recur-pattern-text',
        renderTo: 'recur-pattern',
        width: 500
    });
    
    new Ext.Button({
        text: 'Get value from field',
        renderTo: 'recur-pattern',
        handler: function(){
            pattern.setValue(recurField.getValue());
        }
    });
    
    new Ext.Button({
        text: 'Set value into field',
        renderTo: 'recur-pattern',
        handler: function(){
            recurField.setValue(pattern.getValue());
        }
    });
    
    pattern.setValue(recurField.getValue());
});