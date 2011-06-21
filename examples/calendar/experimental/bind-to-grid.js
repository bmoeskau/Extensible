Ext.require([
    'Ext.grid.Panel',
    'Ext.layout.container.Border',
    'Extensible.calendar.data.MemoryCalendarStore',
    'Extensible.calendar.data.MemoryEventStore',
    'Extensible.calendar.CalendarPanel',
    'Extensible.example.calendar.data.Calendars',
    'Extensible.example.calendar.data.Events'
]);

Ext.onReady(function(){
    
    var calendarStore = Ext.create('Extensible.calendar.data.MemoryCalendarStore', {
        // defined in ../data/Calendars.js
        data: Ext.create('Extensible.example.calendar.data.Calendars')
    });
    
    var eventStore = Ext.create('Extensible.calendar.data.MemoryEventStore', {
        // defined in ../data/Events.js
        data: Ext.create('Extensible.example.calendar.data.Events')
    });
    
    var calendarCfg = {
        xtype: 'calendarpanel',
        eventStore: eventStore,
        calendarStore: calendarStore,
        title: 'Calendar',
        // we're adding to a border layout below, so no need for height/width.
        // just assign the region and the layout will handle the rest.
        region: 'center'
    };
    
    // grid-specific stuff
    var gridDateFmt = 'M n, ' + (Extensible.Date.use24HourTime ? 'G:i' : 'ga'),
        calendarRenderer = function(calendarId) {
            if (calendarId) {
                var CalendarMappings = Extensible.calendar.data.CalendarMappings,
                    rec = calendarStore.findRecord(CalendarMappings.CalendarId.name, calendarId);
                
                // the "x-cal-[color id]" classes just set the foreground color to the calendar color
                return Ext.String.format('<span class="x-cal-{0}">{1}</span>', 
                        rec.data[CalendarMappings.ColorId.name], rec.data[CalendarMappings.Title.name]);
            }
        };
    
    var EventMappings = Extensible.calendar.data.EventMappings;
    
    var gridCfg = {
        xtype: 'grid',
        title: 'Event Grid',
        store: eventStore,
        autoExpandColumn: 'title',
        viewCfg: {
            forceFit: true
        },
        
        // layout configs:
        region: 'west',
        split: true,
        width: 400,
        minWidth: 200,
        maxWidth: 600,

        columns: [{
            dataIndex: EventMappings.EventId.name,
            header: 'Event ID',
            width: 50,
            hidden: true
        },{
            dataIndex: EventMappings.CalendarId.name,
            header: 'Calendar', 
            sortable: true,
            width: 65,
            renderer: calendarRenderer
        },{
            dataIndex: EventMappings.Title.name,
            header: 'Title',
            sortable : true
        },{
            dataIndex: EventMappings.StartDate.name,
            header: 'Start',
            width: 75,
            renderer: Ext.util.Format.dateRenderer(gridDateFmt),
            sortable: true
        },{
            dataIndex: EventMappings.EndDate.name,
            header: 'End',
            width: 75,
            renderer: Ext.util.Format.dateRenderer(gridDateFmt),
            sortable: true
        }]
    };
    
    Ext.create('Ext.Panel', {
        renderTo: 'ct',
        layout: 'border',
        height: 500,
        width: 900,
        border: false,
        items: [
            gridCfg,
            calendarCfg
        ]
    });
});