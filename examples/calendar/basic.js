Ext.onReady(function(){
    
    var today = new Date().clearTime();
    
    //
    // common data store shared by all calendars on the page
    //
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
        fields: Ext.ensible.cal.EventRecord.prototype.fields.getRange(),
        sortInfo: {
            field: Ext.ensible.cal.EventMappings.StartDate.name,
            direction: 'ASC'
        }
    });
    
    //
    // example 1: simplest possible standalone configuration
    //
    new Ext.ensible.cal.CalendarPanel({
        eventStore: eventStore,
        renderTo: 'simple',
        title: 'Basic Calendar',
        width: 700,
        height: 500
    });
    
    //
    // example 2: shows off some common Ext.Panel configs as well as a 
    // few extra CalendarPanel-specific configs
    //
    new Ext.ensible.cal.CalendarPanel({
        eventStore: eventStore,
        renderTo: 'panel',
        title: 'Calendar with Panel Configs',
        activeItem: 1, // default to week view
        width: 700,
        height: 500,
        // Ext.Panel configs:
        frame: true,
        collapsible: true,
        bbar: [{text: 'A Button'}]
    });
});