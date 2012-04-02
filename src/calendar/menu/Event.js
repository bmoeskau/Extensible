/**
 * @class Extensible.calendar.menu.Event
 * @extends Ext.menu.Menu
 * The context menu displayed for calendar events in any {@link Extensible.calendar.view.AbstractCalendar CalendarView} subclass. 
 * @xtype extensible.eventcontextmenu
 */
Ext.define('Extensible.calendar.menu.Event', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.extensible.eventcontextmenu',
    
    requires: ['Ext.menu.DatePicker'],
    
    /** 
     * @cfg {Boolean} hideOnClick
     * False to continue showing the menu after a color is selected, defaults to true.
     */
    hideOnClick : true,
    /**
     * @cfg {Boolean} ignoreParentClicks
     * True to ignore clicks on any item in this menu that is a parent item (displays a submenu) 
     * so that the submenu is not dismissed when clicking the parent item (defaults to true).
     */
    ignoreParentClicks: true,
    /**
     * @cfg {String} editDetailsText
     * The text to display for the 'Edit Details' option in the menu.
     */
    editDetailsText: 'Edit Details',
    /**
     * @cfg {String} deleteText
     * The text to display for the 'Delete' option in the menu.
     */
    deleteText: 'Delete',
    /**
     * @cfg {String} moveToText
     * The text to display for the 'Move to...' option in the menu.
     */
    moveToText: 'Move to...',
    /**
     * @cfg {String} copyText
     * The text to display for the copy option in the menu
     */
    copyText: 'Copy',
    /** 
     * @cfg {Boolean} enableScrolling
     * @hide 
     */
    enableScrolling : false,
    /** 
     * @cfg {Number} maxHeight
     * @hide 
     */
    /** 
     * @cfg {Number} scrollIncrement
     * @hide 
     */
    /**
     * @event click
     * @hide
     */
    /**
     * @event itemclick
     * @hide
     */
    
    // private
    initComponent : function(){
        this.addEvents(
            /**
             * @event editdetails
             * Fires when the user selects the option to edit the event details
             * (by default, in an instance of {@link Extensible.calendar.form.EventDetails}. Handling code should 
             * transfer the current event record to the appropriate instance of the detailed form by showing
             * the form and calling {@link Extensible.calendar.form.EventDetails#loadRecord loadRecord}.
             * @param {Extensible.calendar.menu.Event} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record} that is currently being edited
             * @param {Ext.Element} el The element associated with this context menu
             */
            'editdetails',
            /**
             * @event eventdelete
             * Fires after the user selectes the option to delete an event. Note that this menu does not actually
             * delete the event from the data store. This is simply a notification that the menu option was selected --
             * it is the responsibility of handling code to perform the deletion and any clean up required.
             * @param {Extensible.calendar.menu.Event} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record} for the event to be deleted
             * @param {Ext.Element} el The element associated with this context menu
             */
            'eventdelete',
            /**
             * @event eventmove
             * Fires after the user selects a date in the calendar picker under the "move event" menu option. Note that this menu does not actually
             * update the event in the data store. This is simply a notification that the menu option was selected --
             * it is the responsibility of handling code to perform the move action and any clean up required.
             * @param {Extensible.calendar.menu.Event} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record} for the event to be moved
             * @param {Date} dt The new start date for the event (the existing event start time will be preserved)
             */
            'eventmove',
            /**@event event copy
             * Fires when the user selects copy menu option and selects a date.
             * @param {Extensible.calendar.menu.Event} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record} for the event to be moved
             * @param {Date} stdt The start date time to copy the event to
             * @param {Date} endt The end date time
             */
            'eventcopy'
        );
        this.buildMenu();
        this.callParent(arguments);
    },
    
    /**
     * Overrideable method intended for customizing the menu items. This should only to be used for overriding 
     * or called from a subclass and should not be called directly from application code.
     */
    buildMenu: function(){
        if(this.rendered){
            return;
        }
        this.dateMenu = Ext.create('Ext.menu.DatePicker', {
            scope: this,
            handler: function(dp, dt){
                dt = Extensible.Date.copyTime(this.rec.data[Extensible.calendar.data.EventMappings.StartDate.name], dt);
                this.fireEvent('eventmove', this, this.rec, dt);
            }
        });
        this.copyMenu = Ext.create('Ext.menu.DatePicker',{
            scope: this,
            handler: function(dp,dt){
                stdt = Extensible.Date.copyTime(this.rec.data[Extensible.calendar.data.EventMappings.StartDate.name], dt);
                endt = Extensible.Date.copyTime(this.rec.data[Extensible.calendar.data.EventMappings.EndDate.name], dt);
                this.fireEvent('eventcopy', this, this.rec, stdt, endt);
            }
        });
        
        Ext.apply(this, {
            items: [{
                text: this.editDetailsText,
                iconCls: 'extensible-cal-icon-evt-edit',
                scope: this,
                handler: function(){
                    this.fireEvent('editdetails', this, this.rec, this.ctxEl, Extensible.Date.add(this.rec.get(Extensible.calendar.data.EventMappings.StartDate.name, {days:1})));
                }
            },{
                text: this.deleteText,
                iconCls: 'extensible-cal-icon-evt-del',
                scope: this,
                handler: function(){
                    this.fireEvent('eventdelete', this, this.rec, this.ctxEl);
                }
            },'-',{
                text: this.moveToText,
                iconCls: 'extensible-cal-icon-evt-move',
                menu: this.dateMenu
            },{
                text: this.copyText,
                iconCls: 'extensible-cal-icon-evt-copy',
                menu: this.copyMenu
            }]
        });
    },
    
    /**
     * Shows the specified event at the given XY position. 
     * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record} for the event
     * @param {Ext.Element} el The element associated with this context menu
     * @param {Array} xy The X & Y [x, y] values for the position at which to show the menu (coordinates are page-based) 
     */
    showForEvent: function(rec, el, xy){
        this.rec = rec;
        this.ctxEl = el;
        this.dateMenu.picker.setValue(rec.data[Extensible.calendar.data.EventMappings.StartDate.name]);
        this.showAt(xy);
    },
    
    // private
    onHide : function(){
        this.callParent(arguments);
        delete this.ctxEl;
    }
});