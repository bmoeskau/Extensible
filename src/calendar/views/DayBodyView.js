/**S
 * @class Ext.ensible.cal.DayBodyView
 * @extends Ext.ensible.cal.CalendarView
 * <p>This is the scrolling container within the day and week views where non-all-day events are displayed.
 * Normally you should not need to use this class directly -- instead you should use {@link Ext.ensible.cal.DayView DayView}
 * which aggregates this class and the {@link Ext.ensible.cal.DayHeaderView DayHeaderView} into the single unified view
 * presented by {@link Ext.ensible.cal.CalendarPanel CalendarPanel}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.DayBodyView = Ext.extend(Ext.ensible.cal.CalendarView, {
    /**
     * @cfg {Boolena} enableEventResize
     * True to allow events to be updated by a resize handle at the bottom of the event, false to disallow it (defaults to true).
     */
    enableEventResize: true,
    
    //private
    dayColumnElIdDelimiter: '-day-col-',
    
    //private
    initComponent : function(){
        Ext.ensible.cal.DayBodyView.superclass.initComponent.call(this);
        
        this.addEvents({
            /**
             * @event beforeeventresize
             * Fires after the user drags the resize handle of an event to resize it, but before the resize operation is carried out.
             * This is a cancelable event, so returning false from a handler will cancel the resize operation.
             * @param {Ext.ensible.cal.DayBodyView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was resized
             * containing the updated start and end dates
             */
            beforeeventresize: true,
            /**
             * @event eventresize
             * Fires after the user drags the resize handle of an event and the resize operation is complete.
             * @param {Ext.ensible.cal.DayBodyView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was resized
             * containing the updated start and end dates
             */
            eventresize: true,
            /**
             * @event dayclick
             * Fires after the user clicks within the day view container and not on an event element
             * @param {Ext.ensible.cal.DayBodyView} this
             * @param {Date} dt The date/time that was clicked on
             * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
             * DayBodyView always return false for this param.
             * @param {Ext.Element} el The Element that was clicked on
             */
            dayclick: true
        });
    },
    
    //private
    initDD : function(){
        var cfg = {
            createText: this.ddCreateEventText,
            moveText: this.ddMoveEventText,
            resizeText: this.ddResizeEventText
        };

        this.el.ddScrollConfig = {
            // scrolling is buggy in IE/Opera for some reason.  A larger vthresh
            // makes it at least functional if not perfect
            vthresh: Ext.isIE || Ext.isOpera ? 100 : 40,
            hthresh: -1,
            frequency: 50,
            increment: 100,
            ddGroup: this.ddGroup || this.id+'-DayViewDD'
        };
        this.dragZone = new Ext.ensible.cal.DayViewDragZone(this.el, Ext.apply({
            view: this,
            containerScroll: true
        }, cfg));
        
        this.dropZone = new Ext.ensible.cal.DayViewDropZone(this.el, Ext.apply({
            view: this
        }, cfg));
    },
    
    //private
    refresh : function(reloadData){
        Ext.ensible.log('refresh (DayBodyView)');
        var top = this.el.getScroll().top;
        
        Ext.ensible.cal.DayBodyView.superclass.refresh.call(this, reloadData);
        
        // skip this if the initial render scroll position has not yet been set.
        // necessary since IE/Opera must be deferred, so the first refresh will
        // override the initial position by default and always set it to 0.
        if(this.scrollReady){
            this.scrollTo(top);
        }
    },

    /**
     * Scrolls the container to the specified vertical position. If the view is large enough that
     * there is no scroll overflow then this method will have no affect.
     * @param {Number} y The new vertical scroll position in pixels 
     * @param {Boolean} defer (optional) <p>True to slightly defer the call, false to execute immediately.</p> 
     * <p>This method will automatically defer itself for IE and Opera (even if you pass false) otherwise
     * the scroll position will not update in those browsers. You can optionally pass true, however, to
     * force the defer in all browsers, or use your own custom conditions to determine whether this is needed.</p>
     * <p>Note that this method should not generally need to be called directly as scroll position is managed internally.</p>
     */
    scrollTo : function(y, defer){
        defer = defer || (Ext.isIE || Ext.isOpera);
        if(defer){
            (function(){
                this.el.scrollTo('top', y);
                this.scrollReady = true;
            }).defer(10, this);
        }
        else{
            this.el.scrollTo('top', y);
            this.scrollReady = true;
        }
    },

    // private
    afterRender : function(){
        if(!this.tpl){
            this.tpl = new Ext.ensible.cal.DayBodyTemplate({
                id: this.id,
                dayCount: this.dayCount,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime
            });
        }
        this.tpl.compile();
        
        this.addClass('ext-cal-body-ct');
        
        Ext.ensible.cal.DayBodyView.superclass.afterRender.call(this);
        
        // default scroll position to 7am:
        this.scrollTo(7*42);
    },
    
    // private
    forceSize: Ext.emptyFn,
    
    // private -- called from DayViewDropZone
    onEventResize : function(rec, data){
        if(this.fireEvent('beforeeventresize', this, rec) !== false){
            var D = Ext.ensible.Date,
                start = Ext.ensible.cal.EventMappings.StartDate.name,
                end = Ext.ensible.cal.EventMappings.EndDate.name;
                
            if(D.compare(rec.data[start], data.StartDate) === 0 &&
                D.compare(rec.data[end], data.EndDate) === 0){
                // no changes
                return;
            } 
            rec.set(start, data.StartDate);
            rec.set(end, data.EndDate);
            this.onEventUpdate(null, rec);
            
            this.fireEvent('eventresize', this, rec);
        }
    },

    // inherited docs
    getEventBodyMarkup : function(){
        if(!this.eventBodyMarkup){
            this.eventBodyMarkup = ['{Title}',
                '<tpl if="_isReminder">',
                    '<i class="ext-cal-ic ext-cal-ic-rem">&#160;</i>',
                '</tpl>',
                '<tpl if="_isRecurring">',
                    '<i class="ext-cal-ic ext-cal-ic-rcr">&#160;</i>',
                '</tpl>'
//                '<tpl if="spanLeft">',
//                    '<i class="ext-cal-spl">&#160;</i>',
//                '</tpl>',
//                '<tpl if="spanRight">',
//                    '<i class="ext-cal-spr">&#160;</i>',
//                '</tpl>'
            ].join('');
        }
        return this.eventBodyMarkup;
    },
    
    // inherited docs
    getEventTemplate : function(){
        if(!this.eventTpl){
            this.eventTpl = !(Ext.isIE || Ext.isOpera) ? 
                new Ext.XTemplate(
                    '<div id="{_elId}" class="{_selectorCls} {_colorCls} ext-cal-evt ext-cal-evr" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">',
                        '<div class="ext-evt-bd">', this.getEventBodyMarkup(), '</div>',
                        this.enableEventResize ? '<div class="ext-evt-rsz"><div class="ext-evt-rsz-h">&#160;</div></div>' : '',
                    '</div>'
                )
                : new Ext.XTemplate(
                    '<div id="{_elId}" class="ext-cal-evt {_selectorCls} {_colorCls}-x" style="left: {_left}%; width: {_width}%; top: {_top}px;">',
                        '<div class="ext-cal-evb">&#160;</div>',
                        '<dl style="height: {_height}px;" class="ext-cal-evdm">',
                            '<dd class="ext-evt-bd">',
                                this.getEventBodyMarkup(),
                            '</dd>',
                            this.enableEventResize ? '<div class="ext-evt-rsz"><div class="ext-evt-rsz-h">&#160;</div></div>' : '',
                        '</dl>',
                        '<div class="ext-cal-evb">&#160;</div>',
                    '</div>'
                );
            this.eventTpl.compile();
        }
        return this.eventTpl;
    },
    
    /**
     * <p>Returns the XTemplate that is bound to the calendar's event store (it expects records of type
     * {@link Ext.ensible.cal.EventRecord}) to populate the calendar views with <strong>all-day</strong> events. 
     * Internally this method by default generates different markup for browsers that support CSS border radius 
     * and those that don't. This method can be overridden as needed to customize the markup generated.</p>
     * <p>Note that this method calls {@link #getEventBodyMarkup} to retrieve the body markup for events separately
     * from the surrounding container markup.  This provdes the flexibility to customize what's in the body without
     * having to override the entire XTemplate. If you do override this method, you should make sure that your 
     * overridden version also does the same.</p>
     * @return {Ext.XTemplate} The event XTemplate
     */
    getEventAllDayTemplate : function(){
        if(!this.eventAllDayTpl){
            var tpl, body = this.getEventBodyMarkup();
            
            tpl = !(Ext.isIE || Ext.isOpera) ? 
                new Ext.XTemplate(
                    '<div class="{_selectorCls} {_colorCls} {values.spanCls} ext-cal-evt ext-cal-evr" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">',
                        body,
                    '</div>'
                ) 
                : new Ext.XTemplate(
                    '<div class="ext-cal-evt" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">',
                    '<div class="{_selectorCls} {values.spanCls} {_colorCls} ext-cal-evo">',
                        '<div class="ext-cal-evm">',
                            '<div class="ext-cal-evi">',
                                body,
                            '</div>',
                        '</div>',
                    '</div></div>'
                );
            tpl.compile();
            this.eventAllDayTpl = tpl;
        }
        return this.eventAllDayTpl;
    },
    
    // private
    getTemplateEventData : function(evt){
        var M = Ext.ensible.cal.EventMappings,
            selector = this.getEventSelectorCls(evt[M.EventId.name]),
            data = {},
            recurring = evt[M.RRule.name] != '';
        
        this.getTemplateEventBox(evt);
        
        data._selectorCls = selector;
        var colorCls = 'x-cal-default';
        
        if(this.calendarStore && evt[M.CalendarId.name]){
            var rec = this.calendarStore.getById(evt[M.CalendarId.name]);
            colorCls = 'x-cal-' + rec.data[Ext.ensible.cal.CalendarMappings.ColorId.name];
        }
        data._colorCls = colorCls + (evt._renderAsAllDay ? '-ad' : '');
        data._isRecurring = evt.Recurrence && evt.Recurrence != '';
        data._isReminder = evt[M.Reminder.name] && evt[M.Reminder.name] != '';
        var title = evt[M.Title.name],
            fmt = Ext.ensible.Date.use24HourTime ? 'G:i ' : 'g:ia ';
        data.Title = (evt[M.IsAllDay.name] ? '' : evt[M.StartDate.name].format(fmt)) + (!title || title.length == 0 ? this.defaultEventTitleText : title);
        
        return Ext.applyIf(data, evt);
    },
    
    // private
    getTemplateEventBox : function(evt){
        var heightFactor = .7,
            start = evt[Ext.ensible.cal.EventMappings.StartDate.name],
            end = evt[Ext.ensible.cal.EventMappings.EndDate.name],
            startMins = start.getHours() * 60 + start.getMinutes(),
            endMins = end.getHours() * 60 + end.getMinutes(), 
            diffMins = endMins - startMins;
        
        evt._left = 0;
        evt._width = 100;
        evt._top = Math.round(startMins * heightFactor) + 1;
        evt._height = Math.max((diffMins * heightFactor) - 2, 15);
    },

    // private
    renderItems: function(){
        var day = 0, evts = [];
        for(; day < this.dayCount; day++){
            var ev = emptyCells = skipped = 0, 
                d = this.eventGrid[0][day],
                ct = d ? d.length : 0, 
                evt;
            
            for(; ev < ct; ev++){
                evt = d[ev];
                if(!evt){
                    continue;
                }
                var item = evt.data || evt.event.data;
                if(item._renderAsAllDay){
                    continue;
                }
                Ext.apply(item, {
                    cls: 'ext-cal-ev',
                    _positioned: true
                });
                evts.push({
                    data: this.getTemplateEventData(item),
                    date: this.viewStart.add(Date.DAY, day)
                });
            }
        }
        
        // overlapping event pre-processing loop
        var i = j = 0, overlapCols = [], l = evts.length, prevDt;
        for(; i<l; i++){
            var evt = evts[i].data, 
                evt2 = null, 
                dt = evt[Ext.ensible.cal.EventMappings.StartDate.name].getDate();
            
            for(j=0; j<l; j++){
                if(i==j)continue;
                evt2 = evts[j].data;
                if(this.isOverlapping(evt, evt2)){
                    evt._overlap = evt._overlap == undefined ? 1 : evt._overlap+1;
                    if(i<j){
                        if(evt._overcol===undefined){
                            evt._overcol = 0;
                        }
                        evt2._overcol = evt._overcol+1;
                        overlapCols[dt] = overlapCols[dt] ? Math.max(overlapCols[dt], evt2._overcol) : evt2._overcol;
                    }
                }
            }
        }
        
        // rendering loop
        for(i=0; i<l; i++){
            var evt = evts[i].data,
                dt = evt[Ext.ensible.cal.EventMappings.StartDate.name].getDate();
                
            if(evt._overlap !== undefined){
                var colWidth = 100 / (overlapCols[dt]+1),
                    evtWidth = 100 - (colWidth * evt._overlap);
                    
                evt._width = colWidth;
                evt._left = colWidth * evt._overcol;
            }
            var markup = this.getEventTemplate().apply(evt),
                target = this.id+'-day-col-'+evts[i].date.format('Ymd');
                
            Ext.DomHelper.append(target, markup);
        }
        
        this.fireEvent('eventsrendered', this);
    },
    
    // private
    getDayEl : function(dt){
        return Ext.get(this.getDayId(dt));
    },
    
    // private
    getDayId : function(dt){
        if(Ext.isDate(dt)){
            dt = dt.format('Ymd');
        }
        return this.id + this.dayColumnElIdDelimiter + dt;
    },
    
    // private
    getDaySize : function(){
        var box = this.el.child('.ext-cal-day-col-inner').getBox();
        return {height: box.height, width: box.width};
    },
    
    // private
    getDayAt : function(x, y){
        var sel = '.ext-cal-body-ct',
            xoffset = this.el.child('.ext-cal-day-times').getWidth(),
            viewBox = this.el.getBox(),
            daySize = this.getDaySize(false),
            relX = x - viewBox.x - xoffset,
            dayIndex = Math.floor(relX / daySize.width), // clicked col index
            scroll = this.el.getScroll(),
            row = this.el.child('.ext-cal-bg-row'), // first avail row, just to calc size
            rowH = row.getHeight() / this.incrementsPerHour, // use the incrementsPerHour config variable
            relY = y - viewBox.y - rowH + scroll.top,
            rowIndex = Math.max(0, Math.ceil(relY / rowH)),
            mins = rowIndex * (60 / this.incrementsPerHour),
            dt = this.viewStart.add(Date.DAY, dayIndex).add(Date.MINUTE, mins),
            el = this.getDayEl(dt),
            timeX = x;
       
        if(el){
            timeX = el.getLeft();
        }
        
        return {
            date: dt,
            el: el,
            // this is the box for the specific time block in the day that was clicked on:
            timeBox: {
                x: timeX,
                y: (rowIndex * 42 / this.incrementsPerHour) + viewBox.y - scroll.top,
                width: daySize.width,
                height: rowH
            }
        }
    },

    // private
    onClick : function(e, t){
        if(this.dragPending || Ext.ensible.cal.DayBodyView.superclass.onClick.apply(this, arguments)){
            // The superclass handled the click already so exit
            return;
        }
        if(e.getTarget('.ext-cal-day-times', 3) !== null){
            // ignore clicks on the times-of-day gutter
            return;
        }
        var el = e.getTarget('td', 3);
        if(el){
            if(el.id && el.id.indexOf(this.dayElIdDelimiter) > -1){
                var dt = this.getDateFromId(el.id, this.dayElIdDelimiter);
                this.onDayClick(Date.parseDate(dt, 'Ymd'), true, Ext.get(this.getDayId(dt)));
                return;
            }
        }
        var day = this.getDayAt(e.xy[0], e.xy[1]);
        if(day && day.date){
            this.onDayClick(day.date, false, null);
        }
    }
});

Ext.reg('extensible.daybodyview', Ext.ensible.cal.DayBodyView);
