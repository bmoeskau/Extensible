Ext.onReady(function(){
    
    var C = Ext.ensible.cal, // just save some typing
        today = new Date().clearTime();
    
    var eventStore = new Ext.data.JsonStore({
        id: 'eventStore',
        data: [{
            "id":100,
            "title":"Vacation",
            // this event spans multiple days so it will automatically be rendered as all-day
            "start":today.add(Date.DAY, -5).add(Date.HOUR, 10),
            "end":today.add(Date.DAY, 5).add(Date.HOUR, 15),
            "notes":"Have fun"
        },{
            "id":101,
            "title":"Lunch with Matt",
            "start":today.add(Date.HOUR, 11).add(Date.MINUTE, 30),
            "end":today.add(Date.HOUR, 13),
            "loc":"Chuy's!",
            "url":"http://chuys.com",
            "notes":"Order the queso",
            "rem":"15"
        },{
            "id":102,
            "title":"Brian's birthday",
            "start":today.add(Date.HOUR, 15),
            "end":today.add(Date.HOUR, 15),
            "ad":true // explicit all-day event
        },{
            // id, start and end dates are the only truly required data elements to render an event:
            "id":103,
            "start":today.add(Date.HOUR, 15),
            "end":today.add(Date.HOUR, 15)
        }],
        proxy: new Ext.data.MemoryProxy(),
        fields: C.EventRecord.prototype.fields.getRange(),
        sortInfo: {
            field: C.EventMappings.StartDate.name,
            direction: 'ASC'
        }
    });
    
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