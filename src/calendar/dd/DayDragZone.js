/* @private
 * Internal drag zone implementation for the calendar day and week views.
 */
Ext.define('Extensible.calendar.dd.DayDragZone', {
    extend: 'Extensible.calendar.dd.DragZone',
    
    ddGroup : 'DayViewDD',
    resizeSelector : '.ext-evt-rsz',
    
    getDragData : function(e){
        var t = e.getTarget(this.resizeSelector, 2, true);
        if(t){
            var p = t.parent(this.eventSelector), 
                rec = this.view.getEventRecordFromEl(p);
            
            if(!rec){
                // if rec is null here it usually means there was a timing issue between drag 
                // start and the browser reporting it properly. Simply ignore and it will 
                // resolve correctly once the browser catches up.
                return;
            }
            return {
                type: 'eventresize',
                xy: e.getXY(),
                ddel: p.dom,
                eventStart: rec.data[Extensible.calendar.data.EventMappings.StartDate.name],
                eventEnd: rec.data[Extensible.calendar.data.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }
        var t = e.getTarget(this.eventSelector, this.eventSelectorDepth);
        if(t){
            var rec = this.view.getEventRecordFromEl(t);
            if(!rec){
                // if rec is null here it usually means there was a timing issue between drag 
                // start and the browser reporting it properly. Simply ignore and it will 
                // resolve correctly once the browser catches up.
                return;
            }
            return {
                type: 'eventdrag',
                xy: e.getXY(),
                ddel: t,
                eventStart: rec.data[Extensible.calendar.data.EventMappings.StartDate.name],
                eventEnd: rec.data[Extensible.calendar.data.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }
        
        // If not dragging/resizing an event then we are dragging on 
        // the calendar to add a new event
        t = this.view.getDayAt(e.getX(), e.getY());
        if(t.el){
            return {
                type: 'caldrag',
                dayInfo: t,
                proxy: this.proxy
            };
        }
        return null;
    }
});