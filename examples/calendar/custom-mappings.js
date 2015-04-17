Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        "Extensible": "../../src",
        "Extensible.example": ".."
    }
});
Ext.require([
    'Extensible.calendar.data.MemoryEventStore',
    'Extensible.calendar.data.MemoryCalendarStore',
    'Extensible.calendar.CalendarPanel',
    'Extensible.example.calendar.data.EventsCustom',
    'Extensible.example.calendar.data.CalendarsCustom',
    'Extensible.calendar.data.CalendarMappings',
    'Extensible.calendar.data.EventMappings'
]);

Ext.onReady(function(){

    // For complete details on how to customize the EventMappings object to match your
    // application data model see the header documentation for the EventMappings class.
    // It is best to use Ext.apply() to override mappings in case new default framework
    // mappings are ever added in the future.
    
    Ext.apply(Extensible.calendar.data.EventMappings, {
        // These are the same fields as defined in the standard EventRecord object but the
        // names and mappings have all been customized. Note that the name of each field
        // definition object (e.g., 'EventId') should NOT be changed for the default fields
        // as it is the key used to access the field data programmatically.
        EventId:     {name: 'ID', mapping:'evt_id', type:'string'}, // int by default
        CalendarId:  {name: 'CalID', mapping: 'cal_id', type: 'string'}, // int by default
        Title:       {name: 'EvtTitle', mapping: 'evt_title'},
        StartDate:   {name: 'StartDt', mapping: 'start_dt', type: 'date', dateFormat: 'c'},
        EndDate:     {name: 'EndDt', mapping: 'end_dt', type: 'date', dateFormat: 'c'},
        RRule:       {name: 'RecurRule', mapping: 'recur_rule'},
        Location:    {name: 'Location', mapping: 'location'},
        Notes:       {name: 'Desc', mapping: 'full_desc'},
        Url:         {name: 'LinkUrl', mapping: 'link_url'},
        IsAllDay:    {name: 'AllDay', mapping: 'all_day', type: 'boolean'},
        Reminder:    {name: 'Reminder', mapping: 'reminder'},
        
        // We can also add some new fields that do not exist in the standard EventRecord:
        CreatedBy:   {name: 'CreatedBy', mapping: 'created_by'},
        IsPrivate:   {name: 'Private', mapping:'private', type:'boolean'}
    });
    // Don't forget to reconfigure!
    Extensible.calendar.data.EventModel.reconfigure();
    
    // One key thing to remember is that any record reconfiguration you want to perform
    // must be done PRIOR to initializing your data store, otherwise the changes will
    // not be reflected in the store's records.
     
    var eventStore = Ext.create('Extensible.calendar.data.MemoryEventStore', {
        // defined in ../data/EventsCustom.js
        data: Ext.create('Extensible.example.calendar.data.EventsCustom')
    });
    
    Ext.apply(Extensible.calendar.data.CalendarMappings, {
        // Same basic concept for the CalendarMappings as above
        CalendarId:   {name:'ID', mapping: 'cal_id', type: 'string'}, // int by default
        Title:        {name:'CalTitle', mapping: 'cal_title', type: 'string'},
        Description:  {name:'Desc', mapping: 'cal_desc', type: 'string'},
        ColorId:      {name:'Color', mapping: 'cal_color', type: 'int'},
        IsHidden:     {name:'Hidden', mapping: 'hidden', type: 'boolean'}
    });
    // Don't forget to reconfigure!
    Extensible.calendar.data.CalendarModel.reconfigure();
    
    // Enable event color-coding:
    var calendarStore = Ext.create('Extensible.calendar.data.MemoryCalendarStore', {
        // defined in ../data/CalendarsCustom.js
        data: Ext.create('Extensible.example.calendar.data.CalendarsCustom')
    });
    
    //
    // Now just create a standard calendar using our custom data
    //
    Ext.create('Extensible.calendar.CalendarPanel', {
        eventStore: eventStore,
        calendarStore: calendarStore,
        renderTo: 'cal',
        title: 'Custom Event Mappings',
        showAgendaView: true,
        showListView: true,
        activeItem: 3, // default to month view
        width: 800,
        height: 700
    });
});
