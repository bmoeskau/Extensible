/**
 * @class Ext.ensible.cal.EventContextMenu
 * @extends Ext.menu.Menu
 * The context menu displayed for calendar events in any {@link Ext.ensible.cal.CalendarView CalendarView} subclass. 
 * @xtype extensible.eventcontextmenu
 */
Ext.ensible.cal.EventContextMenu = Ext.extend(Ext.menu.Menu, {
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
             * (by default, in an instance of {@link Ext.ensible.cal.EventEditForm}. Handling code should 
             * transfer the current event record to the appropriate instance of the detailed form by showing
             * the form and calling {@link Ext.ensible.cal.EventEditForm#loadRecord loadRecord}.
             * @param {Ext.ensible.cal.EventContextMenu} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} that is currently being edited
             * @param {Ext.Element} el The element associated with this context menu
             */
            'editdetails',
            /**
             * @event eventdelete
             * Fires after the user selectes the option to delete an event. Note that this menu does not actually
             * delete the event from the data store. This is simply a notification that the menu option was selected --
             * it is the responsibility of handling code to perform the deletion and any clean up required.
             * @param {Ext.ensible.cal.EventContextMenu} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event to be deleted
             * @param {Ext.Element} el The element associated with this context menu
             */
            'eventdelete',
            /**
             * @event eventmove
             * Fires after the user selects a date in the calendar picker under the "move event" menu option. Note that this menu does not actually
             * update the event in the data store. This is simply a notification that the menu option was selected --
             * it is the responsibility of handling code to perform the move action and any clean up required.
             * @param {Ext.ensible.cal.EventContextMenu} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event to be moved
             * @param {Date} dt The new start date for the event (the existing event start time will be preserved)
             */
            'eventmove'
        );
        this.buildMenu();
        Ext.ensible.cal.CalendarListMenu.superclass.initComponent.call(this);
    },
    
    // private
    buildMenu: function(){
        this.dateMenu = new Ext.menu.DateMenu({
            scope: this,
            handler: function(dp, dt){
                dt = Ext.ensible.Date.copyTime(this.rec.data[Ext.ensible.cal.EventMappings.StartDate.name], dt);
                this.fireEvent('eventmove', this, this.rec, dt);
            }
        });
        
        Ext.apply(this, {
            items: [{
                text: this.editDetailsText,
                iconCls: 'extensible-cal-icon-evt-edit',
                scope: this,
                handler: function(){
                    this.fireEvent('editdetails', this, this.rec, this.ctxEl);
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
            }]
        });
    },
    
    /**
     * Shows the specified event at the given XY position. 
     * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event
     * @param {Ext.Element} el The element associated with this context menu
     * @param {Array} xy The X & Y [x, y] values for the position at which to show the menu (coordinates are page-based) 
     */
    showForEvent: function(rec, el, xy){
        this.rec = rec;
        this.ctxEl = el;
        this.dateMenu.picker.setValue(rec.data[Ext.ensible.cal.EventMappings.StartDate.name]);
        this.showAt(xy);
    },
    
    // private
    onHide : function(){
        Ext.ensible.cal.CalendarListMenu.superclass.onHide.call(this);
        delete this.ctxEl;
    }
});

Ext.reg('extensible.eventcontextmenu', Ext.ensible.cal.EventContextMenu);