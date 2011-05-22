/**
 * @class Ext.ensible.cal.CalendarListMenu
 * @extends Ext.menu.Menu
 * <p>A menu containing a {@link Ext.ensible.cal.ColorPalette palette} for choosing calendar colors, 
 * as well as other calendar-specific options.</p>
 * @xtype extensible.calendarlistmenu
 */
Ext.define('Ext.ensible.cal.CalendarListMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.calendarlistmenu',
    
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
     * @cfg {String} cls
     * An optional extra CSS class that will be added to this component's Element (defaults to 'x-calendar-list-menu'). 
     * This can be useful for adding customized styles to the component or any of its children using standard CSS rules.
     */
    cls : 'x-calendar-list-menu',
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
    
    /**
     * @property palette
     * @type ColorPalette
     * The {@link Ext.ensible.cal.ColorPalette ColorPalette} instance for this CalendarListMenu
     */
    
    // private
    initComponent : function(){
        this.addEvents(
            'showcalendar',
            'hidecalendar',
            'radiocalendar',
            'colorchange'
        );
        
        Ext.apply(this, {
            items: [{
                text: this.displayOnlyThisCalendarText,
                iconCls: 'extensible-cal-icon-cal-show',
                handler: this.handleRadioCalendarClick.createDelegate(this)
            }, '-', {
                xtype: 'extensible.calendarcolorpalette',
                handler: this.handleColorSelect.createDelegate(this)
            }]
        });
        Ext.ensible.cal.CalendarListMenu.superclass.initComponent.call(this);
    },
    
    // private
    afterRender: function(){
        Ext.ensible.cal.CalendarListMenu.superclass.afterRender.call(this);
        this.palette = this.findByType('extensible.calendarcolorpalette')[0];
        
        if(this.colorId){
            this.palette.select(this.colorId, true);
        }
    },
    
    // private
    handleRadioCalendarClick: function(e, t){
        this.fireEvent('radiocalendar', this, this.calendarId);
    },
    
    // private
    handleColorSelect: function(cp, selColorId){
        this.fireEvent('colorchange', this, this.calendarId, selColorId, this.colorId);
        this.colorId = selColorId;
        this.menuHide();
    },
    
    /**
     * Sets the calendar id and color id to be associated with this menu. This should be called each time the
     * menu is shown relative to a new calendar.
     * @param {Number} calendarId The id of the calendar to be associated
     * @param {Number} colorId The id of the color to be pre-selected in the color palette
     * @return {Ext.ensible.cal.CalendarListMenu} this
     */
    setCalendar: function(id, cid){
        this.calendarId = id;
        this.colorId = cid;
        
        if(this.rendered){
            this.palette.select(cid, true);
        }
        return this;
    },

    // private
    menuHide : function(){
        if(this.hideOnClick){
            this.hide(true);
        }
    }
});