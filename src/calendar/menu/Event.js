/**
 * The context menu displayed for events in any Extensible.calendar.view.AbstractCalendar subclass.
 */
Ext.define('Extensible.calendar.menu.Event', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.extensible.eventcontextmenu',
    
    requires: ['Ext.menu.DatePicker'],
    
    /**
     * @cfg {Boolean} hideOnClick
     * False to continue showing the menu after a color is selected, defaults to true.
     */
    hideOnClick: true,
    /**
     * @cfg {Boolean} ignoreParentClicks
     * True to ignore clicks on any item in this menu that is a parent item (displays a submenu)
     * so that the submenu is not dismissed when clicking the parent item (defaults to true).
     */
    ignoreParentClicks: true,
    /**
     * @cfg {Number} startDay
     * The 0-based index for the day on which the calendar week begins (0=Sunday, which is the default)
     */
    startDay: 0,
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
     * @cfg {String} copyToText
     * The text to display for the copy option in the menu
     */
    copyToText: 'Copy to...',
    /**
     * @cfg {Boolean} enableScrolling
     * @hide
     */
    enableScrolling: false,
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
    /**
     * @cfg ownerCalendarPanel
     * @type Extensible.calendar.CalendarPanel
     * If this menu is hosted inside a {@link Extensible.calendar.CalendarPanel CalendarPanel} this property will reference
     * it. If the menu was created directly outside of a CalendarPanel this property will be null. Read-only.
     */
    ownerCalendarPanel: {},

    initComponent: function() {
        //this.addEvents(
        //    /**
        //     * @event editdetails
        //     * Fires when the user selects the option to edit the event details
        //     * (by default, in an instance of {@link Extensible.calendar.form.EventDetails}. Handling code should
        //     * transfer the current event record to the appropriate instance of the detailed form by showing
        //     * the form and calling {@link Extensible.calendar.form.EventDetails#loadRecord loadRecord}.
        //     * @param {Extensible.calendar.menu.Event} this
        //     * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel
        //     * record} that is currently being edited
        //     * @param {Ext.Element} el The element associated with this context menu
        //     */
        //    'editdetails',
        //    /**
        //     * @event eventdelete
        //     * Fires after the user selectes the option to delete an event. Note that this menu does not actually
        //     * delete the event from the data store. This is simply a notification that the menu option was
        //     * selected -- it is the responsibility of handling code to perform the deletion and any clean
        //     * up required.
        //     * @param {Extensible.calendar.menu.Event} this
        //     * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel
        //     * record} for the event to be deleted
        //     * @param {Ext.Element} el The element associated with this context menu
        //     */
        //    'eventdelete',
        //    /**
        //     * @event eventmove
        //     * Fires after the user selects a date in the calendar picker under the "move event" menu option.
        //     * Note that this menu does not actually update the event in the data store. This is simply a
        //     * notification that the menu option was selected -- it is the responsibility of handling code
        //     * to perform the move action and any clean up required.
        //     * @param {Extensible.calendar.menu.Event} this
        //     * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel
        //     * record} for the event to be moved
        //     * @param {Date} dt The new start date for the event (the existing event start time will be preserved)
        //     */
        //    'eventmove',
        //    /**
        //     * @event eventcopy
        //     * Fires after the user selects a date in the calendar picker under the "copy event" menu option.
        //     * Note that this menu does not actually update the event in the data store. This is simply a
        //     * notification that the menu option was selected -- it is the responsibility of handling code
        //     * to perform the copy action.
        //     * @param {Extensible.calendar.menu.Event} this
        //     * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel
        //     * record} for the event to be copied
        //     * @param {Date} dt The start date for the event copy (the existing event start time will
        //     * be preserved)
        //     */
        //    'eventcopy'
        //);

        this.buildMenu();
        this.callParent(arguments);
    },
    
    /**
     * Overrideable method intended for customizing the menu items. This should only to be used for overriding
     * or called from a subclass and should not be called directly from application code.
     */
    buildMenu: function() {
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
        
        Ext.apply(me, {
            items: [{
                text: me.editDetailsText,
                iconCls: 'extensible-cal-icon-evt-edit',
                scope: me,
                handler: function() {
                    me.fireEvent('editdetails', me, me.rec, me.ctxEl);
                }
            },{
                text: me.deleteText,
                iconCls: 'extensible-cal-icon-evt-del',
                scope: me,
                handler: function() {
                    me.fireEvent('eventdelete', me, me.rec, me.ctxEl);
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
    },
    
    onEventMoveSelected: function(datePicker, selectedDate) {
        this.doCopyOrMove(selectedDate, 'move');
    },
    
    onEventCopySelected: function(datePicker, selectedDate) {
        this.doCopyOrMove(selectedDate, 'copy');
    },
    
    doCopyOrMove: function(selectedDate, mode) {
        selectedDate = Extensible.Date.copyTime(
            this.rec.data[Extensible.calendar.data.EventMappings.StartDate.name], selectedDate);
        
        this.fireEvent('event' + mode, this, this.rec, selectedDate);
    },
    
    /**
     * Shows the specified event at the given XY position.
     * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel
     * record} for the event
     * @param {Ext.Element} el The element associated with this context menu
     * @param {Array} xy The X & Y [x, y] values for the position at which to show the menu (coordinates
     * are page-based)
     */
    showForEvent: function(rec, el, xy) {
        var me = this,
            startDate = rec.data[Extensible.calendar.data.EventMappings.StartDate.name];
        
        me.rec = rec;
        me.ctxEl = el;
        me.dateMenu.picker.setValue(startDate);
        me.copyMenu.picker.setValue(startDate);
        me.showAt(xy);
    },

    onHide: function() {
        this.callParent(arguments);
    },

    onDestroy: function() {
        delete this.ctxEl;
        this.callParent(arguments);
    }
});