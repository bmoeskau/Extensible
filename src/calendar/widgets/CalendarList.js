/**
 * @class Ext.ensible.cal.CalendarList
 * @extends Ext.Panel
 * <p>This is a {@link Ext.Panel panel} subclass that renders a list of available calendars
 * @constructor
 * @param {Object} config The config object
 * @xtype calendarpanel
 */
Ext.ensible.cal.CalendarList = Ext.extend(Ext.Panel, {
    title: 'Calendars',
    collapsible: true,
    autoHeight: true,
    layout: 'fit',
    menuSelector: 'em',
    hiddenCalendarIds: [2],
    width: 100, // this should be overridden by this container's layout
    
    /**
     * @cfg {Ext.data.Store} store
     * A {@link Ext.data.Store store} containing records of type {@link Ext.ensible.cal.CalendarRecord CalendarRecord}.
     * This is a required config and is used to populate the calendar list.  The CalendarList widget will also listen for events from
     * the store and automatically refresh iteself in the event that the underlying calendar records in the store change.
     */
    
    // private
    initComponent: function(){
        this.addClass('x-calendar-list');
        Ext.ensible.cal.CalendarList.superclass.initComponent.call(this);
    },
    
    // private
    afterRender : function(ct, position){
        Ext.ensible.cal.CalendarList.superclass.afterRender.call(this);
        
        if(this.store){
            this.setStore(this.store, true);
        }
        this.refresh();
        
        this.body.on('click', this.onClick, this);
        this.body.on('mouseover', this.onMouseOver, this, {delegate: 'li'});
        this.body.on('mouseout', this.onMouseOut, this, {delegate: 'li'});
    },
    
    // private
    getListTemplate : function(){
        if(!this.tpl){
            this.tpl = new Ext.XTemplate(
                '<ul><tpl for=".">',
                    '<li id="{cmpId}__{' + Ext.ensible.cal.CalendarMappings.CalendarId.name + '}" class="ext-cal-evr {' + 
                    Ext.ensible.cal.CalendarMappings.StyleClass.name + '}-ad {hiddenCls}">{' + 
                    Ext.ensible.cal.CalendarMappings.Title.name + '}<em>&#160;</em></li>',
                '</tpl></ul>'
            );
            this.tpl.compile();
        }
        return this.tpl;
    },
    
    /**
     * Sets the store used to display the available calendars. It should contain 
     * records of type {@link Ext.ensible.cal.CalendarRecord CalendarRecord}.
     * @param {Ext.data.Store} store
     */
    setStore : function(store, initial){
        if(!initial && this.store){
            this.store.un("datachanged", this.refresh, this);
            this.store.un("add", this.refresh, this);
            this.store.un("remove", this.refresh, this);
            this.store.un("update", this.refresh, this);
            this.store.un("clear", this.refresh, this);
        }
        if(store){
            store.on("datachanged", this.refresh, this);
            store.on("add", this.refresh, this);
            store.on("remove", this.refresh, this);
            store.on("update", this.refresh, this);
            store.on("clear", this.refresh, this);
        }
        this.store = store;
    },
    
    /**
     * Refreshes the calendar list so that it displays based on the most current state of
     * the underlying calendar store. Usually this method does not need to be called directly
     * as the control is automatically bound to the store's events, but it is available in the
     * event that a manual refresh is ever needed.
     */
    refresh: function(){
        var data = [], i = 0, 
            recs = this.store.getRange(),
            len = recs.length;
            
        for(; i < len; i++){
            data[data.length] = Ext.apply({cmpId: this.id}, recs[i].data);
            if(this.isHidden(recs[i].data[Ext.ensible.cal.CalendarMappings.CalendarId.name])){
                data[data.length-1].hiddenCls = 'ext-cal-hidden';
            }
        }
        this.getListTemplate().overwrite(this.body, data);
    },

    // private
    getHiddenCalendarIndex: function(calendarId){
        var i = 0,
            len = this.hiddenCalendarIds.length;
            
        for(; i < len; i++){
            if(this.hiddenCalendarIds[i] == calendarId){
                return i;
            }
        }
        return -1;
    },
        
    // private
    isHidden: function(calendarId){
        return this.getHiddenCalendarIndex(calendarId) > -1;
    },
    
    // private
    toggleCalendar: function(calendarId){
        var i = this.getHiddenCalendarIndex(calendarId);
        if(i > -1){
            this.showCalendar(calendarId);
        }
        else {
            this.hideCalendar(calendarId);
        }
    },
    
    // private
    showCalendar: function(calendarId){
        if(this.isHidden(calendarId)){
            this.hiddenCalendarIds.splice(this.getHiddenCalendarIndex(calendarId), 1);
            Ext.fly(this.id+'__'+calendarId).removeClass('ext-cal-hidden');
        }
    },
    
    // private
    hideCalendar: function(calendarId){
        if(!this.isHidden(calendarId)){
            this.hiddenCalendarIds.push(calendarId);
            Ext.fly(this.id+'__'+calendarId).addClass('ext-cal-hidden');
        }
    },
    
    // private
    hideOtherCalendars: function(calendarId){
        var i = 0, recId,
            recs = this.store.getRange(),
            len = recs.length;
            
        for(; i < len; i++){
            recId = recs[i].data[Ext.ensible.cal.CalendarMappings.CalendarId.name];
            if(recId == calendarId){
                this.showCalendar(recId);
            }
            else{
                this.hideCalendar(recId);
            }
        }
    },
    
    // private
    onMouseOver: function(e, t){
        Ext.fly(t).addClass('hover');
    },
    
    // private
    onMouseOut: function(e, t){
        Ext.fly(t).removeClass('hover');
    },
    
    // private
    onClick : function(e, t){
        var el;
        if(el = e.getTarget(this.menuSelector, 3, true)){
            this.showEventMenu(el, e.getXY());
        }
        else if(el = e.getTarget('li', 3, true)){
            this.toggleCalendar(el.id.split('__')[1]);
        } 
    },
    
    // private
    onEventContextHide : function(){
        if(this.menu.ctxEl){
            this.menu.ctxEl = null;
        }
    },
    
    // private
    showEventMenu : function(el, xy){
        if(!this.menu){
            this.menu = new Ext.menu.Menu({
                id: this.id+'-cal-menu',
                cls: 'x-calendar-list-menu',
                plain: true,
                items: [{
                    text: 'Display only this calendar',
                    scope: this,
                    handler: function(){
                        this.hideOtherCalendars(this.menu.ctxEl.id.split('__')[1]);
                    }
                }, '-', {
                    xtype: 'extensible.calendarcolorpalette',
                    listeners: {
                        'select': {
                            fn: function(cp, color){
                                //alert(color);
                            },
                            scope: this
                        }
                    }
                }]
            });
            this.menu.on('hide', this.onEventContextHide, this);
        }
        if(this.menu.ctxEl){
            this.menu.ctxEl = null;
        }
        this.menu.ctxEl = el.parent('li');
        this.menu.showAt(xy);
    }
});

Ext.reg('extensible.calendarlist', Ext.ensible.cal.CalendarList);