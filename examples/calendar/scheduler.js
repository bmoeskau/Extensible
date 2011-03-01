App = function() {
    return {
        init : function() {
            Ext.QuickTips.init();
            this.initStores();
            this.createScheduler();
            this.createCalendar();
        },
        
        initStores : function(){
            var today = new Date().clearTime();
            this.eventStore = new Ext.ensible.sample.MemoryEventStore({
                fields : [
                /* These fields are shared by both components: */
                    'EventId',
                    'ResourceId',
                    'Title',
                    'Location',
                {
                    name: 'StartDate', type: 'date', dateFormat: 'Y-m-d g:i'
                },{
                    name: 'EndDate', type: 'date', dateFormat: 'Y-m-d g:i'
                },
                /* These are specific to calendar events only, but still must be defined
                 * in the store or they won't be saved into the records from the form
                 */
                'IsAllDay', 'Reminder', 'Notes', 'Url'
                ],
                data: {
                    evts: [{
                        EventId: 100,
                        ResourceId: '1',
                        Title: 'Some task', 
                        StartDate: today.add(Date.HOUR, 8),
                        EndDate: today.add(Date.HOUR, 16),
                        Location: 'Some office',
                        Reminder: '15'
                    },{
                        EventId: 101,
                        ResourceId: '2',
                        Title: 'Some other task', 
                        StartDate: today.add(Date.HOUR, 24),
                        EndDate: today.add(Date.HOUR, 100),
                        Location: 'Home office'
                    },{
                        EventId: 102,
                        ResourceId: '3',
                        Title: 'A basic task', 
                        StartDate: today.add(Date.HOUR, 72),
                        EndDate: today.add(Date.HOUR, 120),
                        Location: 'Customer office'
                    },{
                        EventId: 103,
                        ResourceId: '1',
                        Title: 'Another task', 
                        StartDate: today.add(Date.HOUR, 110),
                        EndDate: today.add(Date.HOUR, 160),
                        Location: 'Austin'
                    }]
                }
            });
            
            var profileBase = 'scheduler/images/profiles/';
            
            this.resourceStore = new Ext.data.JsonStore({
                sortInfo:{field: 'Id', direction: "ASC"},
                idProperty : 'Id',
                fields : [
                    'Id', 
                    'Name',
                    'Type',
                    'ImgUrl',
                    'ColorId', // used by calendar
                    'Color'    // used by scheduler
                ],
                data: [{
                    Id: '1', Name: 'Dave', Type: 'Engineering', ImgUrl: profileBase+'dave.jpg', ColorId: 1, Color: '#FA7166'
                },{
                    Id: '2', Name: 'Arnold', Type: 'Sales', ImgUrl: profileBase+'arnold.jpg', ColorId: 11, Color: '#9D3283'
                },{ 
                    Id: '3', Name: 'Lisa', Type: 'Product Manager', ImgUrl: profileBase+'lisa.jpg', ColorId: 21, Color: '#1A5173'
                }]
            });
        },
        
        createScheduler : function() {
            Sch.BasicViewPresets.weekAndDay.headerConfig.middle.dateFormat = 'l, M d';
            Sch.BasicViewPresets.weekAndDay.headerConfig.bottom.dateFormat = 'n/d';
            Sch.BasicViewPresets.hourAndDay.headerConfig.top.dateFormat = 'l, M d';
            Sch.BasicViewPresets.hourAndDay.headerConfig.middle.dateFormat = 'g:i A';
            
            this.scheduler = new DemoScheduler({
                width: 1000,
                height: 200,
                renderTo : 'sched',
                resourceStore: this.resourceStore,
                eventStore: this.eventStore,
                viewPreset: 'weekAndDay'
            });
        },
        
        createCalendar : function(){
            // Remap some default calendar fields to match the scheduler
            var Cal = Ext.ensible.cal; 
            Cal.EventMappings.CalendarId.name = 'ResourceId';
            Cal.EventRecord.reconfigure();
            
            Cal.CalendarMappings.CalendarId.name = 'Id';
            Cal.CalendarMappings.Title.name = 'Name';
            Cal.CalendarRecord.reconfigure();
            
            // Override the default calendar field labels to match the scheduler
            Ext.ensible.cal.EventEditWindow.prototype.calendarLabelText = 'Staff';
            Ext.ensible.cal.EventEditForm.prototype.calendarLabelText = 'Staff';
            
            this.calendar = new Cal.CalendarPanel({
                eventStore: this.eventStore,
                calendarStore: this.resourceStore,
                renderTo: 'cal',
                width: 1000,
                height: 400,
                activeItem: 1,
                editModal: true,
                showMonthView: false,
                viewConfig: {
                    startDay: 1
                }
            });
        }
    }
}();

Ext.onReady(App.init, App);
