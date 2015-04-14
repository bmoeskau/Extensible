/**
 * This is a {@link Ext.Panel panel} subclass that renders a list of available calendars.
 * It is not part of the Extensible.calendar.CalendarPanel component, but is instead meant
 * to be displayed somewhere else inside of an application layout.
 */
Ext.define('Extensible.calendar.gadget.CalendarListPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.extensible.calendarlist',
    
    requires: [
        'Ext.XTemplate',
        'Extensible.calendar.gadget.CalendarListMenu'
    ],
    
    title: 'Calendars',
    collapsible: true,
    autoHeight: true,
    layout: 'fit',
    menuSelector: 'em',
    width: 100, // this should be overridden by this container's layout
    
    /**
     * @cfg {Ext.data.Store} store
     * A {@link Ext.data.Store store} containing records of type {@link Extensible.calendar.data.CalendarModel CalendarRecord}.
     * This is a required config and is used to populate the calendar list.  The CalendarList widget will also listen for events from
     * the store and automatically refresh iteself in the event that the underlying calendar records in the store change.
     */
    
    initComponent: function() {
        this.addCls('x-calendar-list');
        this.callParent(arguments);
    },
    
    afterRender: function(ct, position) {
        this.callParent(arguments);
        
        if(this.store) {
            this.setStore(this.store, true);
        }
        this.refresh();
        
        this.body.on('click', this.onClick, this);
        this.body.on('mouseover', this.onMouseOver, this, {delegate: 'li'});
        this.body.on('mouseout', this.onMouseOut, this, {delegate: 'li'});
    },
    
    getListTemplate: function() {
        if(!this.tpl) {
            this.tpl = !(Ext.isIE || Ext.isOpera) ?
                Ext.create('Ext.XTemplate',
                    '<ul class="x-unselectable"><tpl for=".">',
                        '<li id="{cmpId}" class="ext-cal-evr {colorCls} {hiddenCls}">{title}<em>&#160;</em></li>',
                    '</tpl></ul>'
                )
                : Ext.create('Ext.XTemplate',
                    '<ul class="x-unselectable"><tpl for=".">',
                        '<li id="{cmpId}" class="ext-cal-evo {colorCls} {hiddenCls}">',
                            '<div class="ext-cal-evm">',
                                '<div class="ext-cal-evi">{title}<em>&#160;</em></div>',
                            '</div>',
                        '</li>',
                    '</tpl></ul>'
                );
            this.tpl.compile();
        }
        return this.tpl;
    },
    
    /**
     * Sets the store used to display the available calendars. It should contain
     * records of type {@link Extensible.calendar.data.CalendarModel CalendarRecord}.
     * @param {Ext.data.Store} store
     */
    setStore: function(store, initial) {
        if(!initial && this.store) {
            this.store.un("load", this.refresh, this);
            this.store.un("add", this.refresh, this);
            this.store.un("remove", this.refresh, this);
            this.store.un("update", this.onUpdate, this);
            this.store.un("clear", this.refresh, this);
        }
        if(store) {
            store.on("load", this.refresh, this);
            store.on("add", this.refresh, this);
            store.on("remove", this.refresh, this);
            store.on("update", this.onUpdate, this);
            store.on("clear", this.refresh, this);
        }
        this.store = store;
    },
    
    onUpdate: function(ds, rec, operation) {
        // ignore EDIT notifications, only refresh after a commit
        if(operation === Ext.data.Record.COMMIT) {
            this.refresh();
        }
    },
    
    /**
     * Refreshes the calendar list so that it displays based on the most current state of
     * the underlying calendar store. Usually this method does not need to be called directly
     * as the control is automatically bound to the store's events, but it is available in the
     * event that a manual refresh is ever needed.
     */
    refresh: function() {
        if(this.skipRefresh) {
            return;
        }
        var data = [], i = 0, o = null,
            CM = Extensible.calendar.data.CalendarMappings,
            recs = this.store.getRange(),
            len = recs.length;
            
        for (; i < len; i++) {
            o = {
                cmpId: this.id + '__' + recs[i].data[CM.CalendarId.name],
                title: recs[i].data[CM.Title.name],
                colorCls: this.getColorCls(recs[i].data[CM.ColorId.name])
            };
            if(recs[i].data[CM.IsHidden.name] === true) {
                o.hiddenCls = 'ext-cal-hidden';
            }
            data[data.length] = o;
        }
        this.getListTemplate().overwrite(this.body, data);
    },
    
    getColorCls: function(colorId) {
        return 'x-cal-'+colorId+'-ad';
    },
    
    toggleCalendar: function(id, commit) {
        var rec = this.store.findRecord(Extensible.calendar.data.CalendarMappings.CalendarId.name, id),
            CM = Extensible.calendar.data.CalendarMappings,
            isHidden = rec.data[CM.IsHidden.name];

        rec.set(CM.IsHidden.name, !isHidden);
        
        if(commit !== false) {
            rec.commit();
        }
    },
    
    showCalendar: function(id, commit) {
        var rec = this.store.findRecord(Extensible.calendar.data.CalendarMappings.CalendarId.name, id);
        if(rec.data[Extensible.calendar.data.CalendarMappings.IsHidden.name] === true) {
            this.toggleCalendar(id, commit);
        }
    },
    
    hideCalendar: function(id, commit) {
        var rec = this.store.findRecord(Extensible.calendar.data.CalendarMappings.CalendarId.name, id);
        if(rec.data[Extensible.calendar.data.CalendarMappings.IsHidden.name] !== true) {
            this.toggleCalendar(id, commit);
        }
    },
    
    radioCalendar: function(id) {
        var i = 0, recId,
            calendarId = Extensible.calendar.data.CalendarMappings.CalendarId.name,
            recs = this.store.getRange(),
            len = recs.length;

        for (; i < len; i++) {
            recId = recs[i].data[calendarId];
            // make a truthy check so that either numeric or string ids can match
            if(recId == id) {
                this.showCalendar(recId, false);
            }
            else{
                this.hideCalendar(recId, false);
            }
        }
        
        // store.commitChanges() just loops over each modified record and calls rec.commit(),
        // which in turns fires an update event that would cause a full refresh for each record.
        // To avoid this we simply set a flag and make sure we only refresh once per commit set.
        this.skipRefresh = true;
        this.store.sync();
        delete this.skipRefresh;
        this.refresh();
    },

    onMouseOver: function(e, t) {
        Ext.fly(t).addCls('hover');
    },

    onMouseOut: function(e, t) {
        Ext.fly(t).removeCls('hover');
    },

    getCalendarId: function(el) {
        return el.id.split('__')[1];
    },

    getCalendarItemEl: function(calendarId) {
        return Ext.get(this.id+'__'+calendarId);
    },

    onClick: function(e, t) {
        var el = e.getTarget(this.menuSelector, 3, true);
        
        if (el) {
            this.showEventMenu(el, e.getXY());
        }
        else {
            el = e.getTarget('li', 3, true);
            
            if (el) {
                this.toggleCalendar(this.getCalendarId(el));
            }
        }
    },

    handleColorChange: function(menu, id, colorId, origColorId) {
        var rec = this.store.findRecord(Extensible.calendar.data.CalendarMappings.CalendarId.name, id);
        rec.data[Extensible.calendar.data.CalendarMappings.ColorId.name] = colorId;
        rec.commit();
    },

    handleRadioCalendar: function(menu, id) {
        this.radioCalendar(id);
    },

    showEventMenu: function(el, xy) {
        var id = this.getCalendarId(el.parent('li')),
            rec = this.store.findRecord(Extensible.calendar.data.CalendarMappings.CalendarId.name, id),
            colorId = rec.data[Extensible.calendar.data.CalendarMappings.ColorId.name];
            
        if(!this.menu) {
            this.menu = Ext.create('Extensible.calendar.gadget.CalendarListMenu');
            this.menu.on('colorchange', this.handleColorChange, this);
            this.menu.on('radiocalendar', this.handleRadioCalendar, this);
        }
        this.menu.setCalendar(id, colorId);
        this.menu.showAt(xy);
    }
});