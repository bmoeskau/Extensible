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
                '<ul class="x-unselectable"><tpl for=".">',
                    '<li id="{cmpId}" class="ext-cal-evr {colorCls} {hiddenCls}">{title}<em>&#160;</em></li>',
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
        var data = [], i = 0, o = null, 
            recs = this.store.getRange(),
            len = recs.length;
            
        for(; i < len; i++){
            o = {
                cmpId: this.id + '__' + recs[i].data[Ext.ensible.cal.CalendarMappings.CalendarId.name],
                title: recs[i].data[Ext.ensible.cal.CalendarMappings.Title.name],
                colorCls: this.getColorCls(recs[i].data[Ext.ensible.cal.CalendarMappings.ColorId.name])
            };
            if(recs[i].data[Ext.ensible.cal.CalendarMappings.IsHidden.name] === true){
                o.hiddenCls = 'ext-cal-hidden';
            }
            data[data.length] = o;
        }
        this.getListTemplate().overwrite(this.body, data);
    },
    
    // private
    getColorCls: function(colorId){
        return 'x-cal-'+colorId+'-ad';
    },
    
    // private
    toggleCalendar: function(id){
        var rec = this.store.getById(id),
            isHidden = rec.data[Ext.ensible.cal.CalendarMappings.IsHidden.name]; 
        
        rec.data[Ext.ensible.cal.CalendarMappings.IsHidden.name] = !isHidden;
        rec.commit();
    },
    
    // private
    showCalendar: function(id){
        var rec = this.store.getById(id);
        if(rec.data[Ext.ensible.cal.CalendarMappings.IsHidden.name] === true){
            this.toggleCalendar(id);
        }
    },
    
    // private
    hideCalendar: function(id){
        var rec = this.store.getById(id);
        if(rec.data[Ext.ensible.cal.CalendarMappings.IsHidden.name] !== true){
            this.toggleCalendar(id);
        }
    },
    
    // private
    radioCalendar: function(id){
        var i = 0, recId,
            recs = this.store.getRange(),
            len = recs.length;
            
        for(; i < len; i++){
            recId = recs[i].data[Ext.ensible.cal.CalendarMappings.CalendarId.name];
            if(recId === id){
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
    getCalendarId: function(el){
        return parseInt(el.id.split('__')[1]);
    },
    
    // private
    getCalendarItemEl: function(calendarId){
        return Ext.get(this.id+'__'+calendarId);
    },
    
    // private
    onClick : function(e, t){
        var el;
        if(el = e.getTarget(this.menuSelector, 3, true)){
            this.showEventMenu(el, e.getXY());
        }
        else if(el = e.getTarget('li', 3, true)){
            this.toggleCalendar(this.getCalendarId(el));
        } 
    },
    
    // private
    handleColorChange: function(menu, id, colorId, origColorId){
        var rec = this.store.getById(id);
        rec.data[Ext.ensible.cal.CalendarMappings.ColorId.name] = colorId;
        rec.commit();
    },
    
    // private
    handleRadioCalendar: function(menu, id){
        this.radioCalendar(id);
    },
    
    // private
    showEventMenu : function(el, xy){
        var id = this.getCalendarId(el.parent('li')),
            rec = this.store.getById(id),
            colorId = rec.data[Ext.ensible.cal.CalendarMappings.ColorId.name];
            
        if(!this.menu){
            this.menu = new Ext.ensible.cal.CalendarListMenu();
            this.menu.on('colorchange', this.handleColorChange, this);
            this.menu.on('radiocalendar', this.handleRadioCalendar, this);
        }
        this.menu.setCalendar(id, colorId);
        this.menu.showAt(xy);
    }
});

Ext.reg('extensible.calendarlist', Ext.ensible.cal.CalendarList);