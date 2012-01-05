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
        'Extensible.example.calendar.data.Events',
        'Extensible.example.calendar.data.Calendars'
    ],
    function() {
        t.diag("Basic Sanity Tests");
    
        // Verify Ext
        t.ok(Ext, 'Ext namespace loaded');
        t.ok(Ext.Window, 'Ext classes loaded');
    
        // Verify Extensible
        t.ok(Extensible, 'Extensible namespace loaded');
        t.ok(Extensible.calendar.CalendarPanel, 'Extensible classes loaded');
    
        // Make sure test data is available
        t.ok(Extensible.example.calendar.data.Events, 'Extensible event data ready');
        t.ok(Extensible.example.calendar.data.Calendars, 'Extensible calendar data ready');
        
        t.done();
        t.endWait("require");
    });
});