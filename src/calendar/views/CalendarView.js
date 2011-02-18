/**
 * @class Ext.ensible.cal.CalendarView
 * @extends Ext.BoxComponent
 * <p>This is an abstract class that serves as the base for other calendar views. This class is not
 * intended to be directly instantiated.</p>
 * <p>When extending this class to create a custom calendar view, you must provide an implementation
 * for the <code>renderItems</code> method, as there is no default implementation for rendering events
 * The rendering logic is totally dependent on how the UI structures its data, which
 * is determined by the underlying UI template (this base class does not have a template).</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.CalendarView = Ext.extend(Ext.BoxComponent, {
    /**
     * @cfg {Ext.data.Store} eventStore
     * The {@link Ext.data.Store store} which is bound to this calendar and contains {@link Ext.ensible.cal.EventRecord EventRecords}.
     * Note that this is an alias to the default {@link #store} config (to differentiate that from the optional {@link #calendarStore}
     * config), and either can be used interchangeably.
     */
    /**
     * @cfg {Ext.data.Store} calendarStore
     * The {@link Ext.data.Store store} which is bound to this calendar and contains {@link Ext.ensible.cal.CalendarRecord CalendarRecords}.
     * This is an optional store that provides multi-calendar (and multi-color) support. If available an additional field for selecting the
     * calendar in which to save an event will be shown in the edit forms. If this store is not available then all events will simply use
     * the default calendar (and color).
     */
    /*
     * @cfg {Boolean} enableRecurrence
     * True to show the recurrence field, false to hide it (default). Note that recurrence requires
     * something on the server-side that can parse the iCal RRULE format in order to generate the
     * instances of recurring events to display on the calendar, so this field should only be enabled
     * if the server supports it.
     */
    //enableRecurrence: false,
    /**
     * @cfg {Boolean} readOnly
     * True to prevent clicks on events or the view from providing CRUD capabilities, false to enable CRUD (the default).
     */
    /**
     * @cfg {Number} startDay
     * The 0-based index for the day on which the calendar week begins (0=Sunday, which is the default)
     */
    startDay : 0,
    /**
     * @cfg {Boolean} spansHavePriority
     * Allows switching between two different modes of rendering events that span multiple days. When true,
     * span events are always sorted first, possibly at the expense of start dates being out of order (e.g., 
     * a span event that starts at 11am one day and spans into the next day would display before a non-spanning 
     * event that starts at 10am, even though they would not be in date order). This can lead to more compact
     * layouts when there are many overlapping events. If false (the default), events will always sort by start date
     * first which can result in a less compact, but chronologically consistent layout.
     */
    spansHavePriority: false,
    /**
     * @cfg {Boolean} trackMouseOver
     * Whether or not the view tracks and responds to the browser mouseover event on contained elements (defaults to
     * true). If you don't need mouseover event highlighting you can disable this.
     */
	trackMouseOver: true,
    /**
     * @cfg {Boolean} enableFx
     * Determines whether or not visual effects for CRUD actions are enabled (defaults to true). If this is false
     * it will override any values for {@link #enableAddFx}, {@link #enableUpdateFx} or {@link enableRemoveFx} and
     * all animations will be disabled.
     */
	enableFx: true,
    /**
     * @cfg {Boolean} enableAddFx
     * True to enable a visual effect on adding a new event (the default), false to disable it. Note that if 
     * {@link #enableFx} is false it will override this value. The specific effect that runs is defined in the
     * {@link #doAddFx} method.
     */
	enableAddFx: true,
    /**
     * @cfg {Boolean} enableUpdateFx
     * True to enable a visual effect on updating an event, false to disable it (the default). Note that if 
     * {@link #enableFx} is false it will override this value. The specific effect that runs is defined in the
     * {@link #doUpdateFx} method.
     */
	enableUpdateFx: false,
    /**
     * @cfg {Boolean} enableRemoveFx
     * True to enable a visual effect on removing an event (the default), false to disable it. Note that if 
     * {@link #enableFx} is false it will override this value. The specific effect that runs is defined in the
     * {@link #doRemoveFx} method.
     */
	enableRemoveFx: true,
    /**
     * @cfg {Boolean} enableDD
     * True to enable drag and drop in the calendar view (the default), false to disable it
     */
    enableDD: true,
    /**
     * @cfg {Boolean} enableContextMenus
     * True to enable automatic right-click context menu handling in the calendar views (the default), false to disable
     * them. Different context menus are provided when clicking on events vs. the view background.
     */
    enableContextMenus: true,
    /**
     * @cfg {Boolean} suppressBrowserContextMenu
     * When {@link #enableContextMenus} is true, the browser context menu will automatically be suppressed whenever a
     * custom context menu is displayed. When this option is true, right-clicks on elements that do not have a custom
     * context menu will also suppress the default browser context menu (no menu will be shown at all). When false,
     * the browser context menu will still show if the right-clicked element has no custom menu (this is the default).
     */
    suppressBrowserContextMenu: false,
    /**
     * @cfg {Boolean} monitorResize
     * True to monitor the browser's resize event (the default), false to ignore it. If the calendar view is rendered
     * into a fixed-size container this can be set to false. However, if the view can change dimensions (e.g., it's in 
     * fit layout in a viewport or some other resizable container) it is very important that this config is true so that
     * any resize event propagates properly to all subcomponents and layouts get recalculated properly.
     */
    monitorResize: true,
    /**
     * @cfg {String} todayText
     * The text to display in the current day's box in the calendar when {@link #showTodayText} is true (defaults to 'Today')
     */
    todayText: 'Today',
    /**
     * @cfg {String} ddCreateEventText
     * The text to display inside the drag proxy while dragging over the calendar to create a new event (defaults to 
     * 'Create event for {0}' where {0} is a date range supplied by the view)
     */
	ddCreateEventText: 'Create event for {0}',
    /**
     * @cfg {String} ddMoveEventText
     * The text to display inside the drag proxy while dragging an event to reposition it (defaults to 
     * 'Move event to {0}' where {0} is the updated event start date/time supplied by the view)
     */
	ddMoveEventText: 'Move event to {0}',
    /**
     * @cfg {String} ddResizeEventText
     * The string displayed to the user in the drag proxy while dragging the resize handle of an event (defaults to 
     * 'Update event to {0}' where {0} is the updated event start-end range supplied by the view). Note that 
     * this text is only used in views
     * that allow resizing of events.
     */
    ddResizeEventText: 'Update event to {0}',
    /**
     * @cfg {String} defaultEventTitleText
     * The default text to display as the title of an event that has a null or empty string title value (defaults to '(No title)')
     */
    defaultEventTitleText: '(No title)',
    /**
     * @cfg {String} dateParamStart
     * The param name representing the start date of the current view range that's passed in requests to retrieve events
     * when loading the view (defauts to 'start').
     */
    dateParamStart: 'start',
    /**
     * @cfg {String} dateParamEnd
     * The param name representing the end date of the current view range that's passed in requests to retrieve events
     * when loading the view (defauts to 'end').
     */
    dateParamEnd: 'end',
    /**
     * @cfg {String} dateParamFormat
     * The format to use for date parameters sent with requests to retrieve events for the calendar (defaults to 'Y-m-d', e.g. '2010-10-31')
     */
    dateParamFormat: 'Y-m-d',
    /**
     * @cfg {Boolean} editModal
     * True to show the default event editor window modally over the entire page, false to allow user interaction with the page
     * while showing the window (the default). Note that if you replace the default editor window with some alternate component this
     * config will no longer apply. 
     */
    editModal: false,
    /**
     * @cfg {Boolean} enableEditDetails
     * True to show a link on the event edit window to allow switching to the detailed edit form (the default), false to remove the
     * link and disable detailed event editing. 
     */
    enableEditDetails: true,
    
    //private properties -- do not override:
    weekCount: 1,
    dayCount: 1,
    eventSelector : '.ext-cal-evt',
    eventOverClass: 'ext-evt-over',
	eventElIdDelimiter: '-evt-',
    dayElIdDelimiter: '-day-',
    
    /**
     * Returns a string of HTML template markup to be used as the body portion of the event template created
     * by {@link #getEventTemplate}. This provides the flexibility to customize what's in the body without
     * having to override the entire XTemplate. This string can include any valid {@link Ext.Template} code, and
     * any data tokens accessible to the containing event template can be referenced in this string.
     * @return {String} The body template string
     */
    getEventBodyMarkup : Ext.emptyFn, // must be implemented by a subclass
    
    /**
     * <p>Returns the XTemplate that is bound to the calendar's event store (it expects records of type
     * {@link Ext.ensible.cal.EventRecord}) to populate the calendar views with events. Internally this method
     * by default generates different markup for browsers that support CSS border radius and those that don't.
     * This method can be overridden as needed to customize the markup generated.</p>
     * <p>Note that this method calls {@link #getEventBodyMarkup} to retrieve the body markup for events separately
     * from the surrounding container markup.  This provides the flexibility to customize what's in the body without
     * having to override the entire XTemplate. If you do override this method, you should make sure that your 
     * overridden version also does the same.</p>
     * @return {Ext.XTemplate} The event XTemplate
     */
    getEventTemplate : Ext.emptyFn, // must be implemented by a subclass
    
    /**
     * This is undefined by default, but can be implemented to allow custom CSS classes and template data to be
     * conditionally applied to events during rendering. This function will be called with the parameter list shown
     * below and is expected to return the CSS class name (or empty string '' for none) that will be added to the 
     * event element's wrapping div. To apply multiple class names, simply return them space-delimited within the 
     * string (e.g., 'my-class another-class'). Example usage, applied in a CalendarPanel config:
     * <pre><code>
// This example assumes a custom field of 'IsHoliday' has been added to EventRecord
viewConfig: {
    getEventClass: function(rec, allday, templateData, store){
        if(rec.data.IsHoliday){
            templateData.iconCls = 'holiday';
            return 'evt-holiday';
        }
        templateData.iconCls = 'plain';
        return '';
    },
    getEventBodyMarkup : function(){
        // This is simplified, but shows the symtax for how you could add a
        // custom placeholder that maps back to the templateData property created
        // in getEventClass. Note that this is standard Ext template syntax.
        if(!this.eventBodyMarkup){
            this.eventBodyMarkup = '&lt;span class="{iconCls}">&lt;/span> {Title}';
        }
        return this.eventBodyMarkup;
    }
}
</code></pre>
     * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} being rendered
     * @param {Boolean} isAllDay A flag indicating whether the event will be <em>rendered</em> as an all-day event. Note that this
     * will not necessarily correspond with the value of the <tt>EventRecord.IsAllDay</tt> field &mdash; events that span multiple
     * days will be rendered using the all-day event template regardless of the field value. If your logic for this function
     * needs to know whether or not the event will be rendered as an all-day event, this value should be used. 
     * @param {Object} templateData A plain JavaScript object that is empty by default. You can add custom properties
     * to this object that will then be passed into the event template for the specific event being rendered. If you have 
     * overridden the default event template and added custom data placeholders, you can use this object to pass the data
     * into the template that will replace those placeholders.
     * @param {Ext.data.Store} store The Event data store in use by the view
     * @method getEventClass
     * @return {String} A space-delimited CSS class string (or '')
     */
    
    // private
    initComponent : function(){
        this.setStartDate(this.startDate || new Date());
        
        Ext.ensible.cal.CalendarView.superclass.initComponent.call(this);
        
        if(this.readOnly === true){
            this.addClass('ext-cal-readonly');
        }
		
        this.addEvents({
            /**
             * @event eventsrendered
             * Fires after events are finished rendering in the view
             * @param {Ext.ensible.cal.CalendarView} this 
             */
            eventsrendered: true,
            /**
             * @event eventclick
             * Fires after the user clicks on an event element. This is a cancelable event, so returning false from a 
             * handler will cancel the click without displaying the event editor view. This could be useful for 
             * validating the rules by which events should be editable by the user.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was clicked on
             * @param {HTMLNode} el The DOM node that was clicked on
             */
            eventclick: true,
            /**
             * @event eventover
             * Fires anytime the mouse is over an event element
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that the cursor is over
             * @param {HTMLNode} el The DOM node that is being moused over
             */
            eventover: true,
            /**
             * @event eventout
             * Fires anytime the mouse exits an event element
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that the cursor exited
             * @param {HTMLNode} el The DOM node that was exited
             */
            eventout: true,
            /**
             * @event beforedatechange
             * Fires before the start date of the view changes, giving you an opportunity to save state or anything else you may need
             * to do prior to the UI view changing. This is a cancelable event, so returning false from a handler will cancel both the
             * view change and the setting of the start date.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Date} startDate The current start date of the view (as explained in {@link #getStartDate}
             * @param {Date} newStartDate The new start date that will be set when the view changes
             * @param {Date} viewStart The first displayed date in the current view
             * @param {Date} viewEnd The last displayed date in the current view
             */
            beforedatechange: true,
            /**
             * @event datechange
             * Fires after the start date of the view has changed. If you need to cancel the date change you should handle the 
             * {@link #beforedatechange} event and return false from your handler function.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Date} startDate The start date of the view (as explained in {@link #getStartDate}
             * @param {Date} viewStart The first displayed date in the view
             * @param {Date} viewEnd The last displayed date in the view
             */
            datechange: true,
            /**
             * @event rangeselect
             * Fires after the user drags on the calendar to select a range of dates/times in which to create an event. This is a 
             * cancelable event, so returning false from a handler will cancel the drag operation and clean up any drag shim elements
             * without displaying the event editor view. This could be useful for validating that a user can only create events within
             * a certain range.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Object} dates An object containing the start (StartDate property) and end (EndDate property) dates selected
             * @param {Function} callback A callback function that MUST be called after the event handling is complete so that
             * the view is properly cleaned up (shim elements are persisted in the view while the user is prompted to handle the
             * range selection). The callback is already created in the proper scope, so it simply needs to be executed as a standard
             * function call (e.g., callback()).
             */
			rangeselect: true,
            /**
             * @event beforeeventmove
             * Fires before an event element is dragged by the user and dropped in a new position. This is a cancelable event, so 
             * returning false from a handler will cancel the move operation. This could be useful for validating that a user can 
             * only move events within a certain date range.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that will be moved
             * @param {Date} dt The new start date to be set (the end date will be automaticaly adjusted to match the event duration)
             */
            beforeeventmove: true,
            /**
             * @event eventmove
             * Fires after an event element has been dragged by the user and dropped in a new position. If you need to cancel the 
             * move operation you should handle the {@link #beforeeventmove} event and return false from your handler function.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was moved with
             * updated start and end dates
             */
			eventmove: true,
            /**
             * @event initdrag
             * Fires when a drag operation is initiated in the view
             * @param {Ext.ensible.cal.CalendarView} this
             */
            initdrag: true,
            /**
             * @event dayover
             * Fires while the mouse is over a day element 
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Date} dt The date that is being moused over
             * @param {Ext.Element} el The day Element that is being moused over
             */
            dayover: true,
            /**
             * @event dayout
             * Fires when the mouse exits a day element 
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Date} dt The date that is exited
             * @param {Ext.Element} el The day Element that is exited
             */
            dayout: true,
            /**
             * @event editdetails
             * Fires when the user selects the option in this window to continue editing in the detailed edit form
             * (by default, an instance of {@link Ext.ensible.cal.EventEditForm}. Handling code should hide this window
             * and transfer the current event record to the appropriate instance of the detailed form by showing it
             * and calling {@link Ext.ensible.cal.EventEditForm#loadRecord loadRecord}.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} that is currently being edited
             * @param {Ext.Element} el The target element
             */
            editdetails: true,
            /**
             * @event eventadd
             * Fires after a new event has been added to the underlying store
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was added
             */
            eventadd: true,
            /**
             * @event eventupdate
             * Fires after an existing event has been updated
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was updated
             */
            eventupdate: true,
            /**
             * @event eventcancel
             * Fires after an event add/edit operation has been canceled by the user and no store update took place
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was canceled
             */
            eventcancel: true,
            /**
             * @event beforeeventdelete
             * Fires before an event is deleted by the user. This is a cancelable event, so returning false from a handler 
             * will cancel the delete operation.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was deleted
             * @param {Ext.Element} el The target element
             */
            beforeeventdelete: true,
            /**
             * @event eventdelete
             * Fires after an event has been deleted by the user. If you need to cancel the delete operation you should handle the 
             * {@link #beforeeventdelete} event and return false from your handler function.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was deleted
             * @param {Ext.Element} el The target element
             */
            eventdelete: true
        });
    },

    // private
    afterRender : function(){
        Ext.ensible.cal.CalendarView.superclass.afterRender.call(this);

        this.renderTemplate();
        
        if(this.store){
            this.store.autoSave = false; // not supported, the calendar will manage saving
            this.setStore(this.store, true);
            
            if(this.store.deferLoad){
                this.reloadStore(this.store.deferLoad);
                delete this.store.deferLoad;
            }
            else {
                this.store.initialParams = this.getStoreParams();
            }
        }
        if(this.calendarStore){
            this.setCalendarStore(this.calendarStore, true);
        }

        this.el.on({
            'mouseover': this.onMouseOver,
            'mouseout': this.onMouseOut,
            'click': this.onClick,
			'resize': this.onResize,
            scope: this
        });
        
        // currently the context menu only contains CRUD actions so do not show it if read-only
        if(this.enableContextMenus && this.readOnly !== true){
            this.el.on('contextmenu', this.onContextMenu, this);
        }
		
		this.el.unselectable();
        
        if(this.enableDD && this.readOnly !== true && this.initDD){
			this.initDD();
        }
        
        this.on('eventsrendered', this.forceSize);
        this.forceSize.defer(100, this);
    },
    
    /**
     * Returns an object containing the start and end dates to be passed as params in all calls
     * to load the event store. The param names are customizable using {@link #dateParamStart}
     * and {@link #dateParamEnd} and the date format used in requests is defined by {@link #dateParamFormat}.
     * If you need to add additional parameters to be sent when loading the store see {@link #getStoreParams}.
     * @return {Object} An object containing the start and end dates
     */
    getStoreDateParams : function(){
        var o = {};
        o[this.dateParamStart] = this.viewStart.format(this.dateParamFormat);
        o[this.dateParamEnd] = this.viewEnd.format(this.dateParamFormat);
        return o;
    },
    
    /**
     * Returns an object containing all key/value params to be passed when loading the event store.
     * By default the returned object will simply be the same object returned by {@link #getStoreDateParams},
     * but this method is intended to be overridden if you need to pass anything in addition to start and end dates.
     * See the inline code comments when overriding for details.
     * @return {Object} An object containing all params to be sent when loading the event store
     */
    getStoreParams : function(){
        // This is needed if you require the default start and end dates to be included
        var params = this.getStoreDateParams();
        
        // Here is where you can add additional custom params, e.g.:
        // params.now = new Date().format(this.dateParamFormat);
        // params.foo = 'bar';
        // params.number = 123;
        
        return params;
    },
    
    /**
     * Reloads the view's underlying event store using the params returned from {@link #getStoreParams}.
     * Reloading the store is typically managed automatically by the view itself, but the method is
     * available in case a manual reload is ever needed.
     * @param {Object} options (optional) An object matching the format used by Store's {@link Ext.data.Store#load load} method
     */
    reloadStore : function(o){
        Ext.ensible.log('reloadStore');
        o = Ext.isObject(o) ? o : {};
        o.params = o.params || {};
        
        Ext.apply(o.params, this.getStoreParams());
        this.store.load(o);
    },
    
    // private
    forceSize: function(){
        if(this.el && this.el.child){
            var hd = this.el.child('.ext-cal-hd-ct'),
                bd = this.el.child('.ext-cal-body-ct');
                
            if(bd==null || hd==null) return;
                
            var headerHeight = hd.getHeight(),
                sz = this.el.parent().getSize();
                   
            bd.setHeight(sz.height-headerHeight);
        }
    },

    /**
     * Refresh the current view, optionally reloading the event store also. While this is normally
     * managed internally on any navigation and/or CRUD action, there are times when you might want
     * to refresh the view manually (e.g., if you'd like to reload using different {@link #getStoreParams params}).
     * @param {Boolean} reloadData True to reload the store data first, false to simply redraw the view using current 
     * data (defaults to false)
     */
    refresh : function(reloadData){
        Ext.ensible.log('refresh (base), reload = '+reloadData);
        if(reloadData === true){
            this.reloadStore();
        }
        this.prepareData();
        this.renderTemplate();
        this.renderItems();
    },
    
    // private
    getWeekCount : function(){
        var days = Ext.ensible.Date.diffDays(this.viewStart, this.viewEnd);
        return Math.ceil(days / this.dayCount);
    },
    
    // private
    prepareData : function(){
        var lastInMonth = this.startDate.getLastDateOfMonth(),
            w = 0, row = 0,
            dt = this.viewStart.clone(),
            weeks = this.weekCount < 1 ? 6 : this.weekCount;
        
        this.eventGrid = [[]];
        this.allDayGrid = [[]];
        this.evtMaxCount = [];
        
        var evtsInView = this.store.queryBy(function(rec){
            return this.isEventVisible(rec.data);
        }, this);
        
        for(; w < weeks; w++){
            this.evtMaxCount[w] = 0;
            if(this.weekCount == -1 && dt > lastInMonth){
                //current week is fully in next month so skip
                break;
            }
            this.eventGrid[w] = this.eventGrid[w] || [];
            this.allDayGrid[w] = this.allDayGrid[w] || [];
            
            for(d = 0; d < this.dayCount; d++){
                if(evtsInView.getCount() > 0){
                    var evts = evtsInView.filterBy(function(rec){
                        var startsOnDate = (dt.getTime() == rec.data[Ext.ensible.cal.EventMappings.StartDate.name].clearTime(true).getTime());
                        var spansFromPrevView = (w == 0 && d == 0 && (dt > rec.data[Ext.ensible.cal.EventMappings.StartDate.name]));
                        return startsOnDate || spansFromPrevView;
                    }, this);
                    
                    this.sortEventRecordsForDay(evts);
                    this.prepareEventGrid(evts, w, d);
                }
                dt = dt.add(Date.DAY, 1);
            }
        }
        this.currentWeekCount = w;
    },
    
    // private
    prepareEventGrid : function(evts, w, d){
        var row = 0,
            dt = this.viewStart.clone(),
            max = this.maxEventsPerDay ? this.maxEventsPerDay : 999;
        
        evts.each(function(evt){
            var M = Ext.ensible.cal.EventMappings;
            
            if(Ext.ensible.Date.diffDays(evt.data[M.StartDate.name], evt.data[M.EndDate.name]) > 0){
                var daysInView = Ext.ensible.Date.diffDays(
                    Ext.ensible.Date.max(this.viewStart, evt.data[M.StartDate.name]),
                    Ext.ensible.Date.min(this.viewEnd, evt.data[M.EndDate.name])) + 1;
                    
                this.prepareEventGridSpans(evt, this.eventGrid, w, d, daysInView);
                this.prepareEventGridSpans(evt, this.allDayGrid, w, d, daysInView, true);
            }
            else{
                row = this.findEmptyRowIndex(w,d);
                this.eventGrid[w][d] = this.eventGrid[w][d] || [];
                this.eventGrid[w][d][row] = evt;
                
                if(evt.data[M.IsAllDay.name]){
                    row = this.findEmptyRowIndex(w,d, true);
                    this.allDayGrid[w][d] = this.allDayGrid[w][d] || [];
                    this.allDayGrid[w][d][row] = evt;
                }
            }
            
            if(this.evtMaxCount[w] < this.eventGrid[w][d].length){
                this.evtMaxCount[w] = Math.min(max+1, this.eventGrid[w][d].length);
            }
            return true;
        }, this);
    },
    
    // private
    prepareEventGridSpans : function(evt, grid, w, d, days, allday){
        // this event spans multiple days/weeks, so we have to preprocess
        // the events and store special span events as placeholders so that
        // the render routine can build the necessary TD spans correctly.
        var w1 = w, d1 = d, 
            row = this.findEmptyRowIndex(w,d,allday),
            dt = this.viewStart.clone();
        
        var start = {
            event: evt,
            isSpan: true,
            isSpanStart: true,
            spanLeft: false,
            spanRight: (d == 6)
        };
        grid[w][d] = grid[w][d] || [];
        grid[w][d][row] = start;
        
        while(--days){
            dt = dt.add(Date.DAY, 1);
            if(dt > this.viewEnd){
                break;
            }
            if(++d1>6){
                // reset counters to the next week
                d1 = 0; w1++;
                row = this.findEmptyRowIndex(w1,0);
            }
            grid[w1] = grid[w1] || [];
            grid[w1][d1] = grid[w1][d1] || [];
            
            grid[w1][d1][row] = {
                event: evt,
                isSpan: true,
                isSpanStart: (d1 == 0),
                spanLeft: (w1 > w) && (d1 % 7 == 0),
                spanRight: (d1 == 6) && (days > 1)
            };
        }
    },
    
    // private
    findEmptyRowIndex : function(w, d, allday){
        var grid = allday ? this.allDayGrid : this.eventGrid,
            day = grid[w] ? grid[w][d] || [] : [],
            i = 0, ln = day.length;
            
        for(; i < ln; i++){
            if(day[i] == null){
                return i;
            }
        }
        return ln;
    },
    
    // private
    renderTemplate : function(){
        if(this.tpl){
            this.tpl.overwrite(this.el, this.getParams());
            this.lastRenderStart = this.viewStart.clone();
            this.lastRenderEnd = this.viewEnd.clone();
        }
    },
    
    /**
     * Disable store event monitoring within this view. Note that if you do this the view will no longer
     * refresh itself automatically when CRUD actions occur. To enable store events see {@link #enableStoreEvents}.
     * @return {CalendarView} this
     */
	disableStoreEvents : function(){
		this.monitorStoreEvents = false;
        return this;
	},
	
    /**
     * Enable store event monitoring within this view if disabled by {@link #disbleStoreEvents}.
     * @return {CalendarView} this
     */
	enableStoreEvents : function(refresh){
		this.monitorStoreEvents = true;
		if(refresh === true){
			this.refresh();
		}
        return this;
	},
	
    // private
	onResize : function(){
		this.refresh(false);
	},
	
    // private
	onInitDrag : function(){
        this.fireEvent('initdrag', this);
    },
	
    // private
	onEventDrop : function(rec, dt){
        this.moveEvent(rec, dt);
	},
    
    // private
	onCalendarEndDrag : function(start, end, onComplete){
        // set this flag for other event handlers that might conflict while we're waiting
        this.dragPending = true;
        
        var dates = {},
            onComplete = this.onCalendarEndDragComplete.createDelegate(this, [onComplete]);
        
        dates[Ext.ensible.cal.EventMappings.StartDate.name] = start;
        dates[Ext.ensible.cal.EventMappings.EndDate.name] = end;
        
        if(this.fireEvent('rangeselect', this, dates, onComplete) !== false){
            this.showEventEditor(dates, null);
            this.editWin.on('hide', onComplete, this, {single:true});
        }
        else{
            // client code canceled the selection so clean up immediately
            this.onCalendarEndDragComplete(onComplete);
        }
	},
    
    // private
    onCalendarEndDragComplete : function(onComplete){
        // callback for the drop zone to clean up
        onComplete();
        // clear flag for other events to resume normally
        this.dragPending = false;
    },
	
    // private
    onUpdate : function(ds, rec, operation){
        if(this.hidden === true || this.monitorStoreEvents === false){
            return;
        }
        if(operation == Ext.data.Record.COMMIT){
            Ext.ensible.log('onUpdate');
            this.dismissEventEditor();
            
            var rrule = rec.data[Ext.ensible.cal.EventMappings.RRule.name];
            // if the event has a recurrence rule we have to reload the store in case
            // any event instances were updated on the server
            this.refresh(rrule !== undefined && rrule !== '');
            
			if(this.enableFx && this.enableUpdateFx){
				this.doUpdateFx(this.getEventEls(rec.data[Ext.ensible.cal.EventMappings.EventId.name]), {
                    scope: this
                });
			}
        }
    },
    
    /**
     * Provides the element effect(s) to run after an event is updated. The method is passed a {@link Ext.CompositeElement}
     * that contains one or more elements in the DOM representing the event that was updated. The default 
     * effect is {@link Ext.Element#highlight highlight}. Note that this method will only be called when 
     * {@link #enableUpdateFx} is true (it is false by default).
     * @param {Ext.CompositeElement} el The {@link Ext.CompositeElement} representing the updated event
     * @param {Object} options An options object to be passed through to any Element.Fx methods. By default this
     * object only contains the current scope (<tt>{scope:this}</tt>) but you can also add any additional fx-specific 
     * options that might be needed for a particular effect to this object.
     */
	doUpdateFx : function(els, o){
		this.highlightEvent(els, null, o);
	},
	
    // private
    onAdd : function(ds, recs, index){
        var rec = Ext.isArray(recs) ? recs[0] : recs; 
        if(this.hidden === true || this.monitorStoreEvents === false || rec.phantom){
            return;
        }
        if(rec._deleting){
            delete rec._deleting;
            return;
        }
        
        Ext.ensible.log('onAdd');
        
		var rrule = rec.data[Ext.ensible.cal.EventMappings.RRule.name];
        
        this.dismissEventEditor();    
		this.tempEventId = rec.id;
        // if the new event has a recurrence rule we have to reload the store in case
        // new event instances were generated on the server
		this.refresh(rrule !== undefined && rrule !== '');
		
		if(this.enableFx && this.enableAddFx){
			this.doAddFx(this.getEventEls(rec.data[Ext.ensible.cal.EventMappings.EventId.name]), {
                scope: this
            });
		};
    },
	
    /**
     * Provides the element effect(s) to run after an event is added. The method is passed a {@link Ext.CompositeElement}
     * that contains one or more elements in the DOM representing the event that was added. The default 
     * effect is {@link Ext.Element#fadeIn fadeIn}. Note that this method will only be called when 
     * {@link #enableAddFx} is true (it is true by default).
     * @param {Ext.CompositeElement} el The {@link Ext.CompositeElement} representing the added event
     * @param {Object} options An options object to be passed through to any Element.Fx methods. By default this
     * object only contains the current scope (<tt>{scope:this}</tt>) but you can also add any additional fx-specific 
     * options that might be needed for a particular effect to this object.
     */
	doAddFx : function(els, o){
		els.fadeIn(Ext.apply(o, {duration:2}));
	},
	
    // private
    onRemove : function(ds, rec){
        if(this.hidden === true || this.monitorStoreEvents === false){
            return;
        }
        
        Ext.ensible.log('onRemove');
        this.dismissEventEditor();
        
        var rrule = rec.data[Ext.ensible.cal.EventMappings.RRule.name],
            // if the new event has a recurrence rule we have to reload the store in case
            // new event instances were generated on the server
            isRecurring = rrule !== undefined && rrule !== '';
        
		if(this.enableFx && this.enableRemoveFx){
			this.doRemoveFx(this.getEventEls(rec.data[Ext.ensible.cal.EventMappings.EventId.name]), {
	            remove: true,
	            scope: this,
				callback: this.refresh.createDelegate(this, [isRecurring])
			});
		}
		else{
			this.getEventEls(rec.data[Ext.ensible.cal.EventMappings.EventId.name]).remove();
            this.refresh(isRecurring);
		}
    },
	
    /**
     * Provides the element effect(s) to run after an event is removed. The method is passed a {@link Ext.CompositeElement}
     * that contains one or more elements in the DOM representing the event that was removed. The default 
     * effect is {@link Ext.Element#fadeOut fadeOut}. Note that this method will only be called when 
     * {@link #enableRemoveFx} is true (it is true by default).
     * @param {Ext.CompositeElement} el The {@link Ext.CompositeElement} representing the removed event
     * @param {Object} options An options object to be passed through to any Element.Fx methods. By default this
     * object contains the following properties:
     * <pre><code>
{
   remove: true, // required by fadeOut to actually remove the element(s)
   scope: this,  // required for the callback
   callback: fn  // required to refresh the view after the fx finish
} 
     * </code></pre>
     * While you can modify this options object as needed if you change the effect used, please note that the
     * callback method (and scope) MUST still be passed in order for the view to refresh correctly after the removal.
     * Please see the inline code comments before overriding this method. 
     */
	doRemoveFx : function(els, o){
        // Please make sure you keep this entire code block or removing events might not work correctly!
        // Removing is a little different because we have to wait for the fx to finish, then we have to actually
        // refresh the view AFTER the fx are run (this is different than add and update).
        if(els.getCount() == 0 && Ext.isFunction(o.callback)){
            // if there are no matching elements in the view make sure the callback still runs.
            // this can happen when an event accessed from the "more" popup is deleted.
            o.callback.call(o.scope || this);
        }
        else{
            // If you'd like to customize the remove fx do so here. Just make sure you
            // DO NOT override the default callback property on the options object, and that
            // you still pass that object in whatever fx method you choose.
            els.fadeOut(o);
        }
	},
	
	/**
	 * Visually highlights an event using {@link Ext.Fx#highlight} config options.
	 * @param {Ext.CompositeElement} els The element(s) to highlight
	 * @param {Object} color (optional) The highlight color. Should be a 6 char hex 
	 * color without the leading # (defaults to yellow: 'ffff9c')
	 * @param {Object} o (optional) Object literal with any of the {@link Ext.Fx} config 
	 * options. See {@link Ext.Fx#highlight} for usage examples.
	 */
	highlightEvent : function(els, color, o) {
		if(this.enableFx){
			var c;
			!(Ext.isIE || Ext.isOpera) ? 
				els.highlight(color, o) :
				// Fun IE/Opera handling:
				els.each(function(el){
					el.highlight(color, Ext.applyIf({attr:'color'}, o));
					if(c = el.child('.ext-cal-evm')) {
						c.highlight(color, o);
					}
				}, this);
		}
	},
	
	/**
	 * Retrieve an Event object's id from its corresponding node in the DOM.
	 * @param {String/Element/HTMLElement} el An {@link Ext.Element}, DOM node or id
	 */
//	getEventIdFromEl : function(el){
//		el = Ext.get(el);
//		var id = el.id.split(this.eventElIdDelimiter)[1];
//        if(id.indexOf('-w_') > -1){
//            //This id has the index of the week it is rendered in as part of the suffix.
//            //This allows events that span across weeks to still have reproducibly-unique DOM ids.
//            id = id.split('-w_')[0];
//        }
//        return id;
//	},
    getEventIdFromEl : function(el){
        el = Ext.get(el);
        var parts, id = '', cls, classes = el.dom.className.split(' ');
        
        Ext.each(classes, function(cls){
            parts = cls.split(this.eventElIdDelimiter);
            if(parts.length > 1){
                id = parts[1];
                return false;
            }
        }, this);
        
        return id;
    },
	
	// private
	getEventId : function(eventId){
		if(eventId === undefined && this.tempEventId){
            // temp record id assigned during an add, will be overwritten later
			eventId = this.tempEventId;
		}
		return eventId;
	},
	
	/**
	 * 
	 * @param {String} eventId
	 * @param {Boolean} forSelect
	 * @return {String} The selector class
	 */
	getEventSelectorCls : function(eventId, forSelect){
		var prefix = forSelect ? '.' : '';
		return prefix + this.id + this.eventElIdDelimiter + this.getEventId(eventId);
	},

	/**
	 * 
	 * @param {String} eventId
	 * @return {Ext.CompositeElement} The matching CompositeElement of nodes
	 * that comprise the rendered event.  Any event that spans across a view 
	 * boundary will contain more than one internal Element.
	 */
	getEventEls : function(eventId){
		var els = this.el.select(this.getEventSelectorCls(this.getEventId(eventId), true), false);
		return new Ext.CompositeElement(els);
	},
    
    /**
     * Returns true if the view is currently displaying today's date, else false.
     * @return {Boolean} True or false
     */
    isToday : function(){
        var today = new Date().clearTime().getTime();
        return this.viewStart.getTime() <= today && this.viewEnd.getTime() >= today;
    },

    // private
    onDataChanged : function(store){
        Ext.ensible.log('onDataChanged');
        this.refresh(false);
    },
    
    // private
    isEventVisible : function(evt){
        var M = Ext.ensible.cal.EventMappings,
            data = evt.data ? evt.data : evt,
            calId = data[M.CalendarId.name],
            calRec = this.calendarStore ? this.calendarStore.getById(calId) : null;
            
        if(calRec && calRec.data[Ext.ensible.cal.CalendarMappings.IsHidden.name] === true){
            // if the event is on a hidden calendar then no need to test the date boundaries
            return false;
        }
            
        var start = this.viewStart.getTime(),
            end = this.viewEnd.getTime(),
            evStart = data[M.StartDate.name].getTime(),
            evEnd = data[M.EndDate.name].getTime();
            
        return Ext.ensible.Date.rangesOverlap(start, end, evStart, evEnd);
    },
    
    // private
    isOverlapping : function(evt1, evt2){
        var ev1 = evt1.data ? evt1.data : evt1,
            ev2 = evt2.data ? evt2.data : evt2,
            M = Ext.ensible.cal.EventMappings,
            start1 = ev1[M.StartDate.name].getTime(),
            end1 = ev1[M.EndDate.name].add(Date.SECOND, -1).getTime(),
            start2 = ev2[M.StartDate.name].getTime(),
            end2 = ev2[M.EndDate.name].add(Date.SECOND, -1).getTime(),
            startDiff = Ext.ensible.Date.diff(ev1[M.StartDate.name], ev2[M.StartDate.name], 'm');
            
            if(end1<start1){
                end1 = start1;
            }
            if(end2<start2){
                end2 = start2;
            }
            
//            var ev1startsInEv2 = (start1 >= start2 && start1 <= end2),
//            ev1EndsInEv2 = (end1 >= start2 && end1 <= end2),
//            ev1SpansEv2 = (start1 < start2 && end1 > end2),
            var evtsOverlap = Ext.ensible.Date.rangesOverlap(start1, end1, start2, end2),
                minimumMinutes = this.minEventDisplayMinutes || 0, // applies in day/week body view only for vertical overlap
                ev1MinHeightOverlapsEv2 = minimumMinutes > 0 && (startDiff > -minimumMinutes && startDiff < minimumMinutes);
        
        //return (ev1startsInEv2 || ev1EndsInEv2 || ev1SpansEv2 || ev1MinHeightOverlapsEv2);
        return (evtsOverlap || ev1MinHeightOverlapsEv2);
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
        return this.id + this.dayElIdDelimiter + dt;
    },
    
    /**
     * Returns the start date of the view, as set by {@link #setStartDate}. Note that this may not 
     * be the first date displayed in the rendered calendar -- to get the start and end dates displayed
     * to the user use {@link #getViewBounds}.
     * @return {Date} The start date
     */
    getStartDate : function(){
        return this.startDate;
    },

    /**
     * Sets the start date used to calculate the view boundaries to display. The displayed view will be the 
     * earliest and latest dates that match the view requirements and contain the date passed to this function.
     * @param {Date} dt The date used to calculate the new view boundaries
     */
    setStartDate : function(start, /*private*/reload){
        Ext.ensible.log('setStartDate (base) '+start.format('Y-m-d'));
        if(this.fireEvent('beforedatechange', this, this.startDate, start, this.viewStart, this.viewEnd) !== false){
            this.startDate = start.clearTime();
            this.setViewBounds(start);
            if(this.rendered){
                this.refresh(reload);
            }
            this.fireEvent('datechange', this, this.startDate, this.viewStart, this.viewEnd);
        }
    },
    
    // private
    setViewBounds : function(startDate){
        var start = startDate || this.startDate,
            offset = start.getDay() - this.startDay;
        
        switch(this.weekCount){
            case 0:
            case 1:
                this.viewStart = this.dayCount < 7 && !this.startDayIsStatic ? start : start.add(Date.DAY, -offset).clearTime(true);
                this.viewEnd = this.viewStart.add(Date.DAY, this.dayCount || 7).add(Date.SECOND, -1);
                return;
            
            case -1: // auto by month
                start = start.getFirstDateOfMonth();
                offset = start.getDay() - this.startDay;
                if(offset < 0){
                    // if the offset is negative then some days will be in the previous week so add a week to the offset
                    offset += 7;
                }
                this.viewStart = start.add(Date.DAY, -offset).clearTime(true);
                
                // start from current month start, not view start:
                var end = start.add(Date.MONTH, 1).add(Date.SECOND, -1);
                // fill out to the end of the week:
                offset = this.startDay;
                if(offset > end.getDay()){
                    // if the offset is larger than the end day index then the last row will be empty so skip it
                    offset -= 7;
                }
                this.viewEnd = end.add(Date.DAY, 6-end.getDay()+offset);
                return;
            
            default:
                this.viewStart = start.add(Date.DAY, -offset).clearTime(true);
                this.viewEnd = this.viewStart.add(Date.DAY, this.weekCount * 7).add(Date.SECOND, -1);
        }
    },
    
    /**
     * Returns the start and end boundary dates currently displayed in the view. The method
     * returns an object literal that contains the following properties:<ul>
     * <li><b>start</b> Date : <div class="sub-desc">The start date of the view</div></li>
     * <li><b>end</b> Date : <div class="sub-desc">The end date of the view</div></li></ul>
     * For example:<pre><code>
var bounds = view.getViewBounds();
alert('Start: '+bounds.start);
alert('End: '+bounds.end);
</code></pre>
     * @return {Object} An object literal containing the start and end values
     */
    getViewBounds : function(){
        return {
            start: this.viewStart,
            end: this.viewEnd
        }
    },
	
	/* private
	 * Sort events for a single day for display in the calendar.  This sorts allday
	 * events first, then non-allday events are sorted either based on event start
	 * priority or span priority based on the value of {@link #spansHavePriority} 
	 * (defaults to event start priority).
	 * @param {MixedCollection} evts A {@link Ext.util.MixedCollection MixedCollection}  
	 * of {@link #Ext.ensible.cal.EventRecord EventRecord} objects
	 */
	sortEventRecordsForDay: function(evts){
        if(evts.length < 2){
            return;
        }
		evts.sort('ASC', function(evtA, evtB){
			var a = evtA.data, b = evtB.data,
                M = Ext.ensible.cal.EventMappings;
			
			// Always sort all day events before anything else
			if (a[M.IsAllDay.name]) {
				return -1;
			}
			else if (b[M.IsAllDay.name]) {
				return 1;
			}
			if (this.spansHavePriority) {
				// This logic always weights span events higher than non-span events 
				// (at the possible expense of start time order). This seems to 
				// be the approach used by Google calendar and can lead to a more
				// visually appealing layout in complex cases, but event order is
				// not guaranteed to be consistent.
				var diff = Ext.ensible.Date.diffDays;
				if (diff(a[M.StartDate.name], a[M.EndDate.name]) > 0) {
					if (diff(b[M.StartDate.name], b[M.EndDate.name]) > 0) {
						// Both events are multi-day
						if (a[M.StartDate.name].getTime() == b[M.StartDate.name].getTime()) {
							// If both events start at the same time, sort the one
							// that ends later (potentially longer span bar) first
							return b[M.EndDate.name].getTime() - a[M.EndDate.name].getTime();
						}
						return a[M.StartDate.name].getTime() - b[M.StartDate.name].getTime();
					}
					return -1;
				}
				else if (diff(b[M.StartDate.name], b[M.EndDate.name]) > 0) {
					return 1;
				}
				return a[M.StartDate.name].getTime() - b[M.StartDate.name].getTime();
			}
			else {
				// Doing this allows span and non-span events to intermingle but
				// remain sorted sequentially by start time. This seems more proper
				// but can make for a less visually-compact layout when there are
				// many such events mixed together closely on the calendar.
				return a[M.StartDate.name].getTime() - b[M.StartDate.name].getTime();
			}
		}.createDelegate(this));
	},
    
    /**
     * Updates the view to contain the passed date
     * @param {Date} dt The date to display
     */
    moveTo : function(dt, /*private*/reload){
        if(Ext.isDate(dt)){
            this.setStartDate(dt, reload);
            return this.startDate;
        }
        return dt;
    },

    /**
     * Updates the view to the next consecutive date(s)
     * @return {Date} The new date
     */
    moveNext : function(/*private*/reload){
        return this.moveTo(this.viewEnd.add(Date.DAY, 1), reload);
    },

    /**
     * Updates the view to the previous consecutive date(s)
     * @return {Date} The new date
     */
    movePrev : function(/*private*/reload){
        var days = Ext.ensible.Date.diffDays(this.viewStart, this.viewEnd)+1;
        return this.moveDays(-days, reload);
    },
    
    /**
     * Shifts the view by the passed number of months relative to the currently set date
     * @param {Number} value The number of months (positive or negative) by which to shift the view
     * @return {Date} The new date
     */
    moveMonths : function(value, /*private*/reload){
        return this.moveTo(this.startDate.add(Date.MONTH, value), reload);
    },
    
    /**
     * Shifts the view by the passed number of weeks relative to the currently set date
     * @param {Number} value The number of weeks (positive or negative) by which to shift the view
     * @return {Date} The new date
     */
    moveWeeks : function(value, /*private*/reload){
        return this.moveTo(this.startDate.add(Date.DAY, value*7), reload);
    },
    
    /**
     * Shifts the view by the passed number of days relative to the currently set date
     * @param {Number} value The number of days (positive or negative) by which to shift the view
     * @return {Date} The new date
     */
    moveDays : function(value, /*private*/reload){
        return this.moveTo(this.startDate.add(Date.DAY, value), reload);
    },
    
    /**
     * Updates the view to show today
     * @return {Date} Today's date
     */
    moveToday : function(/*private*/reload){
        return this.moveTo(new Date(), reload);
    },
    
    /**
     * Sets the event store used by the calendar to display {@link Ext.ensible.cal.EventRecord events}.
     * @param {Ext.data.Store} store
     */
    setStore : function(store, initial){
        var currStore = this.store;
        
        if(!initial && currStore){
            currStore.un("datachanged", this.onDataChanged, this);
            currStore.un("clear", this.refresh, this);
            currStore.un("write", this.onWrite, this);
            currStore.un("exception", this.onException, this);
        }
        if(store){
            store.on("datachanged", this.onDataChanged, this);
            store.on("clear", this.refresh, this);
            store.on("write", this.onWrite, this);
            store.on("exception", this.onException, this);
        }
        this.store = store;
    },
    
    // private
    onException : function(proxy, type, action, o, res, arg){
        // form edits are explicitly canceled, but we may not know if a drag/drop operation
        // succeeded until after a server round trip. if the update failed we have to explicitly
        // reject the changes so that the record doesn't stick around in the store's modified list 
        if(arg.reject){
            arg.reject();
        }
    },
    
    /**
     * Sets the calendar store used by the calendar (contains records of type {@link Ext.ensible.cal.CalendarRecord CalendarRecord}).
     * @param {Ext.data.Store} store
     */
    setCalendarStore : function(store, initial){
        if(!initial && this.calendarStore){
            this.calendarStore.un("datachanged", this.refresh, this);
            this.calendarStore.un("add", this.refresh, this);
            this.calendarStore.un("remove", this.refresh, this);
            this.calendarStore.un("update", this.refresh, this);
        }
        if(store){
            store.on("datachanged", this.refresh, this);
            store.on("add", this.refresh, this);
            store.on("remove", this.refresh, this);
            store.on("update", this.refresh, this);
        }
        this.calendarStore = store;
    },
	
    // private
    getEventRecord : function(id){
        var idx = this.store.find(Ext.ensible.cal.EventMappings.EventId.name, id);
        return this.store.getAt(idx);
    },
	
    // private
	getEventRecordFromEl : function(el){
		return this.getEventRecord(this.getEventIdFromEl(el));
	},
    
    // private
    getParams : function(){
        return {
            viewStart: this.viewStart,
            viewEnd: this.viewEnd,
            startDate: this.startDate,
            dayCount: this.dayCount,
            weekCount: this.weekCount
        };
    },
    
    // private
    getEventEditor : function(){
        // only create one instance of the edit window, even if there are multiple CalendarPanels
        this.editWin = this.editWin || Ext.WindowMgr.get('ext-cal-editwin');
         
        if(!this.editWin){
            this.editWin = new Ext.ensible.cal.EventEditWindow({
                id: 'ext-cal-editwin',
                calendarStore: this.calendarStore,
                modal: this.editModal,
                enableEditDetails: this.enableEditDetails,
                listeners: {
                    'eventadd': {
                        fn: function(win, rec, animTarget){
                            //win.hide(animTarget);
                            win.currentView.onEventAdd(null, rec);
                        },
                        scope: this
                    },
                    'eventupdate': {
                        fn: function(win, rec, animTarget){
                            //win.hide(animTarget);
                            win.currentView.onEventUpdate(null, rec);
                        },
                        scope: this
                    },
                    'eventdelete': {
                        fn: function(win, rec, animTarget){
                            //win.hide(animTarget);
                            win.currentView.onEventDelete(null, rec);
                        },
                        scope: this
                    },
                    'editdetails': {
                        fn: function(win, rec, animTarget, view){
                            win.hide(animTarget);
                            win.currentView.fireEvent('editdetails', win.currentView, rec, animTarget);
                        },
                        scope: this
                    },
                    'eventcancel': {
                        fn: function(win, rec, animTarget){
                            this.dismissEventEditor(animTarget);
                            win.currentView.onEventCancel();
                        },
                        scope: this
                    }
                }
            });
        }
        
        // allows the window to reference the current scope in its callbacks
        this.editWin.currentView = this;
        return this.editWin;
    },
    
    /**
     * Show the currently configured event editor view (by default the shared instance of 
     * {@link Ext.ensible.cal.EventEditWindow EventEditWindow}).
     * @param {Ext.ensible.cal.EventRecord} rec The event record
     * @param {Ext.Element/HTMLNode} animateTarget The reference element that is being edited. By default this is
     * used as the target for animating the editor window opening and closing. If this method is being overridden to
     * supply a custom editor this parameter can be ignored if it does not apply.
     * @return {Ext.ensible.cal.CalendarView} this
     */
    showEventEditor : function(rec, animateTarget){
        this.getEventEditor().show(rec, animateTarget, this);
        return this;
    },
    
    /**
     * Dismiss the currently configured event editor view (by default the shared instance of 
     * {@link Ext.ensible.cal.EventEditWindow EventEditWindow}, which will be hidden).
     * @param {String} dismissMethod (optional) The method name to call on the editor that will dismiss it 
     * (defaults to 'hide' which will be called on the default editor window)
     * @return {Ext.ensible.cal.CalendarView} this
     */
    dismissEventEditor : function(dismissMethod, /*private*/ animTarget){
        if(this.newRecord && this.newRecord.phantom){
            this.store.remove(this.newRecord);
        }
        delete this.newRecord;
        
        // grab the manager's ref so that we dismiss it properly even if the active view has changed
        var editWin = Ext.WindowMgr.get('ext-cal-editwin');
        if(editWin){
            editWin[dismissMethod ? dismissMethod : 'hide'](animTarget);
        }
        return this;
    },
    
    // private
    save: function(){
        this.store.save();
    },
    
    // private
    onWrite: function(store, action, data, resp, rec){
        switch(action){
            case 'create': 
                this.onAdd(store, rec);
                break;
            case 'update':
                this.onUpdate(store, rec, Ext.data.Record.COMMIT);
                break;
            case 'destroy':
                this.onRemove(store, rec);
                break;
        }
    },
    
    // private
    onEventAdd: function(form, rec){
        this.newRecord = rec;
        this.store.add(rec);
        this.save();
        this.fireEvent('eventadd', this, rec);
    },
    
    // private
    onEventUpdate: function(form, rec){
        this.save();
        this.fireEvent('eventupdate', this, rec);
    },
    
    // private
    onEventDelete: function(form, rec){
        this.store.remove(rec);
        this.save();
        this.fireEvent('eventdelete', this, rec);
    },
    
    // private
    onEventCancel: function(form, rec){
        this.fireEvent('eventcancel', this, rec);
    },
    
    // private -- called from subclasses
    onDayClick: function(dt, ad, el){
        if(this.readOnly === true){
            return;
        }
        if(this.fireEvent('dayclick', this, dt, ad, el) !== false){
            var M = Ext.ensible.cal.EventMappings,
                data = {};
                
            data[M.StartDate.name] = dt;
            data[M.IsAllDay.name] = ad;
                
            this.showEventEditor(data, el);
        }
    },
    
    // private
    showEventMenu : function(el, xy){
        if(!this.eventMenu){
            this.eventMenu = new Ext.ensible.cal.EventContextMenu({
                listeners: {
                    'editdetails': this.onEditDetails.createDelegate(this),
                    'eventdelete': this.onDeleteEvent.createDelegate(this),
                    'eventmove': this.onMoveEvent.createDelegate(this)
                }
            });
        }
        this.eventMenu.showForEvent(this.getEventRecordFromEl(el), el, xy);
        this.menuActive = true;
    },
    
    // private
    onEditDetails : function(menu, rec, el){
        this.fireEvent('editdetails', this, rec, el);
        this.menuActive = false;
    },
    
    // private
    onMoveEvent : function(menu, rec, dt){
        this.moveEvent(rec, dt);
        this.menuActive = false;
    },
    
    /**
     * Move the event to a new start date, preserving the original event duration.
     * @param {Object} rec The event {@link Ext.ensible.cal.EventRecord record}
     * @param {Object} dt The new start date
     */
    moveEvent : function(rec, dt){
        if(Ext.ensible.Date.compare(rec.data[Ext.ensible.cal.EventMappings.StartDate.name], dt) === 0){
            // no changes
            return;
        }
        if(this.fireEvent('beforeeventmove', this, rec, dt) !== false){
            var diff = dt.getTime() - rec.data[Ext.ensible.cal.EventMappings.StartDate.name].getTime();
            rec.beginEdit();
            rec.set(Ext.ensible.cal.EventMappings.StartDate.name, dt);
            rec.set(Ext.ensible.cal.EventMappings.EndDate.name, rec.data[Ext.ensible.cal.EventMappings.EndDate.name].add(Date.MILLI, diff));
            rec.endEdit();
            this.save();
            
            this.fireEvent('eventmove', this, rec);
        }
    },
    
    // private
    onDeleteEvent: function(menu, rec, el){
        rec._deleting = true;
        this.deleteEvent(rec, el);
        this.menuActive = false;
    },
    
    /**
     * Delete the specified event.
     * @param {Object} rec The event {@link Ext.ensible.cal.EventRecord record}
     * @param {Object} el The {@link Ext.Element Element} corresponding to the event
     */
    deleteEvent: function(rec, el){
        if(this.fireEvent('beforeeventdelete', this, rec, el) !== false){
            this.store.remove(rec);
            this.save();
            this.fireEvent('eventdelete', this, rec, el);
        }
    },
    
    // private
    onContextMenu : function(e, t){
        var el, match = false;
        
        if(el = e.getTarget(this.eventSelector, 5, true)){
            this.dismissEventEditor().showEventMenu(el, e.getXY());
            match = true;
        }
        
        if(match || this.suppressBrowserContextMenu === true){
            e.preventDefault();
        }
    },
    
    /*
     * Shared click handling.  Each specific view also provides view-specific
     * click handling that calls this first.  This method returns true if it
     * can handle the click (and so the subclass should ignore it) else false.
     */
    onClick : function(e, t){
        if(this.readOnly === true){
            return true;
        }
        if(this.dropZone){
            this.dropZone.clearShims();
        }
        if(this.menuActive === true){
            // ignore the first click if a context menu is active (let it close)
            this.menuActive = false;
            return true;
        }
        var el = e.getTarget(this.eventSelector, 5);
        if(el){
            var id = this.getEventIdFromEl(el),
                rec = this.getEventRecord(id);
            
            if(this.fireEvent('eventclick', this, rec, el) !== false){
                this.showEventEditor(rec, el);
            }
            return true;
        }
    },
    
    // private
    onMouseOver : function(e, t){
        if(this.trackMouseOver !== false && (this.dragZone == undefined || !this.dragZone.dragging)){
            if(!this.handleEventMouseEvent(e, t, 'over')){
                this.handleDayMouseEvent(e, t, 'over');
            }
        }
    },
    
    // private
    onMouseOut : function(e, t){
        if(this.trackMouseOver !== false && (this.dragZone == undefined || !this.dragZone.dragging)){
            if(!this.handleEventMouseEvent(e, t, 'out')){
                this.handleDayMouseEvent(e, t, 'out');
            }
        }
    },
    
    // private
    handleEventMouseEvent : function(e, t, type){
        var el;
        if(el = e.getTarget(this.eventSelector, 5, true)){
            var rel = Ext.get(e.getRelatedTarget());
            if(el == rel || el.contains(rel)){
                return true;
            }
            
            var evtId = this.getEventIdFromEl(el);
            
            if(this.eventOverClass != ''){
                var els = this.getEventEls(evtId);
                els[type == 'over' ? 'addClass' : 'removeClass'](this.eventOverClass);
            }
            this.fireEvent('event'+type, this, this.getEventRecord(evtId), el);
            return true;
        }
        return false;
    },
    
    // private
    getDateFromId : function(id, delim){
        var parts = id.split(delim);
        return parts[parts.length-1];
    },
    
    // private
    handleDayMouseEvent : function(e, t, type){
        if(t = e.getTarget('td', 3)){
            if(t.id && t.id.indexOf(this.dayElIdDelimiter) > -1){
                var dt = this.getDateFromId(t.id, this.dayElIdDelimiter),
                    rel = Ext.get(e.getRelatedTarget()),
                    relTD, relDate;
                
                if(rel){
                    relTD = rel.is('td') ? rel : rel.up('td', 3);
                    relDate = relTD && relTD.id ? this.getDateFromId(relTD.id, this.dayElIdDelimiter) : '';
                }
                if(!rel || dt != relDate){
                    var el = this.getDayEl(dt);
                    if(el && this.dayOverClass != ''){
                        el[type == 'over' ? 'addClass' : 'removeClass'](this.dayOverClass);
                    }
                    this.fireEvent('day'+type, this, Date.parseDate(dt, "Ymd"), el);
                }
            }
        }
    },
    
    // private, MUST be implemented by subclasses
    renderItems : function(){
        throw 'This method must be implemented by a subclass';
    },
    
    // private
    destroy: function(){
        Ext.ensible.cal.CalendarView.superclass.destroy.call(this);
        Ext.destroy(
            this.editWin, 
            this.eventMenu,
            this.dragZone,
            this.dropZone
        );
    }
});