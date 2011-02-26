App = function() {
    return {
        init : function() {
            //Ext.BLANK_IMAGE_URL = 'http://extjs.cachefly.net/ext-3.2.0/resources/images/default/s.gif';
            Ext.QuickTips.init();
            
            this.initStores();
            this.createScheduler();
            this.createCalendar();
        },
        
        initStores : function(){
            this.eventStore = new Ext.ensible.sample.MemoryEventStore({
                fields : [
                    { name: 'ResourceId' },
                    { name: 'Title' },
                    { name: 'StartDate', type: 'date', dateFormat: 'Y-m-d g:i' },
                    { name: 'EndDate', type: 'date', dateFormat: 'Y-m-d g:i' },
                    'Location'
                ]                
            });
            this.resourceStore = new Ext.data.JsonStore({
                sortInfo:{field: 'Id', direction: "ASC"},
                idProperty : 'Id',
                fields : [
                    'Id', 
                    'Name',
                    'Type',
                    'ImgUrl',
                    'ColorId'
                ],
                data: [
                    {Id : '1', Name : 'Rob', Type : 'Sales', ColorId : 1},
                    {Id : '2', Name : 'Mike', Type : 'Sales', ColorId : 11},
                    {Id : '3', Name : 'Kate', Type : 'Product manager', ColorId : 21}
                ]
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
                height: 300,
                activeItem: 2
            });
        },
        
        onSave : function(formPanel, newStart, newEnd, record) {
            var values = formPanel.getForm().getValues();
            
            record.beginEdit();
            record.set('StartDate', newStart);
            record.set('EndDate', newEnd);
            record.set('Title', values.Title);
            record.set('Location', values.Location);
            record.endEdit();
            formPanel.collapse();
        }
    }
}();

Ext.onReady(App.init, App);
