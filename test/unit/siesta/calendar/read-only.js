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
    
    var eventStore = Ext.create('Extensible.calendar.data.MemoryEventStore', {
        data: Ext.create('Extensible.example.calendar.data.Events')
    });
    
    // ==========================================================
    t.diag('Calendar Read-only Mode');
    // ==========================================================
    t.ok(eventStore.getCount() > 0, 'Event store is loaded');
    
    var eventClicked = false,
    
    panel = Ext.create('Extensible.calendar.CalendarPanel', {
        eventStore: eventStore,
        renderTo: Ext.getBody(),
        title: 'Read-only Calendar',
        readOnly: true,
        width: 500,
        height: 400,
        
        listeners: {
            'eventclick': function() {
                eventClicked = true;
            }
        }
    });
    
    t.ok(Ext.get(panel.id), 'The CalendarPanel is rendered');

    var eventEl = Ext.select('.ext-cal-evt').first();
    t.ok(eventEl.hasCls('ext-cal-evt'), 'First event selected');
    
    t.click(eventEl, function() {
        var editWindow = Ext.ComponentQuery.query('#ext-cal-editwin')[0];
        t.notOk(editWindow, 'Edit window is not created on event click');
        
        // Even though the event is read-only the eventclick event should still fire
        t.ok(eventClicked, 'Eventclick event was handled');

        panel.destroy();
        t.ok(Ext.get(panel.id) == null, 'Calendar el is removed');
        
        t.done();
        t.endAsync(frame);
    });
});