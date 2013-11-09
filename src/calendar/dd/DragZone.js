/**
 * Internal drag zone implementation for the calendar components. This provides base functionality
 * and is primarily for the month view -- DayViewDD adds day/week view-specific functionality.
 * @private
 */
Ext.define('Extensible.calendar.dd.DragZone', {
    extend: 'Ext.dd.DragZone',
    
    requires: [
        'Ext.util.Point',
        'Extensible.calendar.dd.StatusProxy',
        'Extensible.calendar.data.EventMappings'
    ],
    
    ddGroup: 'CalendarDD',
    eventSelector: '.ext-cal-evt',
    eventSelectorDepth: 10,
    
    constructor: function(el, config) {
        if(!Extensible.calendar._statusProxyInstance) {
            Extensible.calendar._statusProxyInstance = Ext.create('Extensible.calendar.dd.StatusProxy');
        }
        this.proxy = Extensible.calendar._statusProxyInstance;
        this.callParent(arguments);
    },
    
    getDragData: function(e) {
        // Check whether we are dragging on an event first
        var t = e.getTarget(this.eventSelector, this.eventSelectorDepth);
        if(t) {
            var rec = this.view.getEventRecordFromEl(t);
            if(!rec) {
                // if rec is null here it usually means there was a timing issue between drag
                // start and the browser reporting it properly. Simply ignore and it will
                // resolve correctly once the browser catches up.
                return;
            }
            return {
                type: 'eventdrag',
                ddel: t,
                eventStart: rec.data[Extensible.calendar.data.EventMappings.StartDate.name],
                eventEnd: rec.data[Extensible.calendar.data.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }
        
        // If not dragging an event then we are dragging on the calendar to add a new event
        t = this.view.getDayAt(e.getX(), e.getY());
        if(t.el) {
            return {
                type: 'caldrag',
                start: t.date,
                proxy: this.proxy
            };
        }
        return null;
    },
    
    onInitDrag: function(x, y) {
        if(this.dragData.ddel) {
            var ghost = this.dragData.ddel.cloneNode(true),
                child = Ext.fly(ghost).down('dl');
            
            Ext.fly(ghost).setWidth('auto');
            
            if(child) {
                // for IE/Opera
                child.setHeight('auto');
            }
            this.proxy.update(ghost);
            this.onStartDrag(x, y);
        }
        else if(this.dragData.start) {
            this.onStartDrag(x, y);
        }
        this.view.onInitDrag();
        return true;
    },
    
    afterRepair: function() {
        if(Ext.enableFx && this.dragData.ddel) {
            Ext.fly(this.dragData.ddel).highlight(this.hlColor || 'c3daf9');
        }
        this.dragging = false;
    },
    
    getRepairXY: function(e) {
        if(this.dragData.ddel) {
            return Ext.fly(this.dragData.ddel).getXY();
        }
    },
    
    afterInvalidDrop: function(e, id) {
        Ext.select('.ext-dd-shim').hide();
    },
    
    destroy: function() {
        this.callParent(arguments);
        delete Extensible.calendar._statusProxyInstance;
    }
});