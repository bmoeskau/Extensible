App = function() {
    return {
        init : function() {
            Ext.QuickTips.init();
            this.initStores();
            this.createScheduler();
            this.createCalendar();
        },
        
        initStores : function(){
            this.eventStore = new Ext.ensible.sample.MemoryEventStore({
                fields : [
                    'ResourceId',
                    'Title',
                    'Location',
                {
                    name: 'StartDate', type: 'date', dateFormat: 'Y-m-d g:i'
                },{
                    name: 'EndDate', type: 'date', dateFormat: 'Y-m-d g:i'
                }]
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
            
            this.calendar = new Cal.CalendarPanel({
                eventStore: this.eventStore,
                calendarStore: this.resourceStore,
                renderTo: 'cal',
                width: 1000,
                height: 400,
                activeItem: 2,
                showMonthView: false,
                viewConfig: {
                    startDay: 1
                }
            });
        }
    }
}();

Ext.onReady(App.init, App);
