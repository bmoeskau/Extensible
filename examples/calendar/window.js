Ext.onReady(function(){
    var showWindow = function(){
        if(!this.calendarWin){
            this.calendarWin = new Ext.Window({
                layout: 'fit',
                title: 'Calendar Window',
                width: 850,
                height: 700,
                modal: true,
                closeAction: 'hide',
                items: {
                    // xtype is supported:
                    xtype: 'extensible.calendarpanel',
                    eventStore: new Ext.ensible.sample.MemoryEventStore({
                        // defined in data/events.js
                        data: Ext.ensible.sample.EventData
                    })
                }
            });
        }
        this.calendarWin.show();
    };
    
    Ext.fly('cal-win').on('click', showWindow, this);
    
    showWindow();
});