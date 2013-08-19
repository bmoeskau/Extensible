/** @private
 * Internal drag zone implementation for the calendar day and week views.
 */
Ext.define('Extensible.calendar.dd.DayDragZone', {
    extend: 'Extensible.calendar.dd.DragZone',
    
    ddGroup: 'DayViewDD',
    resizeSelector: '.ext-evt-rsz',
    
    getDragData: function(e) {
        var target = e.getTarget(this.resizeSelector, 2, true),
            rec,
            parent;
        
        if (target) {
            parent = target.parent(this.eventSelector);
            rec = this.view.getEventRecordFromEl(parent);
            
            if (!rec) {
                // if rec is null here it usually means there was a timing issue between drag
                // start and the browser reporting it properly. Simply ignore and it will
                // resolve correctly once the browser catches up.
                return;
            }
            return {
                type: 'eventresize',
                xy: e.getXY(),
                ddel: parent.dom,
                eventStart: rec.data[Extensible.calendar.data.EventMappings.StartDate.name],
                eventEnd: rec.data[Extensible.calendar.data.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }
        
        target = e.getTarget(this.eventSelector, this.eventSelectorDepth);
        
        if (target) {
            rec = this.view.getEventRecordFromEl(target);
            
            if (!rec) {
                // if rec is null here it usually means there was a timing issue between drag
                // start and the browser reporting it properly. Simply ignore and it will
                // resolve correctly once the browser catches up.
                return;
            }
            return {
                type: 'eventdrag',
                xy: e.getXY(),
                ddel: target,
                eventStart: rec.data[Extensible.calendar.data.EventMappings.StartDate.name],
                eventEnd: rec.data[Extensible.calendar.data.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }
        
        // If not dragging/resizing an event then we are dragging on the calendar to add a new event
        target = this.view.getDayAt(e.getX(), e.getY());
        
        if (target.el) {
            return {
                type: 'caldrag',
                dayInfo: target,
                proxy: this.proxy
            };
        }
        return null;
    }
});