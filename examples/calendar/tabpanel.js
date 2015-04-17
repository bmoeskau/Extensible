Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        "Extensible": "../../src",
        "Extensible.example": ".."
    }
});
Ext.require([
    'Ext.tab.Panel',
    'Extensible.calendar.data.MemoryEventStore',
    'Extensible.calendar.CalendarPanel',
    'Extensible.example.calendar.data.Events'
]);

Ext.onReady(function(){
    
    var eventStore = Ext.create('Extensible.calendar.data.MemoryEventStore', {
        // defined in ../data/Events.js
        data: Ext.create('Extensible.example.calendar.data.Events')
    });
    
    //
    // Calendar config only, not created via new. This allows the calendar to
    // be lazy-rendered when its containing tab is first shown. Note that we
    // can configure the calendar directly with tab configs also since it's
    // being added as a direct child of the TabPanel below.
    //
    var calendarCfg = {
        xtype: 'extensible.calendarpanel',
        title: 'Calendar',
        eventStore: eventStore,
        width: 700,
        height: 500,
        activeItem: 1,
        showAgendaView: true,
        showListView: true,
        // this is a good idea since we are in a TabPanel and we don't want
        // the user switching tabs on us while we are editing an event:
        editModal: true,

        listViewCfg: {
            dateRangeDefault: '3months',
            groupBy: 'week'
        }

    };

    //
    // Create the TabPanel and add the calendar config as the second tab
    //    
    Ext.create('Ext.tab.Panel', {
        renderTo: 'tabpanel',
        width: 700,
        height: 500,
        activeTab: 0,
        items: [{
            title: 'General Info',
            contentEl: 'general-tab',
            bodyStyle: 'padding: 20px;'
        }, 
        calendarCfg]
    });
});
