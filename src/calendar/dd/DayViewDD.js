/*
 * Internal drag zone implementation for the calendar day and week views.
 */
Ext.ensible.cal.DayViewDragZone = Ext.extend(Ext.ensible.cal.DragZone, {
    ddGroup : 'DayViewDD',
    resizeSelector : '.ext-evt-rsz',
    
    getDragData : function(e){
        var t = e.getTarget(this.resizeSelector, 2, true);
        if(t){
            var p = t.parent(this.eventSelector), 
                rec = this.view.getEventRecordFromEl(p);
            
            return {
                type: 'eventresize',
                ddel: p.dom,
                eventStart: rec.data[Ext.ensible.cal.EventMappings.StartDate.name],
                eventEnd: rec.data[Ext.ensible.cal.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }
        var t = e.getTarget(this.eventSelector, 3);
        if(t){
            var rec = this.view.getEventRecordFromEl(t);
            return {
                type: 'eventdrag',
                ddel: t,
                eventStart: rec.data[Ext.ensible.cal.EventMappings.StartDate.name],
                eventEnd: rec.data[Ext.ensible.cal.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }
        
        // If not dragging/resizing an event then we are dragging on 
        // the calendar to add a new event
        t = this.view.getDayAt(e.getPageX(), e.getPageY());
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

/*
 * Internal drop zone implementation for the calendar day and week views.
 */
Ext.ensible.cal.DayViewDropZone = Ext.extend(Ext.ensible.cal.DropZone, {
    ddGroup : 'DayViewDD',
    
    onNodeOver : function(n, dd, e, data){
        var dt, text = this.createText;
        if(data.type == 'caldrag'){
            if(!this.dragStartMarker){
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
                this.dragStartMarker.setBox(n.timeBox);
                this.dragCreateDt = n.date;
            }
            var endDt, box = this.dragStartMarker.getBox();
            box.height = Math.ceil(Math.abs(e.xy[1] - box.y) / n.timeBox.height) * n.timeBox.height;
            
            if(e.xy[1] < box.y){
                box.height += n.timeBox.height;
                box.y = box.y - box.height + n.timeBox.height;
                endDt = this.dragCreateDt.add(Date.MINUTE, 30);
            }
            else{
                n.date = n.date.add(Date.MINUTE, 30);
            }
            this.shim(this.dragCreateDt, box);
            
            var curr = Ext.ensible.Date.copyTime(n.date, this.dragCreateDt);
            this.dragStartDate = Ext.ensible.Date.min(this.dragCreateDt, curr);
            this.dragEndDate = endDt || Ext.ensible.Date.max(this.dragCreateDt, curr);
                
            dt = this.dragStartDate.format('g:ia-') + this.dragEndDate.format('g:ia');
        }
        else{
            var evtEl = Ext.get(data.ddel),
                dayCol = evtEl.parent().parent(),
                box = evtEl.getBox();
            
            box.width = dayCol.getWidth();
            
            if(data.type == 'eventdrag'){
                if(this.dragOffset === undefined){
                    this.dragOffset = n.timeBox.y-box.y;
                    box.y = n.timeBox.y-this.dragOffset;
                }
                else{
                    box.y = n.timeBox.y;
                }
                dt = n.date.format('n/j g:ia');
                box.x = n.el.getLeft();
                
                this.shim(n.date, box);
                text = this.moveText;
            }
            if(data.type == 'eventresize'){
                if(!this.resizeDt){
                    this.resizeDt = n.date;
                }
                box.x = dayCol.getLeft();
                box.height = Math.ceil(Math.abs(e.xy[1] - box.y) / n.timeBox.height) * n.timeBox.height;
                if(e.xy[1] < box.y){
                    box.y -= box.height;
                }
                else{
                    n.date = n.date.add(Date.MINUTE, 30);
                }
                this.shim(this.resizeDt, box);
                
                var curr = Ext.ensible.Date.copyTime(n.date, this.resizeDt),
                    start = Ext.ensible.Date.min(data.eventStart, curr),
                    end = Ext.ensible.Date.max(data.eventStart, curr);
                    
                data.resizeDates = {
                    StartDate: start,
                    EndDate: end
                }
                dt = start.format('g:ia-') + end.format('g:ia');
                text = this.resizeText;
            }
        }
        
        data.proxy.updateMsg(String.format(text, dt));
        return this.dropAllowed;
    },
    
    shim : function(dt, box){
        Ext.each(this.shims, function(shim){
            if(shim){
                shim.isActive = false;
                shim.hide();
            }
        });
        
        var shim = this.shims[0];
        if(!shim){
            shim = this.createShim();
            this.shims[0] = shim;
        }
        
        shim.isActive = true;
        shim.show();
        shim.setBox(box);
    },
    
    onNodeDrop : function(n, dd, e, data){
        if(n && data){
            if(data.type == 'eventdrag'){
                var rec = this.view.getEventRecordFromEl(data.ddel);
                this.view.onEventDrop(rec, n.date);
                this.onCalendarDragComplete();
                delete this.dragOffset;
                return true;
            }
            if(data.type == 'eventresize'){
                var rec = this.view.getEventRecordFromEl(data.ddel);
                this.view.onEventResize(rec, data.resizeDates);
                this.onCalendarDragComplete();
                delete this.resizeDt;
                return true;
            }
            if(data.type == 'caldrag'){
                Ext.destroy(this.dragStartMarker);
                delete this.dragStartMarker;
                delete this.dragCreateDt;
                this.view.onCalendarEndDrag(this.dragStartDate, this.dragEndDate, 
                    this.onCalendarDragComplete.createDelegate(this));
                //shims are NOT cleared here -- they stay visible until the handling
                //code calls the onCalendarDragComplete callback which hides them.
                return true;
            }
        }
        this.onCalendarDragComplete();
        return false;
    }
});
