/**
 * Displays a calendar view by month. This class does not usually need ot be used directly as you can
 * use a {@link Extensible.calendar.CalendarPanel CalendarPanel} to manage multiple calendar views at once including
 * the month view.
 */
Ext.define('Extensible.calendar.view.Month', {
    extend: 'Extensible.calendar.view.AbstractCalendar',
    alias: 'widget.extensible.monthview',
    
    requires: [
        'Ext.XTemplate',
        'Ext.TaskManager',
        'Extensible.calendar.template.Month',
        'Extensible.calendar.util.WeekEventRenderer',
        'Extensible.calendar.view.MonthDayDetail'
    ],
    
    /**
     * @cfg {String} moreText
     * **Deprecated.** Please override {@link #getMoreText} instead.
     * 
     * The text to display in a day box when there are more events than can be displayed and a link is provided to
     * show a popup window with all events for that day (defaults to '+{0} more...', where {0} will be
     * replaced by the number of additional events that are not currently displayed for the day).
     * @deprecated
     */
    moreText: '+{0} more...',
    /**
     * @cfg {String} detailsTitleDateFormat
     * The date format for the title of the details panel that shows when there are hidden events and the "more" link
     * is clicked (defaults to 'F j').
     */
    detailsTitleDateFormat: 'F j',
    /**
     * @cfg {Boolean} showTime
     * True to display the current time in today's box in the calendar, false to not display it (defaults to true)
     */
    showTime: true,
    /**
     * @cfg {Boolean} showTodayText
     * True to display the {@link #todayText} string in today's box in the calendar, false to not display it
     * (defaults to true)
     */
    showTodayText: true,
    /**
     * @cfg {Boolean} showHeader
     * True to display a header beneath the navigation bar containing the week names above each week's column, false
     * not to show it and instead display the week names in the first row of days in the calendar (defaults to false).
     */
    showHeader: false,
    /**
     * @cfg {Boolean} showWeekLinks
     * True to display an extra column before the first day in the calendar that links to the
     * {@link Extensible.calendar.view.Week view} for each individual week, false to not show it (defaults to false).
     * If true, the week links can also contain the week number depending on the value of {@link #showWeekNumbers}.
     */
    showWeekLinks: false,
    /**
     * @cfg {Boolean} showWeekNumbers
     * True to show the week number for each week in the calendar in the week link column, false to show nothing
     * (defaults to false). Note that if {@link #showWeekLinks} is false this config will have no affect even if true.
     */
    showWeekNumbers: false,
    /**
     * @cfg {String} weekLinkOverClass
     * The CSS class name applied when the mouse moves over a week link element (only applies when
     * {@link #showWeekLinks} is true, defaults to 'ext-week-link-over').
     */
    weekLinkOverClass: 'ext-week-link-over',
    /**
     * @cfg {Number} morePanelMinWidth
     * When there are more events in a given day than can be displayed in the calendar view, the extra events
     * are hidden and a "{@link #getMoreText more events}" link is displayed. When clicked, the link pops up a
     * detail panel that displays all events for that day. By default the panel will be the same width as the day
     * box, but this config allows you to set the minimum width of the panel in the case where the width
     * of the day box is too narrow for the events to be easily readable (defaults to 220 pixels).
     */
    morePanelMinWidth: 220,
    
    //private properties -- do not override:
    daySelector: '.ext-cal-day',
    moreSelector: '.ext-cal-ev-more',
    weekLinkSelector: '.ext-cal-week-link',
    weekCount: -1, // defaults to auto by month
    dayCount: 7,
    moreElIdDelimiter: '-more-',
    weekLinkIdDelimiter: 'ext-cal-week-',

    initComponent: function() {
        this.callParent(arguments);

        //this.addEvents({
        //    /**
        //     * @event dayclick
        //     * Fires after the user clicks within the view container and not on an event element. This is a
        //     * cancelable event, so returning false from a handler will cancel the click without displaying the event
        //     * editor view. This could be useful for validating that a user can only create events on certain days.
        //     * @param {Extensible.calendar.view.Month} this
        //     * @param {Date} dt The date/time that was clicked on
        //     * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks
        //     * within the MonthView always return true for this param.
        //     * @param {Ext.Element} el The Element that was clicked on
        //     */
        //    dayclick: true,
        //    /**
        //     * @event weekclick
        //     * Fires after the user clicks within a week link (when {@link #showWeekLinks is true)
        //     * @param {Extensible.calendar.view.Month} this
        //     * @param {Date} dt The start date of the week that was clicked on
        //     */
        //    weekclick: true,
        //    /**
        //     * @protected
        //     */
        //            dayover: true,
        //    /**
        //     * @protected
        //     */
        //    dayout: true
        //});
    },

    initDD: function() {
        var cfg = {
            view: this,
            createText: this.ddCreateEventText,
            copyText: this.ddCopyEventText,
            moveText: this.ddMoveEventText,
            ddGroup: this.ddGroup || this.id+'-MonthViewDD'
        };
        
        this.dragZone = Ext.create('Extensible.calendar.dd.DragZone', this.el, cfg);
        this.dropZone = Ext.create('Extensible.calendar.dd.DropZone', this.el, cfg);
    },

    onDestroy: function() {
        Ext.destroy(this.ddSelector);
        Ext.destroy(this.dragZone);
        Ext.destroy(this.dropZone);
        
        this.callParent(arguments);
    },

    afterRender: function() {
        if(!this.tpl) {
            this.tpl = Ext.create('Extensible.calendar.template.Month', {
                id: this.id,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime,
                showHeader: this.showHeader,
                showWeekLinks: this.showWeekLinks,
                showWeekNumbers: this.showWeekNumbers
            });
            this.tpl.compile();
        }
        
        this.addCls('ext-cal-monthview ext-cal-ct');
        
        this.callParent(arguments);
    },

    onResize: function() {
        if (this.monitorResize) {
            this.maxEventsPerDay = this.getMaxEventsPerDay();
            this.refresh(false);
        }
    },

    forceSize: function() {
        // Compensate for the week link gutter width if visible
        if(this.showWeekLinks && this.el) {
            var hd = this.el.down('.ext-cal-hd-days-tbl'),
                bgTbl = this.el.select('.ext-cal-bg-tbl'),
                evTbl = this.el.select('.ext-cal-evt-tbl'),
                wkLinkW = this.el.down('.ext-cal-week-link').getWidth(),
                w = this.el.getWidth()-wkLinkW;
            
            hd.setWidth(w);
            bgTbl.setWidth(w);
            evTbl.setWidth(w);
        }
        this.callParent(arguments);
    },
    
    //private
    initClock: function() {
        if(Ext.fly(this.id+'-clock') !== null) {
            this.prevClockDay = new Date().getDay();
            if(this.clockTask) {
                Ext.util.TaskManager.stop(this.clockTask);
            }
            this.clockTask = Ext.util.TaskManager.start({
                run: function() {
                    var el = Ext.fly(this.id+'-clock'),
                        t = new Date();
                        
                    if(t.getDay() === this.prevClockDay) {
                        if(el) {
                            el.update(Ext.Date.format(t, Extensible.Date.use24HourTime ? 'G:i' : 'g:ia'));
                        }
                    }
                    else{
                        this.prevClockDay = t.getDay();
                        this.moveTo(t);
                    }
                },
                scope: this,
                interval: 1000
            });
        }
    },
    
    /**
     * Returns the text to display in a day box when there are more events than can be displayed and a link is
     * provided to show a popup window with all events for that day (defaults to '+{0} more...', where {0} will be
     * replaced by the number of additional events that are not currently displayed for the day).
     * @param {Integer} numEvents The number of events currently hidden from view
     * @return {String} The text to display for the "more" link
     */
    getMoreText: function(numEvents) {
        return this.moreText;
    },

    /**
     * @protected 
     */
    getEventBodyMarkup: function() {
        if(!this.eventBodyMarkup) {
            this.eventBodyMarkup = ['{Title}',
                '<tpl if="_isReminder">',
                    '<i class="ext-cal-ic ext-cal-ic-rem">&#160;</i>',
                '</tpl>',
                '<tpl if="_isRecurring">',
                    '<i class="ext-cal-ic ext-cal-ic-rcr">&#160;</i>',
                '</tpl>',
                '<tpl if="spanLeft">',
                    '<i class="ext-cal-spl">&#160;</i>',
                '</tpl>',
                '<tpl if="spanRight">',
                    '<i class="ext-cal-spr">&#160;</i>',
                '</tpl>'
            ].join('');
        }
        return this.eventBodyMarkup;
    },
    
    /**
     * @protected 
     */
    getEventTemplate: function() {
        if(!this.eventTpl) {
            var tpl, body = this.getEventBodyMarkup();
            
            tpl = !(Ext.isIE || Ext.isOpera) ?
                Ext.create('Ext.XTemplate',
                    '<div class="{_extraCls} {spanCls} ext-cal-evt ext-cal-evr">',
                        body,
                    '</div>'
                )
                : Ext.create('Ext.XTemplate',
                    '<tpl if="_renderAsAllDay">',
                        '<div class="{_extraCls} {spanCls} ext-cal-evt ext-cal-evo">',
                            '<div class="ext-cal-evm">',
                                '<div class="ext-cal-evi">',
                    '</tpl>',
                    '<tpl if="!_renderAsAllDay">',
                        '<div class="{_extraCls} ext-cal-evt ext-cal-evr">',
                    '</tpl>',
                    body,
                    '<tpl if="_renderAsAllDay">',
                                '</div>',
                            '</div>',
                    '</tpl>',
                        '</div>'
                );
            tpl.compile();
            this.eventTpl = tpl;
        }
        return this.eventTpl;
    },

    getTemplateEventData: function(evtData) {
        var M = Extensible.calendar.data.EventMappings,
            extraClasses = [this.getEventSelectorCls(evtData[M.EventId.name])],
            templateData = {},
            colorCls = 'x-cal-default',
            title = evtData[M.Title.name],
            fmt = Extensible.Date.use24HourTime ? 'G:i ' : 'g:ia ',
            rec;
        
        if (this.calendarStore && evtData[M.CalendarId.name]) {
            rec = this.calendarStore.findRecord(Extensible.calendar.data.CalendarMappings.CalendarId.name, evtData[M.CalendarId.name]);
            if(rec) {
                colorCls = 'x-cal-' + rec.get(Extensible.calendar.data.CalendarMappings.ColorId.name);
            }
        }
        colorCls += (evtData._renderAsAllDay ? '-ad' : '');
        extraClasses.push(colorCls);
        
        if (evtData._renderAsAllDay) {
            extraClasses.push('ext-evt-block');
        }
        
        if (this.getEventClass) {
            rec = this.getEventRecord(evtData[M.EventId.name]);
            var cls = this.getEventClass(rec, !!evtData._renderAsAllDay, templateData, this.store);
            extraClasses.push(cls);
        }
        
        templateData._extraCls = extraClasses.join(' ');
        templateData._isRecurring = M.RRule && !!evtData[M.RRule.name];
        templateData._isReminder = evtData[M.Reminder.name] && evtData[M.Reminder.name] !== '';
        templateData.Title = (evtData[M.IsAllDay.name] ? '' : Ext.Date.format(evtData[M.StartDate.name], fmt)) +
                (!title || title.length === 0 ? this.defaultEventTitleText : title);
        
        return Ext.applyIf(templateData, evtData);
    },

    refresh: function(reloadData) {
        Extensible.log('refresh (MonthView)');
        if(this.detailPanel) {
            this.detailPanel.hide();
        }
        if (!this.isHeaderView) {
            this.maxEventsPerDay = this.getMaxEventsPerDay();
        }
        this.callParent(arguments);
        
        if(this.showTime !== false) {
            this.initClock();
        }
    },

    renderItems: function() {
        Extensible.calendar.util.WeekEventRenderer.render({
            eventGrid: this.allDayOnly ? this.allDayGrid : this.eventGrid,
            viewStart: this.viewStart,
            tpl: this.getEventTemplate(),
            maxEventsPerDay: this.maxEventsPerDay,
            viewId: this.id,
            templateDataFn: Ext.bind(this.getTemplateEventData, this),
            evtMaxCount: this.evtMaxCount,
            weekCount: this.weekCount,
            dayCount: this.dayCount,
            getMoreText: Ext.bind(this.getMoreText, this)
        });
        this.fireEvent('eventsrendered', this);
    },

    getDayEl: function(dt) {
        return Ext.get(this.getDayId(dt));
    },

    getDayId: function(dt) {
        if(Ext.isDate(dt)) {
            dt = Ext.Date.format(dt, 'Ymd');
        }
        return this.id + this.dayElIdDelimiter + dt;
    },

    getWeekIndex: function(dt) {
        var el = this.getDayEl(dt).up('.ext-cal-wk-ct');
        return parseInt(el.id.split('-wk-')[1], 10);
    },

    getDaySize: function(contentOnly) {
        var box = this.el.getBox(),
            padding = this.getViewPadding(),
            w = (box.width - padding.width) / this.dayCount,
            h = (box.height - padding.height) / this.getWeekCount();
            
        if(contentOnly) {
            // measure last row instead of first in case text wraps in first row
            var hd = this.el.select('.ext-cal-dtitle').last().parent('tr');
            h = hd ? h-hd.getHeight(true) : h;
        }
        return {height: h, width: w};
    },

    getEventHeight: function() {
        if (!this.eventHeight) {
            var evt = this.el.select('.ext-cal-evt').first();
            if(evt) {
                this.eventHeight = evt.parent('td').getHeight();
            }
            else {
                return 16; // no events rendered, so try setting this.eventHeight again later
            }
        }
        return this.eventHeight;
    },

    getMaxEventsPerDay: function() {
        var dayHeight = this.getDaySize(true).height,
            eventHeight = this.getEventHeight(),
            max = Math.max(Math.floor((dayHeight - eventHeight) / eventHeight), 0);
        
        return max;
    },

    getViewPadding: function(sides) {
        sides = sides || 'tlbr';
        
        var top = sides.indexOf('t') > -1,
            left = sides.indexOf('l') > -1,
            right = sides.indexOf('r') > -1,
            height = this.showHeader && top ? this.el.select('.ext-cal-hd-days-tbl').first().getHeight() : 0,
            width = 0;
        
        if (this.isHeaderView) {
            if (left) {
                width = this.el.select('.ext-cal-gutter').first().getWidth();
            }
            if (right) {
                width += this.el.select('.ext-cal-gutter-rt').first().getWidth();
            }
        }
        else if (this.showWeekLinks && left) {
            width = this.el.select('.ext-cal-week-link').first().getWidth();
        }
        
        return {
            height: height,
            width: width
        };
    },

    getDayAt: function(x, y) {
        var box = this.el.getBox(),
            padding = this.getViewPadding('tl'), // top/left only since we only want the xy offsets
            daySize = this.getDaySize(),
            dayL = Math.floor(((x - box.x - padding.width) / daySize.width)),
            dayT = Math.floor(((y - box.y - padding.height) / daySize.height)),
            days = (dayT * 7) + dayL,
            dt = Extensible.Date.add(this.viewStart, {days: days});
        
        return {
            date: dt,
            el: this.getDayEl(dt)
        };
    },
    
    /**
     * @protected 
     */
    moveNext: function() {
        return this.moveMonths(1, true);
    },
    
    /**
     * @protected 
     */
    movePrev: function() {
        return this.moveMonths(-1, true);
    },

    onInitDrag: function() {
        this.callParent(arguments);
        
        Ext.select(this.daySelector).removeCls(this.dayOverClass);
        if(this.detailPanel) {
            this.detailPanel.hide();
        }
    },

    onMoreClick: function(dt) {
        if(!this.detailPanel) {
            this.detailPanel = Ext.create('Ext.Panel', {
                id: this.id+'-details-panel',
                title: Ext.Date.format(dt, this.detailsTitleDateFormat),
                layout: 'fit',
                floating: true,
                renderTo: Ext.getBody(),
                hideMode: 'offsets',
                tools: [{
                    type: 'close',
                    handler: function(e, t, p) {
                        p.ownerCt.hide();
                    }
                }],
                items: {
                    xtype: 'extensible.monthdaydetailview',
                    id: this.id+'-details-view',
                    date: dt,
                    view: this,
                    store: this.store,
                    calendarStore: this.calendarStore,
                    listeners: {
                        'eventsrendered': Ext.bind(this.onDetailViewUpdated, this)
                    }
                }
            });
            
            if(this.enableContextMenus && this.readOnly !== true) {
                this.detailPanel.body.on('contextmenu', this.onContextMenu, this);
            }
        }
        else{
            this.detailPanel.setTitle(Ext.Date.format(dt, this.detailsTitleDateFormat));
        }
        this.detailPanel.getComponent(this.id+'-details-view').update(dt);
    },

    onDetailViewUpdated: function(view, dt, numEvents) {
        var p = this.detailPanel,
            dayEl = this.getDayEl(dt),
            box = dayEl.getBox(),
            innerTplHeight = p.el.down('.ext-cal-mdv').getHeight(),
            header = p.getDockedItems('header')[0],
            frameSize = p.frameSize || {top:0, bottom:0},
            frameHeight = frameSize.top + frameSize.bottom + header.getHeight(),
            bodyHeight = innerTplHeight + frameHeight + 5,
            documentBodyHeight = Ext.getBody().getHeight() - 20,
            calculatedHeight = Math.min(bodyHeight, documentBodyHeight);
        
        // Check for overflow first -- if overflow is needed the scrollbar
        // will affect the body width in some browsers
        if (calculatedHeight === documentBodyHeight) {
            p.body.addCls('ext-cal-overflow-y');
        }
        else {
            p.body.removeCls('ext-cal-overflow-y');
        }
        // Now set the new calculated panel dimensions
        p.setWidth(Math.max(box.width, this.morePanelMinWidth));
        p.setHeight(calculatedHeight);
        
        p.show();
        p.alignTo(dayEl, 't-t?');
    },

    onHide: function() {
        this.callParent(arguments);
        
        if(this.detailPanel) {
            this.detailPanel.hide();
        }
    },

    onClick: function(e, t) {
        if(this.detailPanel) {
            this.detailPanel.hide();
        }
        
        var el = e.getTarget(this.moreSelector, 3),
            dt;
        
        if (el) {
            dt = el.id.split(this.moreElIdDelimiter)[1];
            this.onMoreClick(Ext.Date.parseDate(dt, 'Ymd'));
            return;
        }
        
        el = e.getTarget(this.weekLinkSelector, 3);
        
        if (el) {
            dt = el.id.split(this.weekLinkIdDelimiter)[1];
            this.fireEvent('weekclick', this, Ext.Date.parseDate(dt, 'Ymd'));
            return;
        }
        
        if (Extensible.calendar.view.Month.superclass.onClick.apply(this, arguments)) {
            // The superclass handled the click already so exit
            return;
        }
        
        el = e.getTarget('td', 3);
        
        if (el) {
            if (el.id && el.id.indexOf(this.dayElIdDelimiter) > -1) {
                var parts = el.id.split(this.dayElIdDelimiter);
                dt = parts[parts.length-1];
                    
                //this.fireEvent('dayclick', this, Ext.Date.parseDate(dt, 'Ymd'), false, Ext.get(this.getDayId(dt)));
                this.onDayClick(Ext.Date.parseDate(dt, 'Ymd'), false, Ext.get(this.getDayId(dt)));
                return;
            }
        }
    },

    handleDayMouseEvent: function(e, t, type) {
        var el = e.getTarget(this.weekLinkSelector, 3, true);
        if(el) {
            el[type === 'over' ? 'addCls' : 'removeCls'](this.weekLinkOverClass);
            return;
        }
        this.callParent(arguments);
    },

    destroy: function() {
        this.callParent(arguments);
        
        if(this.detailsPanel) {
            this.detailPanel.body.un('contextmenu', this.onContextMenu, this);
        }
    }
});