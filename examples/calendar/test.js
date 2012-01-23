Ext.onReady(function() {
    var panel = Ext.create('Ext.panel.Panel', {
        layout: 'fit',
        renderTo: Ext.getBody(),
        tbar: {
            items: [{
                text: 'doit',
                handler: function() {
                    panel.removeAll();
                }
            }]
        },
        width: 800,
        height: 600
    });

    var cal = Ext.create('Extensible.calendar.CalendarPanel', {
        border: false,
        store: Ext.create('Extensible.calendar.data.MemoryEventStore')
    });

    panel.add(cal);
});