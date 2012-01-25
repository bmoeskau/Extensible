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
        'Extensible.example.calendar.data.Events'
    ],
    function() {
        var eventStore = Ext.create('Extensible.calendar.data.MemoryEventStore', {
            data: Ext.create('Extensible.example.calendar.data.Events')
        });
        
        // ==========================================================
        t.diag('Basic Calendar Rendering');
        // ==========================================================
        t.ok(eventStore.getCount() > 0, 'Event store is loaded');
        
        var eventClicked = false,
        
        panel = Ext.create('Extensible.calendar.CalendarPanel', {
            eventStore: eventStore,
            renderTo: Ext.getBody(),
            title: 'Basic Calendar',
            width: 500,
            height: 400,
            
            listeners: {
                'eventclick': function() {
                    eventClicked = true;
                }
            }
        });
        
        t.ok(Ext.get(panel.id), 'The CalendarPanel is rendered');
        t.hasSize(panel, 500, 400, 'Correct initial size');


        // ==========================================================
        t.diag('Basic Calendar Actions');
        // ==========================================================
        var eventEl = Ext.select('.ext-cal-evt').first();
        t.ok(eventEl.hasCls('ext-cal-evt'), 'First event selected');
        
        t.click(eventEl, function() {
            var editWindow = Ext.ComponentQuery.query('#ext-cal-editwin')[0];
            t.ok(editWindow.id === 'ext-cal-editwin', 'Edit window created on event click');
            
            setTimeout(function() {
                t.ok(editWindow.getEl().isVisible() === true, 'Edit window is visible');
                t.ok(eventClicked, 'Eventclick event was handled');
                
                t.type(editWindow.getEl().down('input'), '[ESCAPE]', function() {
                    setTimeout(function() {
                        t.ok(editWindow.getEl().isVisible() === false, 'Edit window is hidden on Esc');
                        
                        panel.destroy();
                        t.ok(panel.getEl() == null, 'Calendar is destroyed');
                        t.ok(Ext.get(panel.id) == null, 'Calendar el is removed');
                        
                        t.done();
                        t.endAsync(frame);
                    }, 500);
                });
            }, 500);
        });
    });
});