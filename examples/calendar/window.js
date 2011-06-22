Ext.require([
    'Ext.Window',
    'Extensible.calendar.data.MemoryEventStore',
    'Extensible.calendar.CalendarPanel',
    'Extensible.example.calendar.data.Events'
]);

Ext.onReady(function(){
    var showWindow = function(){
        if(!this.calendarWin){
            this.calendarWin = Ext.create('Ext.Window', {
                layout: 'fit',
                title: 'Calendar Window',
                width: 850,
                height: 700,
                modal: true,
                closeAction: 'hide',
                items: {
                    // xtype is supported:
                    xtype: 'extensible.calendarpanel',
                    eventStore: Ext.create('Extensible.calendar.data.MemoryEventStore', {
                        // defined in ../data/Events.js
                        data: Ext.create('Extensible.example.calendar.data.Events')
                    })
                }
            });
        }
        this.calendarWin.show();
    };
    
    Ext.fly('cal-win').on('click', showWindow, this);
    
    showWindow();
});