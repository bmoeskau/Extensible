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
    
    t.diag('Loading Calendar with Recurrence');
    
    // We are loading events remotely via PHP, so the actual testing is done
    // in this callback function after the store is loaded below.
    var onEventsLoaded = function() {
        var cp = Ext.get(panel.id),
            jumpToText = Ext.get('test-cal-tb-jump-dt-inputEl'),
            dateTrigger = Ext.get('test-cal-tb-jump-btnEl');
        
        t.ok(cp, 'The CalendarPanel is rendered');
        
        t.chain(
            function(next) {
                // Navigate to a known past date to ensure consistent test runs
                t.type(jumpToText, '12/01/12', next);
            },
            function(next) {
                t.click(dateTrigger, next);
            },
            function(next) {
                t.waitFor(function() {
                    // Wait for Dec 1 to be loaded to ensure that navigation completed
                    return Ext.get('test-cal-month-ev-day-20121201');
                }, next, this, 15000, 500);
            },
            function(next) {
                var events = Ext.select('.ext-cal-evt'),
                    counter = {},
                    trim = Ext.String.trim;
                    
                var count = function(title) {
                    title = trim(title);
                    counter[title] = counter[title] === undefined ? 1 : ++counter[title];
                };
                
                t.diag('Verifying Recurring Instances');
                t.is(events.getCount(), 69, '69 recurring instances rendered');
                
                events.each(function(evt) {
                    count(evt.dom.innerText);
                });
                
                t.is(counter['1:00pm Recur weekdays'], 30, '1:00pm Recur weekdays');
                t.is(counter['8:00am Recur daily 10 times'], 10, '8:00am Recur daily 10 times');
                t.is(counter['Multi-day, recur every Tuesday'], 6, 'Multi-day, recur every Tuesday');
                t.is(counter['Recur every third Wednesday'], 1, 'Recur every third Wednesday');
                t.is(counter['Recur first day of each month'], 2, 'Recur first day of each month');
                t.is(counter['Recur last Friday of month'], 2, 'Recur last Friday of month');
                t.is(counter['Recur weekend days'], 12, 'Recur weekend days');
                t.is(counter['Recur weekly 8 times'], 6, 'Recur weekly 8 times');
                
                t.done();
                t.endAsync(frame);
            }
        );
    };
    
    var frame = t.beginAsync();
    
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
                    
                    onEventsLoaded();
                },
                scope: this,
                single: true // only kick off the test callback after the initial load
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
        width: 500,
        height: 800 // make tall enough to show all recurring instances
    });
});