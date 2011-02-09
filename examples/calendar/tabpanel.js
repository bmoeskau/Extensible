Ext.onReady(function(){
    
    this.eventStore = new Ext.ensible.sample.MemoryEventStore({
        // defined in data-events.js
        data: Ext.ensible.sample.EventData
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
        activeItem: 1
    };

    //
    // Create the TabPanel and add the calendar config as the second tab
    //    
    new Ext.TabPanel({
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