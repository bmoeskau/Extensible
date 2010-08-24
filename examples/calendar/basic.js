Ext.onReady(function(){
    
    var today = new Date().clearTime();
    
    var eventStore = new Ext.data.JsonStore({
        id: 'eventStore',
        data: [{
            "title":"Vacation",
            // this event spans multiple days so it will automatically be rendered as all-day
            "start":today.add(Date.DAY, -5).add(Date.HOUR, 10),
            "end":today.add(Date.DAY, 5).add(Date.HOUR, 15),
            "notes":"Have fun"
        },{
            "title":"Lunch with Matt",
            "start":today.add(Date.HOUR, 11).add(Date.MINUTE, 30),
            "end":today.add(Date.HOUR, 13),
            "loc":"Chuy's!",
            "url":"http://chuys.com",
            "notes":"Order the queso",
            "rem":"15"
        },{
            "title":"Brian's birthday",
            "start":today.add(Date.HOUR, 15),
            "end":today.add(Date.HOUR, 15),
            "ad":true // explicit all-day event
        },{
            // start and end dates are the only truly required data elements to render an event:
            "start":today.add(Date.HOUR, 15),
            "end":today.add(Date.HOUR, 15)
        }],
        proxy: new Ext.data.MemoryProxy(),
        fields: Ext.ensible.cal.EventRecord.prototype.fields.getRange(),
        sortInfo: {
            field: Ext.ensible.cal.EventMappings.StartDate.name,
            direction: 'ASC'
        }
    });
    
    new Ext.ensible.cal.CalendarPanel({
        eventStore: eventStore,
        renderTo: 'basic-cal',
        title: 'Basic Calendar',
        width: 800,
        height: 600
    });
});