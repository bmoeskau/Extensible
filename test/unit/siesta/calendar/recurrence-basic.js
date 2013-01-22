StartTest(function(t) {
    Ext.Loader.setConfig({
        enabled: true,
        disableCaching: false,
        paths: {
            'Extensible': '../../../src',
            'Extensible.example': '../../../examples'
        }
    });
    
    Ext.Ajax.extraParams = {
        // Required for the sample PHP to use recurring sample data. Use a random
        // key so that every individual test run gets a fresh session!
        app_id: 'recurrence_' + Math.floor((Math.random()*1000)+1)
    };
    
    var frame = t.beginAsync();
    
    t.diag('Loading Calendar with Recurrence');
    
    // We are loading events remotely via PHP, so the actual testing is done
    // in this callback function after the store is loaded below.
    var onEventsLoaded = function() {
        var events = Ext.select('.ext-cal-evt'),
            counter = {},
            title,
            trim = Ext.String.trim;
        
        t.diag('Verifying Recurring Instances');
        t.is(events.getCount(), 54, '54 recurring instances rendered');
        
        events.each(function(evt) {
            title = trim(evt.dom.innerText);
            counter[title] = counter[title] === undefined ? 1 : ++counter[title];
        });
        
        t.is(counter['1:00pm Recur weekdays'], 24, '1:00pm Recur weekdays');
        t.is(counter['8:00am Recur daily 10 times'], 10, '8:00am Recur daily 10 times');
        t.is(counter['Multi-day, recur every Tuesday'], 5, 'Multi-day, recur every Tuesday');
        t.is(counter['Recur every third Wednesday'], 1, 'Recur every third Wednesday');
        t.is(counter['Recur first day of each month'], 2, 'Recur first day of each month');
        t.is(counter['Recur last Friday of month'], 1, 'Recur last Friday of month');
        t.is(counter['Recur weekend days'], 9, 'Recur weekend days');
        t.is(counter['Recur weekly 8 times'], 2, 'Recur weekly 8 times');
        
        t.done();
        t.endAsync(frame);
    };
    
    var calendarStore = Ext.create('Extensible.calendar.data.MemoryCalendarStore', {
        data: Ext.create('Extensible.example.calendar.data.Calendars')
    });
    
    var eventStore = Ext.create('Extensible.calendar.data.EventStore', {
        autoLoad: true,
        proxy: {
            type: 'rest',
            url: '../../../examples/calendar/remote/php/app.php/events',
            noCache: false,
            
            reader: {
                type: 'json',
                root: 'data'
            },
            
            writer: {
                type: 'json',
                nameProperty: 'mapping'
            }
        },
        listeners: {
            'load': {
                fn: function() {
                    t.ok(eventStore.getCount() > 0, 'Event store is loaded');
                    t.ok(calendarStore.getCount() > 0, 'Calendar store is loaded');
                },
                single: true
            }
        }
    });
    
    var panel = Ext.create('Extensible.calendar.CalendarPanel', {
        eventStore: eventStore,
        calendarStore: calendarStore,
        renderTo: Ext.getBody(),
        id: 'test-cal',
        title: 'Calendar',
        recurrence: true,
        width: 800,
        height: 800, // make tall enough to show all recurring instances with no overflow
        
        listeners: {
            'eventsrendered': {
                fn: onEventsLoaded,
                single: true,
                delay: 100
            }
        }
    });
});