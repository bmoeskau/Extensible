/* @private
 * Internal drop zone implementation for the calendar day and week views.
 */
Ext.define('Extensible.calendar.dd.DayDropZone', {
    extend: 'Extensible.calendar.dd.DropZone',

    ddGroup: 'DayViewDD',
    dateRangeFormat: '{0}-{1}',
    dateFormat: 'n/j',
    
    onNodeOver: function(n, dd, e, data) {
        var dt,
            box,
            diff,
            curr,
            text = this.createText,
            timeFormat = Extensible.Date.use24HourTime ? 'G:i' : 'g:ia';
            
        if(data.type === 'caldrag') {
            if(!this.dragStartMarker) {
                // Since the container can scroll, this gets a little tricky.
                // There is no el in the DOM that we can measure by default since
                // the box is simply calculated from the original drag start (as opposed
                // to dragging or resizing the event where the orig event box is present).
                // To work around this we add a placeholder el into the DOM and give it
                // the original starting time's box so that we can grab its updated
                // box measurements as the underlying container scrolls up or down.
                // This placeholder is removed in onNodeDrop.
                this.dragStartMarker = n.el.parent().createChild({
                    style: 'position:absolute;'
                });
                // use the original dayInfo values from the drag start
                this.dragStartMarker.setBox(data.dayInfo.timeBox);
                this.dragCreateDt = data.dayInfo.date;
            }
            var endDt;
            box = this.dragStartMarker.getBox();
            box.height = Math.ceil(Math.abs(e.getY() - box.y) / n.timeBox.height) * n.timeBox.height;
            
            if(e.getY() < box.y) {
                box.height += n.timeBox.height;
                box.y = box.y - box.height + n.timeBox.height;
                endDt = Extensible.Date.add(this.dragCreateDt, {minutes: this.ddIncrement});
            }
            else{
                n.date = Extensible.Date.add(n.date, {minutes: this.ddIncrement});
            }
            this.shim(this.dragCreateDt, box);
            
            diff = Extensible.Date.diff(this.dragCreateDt, n.date);
            curr = Extensible.Date.add(this.dragCreateDt, {millis: diff});
                
            this.dragStartDate = Extensible.Date.min(this.dragCreateDt, curr);
            this.dragEndDate = endDt || Extensible.Date.max(this.dragCreateDt, curr);
                
            dt = Ext.String.format(this.dateRangeFormat,
                Ext.Date.format(this.dragStartDate, timeFormat),
                Ext.Date.format(this.dragEndDate, timeFormat));
        }
        else{
            var evtEl = Ext.get(data.ddel),
                dayCol = evtEl.parent().parent();
            
            box = evtEl.getBox();
            box.width = dayCol.getWidth();
            
            if(data.type === 'eventdrag') {
                if(this.dragOffset === undefined) {
                    // on fast drags there is a lag between the original drag start xy position and
                    // that first detected within the drop zone's getTargetFromEvent method (which is
                    // where n.timeBox comes from). to avoid a bad offset we calculate the
                    // timeBox based on the initial drag xy, not the current target xy.
                    var initialTimeBox = this.view.getDayAt(data.xy[0], data.xy[1]).timeBox;
                    this.dragOffset = initialTimeBox.y - box.y;
                }
                else{
                    box.y = n.timeBox.y;
                }
                dt = Ext.Date.format(n.date, (this.dateFormat + ' ' + timeFormat));
                box.x = n.el.getLeft();
                
                this.shim(n.date, box);
                text = (e.ctrlKey || e.altKey) ? this.copyText : this.moveText;
            }
            if(data.type === 'eventresize') {
                if(!this.resizeDt) {
                    this.resizeDt = n.date;
                }
                box.x = dayCol.getLeft();
                box.height = Math.ceil(Math.abs(e.getY() - box.y) / n.timeBox.height) * n.timeBox.height;
                if(e.getY() < box.y) {
                    box.y -= box.height;
                }
                else{
                    n.date = Extensible.Date.add(n.date, {minutes: this.ddIncrement});
                }
                this.shim(this.resizeDt, box);
                
                diff = Extensible.Date.diff(this.resizeDt, n.date);
                curr = Extensible.Date.add(this.resizeDt, {millis: diff});
                
                var start = Extensible.Date.min(data.eventStart, curr),
                    end = Extensible.Date.max(data.eventStart, curr);
                    
                data.resizeDates = {
                    StartDate: start,
                    EndDate: end
                };
                
                dt = Ext.String.format(this.dateRangeFormat,
                    Ext.Date.format(start, timeFormat),
                    Ext.Date.format(end, timeFormat));
                    
                text = this.resizeText;
            }
        }
        
        data.proxy.updateMsg(Ext.String.format(text, dt));
        return this.dropAllowed;
    },
    
    shim: function(dt, box) {
        this.DDMInstance.notifyOccluded = true;
        
        Ext.each(this.shims, function(shim) {
            if(shim) {
                shim.isActive = false;
                shim.hide();
            }
        });
        
        var shim = this.shims[0];
        if(!shim) {
            shim = this.createShim();
            this.shims[0] = shim;
        }
        
        shim.isActive = true;
        shim.show();
        shim.setBox(box);
    },
    
    onNodeDrop: function(n, dd, e, data) {
        if(n && data) {
            var rec;
            
            if(data.type === 'eventdrag') {
                rec = this.view.getEventRecordFromEl(data.ddel);
                this.view.onEventDrop(rec, n.date, (e.ctrlKey || e.altKey) ? 'copy' : 'move');
                this.onCalendarDragComplete();
                delete this.dragOffset;
                return true;
            }
            if(data.type === 'eventresize') {
                rec = this.view.getEventRecordFromEl(data.ddel);
                this.view.onEventResize(rec, data.resizeDates);
                this.onCalendarDragComplete();
                delete this.resizeDt;
                return true;
            }
            if(data.type === 'caldrag') {
                Ext.destroy(this.dragStartMarker);
                delete this.dragStartMarker;
                delete this.dragCreateDt;
                this.view.onCalendarEndDrag(this.dragStartDate, this.dragEndDate,
                    Ext.bind(this.onCalendarDragComplete, this));
                //shims are NOT cleared here -- they stay visible until the handling
                //code calls the onCalendarDragComplete callback which hides them.
                return true;
            }
        }
        this.onCalendarDragComplete();
        return false;
    }
});
