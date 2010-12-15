App = function() {
    return {
        init : function() {
            
            Ext.BLANK_IMAGE_URL = 'http://extjs.cachefly.net/ext-3.1.0/resources/images/default/s.gif';

            // This is an example calendar store that enables event color-coding
            this.calendarStore = new Ext.ensible.sample.CalendarStore({
                // defined in data-calendars.js
                data: Ext.ensible.sample.CalendarData
            });

            // A sample event store that loads static JSON from a local file. Obviously a real
            // implementation would likely be loading remote data via an HttpProxy, but the
            // underlying store functionality is the same.
            this.eventStore = new Ext.ensible.ux.MemoryEventStore({
                // defined in data-events.js
                data: Ext.ensible.sample.EventData
            });
            
            // This is the app UI layout code.  All of the calendar views are subcomponents of
            // CalendarPanel, but the app title bar and sidebar/navigation calendar are separate
            // pieces that are composed in app-specific layout code since they could be omitted
            // or placed elsewhere within the application.
            new Ext.Viewport({
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
                            Ext.getCmp('app-center').header.addClass('app-center-header');
                        }
                    },
                    items: [{
                        id:'app-west',
                        region: 'west',
                        width: 176,
                        border: false,
                        items: [{
                            xtype: 'datepicker',
                            id: 'app-nav-picker',
                            cls: 'ext-cal-nav-picker',
                            listeners: {
                                'select': {
                                    fn: function(dp, dt){
                                        App.calendarPanel.setStartDate(dt);
                                    },
                                    scope: this
                                }
                            }
                        },{
                            xtype: 'extensible.calendarlist',
                            store: this.calendarStore,
                            border: false,
                            width: 175
                        }]
                    },{
                        xtype: 'extensible.calendarpanel',
                        eventStore: this.eventStore,
                        calendarStore: this.calendarStore,
                        border: false,
                        id:'app-calendar',
                        region: 'center',
                        activeItem: 3, // month view
                        
                        // Any generic view options that should be applied to all sub views:
                        viewConfig: {
                            //enableFx: false
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
                        
                        // Some optional CalendarPanel configs to experiment with:
                        //readOnly: true,
                        //showDayView: false,
                        //showMultiDayView: true,
                        //showWeekView: false,
                        //showMultiWeekView: false,
                        //showMonthView: false,
                        //showNavBar: false,
                        //showTodayText: false,
                        //showTime: false,
                        //editModal: true,
                        //title: 'My Calendar', // the header of the calendar, could be a subtitle for the app
                        
                        // Once this component inits it will set a reference to itself as an application
                        // member property for easy reference in other functions within App.
                        initComponent: function() {
                            App.calendarPanel = this;
                            this.constructor.prototype.initComponent.apply(this, arguments);
                        },
                        
//                        plugins: [{
//                            ptype: 'ext.ensible.cal.contextmenu'
//                        }],
                        
                        listeners: {
                            'eventclick': {
                                fn: function(vw, rec, el){
                                    this.clearMsg();
                                },
                                scope: this
                            },
                            'eventover': function(vw, rec, el){
                                //console.log('Entered evt rec='+rec.data[Ext.ensible.cal.EventMappings.Title.name]', view='+ vw.id +', el='+el.id);
                            },
                            'eventout': function(vw, rec, el){
                                //console.log('Leaving evt rec='+rec.data[Ext.ensible.cal.EventMappings.Title.name]+', view='+ vw.id +', el='+el.id);
                            },
                            'eventadd': {
                                fn: function(cp, rec){
                                    this.showMsg('Event '+ rec.data[Ext.ensible.cal.EventMappings.Title.name] +' was added');
                                },
                                scope: this
                            },
                            'eventupdate': {
                                fn: function(cp, rec){
                                    this.showMsg('Event '+ rec.data[Ext.ensible.cal.EventMappings.Title.name] +' was updated');
                                },
                                scope: this
                            },
                            'eventdelete': {
                                fn: function(cp, rec){
                                    //this.eventStore.remove(rec);
                                    this.showMsg('Event '+ rec.data[Ext.ensible.cal.EventMappings.Title.name] +' was deleted');
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
                                    if(this.editWin){
                                        this.editWin.hide();
                                    };
                                    if(dateInfo !== null){
                                        // will be null when switching to the event edit form so ignore
                                        Ext.getCmp('app-nav-picker').setValue(dateInfo.activeDate);
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
                            'eventmove': {
                                fn: function(vw, rec){
                                    rec.commit();
                                    var time = rec.data[Ext.ensible.cal.EventMappings.IsAllDay.name] ? '' : ' \\a\\t g:i a';
                                    this.showMsg('Event '+ rec.data[Ext.ensible.cal.EventMappings.Title.name] +' was moved to '+
                                        rec.data[Ext.ensible.cal.EventMappings.StartDate.name].format('F jS'+time));
                                },
                                scope: this
                            },
                            'eventresize': {
                                fn: function(vw, rec){
                                    rec.commit();
                                    this.showMsg('Event '+ rec.data[Ext.ensible.cal.EventMappings.Title.name] +' was updated');
                                },
                                scope: this
                            },
                            'eventdelete': {
                                fn: function(win, rec){
                                    this.eventStore.remove(rec);
                                    this.showMsg('Event '+ rec.data[Ext.ensible.cal.EventMappings.Title.name] +' was deleted');
                                },
                                scope: this
                            },
                            'initdrag': {
                                fn: function(vw){
                                    if(this.editWin && this.editWin.isVisible()){
                                        this.editWin.hide();
                                    }
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
            var p = Ext.getCmp('app-center');
            
            if(startDt.clearTime().getTime() == endDt.clearTime().getTime()){
                p.setTitle(startDt.format('F j, Y'));
            }
            else if(startDt.getFullYear() == endDt.getFullYear()){
                if(startDt.getMonth() == endDt.getMonth()){
                    p.setTitle(startDt.format('F j') + ' - ' + endDt.format('j, Y'));
                }
                else{
                    p.setTitle(startDt.format('F j') + ' - ' + endDt.format('F j, Y'));
                }
            }
            else{
                p.setTitle(startDt.format('F j, Y') + ' - ' + endDt.format('F j, Y'));
            }
        },
        
        // This is an application-specific way to communicate CalendarPanel event messages back to the user.
        // This could be replaced with a function to do "toast" style messages, growl messages, etc. This will
        // vary based on application requirements, which is why it's not baked into the CalendarPanel.
        showMsg: function(msg){
            Ext.fly('app-msg').update(msg).removeClass('x-hidden');
        },
        
        clearMsg: function(){
            Ext.fly('app-msg').update('').addClass('x-hidden');
        }
    }
}();

Ext.onReady(App.init, App);
