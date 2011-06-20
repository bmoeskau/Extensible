Ext.require([
    'Extensible.calendar.data.MemoryEventStore',
    'Extensible.calendar.CalendarPanel',
    'Extensible.example.calendar.data.Events'
]);

Ext.onReady(function(){
    
    var eventStore = Ext.create('Extensible.calendar.data.MemoryEventStore', {
        // defined in ../data/Events.js
        data: Ext.create('Extensible.example.calendar.data.Events')
    });
    
    // NOTE: The default event color has been overridden in CSS. View the source
    // of custom-views.html to see how that was done.
    
    Ext.create('Extensible.calendar.CalendarPanel', {
        eventStore: eventStore,
        renderTo: 'cal',
        title: 'Custom Views',
        width: 800,
        height: 700,
        activeItem: 1,
        
        // These show by default, turn them off
        showDayView: false,
        showMonthView: false,
        
        // Defaults to 3 days. You could also set the dayCount config
        // inside multiDayViewCfg to change that.
        showMultiDayView: true,
        
        // Show a custom 3-week view
        multiWeekViewCfg: {
            weekCount: 3
        },
        
        // Used with the custom week view configured below
        weekText: 'Work Week',
        
        weekViewCfg: {
            // These settings create a fixed weekday view. 
            // This view will only show Mon-Fri.
            dayCount: 5,
            // Always start the view on Monday
            startDay: 1,
            startDayIsStatic: true,
            
            // NOTE: the configs below apply to any DayView or WeekView. If you wanted all day
            // and week views to share these same settings, you could simply pass these configs
            // in the general viewCfg. Any views that do not use them will ignore them. They are
            // only on this view in this sample to demonstrate how they can be easily customized per view.
            
            // Hide the half-hour marker line
            showHourSeparator: false,
            // Start the view at 6:00
            viewStartHour: 6,
            // End the view at 8:00pm / 20:00
            viewEndHour: 20,
            // Default the scroll position on load to 8:00 if the body is overflowed
            scrollStartHour: 8,
            // Customize the hour (and event) heights. See the docs for details on setting this.
            // This example will be double-height (the default is 42)
            hourHeight: 84,
            // Allow drag-drop, drag-create and resize of events in 10-minute increments
            ddIncrement: 10,
            // Since the hour blocks are double-height, we can shorten the minimum event display 
            // height to match the ddIncrement
            minEventDisplayMinutes: 10
        }
    });
});