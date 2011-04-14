Ext.onReady(function(){
    
    var calendarStore = new Ext.ensible.sample.CalendarStore({
        // defined in data/calendars.js
        data: Ext.ensible.sample.CalendarData
    });
    
    var eventStore = new Ext.ensible.sample.MemoryEventStore({
        // we'll start without events for this example
    });
    
    var jobStore = new Ext.data.ArrayStore({
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
        id: 'jobs-grid',
        title: 'Available Chores',
        store: jobStore,
        stripeRows: true,
        //autoExpandColumn: 'title',
        viewCfg: {
            forceFit: true
        },
        // enable dd sharing with the calendar
        enableDragDrop: true,
        ddGroup: 'jobsExampleDD',
        
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
    
    new Ext.Panel({
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