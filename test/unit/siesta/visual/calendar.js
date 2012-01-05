StartTest(function(t) {
    Ext.Loader.setConfig({
        enabled: true,
        disableCaching: false,
        paths: {
            'Extensible': '../../../src',
            'Extensible.example': '../../../examples'
        }
    });
    
    t.wait("require");
    
    Ext.require([
        'Extensible.calendar.CalendarPanel',
        'Extensible.calendar.data.MemoryEventStore',
        'Extensible.example.calendar.data.Events'
    ],
    function() {
        t.diag('Basic Calendar Rendering');
        
        var eventStore = Ext.create('Extensible.calendar.data.MemoryEventStore', {
            data: Ext.create('Extensible.example.calendar.data.Events')
        });
        
        t.ok(eventStore.getCount() > 0, 'Event store is loaded');
        
        var panel = Ext.create('Extensible.calendar.CalendarPanel', {
            eventStore: eventStore,
            renderTo: Ext.getBody(),
            title: 'Basic Calendar',
            width: 500,
            height: 400
        });
        
        t.ok(panel.rendered, 'The CalendarPanel is rendered');
        t.hasSize(panel, 500, 400, 'Correct initial size');
        
        t.done();
        t.endWait("require");
    });
});