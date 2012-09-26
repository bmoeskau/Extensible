/* @private
 * Internal drop zone implementation for the calendar components. This provides base functionality
 * and is primarily for the month view -- DayViewDD adds day/week view-specific functionality.
 */
Ext.define('Extensible.calendar.dd.DropZone', {
    extend: 'Ext.dd.DropZone',
    
    requires: [
        'Ext.Layer',
        'Extensible.calendar.data.EventMappings'
    ],
    
    ddGroup : 'CalendarDD',
    eventSelector : '.ext-cal-evt',
    dateRangeFormat : '{0}-{1}',
    dateFormat : 'n/j',
    
    // private
    shims : [],
    
    getTargetFromEvent : function(e){
        var dragOffset = this.dragOffset || 0,
            y = e.getPageY() - dragOffset,
            d = this.view.getDayAt(e.getPageX(), y);
        
        return d.el ? d : null;
    },
    
    onNodeOver : function(n, dd, e, data){
        var D = Extensible.Date,
            eventDragText = (e.ctrlKey || e.altKey) ? this.copyText : this.moveText,
            start = data.type == 'eventdrag' ? n.date : D.min(data.start, n.date),
            end = data.type == 'eventdrag' ? D.add(n.date, {days: D.diffDays(data.eventStart, data.eventEnd)}) :
                D.max(data.start, n.date);
        
        if (!this.dragStartDate || !this.dragEndDate || (D.diffDays(start, this.dragStartDate) !== 0) || (D.diffDays(end, this.dragEndDate) !== 0)) {
            this.dragStartDate = start;
            this.dragEndDate = end;
            this.shim(start, end);
            
            var range = Ext.Date.format(start, this.dateFormat);
                
            if(D.diffDays(start, end) > 0){
                end = Ext.Date.format(end, this.dateFormat);
                range = Ext.String.format(this.dateRangeFormat, range, end);
            }
            this.currentRange = range;
        }
                
        data.proxy.updateMsg(Ext.String.format(data.type === 'eventdrag' ? eventDragText :
            this.createText, this.currentRange));
            
        return this.dropAllowed;
    },
    
    shim : function(start, end){
        this.currWeek = -1;
        var dt = Ext.Date.clone(start),
            dt2 = Ext.Date.clone(end),
            i = 0, shim, box,
            D = Extensible.Date,
            // Since both dates have no time (00:00), the diff will always be one less than the number
            // of highlighted days required (e.g. 2 selected days will only be 1 day difference). We adjust
            // a day to account for that, plus a little extra so that the midnight boundary is not
            // interpreted as the previous day in the diff.
            cnt = D.diffDays(dt, D.add(dt2, {hours: 25}));
        
        Ext.each(this.shims, function(shim){
            if(shim){
                shim.isActive = false;
            }
        });
        
        while(i++ < cnt){
            var dayEl = this.view.getDayEl(dt);
            
            // if the date is not in the current view ignore it (this
            // can happen when an event is dragged to the end of the
            // month so that it ends outside the view)
            if(dayEl){
                var wk = this.view.getWeekIndex(dt),
                    shim = this.shims[wk];
            
                if(!shim){
                    shim = this.createShim();
                    this.shims[wk] = shim;
                }
                if(wk != this.currWeek){
                    shim.boxInfo = dayEl.getBox();
                    this.currWeek = wk;
                }
                else{
                    box = dayEl.getBox();
                    shim.boxInfo.right = box.right;
                    shim.boxInfo.width = box.right - shim.boxInfo.x;
                }
                shim.isActive = true;
            }
            dt = D.add(dt, {days: 1});
        }
        
        Ext.each(this.shims, function(shim){
            if(shim){
                if(shim.isActive){
                    shim.show();
                    shim.setBox(shim.boxInfo);
                }
                else if(shim.isVisible()){
                    shim.hide();
                }
            }
        });
    },
    
    createShim : function(){
        var owner = this.view.ownerCalendarPanel ? this.view.ownerCalendarPanel : this.view;
        if(!this.shimCt){
            this.shimCt = Ext.get('ext-dd-shim-ct-'+owner.id);
            if(!this.shimCt){
                this.shimCt = document.createElement('div');
                this.shimCt.id = 'ext-dd-shim-ct-'+owner.id;
                owner.getEl().parent().appendChild(this.shimCt);
            }
        }
        var el = document.createElement('div');
        el.className = 'ext-dd-shim';
        this.shimCt.appendChild(el);
        
        return Ext.create('Ext.Layer', {
            shadow: false, 
            useDisplay: true, 
            constrain: false
        }, el);
    },
    
    clearShims : function(){
        Ext.each(this.shims, function(shim){
            if(shim){
                shim.hide();
            }
        });
    },
    
    onContainerOver : function(dd, e, data){
        return this.dropAllowed;
    },
    
    onCalendarDragComplete : function(){
        delete this.dragStartDate;
        delete this.dragEndDate;
        this.clearShims();
    },
    
    onNodeDrop : function(n, dd, e, data){
        if(n && data){
            if(data.type == 'eventdrag'){
                var rec = this.view.getEventRecordFromEl(data.ddel),
                    dt = Extensible.Date.copyTime(rec.data[Extensible.calendar.data.EventMappings.StartDate.name], n.date);
                    
                this.view.onEventDrop(rec, dt, (e.ctrlKey || e.altKey) ? 'copy' : 'move');
                this.onCalendarDragComplete();
                return true;
            }
            if(data.type == 'caldrag'){
                if (!this.dragEndDate) {
                    // this can occur on a long click where drag starts but onNodeOver is never executed
                    this.dragStartDate = this.dragEndDate = Ext.Date.clearTime(data.start);
                }
                this.view.onCalendarEndDrag(this.dragStartDate, Extensible.Date.add(this.dragEndDate, {days: 1}),
                    Ext.bind(this.onCalendarDragComplete, this));
                //shims are NOT cleared here -- they stay visible until the handling
                //code calls the onCalendarDragComplete callback which hides them.
                return true;
            }
        }
        this.onCalendarDragComplete();
        return false;
    },
    
    onContainerDrop : function(dd, e, data){
        this.onCalendarDragComplete();
        return false;
    },
    
    destroy: function() {
        Ext.each(this.shims, function(shim){
            if(shim){
                Ext.destroy(shim);
            }
        });
        
        Ext.removeNode(this.shimCt);
        delete this.shimCt;
        this.shims.length = 0;
    }
});

