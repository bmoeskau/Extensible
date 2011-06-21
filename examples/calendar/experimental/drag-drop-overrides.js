/*
 * ==============================
 *  IMPORTANT NOTE ON USAGE
 * ==============================
 * These are overrides required to get basic drag-drop functionality working between the
 * CalendarPanel and a GridPanel. These are NOT intended as a long-term solution for how
 * best to do this -- it is merely a proof-of-concept to determine what kinds of changes
 * will be necessary in the CalendarPanel to better enable this type of functionality in
 * a generic and flexible way in the future.  The code below is definitely not best-practice
 * code, but feel free to experiment with it.  In a forthcoming version of Extensible the
 * calendar DnD support will be refactored and these overrides will no longer be needed.
 */

Ext.require([
    'Extensible.calendar.view.AbstractCalendar',
    'Extensible.calendar.view.Day',
    'Extensible.calendar.data.EventMappings',
    'Extensible.calendar.dd.DropZone',
    'Extensible.calendar.dd.DayDropZone'
]);

Ext.onReady(function() {
    /*
     * Currently the calendar drop zone expects certain drag data to be present, so if dragging
     * from the grid, default the data as required for it to work
     */
    var nodeOverInterceptor = function(n, dd, e, data){
        if (data.selections) {
            data.type = 'griddrag';
            data.start = n.date;
            data.proxy = {
                updateMsg: Ext.emptyFn
            }
        }
    };
    
    /*
     * Need to hook into the drop to provide a custom mapping between the existing grid
     * record being dropped and the new calendar record being added
     */
    var nodeDropInterceptor = function(n, dd, e, data){
        if(n && data){
            if(data.type == 'griddrag'){
                var rec = Ext.create('Extensible.calendar.data.EventModel'),
                    M = Extensible.calendar.data.EventMappings;
                
                // These are the fields passed from the grid's record
                var gridData = data.selections[0].data;
                rec.data[M.Title.name] = gridData.title;
                rec.data[M.CalendarId.name] = gridData.cid;
                
                // You need to provide whatever default date range logic might apply here:
                rec.data[M.StartDate.name] = n.date;
                rec.data[M.EndDate.name] = n.date.add(Date.HOUR, 1);
                rec.data[M.IsAllDay.name] = false;
                
                // save the evrnt and clean up the view
                this.view.onEventDrop(rec, n.date);
                this.onCalendarDragComplete();
                return true;
            }
        }
    };
    
    /*
     * Day/Week view require special logic when dragging over to create a 
     * drag shim sized to the event being dragged
     */
    var dayViewNodeOverInterceptor = function(n, dd, e, data){
        if (data.selections) {
            data.type = 'griddrag';
            data.start = n.date;
            data.proxy = {
                updateMsg: Ext.emptyFn
            }
    
            var dayCol = e.getTarget('.ext-cal-day-col', 5, true);
            if (dayCol) {
                var box = {
                    height: Extensible.calendar.view.Day.prototype.hourHeight,
                    width: dayCol.getWidth(),
                    y: n.timeBox.y,
                    x: n.el.getLeft()
                }
                this.shim(n.date, box);
            }
        }
    };
    
    // Apply the interceptor functions to each class:
    var dropZoneProto = Extensible.calendar.dd.DropZone.prototype,
        dayDropZoneProto = Extensible.calendar.dd.DayDropZone.prototype 
    
    dropZoneProto.onNodeOver = Ext.Function.createInterceptor(dropZoneProto.onNodeOver, nodeOverInterceptor);
    dropZoneProto.onNodeDrop = Ext.Function.createInterceptor(dropZoneProto.onNodeDrop, nodeDropInterceptor);
    
    dayDropZoneProto.onNodeOver = Ext.Function.createInterceptor(dayDropZoneProto.onNodeOver, dayViewNodeOverInterceptor);
    dayDropZoneProto.onNodeDrop = Ext.Function.createInterceptor(dayDropZoneProto.onNodeDrop, nodeDropInterceptor);
    
    /*
     * This is a simple override required for dropping from outside the calendar. By default it
     * assumes that any drag originated within itelf, so a drag would be a move of an existing event.
     * This is no longer the case and it must check to see what the record state is.
     */
    Extensible.calendar.view.AbstractCalendar.override({
        onEventDrop : function(rec, dt){
            if (rec.phantom) {
                this.onEventAdd(null, rec);
            }
            else {
                this.moveEvent(rec, dt);
            }
        }
    });
});