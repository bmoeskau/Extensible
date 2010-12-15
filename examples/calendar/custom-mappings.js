Ext.onReady(function(){

    // For complete details on how to customize the EventMappings object to match your
    // application data model see the header documentation for the EventMappings class.
    
    Ext.ensible.cal.EventMappings = {
        // These are the same fields as defined in the standard EventRecord object but the
        // names and mappings have all been customized. Note that the name of each field
        // definition object (e.g., 'EventId') should NOT be changed for the default fields
        // as it is the key used to access the field data programmatically.
        EventId:     {name: 'ID', mapping:'evt_id', type:'int'},
        CalendarId:  {name: 'CalID', mapping: 'cal_id', type: 'int'},
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
    };
    // Don't forget to reconfigure!
    Ext.ensible.cal.EventRecord.reconfigure();
    
    // One key thing to remember is that any record reconfiguration you want to perform
    // must be done PRIOR to initializing your data store, otherwise the changes will
    // not be reflected in the store's records.
     
    var eventStore = new Ext.ensible.ux.MemoryEventStore({
        // defined in data-events-custom.js
        data: Ext.ensible.sample.EventDataCustom
    });
    
    // Although it's not shown here, the calendar mappings could also be customized in
    // exactly the same manner as the event mappings are above. For details see the header
    // documentation for the CalendarMappings class.
    
    // Enable event color-coding:
    var calendarStore = new Ext.ensible.sample.CalendarStore({
        // defined in data-calendars.js
        data: Ext.ensible.sample.CalendarData
    });
    
    //
    // Now just create a standard calendar using our custom data
    //
    new Ext.ensible.cal.CalendarPanel({
        eventStore: eventStore,
        calendarStore: calendarStore,
        renderTo: 'cal',
        title: 'Custom Event Mappings',
        width: 800,
        height: 800
    });
});