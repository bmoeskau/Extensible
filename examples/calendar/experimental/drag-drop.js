Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        "Extensible": "../../../src",
        "Extensible.example": "../.."
    }
});
Ext.require([
    'Ext.layout.container.Border',
    'Ext.grid.Panel',
    'Ext.data.ArrayStore',
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
    
    var jobStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
            { name: 'title' },
            { name: 'cid', type: 'integer' }
        ],
        data: [
            ['Walk the dog', 1],
            ['Clean the house', 1], 
            ['Finish TPS reports', 2], 
            ['Do homework', 3]
        ]
    });
    
    var calendarCfg = {
        xtype: 'extensible.calendarpanel',
        eventStore: eventStore,
        calendarStore: calendarStore,
        title: 'Calendar',
        viewConfig: {
            // enable dd sharing with the grid
            ddGroup: 'jobsExampleDD'
        },
        // we're adding to a border layout below, so no need for height/width.
        // just assign the region and the layout will handle the rest.
        region: 'center'
    };
    
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
        id: 'jobs-grid',
        title: 'Available Chores',
        store: jobStore,

        viewCfg: {
            forceFit: true,
            // enable dd sharing with the calendar
            plugins: {
                ptype: 'gridviewdragdrop',
                enableDrop: false,
                ddGroup: 'jobsExampleDD'
            }
        },
        // layout configs:
        region: 'west',
        split: true,
        width: 200,
        minWidth: 100,
        maxWidth: 300,

        columns: [{
            header: 'Calendar',
            width: 75,
            dataIndex: 'cid',
            renderer: calendarRenderer
        },{
            header: 'Description',
            width: 120,
            dataIndex: 'title'
        }]
    };
    
    Ext.create('Ext.Panel', {
        renderTo: 'ct',
        layout: 'border',
        height: 500,
        width: 800,
        border: false,
        items: [
            gridCfg,
            calendarCfg
        ]
    });
    
});