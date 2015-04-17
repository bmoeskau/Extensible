/**
 * A menu containing a {@link Extensible.calendar.util.ColorPicker color picker} for choosing
 * calendar colors, as well as other calendar-specific options.
 * 
 * @private
 */
Ext.define('Extensible.calendar.gadget.CalendarListMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.extensible.calendarlistmenu',
    
    requires: ['Extensible.calendar.util.ColorPicker'],
    
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
     * @cfg {String} displayOnlyThisCalendarText
     * The text to display for the 'Display only this calendar' option in the menu.
     */
    displayOnlyThisCalendarText: 'Display only this calendar',
    /**
     * @cfg {Number} calendarId
     * The id of the calendar to be associated with this menu. This calendarId will be passed
     * back with any events from this menu to identify the calendar to be acted upon. The calendar
     * id can also be changed at any time after creation by calling {@link setCalendar}.
     */
    
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
     * @property palette
     * @type ColorPicker
     * The {@link Extensible.calendar.util.ColorPicker ColorPicker} instance for this CalendarListMenu
     */
    
    initComponent: function() {
        //this.addEvents(
        //    'showcalendar',
        //    'hidecalendar',
        //    'radiocalendar',
        //    'colorchange'
        //);

        Ext.apply(this, {
            plain: true,
            items: [{
                text: this.displayOnlyThisCalendarText,
                iconCls: 'extensible-cal-icon-cal-show',
                handler: Ext.bind(this.handleRadioCalendarClick, this)
            }, '-', {
                xtype: 'extensible.calendarcolorpicker',
                id: this.id + '-calendar-color-picker',
                handler: Ext.bind(this.handleColorSelect, this)
            }]
        });
        
        this.addCls('x-calendar-list-menu');
        this.callParent(arguments);
    },
    
    afterRender: function() {
        this.callParent(arguments);
        
        this.palette = this.down('#' + this.id + '-calendar-color-picker');
        
        if(this.colorId) {
            this.palette.select(this.colorId, true);
        }
    },
    
    handleRadioCalendarClick: function(e, t) {
        this.fireEvent('radiocalendar', this, this.calendarId);
    },
    
    handleColorSelect: function(cp, selColorId) {
        this.fireEvent('colorchange', this, this.calendarId, selColorId, this.colorId);
        this.colorId = selColorId;
        this.menuHide();
    },
    
    /**
     * Sets the calendar id and color id to be associated with this menu. This should be called each time the
     * menu is shown relative to a new calendar.
     * @param {Number} calendarId The id of the calendar to be associated
     * @param {Number} colorId The id of the color to be pre-selected in the color palette
     * @return {Extensible.calendar.gadget.CalendarListMenu} this
     */
    setCalendar: function(id, cid) {
        this.calendarId = id;
        this.colorId = cid;
        
        if(this.rendered) {
            this.palette.select(cid, true);
        }
        return this;
    },

    menuHide: function() {
        if(this.hideOnClick) {
            this.hide();
        }
    }
});