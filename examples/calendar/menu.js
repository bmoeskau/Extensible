Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        "Extensible": "../../src",
        "Extensible.example": ".."
    }
});
Ext.require([
    'Extensible.calendar.data.MemoryEventStore',
    'Extensible.calendar.CalendarPanel',
    'Extensible.example.calendar.data.Events'
]);

Ext.onReady(function(){
    var eventStore = Ext.create('Extensible.calendar.data.MemoryEventStore', {
        // defined in ../data/Events.js
        data: Extensible.example.calendar.data.Events.getData()
    });

    Ext.override(Extensible.calendar.menu.Event, {
    	   buildMenu: function() {
    		   console.log('build menu invoked');
    	        var me = this;


    	        if(me.rendered) {
    	            return;
    	        }
    	        me.dateMenu = Ext.create('Ext.menu.DatePicker', {
    	            scope: me,
    	            startDay: me.startDay,
    	            handler: me.onEventMoveSelected
    	        });
    	        me.copyMenu = Ext.create('Ext.menu.DatePicker', {
    	            scope: me,
    	            startDay: me.startDay,
    	            handler: me.onEventCopySelected
    	        });

    	        var ownerCalendarPanelInstId = this.ownerCalendarPanel.id;

    	        var calInst2 = ownerCalendarPanelInstId.search("2");

    	        if (-1 == calInst2) {

    	        	Ext.apply(me, {
    	        		items: [
    	        		        {
    	        		        	text: me.editDetailsText,
    	        		        	iconCls: 'extensible-cal-icon-evt-edit',
    	        		        	scope: me,
    	        		        	handler: function() {
    	        		        		me.fireEvent('editdetails', me, me.rec, me.ctxEl);
    	        		        	}
    	        		        },'-',{
    	        		        	text: me.moveToText,
    	        		        	iconCls: 'extensible-cal-icon-evt-move',
    	        		        	menu: me.dateMenu
    	        		        },{
    	        		        	text: me.copyToText,
    	        		        	iconCls: 'extensible-cal-icon-evt-copy',
    	        		        	menu: me.copyMenu
    	        		        }]
    	        	});
    	        }
    	        else
    	        {
    	        	Ext.apply(me, {
    	        		items: [
    	        		        {
    	        		        	text: me.deleteText,
    	        		        	iconCls: 'extensible-cal-icon-evt-del',
    	        		        	scope: me,
    	        		        	handler: function() {
    	        		        		me.fireEvent('eventdelete', me, me.rec, me.ctxEl);
    	        		        	}
    	        		        },
    	        		        {
    	        		        	text: me.editDetailsText,
    	        		        	iconCls: 'extensible-cal-icon-evt-edit',
    	        		        	scope: me,
    	        		        	handler: function() {
    	        		        		me.fireEvent('editdetails', me, me.rec, me.ctxEl);
    	        		        	}
    	        		        },'-',{
    	        		        	text: me.moveToText,
    	        		        	iconCls: 'extensible-cal-icon-evt-move',
    	        		        	menu: me.dateMenu
    	        		        },{
    	        		        	text: me.copyToText,
    	        		        	iconCls: 'extensible-cal-icon-evt-copy',
    	        		        	menu: me.copyMenu
    	        		        }]
    	        	});
    	        }
    	    }

    });


    //
    // example 1: simplest possible stand-alone configuration
    //
    Ext.create('Extensible.calendar.CalendarPanel', {
    	id: 'cal-example1',
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
    Ext.create('Extensible.calendar.CalendarPanel', {
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
