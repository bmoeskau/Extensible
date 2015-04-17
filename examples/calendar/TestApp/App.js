Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        "Extensible": "../../../src",
        "Extensible.example": "../.."
    }
});

Ext.define('Extensible.example.calendar.TestApp.App', {
    
    requires: [
        'Ext.container.Viewport',
        'Ext.layout.container.Border',
        'Extensible.calendar.CalendarPanel',
        'Extensible.calendar.gadget.CalendarListPanel',
        'Extensible.calendar.data.MemoryCalendarStore',
        'Extensible.calendar.data.MemoryEventStore',
        'Extensible.example.calendar.data.Events',
        'Extensible.example.calendar.data.Calendars'
    ],
    
    constructor : function() {
        var startDay = 0; // The 0-based index for the day on which the calendar week begins (0=Sunday)

        // This is an example calendar store that enables event color-coding
        this.calendarStore = Ext.create('Extensible.calendar.data.MemoryCalendarStore', {
            // defined in ../data/Calendars.js
            data: Ext.create('Extensible.example.calendar.data.Calendars')
        });

        // A sample event store that loads static JSON from a local file. Obviously a real
        // implementation would likely be loading remote data via an HttpProxy, but the
        // underlying store functionality is the same.
        this.eventStore = Ext.create('Extensible.calendar.data.MemoryEventStore', {
            // defined in ../data/Events.js
            data: Ext.create('Extensible.example.calendar.data.Events'),
            // This disables the automatic CRUD messaging built into the sample data store.
            // This test application will provide its own custom messaging. See the source
            // of MemoryEventStore to see how automatic store messaging is implemented.
            autoMsg: false
        });

        // Make the calendar stateful. This is optional. If set, the application will remember hidden
        // calendars in the calendar list panel.
        Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

        // This is the app UI layout code.  All of the calendar views are subcomponents of
        // CalendarPanel, but the app title bar and sidebar/navigation calendar are separate
        // pieces that are composed in app-specific layout code since they could be omitted
        // or placed elsewhere within the application.
        Ext.create('Ext.Viewport', {
            layout: 'border',
            renderTo: 'calendar-ct',
            items: [{
                id: 'app-header',
                region: 'north',
                height: 35,
                border: false,
                contentEl: 'app-header-content'
            },{
                id: 'app-center',
                title: '...', // will be updated to the current view's date range
                region: 'center',
                layout: 'border',
                listeners: {
                    'afterrender': function(){
                        Ext.getCmp('app-center').header.addCls('app-center-header');
                    }
                },
                items: [{
                    id:'app-west',
                    region: 'west',
                    width: 179,
                    border: false,
                    items: [{
                        xtype: 'datepicker',
                        id: 'app-nav-picker',
                        cls: 'ext-cal-nav-picker',
                        startDay: startDay,
                        listeners: {
                            'select': {
                                fn: function(dp, dt){
                                    Ext.getCmp('app-calendar').setStartDate(dt);
                                },
                                scope: this
                            }
                        }
                    },{
                        xtype: 'extensible.calendarlist',
                        store: this.calendarStore,
                        border: false,
                        width: 178
                    }]
                },{
                    xtype: 'extensible.calendarpanel',
                    eventStore: this.eventStore,
                    calendarStore: this.calendarStore,
                    border: false,
                    id:'app-calendar',
                    region: 'center',
                    activeItem: 3, // month view
                    startDay: startDay,
                    
                    // Any generic view options that should be applied to all sub views:
                    viewConfig: {
                        //enableFx: false,
                        //ddIncrement: 10, //only applies to DayView and subclasses, but convenient to put it here
                        //viewStartHour: 6,
                        //viewEndHour: 18,
                        //minEventDisplayMinutes: 15
                        startDay: 0,
                        showTime: false
                    },
                    
                    // View options specific to a certain view (if the same options exist in viewConfig
                    // they will be overridden by the view-specific config):
                    monthViewCfg: {
                        showHeader: true,
                        showWeekLinks: true,
                        showWeekNumbers: true
                    },
                    
                    multiWeekViewCfg: {
                        //weekCount: 3
                    },

                    agendaViewCfg: {
                        linkDatesToDayView: true,
                        dateRangeDefault: '3months'
                    },

                    listViewCfg: {
                        linkDatesToDayView: true,
                        dateRangeDefault: '3months',
                        simpleList: true,
                        groupBy: 'month'
                    },

                    // Some optional CalendarPanel configs to experiment with:
                    //readOnly: true,
                    //showDayView: false,
                    //showMultiDayView: true,
                    //showWeekView: false,
                    //showMultiWeekView: false,
                    //showMonthView: false,
                    showAgendaView: true,
                    showListView: true,
                    //showNavBar: false,
                    //showTodayText: false,
                    //showTime: false,
                    //editModal: true,
                    //enableEditDetails: false,
                    //title: 'My Calendar', // the header of the calendar, could be a subtitle for the app
                    
                    listeners: {
                        'datechange': {
                            fn: function(vw, startDt, viewStart, viewEnd){
                                this.updateTitle(viewStart, viewEnd);
                            },
                            scope: this
                        },
                        'eventclick': {
                            fn: function(vw, rec, el){
                                this.clearMsg();
                            },
                            scope: this
                        },
                        'eventover': function(vw, rec, el){
                            //console.log('Entered evt rec='+rec.data[Extensible.calendar.data.EventMappings.Title.name]', view='+ vw.id +', el='+el.id);
                        },
                        'eventout': function(vw, rec, el){
                            //console.log('Leaving evt rec='+rec.data[Extensible.calendar.data.EventMappings.Title.name]+', view='+ vw.id +', el='+el.id);
                        },
                        'eventadd': {
                            fn: function(cp, rec){
                                this.showMsg('Event '+ rec.data[Extensible.calendar.data.EventMappings.Title.name] +' was added');
                            },
                            scope: this
                        },
                        'eventupdate': {
                            fn: function(cp, rec){
                                this.showMsg('Event '+ rec.data[Extensible.calendar.data.EventMappings.Title.name] +' was updated');
                            },
                            scope: this
                        },
                        'eventcancel': {
                            fn: function(cp, rec){
                                // edit canceled
                            },
                            scope: this
                        },
                        'viewchange': {
                            fn: function(p, vw, dateInfo){
                                if(dateInfo){
                                    this.updateTitle(dateInfo.viewStart, dateInfo.viewEnd);
                                }
                            },
                            scope: this
                        },
                        'dayclick': {
                            fn: function(vw, dt, ad, el){
                                this.clearMsg();
                            },
                            scope: this
                        },
                        'rangeselect': {
                            fn: function(vw, dates, onComplete){
                                this.clearMsg();
                            },
                            scope: this
                        },
                        'eventcopy': {
                            fn: function(vw, rec){
                                this.onEventCopyOrMove(rec, 'copy');
                            },
                            scope: this
                        },
                        'eventmove': {
                            fn: function(vw, rec){
                                this.onEventCopyOrMove(rec, 'move');
                            },
                            scope: this
                        },
                        'eventresize': {
                            fn: function(vw, rec){
                                rec.commit();
                                this.showMsg('Event '+ rec.data[Extensible.calendar.data.EventMappings.Title.name] +' was updated');
                            },
                            scope: this
                        },
                        'eventdelete': {
                            fn: function(win, rec){
                                this.eventStore.remove(rec);
                                this.showMsg('Event '+ rec.data[Extensible.calendar.data.EventMappings.Title.name] +' was deleted');
                            },
                            scope: this
                        },
                        'initdrag': {
                            fn: function(vw){
                                // do something when drag starts
                            },
                            scope: this
                        }
                    }
                }]
            }]
        });
    },
    
    // The CalendarPanel itself supports the standard Panel title config, but that title
    // only spans the calendar views.  For a title that spans the entire width of the app
    // we added a title to the layout's outer center region that is app-specific. This code
    // updates that outer title based on the currently-selected view range anytime the view changes.
    updateTitle: function(startDt, endDt){
        var p = Ext.getCmp('app-center'),
            fmt = Ext.Date.format;
        
        if(Ext.Date.clearTime(startDt).getTime() === Ext.Date.clearTime(endDt).getTime()){
            p.setTitle(fmt(startDt, 'F j, Y'));
        }
        else if(startDt.getFullYear() === endDt.getFullYear()){
            if(startDt.getMonth() === endDt.getMonth()){
                p.setTitle(fmt(startDt, 'F j') + ' - ' + fmt(endDt, 'j, Y'));
            }
            else{
                p.setTitle(fmt(startDt, 'F j') + ' - ' + fmt(endDt, 'F j, Y'));
            }
        }
        else{
            p.setTitle(fmt(startDt, 'F j, Y') + ' - ' + fmt(endDt, 'F j, Y'));
        }
    },
    
    // Handle event moves or copies generically
    onEventCopyOrMove: function(rec, mode) {
        var mappings = Extensible.calendar.data.EventMappings,
            time = rec.data[mappings.IsAllDay.name] ? '' : ' \\a\\t g:i a',
            action = mode === 'copy' ? 'copied' : 'moved';
        
        rec.commit();
        
        this.showMsg('Event '+ rec.data[mappings.Title.name] +' was ' + action + ' to '+
            Ext.Date.format(rec.data[mappings.StartDate.name], ('F jS'+time)));
    },
    
    // This is an application-specific way to communicate CalendarPanel event messages back to the user.
    // This could be replaced with a function to do "toast" style messages, growl messages, etc. This will
    // vary based on application requirements, which is why it's not baked into the CalendarPanel.
    showMsg: function(msg){
        Ext.fly('app-msg').update(msg).removeCls('x-hidden');
    },
    
    clearMsg: function(){
        Ext.fly('app-msg').update('').addCls('x-hidden');
    }
});

Ext.onReady(function() {
    Ext.create('Extensible.example.calendar.TestApp.App');
});
