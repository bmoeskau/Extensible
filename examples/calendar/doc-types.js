Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        "Extensible": "../../src",
        "Extensible.example": ".."
    }
});
Ext.require([
    'Ext.data.ArrayStore',
    'Ext.form.field.ComboBox',
    'Extensible.calendar.data.MemoryEventStore',
    'Extensible.calendar.data.MemoryCalendarStore',
    'Extensible.calendar.CalendarPanel',
    'Extensible.example.calendar.data.Events',
    'Extensible.example.calendar.data.Calendars'
]);

Ext.onReady(function(){
    //
    // There's really nothing too interesting about this setup. This example is
    // solely to demo support of the different common HTML doc types.
    //
    var doctypeStore = Ext.create('Ext.data.ArrayStore', {
        fields: ['name', 'dtd'],
        data : [
            ['None', ''],
            ['HTML 5', 'html5'],
            ['HTML 4.01', 'html4/strict'],
            ['HTML 4.01 Transitional', 'html4/loose'],
            ['HTML 4.01 Frameset', 'html4/frameset'],
            ['XHTML 1.0 Strict', 'xhtml1/DTD/xhtml1-strict'],
            ['XHTML 1.0 Transitional', 'xhtml1/DTD/xhtml1-transitional'],
            ['XHTML 1.0 Frameset', 'xhtml1/DTD/xhtml1-frameset']
        ]
    });
    
    var doctypeCombo = Ext.create('Ext.form.field.ComboBox', {
        renderTo: 'doctypes',
        store: doctypeStore,
        displayField: 'name',
        valueField: 'dtd',
        typeAhead: true,
        queryMode: 'local',
        triggerAction: 'all',
        emptyText: 'Select a doctype...',
        selectOnFocus: true,
        value: '',
        listeners: {
            'select': {
                fn: function(cbo, rec){
                    rec = rec[0];
                    window.location = 'doc-types.php?doctype='+rec.data.name+'&dtd='+rec.data.dtd;
                }
            }
        }
    });
    
    // set the combo selected value if the url contains a doctype param
    var search = window.location.search;
    if(search.length > 0){
        search = search.substring(1, search.length); // strip the ?
        var params = Ext.Object.fromQueryString(search);
        doctypeCombo.setValue(params.doctype);
    }
    
    Ext.create('Extensible.calendar.CalendarPanel', {
        eventStore: Ext.create('Extensible.calendar.data.MemoryEventStore', {
            // defined in ../data/Events.js
            data: Ext.create('Extensible.example.calendar.data.Events')
        }),
        calendarStore: Ext.create('Extensible.calendar.data.MemoryCalendarStore', {
            // defined in ../data/Calendars.js
            data: Ext.create('Extensible.example.calendar.data.Calendars')
        }),
        renderTo: 'cal',
        title: 'Doctype Tester',
        showAgendaView: true,
        showListView: true,
        activeItem: 1,
        width: 800,
        height: 700
    });
});
