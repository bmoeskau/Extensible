StartTest(function(t) {
    Ext.Loader.setConfig({
        enabled: true,
        disableCaching: false,
        paths: {
            'Extensible': '../../../src',
            'Extensible.example': '../../../examples'
        }
    });
    
    var frame = t.beginAsync();
    
    Ext.require([
        'Extensible.calendar.CalendarPanel',
        'Extensible.calendar.data.MemoryEventStore',
        'Extensible.calendar.data.MemoryCalendarStore',
        'Extensible.example.calendar.data.Events',
        'Extensible.example.calendar.data.Calendars'
    ],
    function() {
        var eventStore = Ext.create('Extensible.calendar.data.MemoryEventStore', {
            data: Ext.create('Extensible.example.calendar.data.Events')
        }),
        calendarStore = Ext.create('Extensible.calendar.data.MemoryCalendarStore', {
            data: Ext.create('Extensible.example.calendar.data.Calendars')
        });

        
        // ==========================================================
        t.diag('Calendar List');
        // ==========================================================
        t.ok(eventStore.getCount() > 0, 'Event store is loaded');
        t.ok(calendarStore.getCount() > 0, 'Calendar store is loaded');
        
        var panel = Ext.create('Extensible.calendar.CalendarPanel', {
            eventStore: eventStore,
            calendarStore: calendarStore,
            renderTo: Ext.getBody(),
            title: 'Calendar',
            width: 500,
            height: 400
        });
        
        t.ok(Ext.get(panel.id), 'The CalendarPanel is rendered');

        var eventEl = Ext.select('.ext-cal-evt').first();
        t.ok(eventEl.hasCls('x-cal-2-ad'), 'First event selected');
        
        t.click(eventEl, function() {
            var editWindow = Ext.ComponentQuery.query('#ext-cal-editwin')[0];
            
            setTimeout(function() {
                var calendarCombo = editWindow.getEl().down('.ext-calendar-picker input');
                t.ok(calendarCombo.dom.value === 'Home', 'Calendar list loaded');
                t.type(calendarCombo, '[DOWN][DOWN][ENTER]');
                
                setTimeout(function() {
                    t.click(editWindow.getEl().down('button').first());
                    eventEl = Ext.select('.ext-cal-evt').first();
                    t.ok(eventEl.hasCls('x-cal-22-ad'), 'First event changed class names');
                    
                    t.endAsync(frame);
                }, 100);
            }, 500);
        });
    });
});