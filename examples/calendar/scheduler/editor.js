Ext.ns('App');

Ext.onReady(function () {
    Ext.QuickTips.init();

    App.Scheduler.init();
});

App.Scheduler = {

    // Bootstrap function
    init: function () {

        this.scheduler = this.createScheduler();

        this.initSchedulerEvents();
        this.initStoreEvents();
    },

    onEventContextMenu: function (s, rec, e) {
        e.stopEvent();

        if (!s.ctx) {
            s.ctx = new Ext.menu.Menu({
                items: [{
                    text: 'Delete event',
                    iconCls: 'icon-delete',
                    handler : function() {
                        s.eventStore.remove(s.ctx.rec);
                    }
                }]
            });
        }
        s.ctx.rec = rec;
        s.ctx.showAt(e.getXY());
    },

    // Don't show tooltip if editor is visible
    beforeTooltipShow: function (s, r) {
        return s.editor.collapsed;
    },

    initStoreEvents: function () {
        var s = this.scheduler;

        s.eventStore.on('update', function (store, bookingRecord, operation) {
            if (operation !== Ext.data.Record.EDIT) return;

            s.getElementFromEventRecord(bookingRecord).addClass('sch-fake-loading');

            // Simulate server delay 1.5 seconds
            bookingRecord.commit.defer(1500, bookingRecord);
        });
    },

    initSchedulerEvents: function () {
        var s = this.scheduler;

        s.on({
            eventcontextmenu : this.onEventContextMenu, 
            beforetooltipshow : this.beforeTooltipShow, 
            scope : this
        });
    },

    createScheduler: function () {

        // Store holding all the resources
        var resourceStore = new Ext.data.JsonStore({
            sortInfo: { field: 'Id', direction: "ASC" },
            idProperty: 'YourIdField',
            fields: [
                { name: 'Id', mapping: 'YourIdField' },
                'ImgUrl',
                'Name',
                'Type',
                'Color'
            ]
        });

        resourceStore.loadData(staff);

        // Store holding all the events
        var eventStore = new Ext.data.JsonStore({
            fields: [
                { name: 'ResourceId' },
                { name: 'StartDate', type: 'date', dateFormat: 'Y-m-d g:i' },
                { name: 'EndDate', type: 'date', dateFormat: 'Y-m-d g:i' },
                'Title',
                'Location'
            ]
        });

        var start = new Date(2011, 1, 7, 8);

        eventStore.loadData(tasks);
        
        return new DemoScheduler({
            width: 1030,
            height: 400,
            renderTo : 'my-div',
            resourceStore: resourceStore,
            eventStore: eventStore,
            viewPreset: 'hourAndDay',
            startDate: start,
            endDate: start.add(Date.HOUR, 10)
        });
    }
};
