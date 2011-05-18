Ext.onReady(function(){
    
    var calendarStore = new Ext.ensible.sample.CalendarStore({
        // defined in data/calendars.js
        data: Ext.ensible.sample.CalendarData
    });
    
    var eventStore = new Ext.ensible.sample.MemoryEventStore({
        // defined in data/events.js
        data: Ext.ensible.sample.EventData
    });
    
    var calendarCfg = {
        xtype: 'extensible.calendarpanel',
        eventStore: eventStore,
        calendarStore: calendarStore,
        title: 'Calendar',
        // we're adding to a border layout below, so no need for height/width.
        // just assign the region and the layout will handle the rest.
        region: 'center'
    };
    
    // grid-specific stuff
    var gridDateFmt = 'M n, ' + (Ext.ensible.Date.use24HourTime ? 'G:i' : 'ga'),
        calendarRenderer = function(val) {
            if (val) {
                var M = Ext.ensible.cal.CalendarMappings,
                    rec = calendarStore.getById(val);
                
                // the "x-cal-[color id]" classes just set the foreground color to the calendar color
                return String.format('<span class="x-cal-{0}">{1}</span>', rec.data[M.ColorId.name], rec.data[M.Title.name]);
            }
        };
    
    var gridCfg = {
        xtype: 'grid',
        title: 'Event Grid',
        store: eventStore,
        stripeRows: true,
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
            id: 'id',
            header: 'Event ID',
            width: 50,
            hidden: true
        },{
            id: 'cid',
            header: 'Calendar', 
            sortable: true,
            width: 65,
            renderer: calendarRenderer
        },{
            id: 'title',
            header: 'Title',
            sortable : true
        },{
            id: 'start',
            header: 'Start',
            width: 75,
            renderer: Ext.util.Format.dateRenderer(gridDateFmt),
            sortable: true
        },{
            id: 'end',
            header: 'End',
            width: 75,
            renderer: Ext.util.Format.dateRenderer(gridDateFmt),
            sortable: true
        }]
    };
    
    new Ext.Panel({
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