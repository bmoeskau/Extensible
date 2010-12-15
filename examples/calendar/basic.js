Ext.onReady(function(){
    
    this.eventStore = new Ext.ensible.sample.MemoryEventStore({
        // defined in data-events.js
        data: Ext.ensible.sample.EventData
    });
    
    //
    // example 1: simplest possible stand-alone configuration
    //
    new Ext.ensible.cal.CalendarPanel({
        eventStore: eventStore,
        renderTo: 'simple',
        title: 'Basic Calendar',
        width: 700,
        height: 500
    });
    
    //
    // example 2: shows off some common Ext.Panel configs as well as a 
    // few extra CalendarPanel-specific configs + a calendar store
    //
    new Ext.ensible.cal.CalendarPanel({
        id: 'cal-example2',
        eventStore: eventStore,
        renderTo: 'panel',
        title: 'Calendar with Panel Configs',
        activeItem: 1, // default to week view
        width: 700,
        height: 500,
        
        // Standard Ext.Panel configs:
        frame: true,
        collapsible: true,
        bbar: [{text: 'A Button', handler: function(){
            Ext.Msg.alert('Button', 'I work!');
        }}],
        
        listeners: {
            // A simple example showing how to handle a custom calendar event to
            // override default behavior. See the docs for all available events.
            'eventclick': {
                fn: function(panel, rec, el){
                    // override the default edit handling
                    //Ext.Msg.alert('App Click', 'Editing: ' + rec.data.Title);
                    
                    // return false to tell the CalendarPanel that we've handled the click and it 
                    // should ignore it (e.g., do not show the default edit window)
                    //return false;
                },
                scope: this
            }
        }
    });
});