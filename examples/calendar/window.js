Ext.onReady(function(){
    
    var eventStore = new Ext.ensible.ux.MemoryEventStore({data: eventList});
    
    var showWindow = function(){
        if(!this.calendarWin){
            this.calendarWin = new Ext.Window({
                layout: 'fit',
                title: 'Calendar Window',
                width: 700,
                height: 500,
                modal: true,
                closeAction: 'hide',
                animateTarget: 'cal-win',
                items: {
                    // xtype is supported:
                    xtype: 'extensible.calendarpanel',
                    eventStore: eventStore
                }
            });
        }
        this.calendarWin.show();
    };
    
    Ext.fly('cal-win').on('click', showWindow, this);
});