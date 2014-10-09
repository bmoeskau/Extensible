/**
 * This is an abstract class that serves as the base for other calendar views. This class is not
 * intended to be directly instantiated.
 * 
 * When extending this class to create a custom calendar view, you must provide an implementation
 * for the <tt>renderItems</tt> method, as there is no default implementation for rendering events
 * The rendering logic is totally dependent on how the UI structures its data, which
 * is determined by the underlying UI template (this base class does not have a template).
 */
Ext.define('Extensible.calendar.view.AbstractCalendar', {
    extend: 'Ext.Component',
    
    requires: [
        'Ext.CompositeElement',
        'Extensible.calendar.form.EventDetails',
        'Extensible.calendar.form.EventWindow',
        'Extensible.calendar.menu.Event',
        'Extensible.calendar.dd.DragZone',
        'Extensible.calendar.dd.DropZone',
        'Extensible.form.recurrence.RangeEditWindow'
    ],

    /**
     * @cfg {Ext.data.Store} eventStore
     * The {@link Ext.data.Store store} which is bound to this calendar and contains {@link Extensible.calendar.data.EventModel EventRecords}.
     * Note that this is an alias to the default {@link #store} config (to differentiate that from the optional {@link #calendarStore}
     * config), and either can be used interchangeably.
     */
    /**
     * @cfg {Ext.data.Store} calendarStore
     * The {@link Ext.data.Store store} which is bound to this calendar and contains {@link Extensible.calendar.data.CalendarModel CalendarRecords}.
     * This is an optional store that provides multi-calendar (and multi-color) support. If available an additional field for selecting the
     * calendar in which to save an event will be shown in the edit forms. If this store is not available then all events will simply use
     * the default calendar (and color).
     */
    /*
     * @cfg {Boolean} recurrence
     * True to show the recurrence field, false to hide it (default). Note that recurrence requires
     * something on the server-side that can parse the iCal RRULE format in order to generate the
     * instances of recurring events to display on the calendar, so this field should only be enabled
     * if the server supports it.
     */
    recurrence: false,
    
    // @private
    // At the moment these are used, but not required to be modified. In the future, these may be used
    // for customizing how recurrence data is requested and processed.
    recurrenceOptions: {
        expansionMode: 'remote',
        expansionParam: {
            name: 'singleEvents',
            value: true
        }
    },

    /**
     * @cfg {Boolean} readOnly
     * True to prevent clicks on events or the view from providing CRUD capabilities, false to enable CRUD (the default).
     */
    /**
     * @cfg {Number} startDay
     * The 0-based index for the day on which the calendar week begins (0=Sunday, which is the default)
     */
    startDay: 0,
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
     * @cfg {String} ddCopyEventText
     * The text to display inside the drag proxy while alt-dragging an event to copy it (defaults to
     * 'Copy event to {0}' where {0} is the updated event start date/time supplied by the view)
     */
    ddCopyEventText: 'Copy event to {0}',
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
     * when loading the view (defaults to 'startDate').
     */
    dateParamStart: 'startDate',
    /**
     * @cfg {String} dateParamEnd
     * The param name representing the end date of the current view range that's passed in requests to retrieve events
     * when loading the view (defaults to 'endDate').
     */
    dateParamEnd: 'endDate',
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
    /**
     * @cfg {String} weekendCls
     * A CSS class to apply to weekend days in the current view (defaults to 'ext-cal-day-we' which highlights weekend days in light blue).
     * To disable this styling set the value to null or ''.
     */
    weekendCls: 'ext-cal-day-we',
    /**
     * @cfg {String} prevMonthCls
     * A CSS class to apply to any days that fall in the month previous to the current view's month (defaults to 'ext-cal-day-prev' which
     * highlights previous month days in light gray). To disable this styling set the value to null or ''.
     */
    prevMonthCls: 'ext-cal-day-prev',
    /**
     * @cfg {String} nextMonthCls
     * A CSS class to apply to any days that fall in the month after the current view's month (defaults to 'ext-cal-day-next' which
     * highlights next month days in light gray). To disable this styling set the value to null or ''.
     */
    nextMonthCls: 'ext-cal-day-next',
    /**
     * @cfg {String} todayCls
     * A CSS class to apply to the current date when it is visible in the current view (defaults to 'ext-cal-day-today' which
     * highlights today in yellow). To disable this styling set the value to null or ''.
     */
    todayCls: 'ext-cal-day-today',
    /**
     * @cfg {String} hideMode
     * How this component should be hidden. Supported values are <tt>'visibility'</tt>
     * (css visibility), <tt>'offsets'</tt> (negative offset position) and <tt>'display'</tt>
     * (css display).
     * 
     * **Note:** For calendar views the default is 'offsets' rather than the Ext JS default of
     * 'display' in order to preserve scroll position after hiding/showing a scrollable view like Day or Week.
     */
    hideMode: 'offsets',
    /**
     * @cfg {String} notifyOnExceptionTitle
     * @since 1.6.0
     * The notification title used by the {@link #notifyOnException} method when a server error occurs
     * (defaults to "Server Error").
     */
    notifyOnExceptionTitle: 'Server Error',
    /**
     * @cfg {String} notifyOnExceptionText
     * @since 1.6.0
     * The notification starting text used by the {@link #notifyOnException} method when a server error occurs
     * (defaults to "The action failed with the following response:"). The text of the error is appended.
     */
    notifyOnExceptionText: 'The action failed with the following response:',
    /**
     * @cfg {String} notifyOnExceptionDefaultMessage
     * @since 1.6.0
     * The default notification message text used by the {@link #notifyOnException} method when a server error occurs
     * and no error message is returned from the server (defaults to "An unknown error occurred").
     */
    notifyOnExceptionDefaultMessage: 'An unknown error occurred',
    
    /**
     * @property ownerCalendarPanel
     * @type Extensible.calendar.CalendarPanel
     * If this view is hosted inside a {@link Extensible.calendar.CalendarPanel CalendarPanel} this property will reference
     * it. If the view was created directly outside of a CalendarPanel this property will be null. Read-only.
     */

    //private properties -- do not override:
    weekCount: 1,
    dayCount: 1,
    eventSelector: '.ext-cal-evt',
    eventSelectorDepth: 10,
    eventOverClass: 'ext-evt-over',
    eventElIdDelimiter: '-evt-',
    dayElIdDelimiter: '-day-',
    recurringInstanceIdDelimiter: '-rid-',

    /**
     * Returns a string of HTML template markup to be used as the body portion of the event template created
     * by {@link #getEventTemplate}. This provides the flexibility to customize what's in the body without
     * having to override the entire XTemplate. This string can include any valid {@link Ext.Template} code, and
     * any data tokens accessible to the containing event template can be referenced in this string.
     * @return {String} The body template string
     */
    getEventBodyMarkup: Ext.emptyFn, // must be implemented by a subclass

    /**
     * Returns the XTemplate that is bound to the calendar's event store (it expects records of type
     * {@link Extensible.calendar.data.EventModel}) to populate the calendar views with events. Internally this method
     * by default generates different markup for browsers that support CSS border radius and those that don't.
     * This method can be overridden as needed to customize the markup generated.
     * 
     * Note that this method calls {@link #getEventBodyMarkup} to retrieve the body markup for events separately
     * from the surrounding container markup.  This provides the flexibility to customize what's in the body without
     * having to override the entire XTemplate. If you do override this method, you should make sure that your
     * overridden version also does the same.
     * @return {Ext.XTemplate} The event XTemplate
     */
    getEventTemplate: Ext.emptyFn, // must be implemented by a subclass

    /**
     * This is undefined by default, but can be implemented to allow custom CSS classes and template data to be
     * conditionally applied to events during rendering. This function will be called with the parameter list shown
     * below and is expected to return the CSS class name (or empty string '' for none) that will be added to the
     * event element's wrapping div. To apply multiple class names, simply return them space-delimited within the
     * string (e.g., 'my-class another-class'). Example usage, applied in a CalendarPanel config:
     *		// This example assumes a custom field of 'IsHoliday' has been added to EventRecord
     *		viewConfig: {
     *			getEventClass: function(rec, allday, templateData, store) {
     *				if (rec.data.IsHoliday) {
     *				templateData.iconCls = 'holiday';
     *				return 'evt-holiday';
     *			}
     *			templateData.iconCls = 'plain';
     *			return '';
     *			},
     *			getEventBodyMarkup: function() {
     *			// This is simplified, but shows the symtax for how you could add a
     *			// custom placeholder that maps back to the templateData property created
     *			// in getEventClass. Note that this is standard Ext template syntax.
     *				if (!this.eventBodyMarkup) {
     *					this.eventBodyMarkup = '&lt;span class="{iconCls}">&lt;/span> {Title}';
     *				}
     *			return this.eventBodyMarkup;
     *			}
     *		}
     * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record} being rendered
     * @param {Boolean} isAllDay A flag indicating whether the event will be *rendered* as an all-day event. Note that this
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

    initComponent: function() {
        this.setStartDate(this.startDate || new Date());

        this.callParent(arguments);

        if (this.readOnly === true) {
            this.addCls('ext-cal-readonly');
        }

        this.addEvents({
            /**
             * @event eventsrendered
             * Fires after events are finished rendering in the view
             * @param {Extensible.calendar.view.AbstractCalendar} this
             */
            eventsrendered: true,
            /**
             * @event eventclick
             * Fires after the user clicks on an event element. This is a cancelable event, so returning false from a
             * handler will cancel the click without displaying the event editor view. This could be useful for
             * validating the rules by which events should be editable by the user.
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record} for the event that was clicked on
             * @param {HTMLNode} el The DOM node that was clicked on
             */
            eventclick: true,
            /**
             * @event eventover
             * Fires anytime the mouse is over an event element
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record} for the event that the cursor is over
             * @param {HTMLNode} el The DOM node that is being moused over
             */
            eventover: true,
            /**
             * @event eventout
             * Fires anytime the mouse exits an event element
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record} for the event that the cursor exited
             * @param {HTMLNode} el The DOM node that was exited
             */
            eventout: true,
            /**
             * @event beforedatechange
             * Fires before the start date of the view changes, giving you an opportunity to save state or anything else you may need
             * to do prior to the UI view changing. This is a cancelable event, so returning false from a handler will cancel both the
             * view change and the setting of the start date.
             * @param {Extensible.calendar.view.AbstractCalendar} this
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
             * @param {Extensible.calendar.view.AbstractCalendar} this
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
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Object} dates An object containing the start (StartDate property) and end (EndDate property) dates selected
             * @param {Function} callback A callback function that MUST be called after the event handling is complete so that
             * the view is properly cleaned up (shim elements are persisted in the view while the user is prompted to handle the
             * range selection). The callback is already created in the proper scope, so it simply needs to be executed as a standard
             * function call (e.g., callback()).
             */
            rangeselect: true,
            /**
             * @event beforeeventcopy
             * Fires before an existing event is duplicated by the user via the "copy" command. This is a
             * cancelable event, so returning false from a handler will cancel the copy operation.
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel
             * record} for the event that will be copied
             * @param {Date} dt The new start date to be set in the copy (the end date will be automaticaly
             * adjusted to match the original event duration)
             */
            beforeeventcopy: true,
            /**
             * @event eventcopy
             * Fires after an event has been duplicated by the user via the "copy" command. If you need to
             * cancel the copy operation you should handle the {@link #beforeeventcopy} event and return
             * false from your handler function.
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel
             * record} for the event that was copied (with updated start and end dates)
             */
            eventcopy: true,
            /**
             * @event beforeeventmove
             * Fires after an event element has been dragged by the user and dropped in a new position, but before
             * the event record is updated with the new dates, providing a hook for canceling the update.
             * To cancel the move, return false from a handling function. This could be useful for validating
             * that a user can only move events within a certain date range, for example.
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record}
             * for the event that will be moved. Start and end dates will be the original values before the move started.
             * @param {Date} dt The new start date to be set (the end date will be automaticaly calculated to match
             * based on the event duration)
             */
            beforeeventmove: true,
            /**
             * @event eventmove
             * Fires after an event element has been moved to a new position and its data updated. If you need to
             * cancel the move operation you should handle the {@link #beforeeventmove} event and return false
             * from your handler function.
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record}
             * for the event that was moved with updated start and end dates
             */
            eventmove: true,
            /**
             * @event initdrag
             * Fires when a drag operation is initiated in the view
             * @param {Extensible.calendar.view.AbstractCalendar} this
             */
            initdrag: true,
            /**
             * @event dayover
             * Fires while the mouse is over a day element
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Date} dt The date that is being moused over
             * @param {Ext.Element} el The day Element that is being moused over
             */
            dayover: true,
            /**
             * @event dayout
             * Fires when the mouse exits a day element
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Date} dt The date that is exited
             * @param {Ext.Element} el The day Element that is exited
             */
            dayout: true,
            /**
             * @event editdetails
             * Fires when the user selects the option in this window to continue editing in the detailed edit form
             * (by default, an instance of {@link Extensible.calendar.form.EventDetails}. Handling code should hide this window
             * and transfer the current event record to the appropriate instance of the detailed form by showing it
             * and calling {@link Extensible.calendar.form.EventDetails#loadRecord loadRecord}.
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record} that is currently being edited
             * @param {Ext.Element} el The target element
             */
            editdetails: true,
            /**
             * @event eventadd
             * Fires after a new event has been added to the underlying store
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The new {@link Extensible.calendar.data.EventModel record} that was added
             */
            eventadd: true,
            /**
             * @event eventupdate
             * Fires after an existing event has been updated
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The new {@link Extensible.calendar.data.EventModel record} that was updated
             */
            eventupdate: true,
            /**
             * @event eventcancel
             * Fires after an event add/edit operation has been canceled by the user and no store update took place
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The new {@link Extensible.calendar.data.EventModel record} that was canceled
             */
            eventcancel: true,
            /**
             * @event beforeeventdelete
             * Fires before an event is deleted by the user. This is a cancelable event, so returning false from a handler
             * will cancel the delete operation.
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record} for the event that was deleted
             * @param {Ext.Element} el The target element
             */
            beforeeventdelete: true,
            /**
             * @event eventdelete
             * Fires after an event has been deleted by the user. If you need to cancel the delete operation you should handle the
             * {@link #beforeeventdelete} event and return false from your handler function.
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Extensible.calendar.data.EventModel} rec The {@link Extensible.calendar.data.EventModel record} for the event that was deleted
             * @param {Ext.Element} el The target element
             */
            eventdelete: true,
            /**
             * @event eventexception
             * Fires after an event has been processed via an Ext proxy and returned with an exception. This
             * could be because of a server error, or because the data returned <tt>success: false</tt>.
             *
             * The view provides default handling via the overrideable {@link #notifyOnException} method. If
             * any function handling this event returns false, the notifyOnException method will not be called.
             *
             * Note that only Server proxy and subclasses (including Ajax proxy) will raise this event.
             *
             * @param {Extensible.calendar.view.AbstractCalendar} this
             * @param {Object} response The raw response object returned from the server
             * @param {Ext.data.Operation} operation The operation that was processed
             * @since 1.6.0
             */
            eventexception: true
        });
    },

    afterRender: function() {
        this.callParent(arguments);

        this.renderTemplate();

        if (this.store) {
            this.setStore(this.store, true);
            if (this.store.deferLoad) {
                this.reloadStore(this.store.deferLoad);
                delete this.store.deferLoad;
            }
            else {
                this.store.initialParams = this.getStoreParams();
            }
        }
        if (this.calendarStore) {
            this.setCalendarStore(this.calendarStore, true);
        }

        this.on('resize', this.onResize, this);

        this.el.on({
            'mouseover': this.onMouseOver,
            'mouseout': this.onMouseOut,
            'click': this.onClick,
            //'resize': this.onResize,
            scope: this
        });

        // currently the context menu only contains CRUD actions so do not show it if read-only
        if (this.enableContextMenus && this.readOnly !== true) {
            this.el.on('contextmenu', this.onContextMenu, this);
        }

        this.el.unselectable();

        if (this.enableDD && this.readOnly !== true && this.initDD) {
            this.initDD();
        }

        this.on('eventsrendered', this.onEventsRendered);

        Ext.defer(this.forceSize, 100, this);
    },

    /**
     * Returns an object containing the start and end dates to be passed as params in all calls
     * to load the event store. The param names are customizable using {@link #dateParamStart}
     * and {@link #dateParamEnd} and the date format used in requests is defined by {@link #dateParamFormat}.
     * If you need to add additional parameters to be sent when loading the store see {@link #getStoreParams}.
     * @return {Object} An object containing the start and end dates
     */
    getStoreDateParams: function() {
        var o = {};
        o[this.dateParamStart] = Ext.Date.format(this.viewStart, this.dateParamFormat);
        o[this.dateParamEnd] = Ext.Date.format(this.viewEnd, this.dateParamFormat);
        return o;
    },

    /**
     * Returns an object containing all key/value params to be passed when loading the event store.
     * By default the returned object will simply be the same object returned by {@link #getStoreDateParams},
     * but this method is intended to be overridden if you need to pass anything in addition to start and end dates.
     * See the inline code comments when overriding for details.
     * @return {Object} An object containing all params to be sent when loading the event store
     */
    getStoreParams: function() {
        // This is needed if you require the default start and end dates to be included
        var params = this.getStoreDateParams();

        // Here is where you can add additional custom params, e.g.:
        // params.now = Ext.Date.format(new Date(), this.dateParamFormat);
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
    reloadStore: function(o) {
        Extensible.log('reloadStore');

        var recurrenceOptions = this.recurrenceOptions;

        o = Ext.isObject(o) ? o : {};
        o.params = o.params || {};

        Ext.apply(o.params, this.getStoreParams());

        if (this.recurrence && recurrenceOptions.expansionParam && recurrenceOptions.expansionMode === 'remote') {
            o.params[recurrenceOptions.expansionParam.name] = recurrenceOptions.expansionParam.value;
        }

        this.store.load(o);
    },

    onEventsRendered: function() {
        this.forceSize();
    },

    forceSize: function() {
        var el = this.el;
        
        if (el && el.down) {
            var hd = el.down('.ext-cal-hd-ct'),
                bd = el.down('.ext-cal-body-ct');

            if (!bd || !hd) {
                return;
            }

            var headerHeight = hd.getHeight(),
                sz = el.parent().getSize();

            bd.setHeight(sz.height - headerHeight);
        }
    },

    /**
     * Refresh the current view, optionally reloading the event store also. While this is normally
     * managed internally on any navigation and/or CRUD action, there are times when you might want
     * to refresh the view manually (e.g., if you'd like to reload using different {@link #getStoreParams params}).
     * @param {Boolean} reloadData True to reload the store data first, false to simply redraw the view using current
     * data (defaults to false)
     */
    refresh: function(reloadData) {
        if (!this.isActiveView()) {
            Extensible.log('refresh (AbstractCalendar), skipped for non-active view (' + this.id + ')');
            return;
        }
        Extensible.log('refresh (AbstractCalendar), reload = ' + reloadData);

        if (reloadData === true) {
            this.reloadStore();
        }
        else {
            this.prepareData();
            this.renderTemplate();
            this.renderItems();
        }
    },

    getWeekCount: function() {
        var days = Extensible.Date.diffDays(this.viewStart, this.viewEnd);
        return Math.ceil(days / this.dayCount);
    },
    
    prepareData: function() {
        var lastInMonth = Ext.Date.getLastDateOfMonth(this.startDate),
            w = 0,
            d = 0,
            row = 0,
            currentDt = Ext.Date.clone(this.viewStart),
            weeks = this.weekCount < 1 ? 6 : this.weekCount;

        this.eventGrid = [[]];
        this.allDayGrid = [[]];
        this.evtMaxCount = [];

        var evtsInView = this.store.queryBy(function(rec) {
            return this.isEventVisible(rec.data);
        }, this);
        
        var filterFn = function(rec) {
            var EventMappings = Extensible.calendar.data.EventMappings,
                startDt = Ext.Date.clearTime(rec.data[EventMappings.StartDate.name], true),
                startsOnDate = currentDt.getTime() === startDt.getTime(),
                spansFromPrevView = (w === 0 && d === 0 && (currentDt > rec.data[EventMappings.StartDate.name]));
    
            return startsOnDate || spansFromPrevView;
        };

        for (; w < weeks; w++) {
            this.evtMaxCount[w] = this.evtMaxCount[w] || 0;
            
            if (this.weekCount === -1 && currentDt > lastInMonth) {
                //current week is fully in next month so skip
                break;
            }
            this.eventGrid[w] = this.eventGrid[w] || [];
            this.allDayGrid[w] = this.allDayGrid[w] || [];

            for (d = 0; d < this.dayCount; d++) {
                if (evtsInView.getCount() > 0) {
                    var evts = evtsInView.filterBy(filterFn, this);

                    this.sortEventRecordsForDay(evts);
                    this.prepareEventGrid(evts, w, d);
                }
                currentDt = Extensible.Date.add(currentDt, {days: 1});
            }
        }
        this.currentWeekCount = w;
    },

    prepareEventGrid: function(evts, w, d) {
        var me = this,
            row = 0,
            dt = Ext.Date.clone(me.viewStart),
            maxEventsForDay;

        evts.each(function(evt) {
            var M = Extensible.calendar.data.EventMappings;

            if (Extensible.Date.diffDays(evt.data[M.StartDate.name], evt.data[M.EndDate.name]) > 0) {
                var daysInView = Extensible.Date.diffDays(
                    Extensible.Date.max(me.viewStart, evt.data[M.StartDate.name]),
                    Extensible.Date.min(me.viewEnd, evt.data[M.EndDate.name])) + 1;

                me.prepareEventGridSpans(evt, me.eventGrid, w, d, daysInView);
                me.prepareEventGridSpans(evt, me.allDayGrid, w, d, daysInView, true);
            }
            else {
                row = me.findEmptyRowIndex(w,d);
                me.eventGrid[w][d] = me.eventGrid[w][d] || [];
                me.eventGrid[w][d][row] = evt;

                if (evt.data[M.IsAllDay.name]) {
                    row = me.findEmptyRowIndex(w,d, true);
                    me.allDayGrid[w][d] = me.allDayGrid[w][d] || [];
                    me.allDayGrid[w][d][row] = evt;
                }
            }
            
            me.setMaxEventsForDay(w, d);

            return true;
        }, me);
    },
    
    setMaxEventsForDay: function(weekIndex, dayIndex) {
        var max = (this.maxEventsPerDay + 1) || 999;
        
        // If calculating the max event count for the day/week view header, use the allDayGrid
        // so that only all-day events displayed in that area get counted, otherwise count all events.
        var maxEventsForDay = this[this.isHeaderView ? 'allDayGrid' : 'eventGrid'][weekIndex][dayIndex] || [];
        
        this.evtMaxCount[weekIndex] = this.evtMaxCount[weekIndex] || 0;
        
        if (maxEventsForDay.length && this.evtMaxCount[weekIndex] < maxEventsForDay.length) {
            this.evtMaxCount[weekIndex] = Math.min(max, maxEventsForDay.length);
        }
    },

    prepareEventGridSpans: function(evt, grid, w, d, days, allday) {
        // this event spans multiple days/weeks, so we have to preprocess
        // the events and store special span events as placeholders so that
        // the render routine can build the necessary TD spans correctly.
        var w1 = w,
            d1 = d,
            row = this.findEmptyRowIndex(w,d,allday),
            dt = Ext.Date.clone(this.viewStart);

        var start = {
            event: evt,
            isSpan: true,
            isSpanStart: true,
            spanLeft: false,
            spanRight: (d === 6)
        };
        
        grid[w][d] = grid[w][d] || [];
        grid[w][d][row] = start;
        
        this.setMaxEventsForDay(w, d);
        
        while (--days) {
            dt = Extensible.Date.add(dt, {days: 1});
            
            if (dt > this.viewEnd) {
                break;
            }
            if (++d1 > 6) {
                // reset counters to the next week
                d1 = 0; w1++;
                row = this.findEmptyRowIndex(w1,0);
            }
            grid[w1] = grid[w1] || [];
            grid[w1][d1] = grid[w1][d1] || [];

            grid[w1][d1][row] = {
                event: evt,
                isSpan: true,
                isSpanStart: (d1 === 0),
                spanLeft: (w1 > w) && (d1 % 7 === 0),
                spanRight: (d1 === 6) && (days > 1)
            };
            
            // In this loop we are pre-processing empty span placeholders. In the case
            // where a given week might only contain such spans, we have to make this
            // max event check on each iteration to make sure that our empty placeholder
            // divs get created correctly even without "real" events:
            this.setMaxEventsForDay(w1, d1);
        }
    },

    findEmptyRowIndex: function(w, d, allday) {
        var grid = allday ? this.allDayGrid : this.eventGrid,
            day = grid[w] ? grid[w][d] || [] : [],
            i = 0,
            len = day.length;

        for (; i < len; i++) {
            if (!day[i]) {
                return i;
            }
        }
        return len;
    },

    renderTemplate: function() {
        if (this.tpl) {
            this.tpl.overwrite(this.el, this.getTemplateParams());
            this.lastRenderStart = Ext.Date.clone(this.viewStart);
            this.lastRenderEnd = Ext.Date.clone(this.viewEnd);
        }
    },

    getTemplateParams: function() {
        return {
            viewStart: this.viewStart,
            viewEnd: this.viewEnd,
            startDate: this.startDate,
            dayCount: this.dayCount,
            weekCount: this.weekCount,
            weekendCls: this.weekendCls,
            prevMonthCls: this.prevMonthCls,
            nextMonthCls: this.nextMonthCls,
            todayCls: this.todayCls
        };
    },

    /**
     * Disable store event monitoring within this view. Note that if you do this the view will no longer
     * refresh itself automatically when CRUD actions occur. To enable store events see {@link #enableStoreEvents}.
     * @return {CalendarView} this
     */
    disableStoreEvents: function() {
        this.monitorStoreEvents = false;
        return this;
    },

    /**
     * Enable store event monitoring within this view if disabled by {@link #disbleStoreEvents}.
     * @return {CalendarView} this
     */
    enableStoreEvents: function(refresh) {
        this.monitorStoreEvents = true;
        if (refresh === true) {
            this.refresh();
        }
        return this;
    },

    onResize: function() {
        this.refresh(false);
    },

    onInitDrag: function() {
        this.fireEvent('initdrag', this);
    },

    onEventDrop: function(rec, dt, mode) {
        this[(mode || 'move') + 'Event'](rec, dt);
    },

    onCalendarEndDrag: function(start, end, onComplete) {
        // set this flag for other event handlers that might conflict while we're waiting
        this.dragPending = true;

        var dates = {},
            boundOnComplete = Ext.bind(this.onCalendarEndDragComplete, this, [onComplete]);

        dates[Extensible.calendar.data.EventMappings.StartDate.name] = start;
        dates[Extensible.calendar.data.EventMappings.EndDate.name] = end;

        if (this.fireEvent('rangeselect', this, dates, boundOnComplete) !== false) {
            this.showEventEditor(dates, null);
            
            if (this.editWin) {
                this.editWin.on('hide', boundOnComplete, this, {single:true});
            }
            else {
                boundOnComplete();
            }
        }
        else {
            // client code canceled the selection so clean up immediately
            this.onCalendarEndDragComplete(boundOnComplete);
        }
    },

    onCalendarEndDragComplete: function(onComplete) {
        // callback for the drop zone to clean up
        onComplete();
        // clear flag for other events to resume normally
        this.dragPending = false;
    },

    /**
     * Refresh the view. Determine if a store reload is required after a given CRUD operation.
     * @param {String} action One of 'create', 'update' or 'delete'
     * @param {Ext.data.Operation} operation The affected operation
     */
    refreshAfterEventChange: function(action, operation) {
        // Determine if a store reload is needed. A store reload is needed if the event is recurring after being
        // edited or was recurring before being edited AND an event store reload has not been triggered already for
        // this operation. If an event is not currently recurring (isRecurring = false) but still has an instance
        // start date set, then it must have been recurring and edited to no longer recur.
        var RInstanceStartDate = Extensible.calendar.data.EventMappings.RInstanceStartDate,
            isInstance = RInstanceStartDate && !!operation.records[0].get(RInstanceStartDate.name),
            reload = (operation.records[0].isRecurring() || isInstance) && !operation.wasStoreReloadTriggered;

        if (reload) {
            // For calendar views with a body and a header component (e.g. weekly view, day view), this function is
            // called twice. Ensure that a store reload is triggered only once for the same operation.
            operation.wasStoreReloadTriggered = true;
        }
        this.refresh(reload);
    },

    onUpdate: function(store, operation, updateType) {
        if (this.hidden === true || this.ownerCt.hidden === true || this.monitorStoreEvents === false) {
            // Hidden calendar view don't need to be refreshed. For views composed of header and body (for example
            // Extensible.calendar.view.Day or Extensible.calendar.view.Week) we need to check the ownerCt to find out
            // if a view is hidden.
            return;
        }
        if (updateType === Ext.data.Record.COMMIT) {
            Extensible.log('onUpdate');
            this.dismissEventEditor();

            this.refreshAfterEventChange('update', operation);

            var rec = operation.records[0];

            if (this.enableFx && this.enableUpdateFx) {
                this.doUpdateFx(this.getEventEls(rec.data[Extensible.calendar.data.EventMappings.EventId.name]), {
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
    doUpdateFx: function(els, o) {
        this.highlightEvent(els, null, o);
    },

    onAdd: function(store, operation) {
        var rec = operation.records[0];

        if (this.hidden === true || this.ownerCt.hidden === true || this.monitorStoreEvents === false) {
            // Hidden calendar view don't need to be refreshed. For views composed of header and body (for example
            // Extensible.calendar.view.Day or Extensible.calendar.view.Week) we need to check the ownerCt to find out
            // if a view is hidden.
            return;
        }
        // if (rec._deleting) {
            // delete rec._deleting;
            // return;
        // }

        Extensible.log('onAdd');

        this.dismissEventEditor();
        //this.tempEventId = rec.id;

        this.refreshAfterEventChange('create', operation);

        // if (this.enableFx && this.enableAddFx) {
            // this.doAddFx(this.getEventEls(rec.data[Extensible.calendar.data.EventMappings.EventId.name]), {
                // scope: this
            // });
        // }
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
    doAddFx: function(els, o) {
        els.fadeIn(Ext.apply(o, { duration: 2000 }));
    },

    onRemove: function(store, operation) {
        if (this.hidden === true || this.ownerCt.hidden === true || this.monitorStoreEvents === false) {
            // Hidden calendar view don't need to be refreshed. For views composed of header and body (for example
            // Extensible.calendar.view.Day or Extensible.calendar.view.Week) we need to check the ownerCt to find out
            // if a view is hidden.
            return;
        }

        Extensible.log('onRemove');
        this.dismissEventEditor();

        var rec = operation.records[0];

        if (this.enableFx && this.enableRemoveFx) {
            this.doRemoveFx(this.getEventEls(rec.data[Extensible.calendar.data.EventMappings.EventId.name]), {
                remove: true,
                scope: this,
                callback: Ext.bind(this.refreshAfterEventChange, this, ['delete', operation])
            });
        }
        else {
            this.getEventEls(rec.data[Extensible.calendar.data.EventMappings.EventId.name]).remove();
            this.refreshAfterEventChange('delete', operation);
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
     *		{
     *			remove: true, // required by fadeOut to actually remove the element(s)
     *			scope: this,  // required for the callback
     *			callback: fn  // required to refresh the view after the fx finish
     *		}
     * While you can modify this options object as needed if you change the effect used, please note that the
     * callback method (and scope) MUST still be passed in order for the view to refresh correctly after the removal.
     * Please see the inline code comments before overriding this method.
     */
    doRemoveFx: function(els, o) {
        // Please make sure you keep this entire code block or removing events might not work correctly!
        // Removing is a little different because we have to wait for the fx to finish, then we have to actually
        // refresh the view AFTER the fx are run (this is different than add and update).
        if (els.getCount() === 0 && Ext.isFunction(o.callback)) {
            // if there are no matching elements in the view make sure the callback still runs.
            // this can happen when an event accessed from the "more" popup is deleted.
            o.callback.call(o.scope || this);
        }
        else {
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
    highlightEvent: function(els, color, o) {
        if (this.enableFx) {
            if (Ext.isIE || Ext.isOpera) {
                // Fun IE/Opera handling:
                var highlightEl;
                
                els.each(function(el) {
                    el.highlight(color, Ext.applyif ({attr:'color'}, o));
                    var highlightEl = el.down('.ext-cal-evm');
                    
                    if (highlightEl) {
                        highlightEl.highlight(color, o);
                    }
                }, this);
            }
            else {
                els.highlight(color, o);
            }
        }
    },

    /**
     * Retrieve an Event object's id from its corresponding node in the DOM.
     * @param {String/Element/HTMLElement} el An {@link Ext.Element}, DOM node or id
     */
    getEventIdFromEl: function(el) {
        el = Ext.get(el);
        var parts, id = '', cls, classes = el.dom.className.split(' ');

        Ext.each(classes, function(cls) {
            parts = cls.split(this.eventElIdDelimiter);
            if (parts.length > 1) {
                id = parts[1];
                return false;
            }
        }, this);

        return id;
    },

    getEventId: function(eventId) {
        if (eventId === undefined && this.tempEventId) {
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
    getEventSelectorCls: function(eventId, forSelect) {
        var prefix = forSelect ? '.' : '',
            id = this.getEventId(eventId),
            cls = prefix + this.id + this.eventElIdDelimiter + id;

        return cls;
    },

    /**
     *
     * @param {String} eventId
     * @return {Ext.dom.CompositeElement} The matching CompositeElement of nodes
     * that comprise the rendered event.  Any event that spans across a view
     * boundary will contain more than one internal Element.
     */
    getEventEls: function(eventId) {
        var els = this.el.select(this.getEventSelectorCls(this.getEventId(eventId), true), false);
        return Ext.create('Ext.CompositeElement', els);
    },

    /**
     * Returns true if the view is currently displaying today's date, else false.
     * @return {Boolean} True or false
     */
    isToday: function() {
        var today = Ext.Date.clearTime(new Date()).getTime();
        return this.viewStart.getTime() <= today && this.viewEnd.getTime() >= today;
    },

    isEventVisible: function(evt) {
        var eventMappings = Extensible.calendar.data.EventMappings,
            calendarMappings = Extensible.calendar.data.CalendarMappings,
            data = evt.data || evt,
            calRec = this.calendarStore ? this.calendarStore.findRecord(calendarMappings.CalendarId.name,
                evt[eventMappings.CalendarId.name]) : null;

        if (calRec && calRec.data[calendarMappings.IsHidden.name] === true) {
            // if the event is on a hidden calendar then no need to test the date boundaries
            return false;
        }

        var start = this.viewStart.getTime(),
            end = this.viewEnd.getTime(),
            evStart = data[eventMappings.StartDate.name].getTime(),
            evEnd = data[eventMappings.EndDate.name].getTime();

        return Extensible.Date.rangesOverlap(start, end, evStart, evEnd);
    },

    isOverlapping: function(evt1, evt2) {
        var ev1 = evt1.data ? evt1.data : evt1,
            ev2 = evt2.data ? evt2.data : evt2,
            M = Extensible.calendar.data.EventMappings,
            start1 = ev1[M.StartDate.name].getTime(),
            end1 = Extensible.Date.add(ev1[M.EndDate.name], {seconds: -1}).getTime(),
            start2 = ev2[M.StartDate.name].getTime(),
            end2 = Extensible.Date.add(ev2[M.EndDate.name], {seconds: -1}).getTime(),
            startDiff = Extensible.Date.diff(ev1[M.StartDate.name], ev2[M.StartDate.name], 'm');

            if (end1<start1) {
                end1 = start1;
            }
            if (end2<start2) {
                end2 = start2;
            }

//            var ev1startsInEv2 = (start1 >= start2 && start1 <= end2),
//            ev1EndsInEv2 = (end1 >= start2 && end1 <= end2),
//            ev1SpansEv2 = (start1 < start2 && end1 > end2),
            var evtsOverlap = Extensible.Date.rangesOverlap(start1, end1, start2, end2),
                minimumMinutes = this.minEventDisplayMinutes || 0, // applies in day/week body view only for vertical overlap
                ev1MinHeightOverlapsEv2 = minimumMinutes > 0 && (startDiff > -minimumMinutes && startDiff < minimumMinutes);

        //return (ev1startsInEv2 || ev1EndsInEv2 || ev1SpansEv2 || ev1MinHeightOverlapsEv2);
        return (evtsOverlap || ev1MinHeightOverlapsEv2);
    },

    isEventSpanning: function(evt) {
        var M = Extensible.calendar.data.EventMappings,
            data = evt.data || evt,
            diff;

        diff = Extensible.Date.diffDays(data[M.StartDate.name], data[M.EndDate.name]);

        //TODO: Prevent 00:00 end time from causing a span. This logic is OK, but
        //      other changes are still needed for it to work fully. Deferring for now.
//        if (diff <= 1 && Extensible.Date.isMidnight(data[M.EndDate.name])) {
//            return false;
//        }
        return diff > 0;
    },

    getDayEl: function(dt) {
        return Ext.get(this.getDayId(dt));
    },

    getDayId: function(dt) {
        if (Ext.isDate(dt)) {
            dt = Ext.Date.format(dt, 'Ymd');
        }
        return this.id + this.dayElIdDelimiter + dt;
    },

    /**
     * Returns the start date of the view, as set by {@link #setStartDate}. Note that this may not
     * be the first date displayed in the rendered calendar -- to get the start and end dates displayed
     * to the user use {@link #getViewBounds}.
     * @return {Date} The start date
     */
    getStartDate: function() {
        return this.startDate;
    },

    /**
     * Sets the start date used to calculate the view boundaries to display. The displayed view will be the
     * earliest and latest dates that match the view requirements and contain the date passed to this function.
     * @param {Date} dt The date used to calculate the new view boundaries
     */
    setStartDate: function(start, /*private*/reload) {
        var me = this;

        Extensible.log('setStartDate (base) '+Ext.Date.format(start, 'Y-m-d'));

        var cloneDt = Ext.Date.clone,
            cloneStartDate = me.startDate ? cloneDt(me.startDate) : null,
            cloneStart = cloneDt(start),
            cloneViewStart = me.viewStart ? cloneDt(me.viewStart) : null,
            cloneViewEnd = me.viewEnd ? cloneDt(me.viewEnd) : null;

        if (me.fireEvent('beforedatechange', me, cloneStartDate, cloneStart, cloneViewStart, cloneViewEnd) !== false) {
            me.startDate = Ext.Date.clearTime(start);
            me.setViewBounds(start);

            if (me.ownerCalendarPanel && me.ownerCalendarPanel.startDate !== me.startDate) {
                // Sync the owning CalendarPanel's start date directly, not via CalendarPanel.setStartDate(),
                // since that would in turn call this method again.
                me.ownerCalendarPanel.startDate = me.startDate;
            }

            if (me.rendered) {
                me.refresh(reload);
            }
            me.fireEvent('datechange', me, cloneDt(me.startDate), cloneDt(me.viewStart), cloneDt(me.viewEnd));
        }
    },

    setViewBounds: function(startDate) {
        var me = this,
            start = startDate || me.startDate,
            offset = start.getDay() - me.startDay,
            Dt = Extensible.Date;

        if (offset < 0) {
            // if the offset is negative then some days will be in the previous week so add a week to the offset
            offset += 7;
        }
        switch(this.weekCount) {
            case 0:
            case 1:
                me.viewStart = me.dayCount < 7 && !me.startDayIsStatic ?
                    start: Dt.add(start, {days: -offset, clearTime: true});
                me.viewEnd = Dt.add(me.viewStart, {days: me.dayCount || 7, seconds: -1});
                return;

            case -1:
                // auto by month
                start = Ext.Date.getFirstDateOfMonth(start);
                offset = start.getDay() - me.startDay;
                if (offset < 0) {
                    // if the offset is negative then some days will be in the previous week so add a week to the offset
                    offset += 7;
                }
                me.viewStart = Dt.add(start, {days: -offset, clearTime: true});

                // start from current month start, not view start:
                var end = Dt.add(start, {months: 1, seconds: -1});

                // fill out to the end of the week:
                offset = me.startDay;
                if (offset > end.getDay()) {
                    // if the offset is larger than the end day index then the last row will be empty so skip it
                    offset -= 7;
                }

                me.viewEnd = Dt.add(end, {days: 6 - end.getDay() + offset});
                return;

            default:
                me.viewStart = Dt.add(start, {days: -offset, clearTime: true});
                me.viewEnd = Dt.add(me.viewStart, {days: me.weekCount * 7, seconds: -1});
        }
    },

    /**
     * Returns the start and end boundary dates currently displayed in the view. The method
     * returns an object literal that contains the following properties:
     *
     *	* **start** Date: The start date of the view
     *	* **end** Date: The end date of the view
     * 
     * For example:
     *		var bounds = view.getViewBounds();
     *		alert('Start: '+bounds.start);
     *		alert('End: '+bounds.end);
     * @return {Object} An object literal containing the start and end values
     */
    getViewBounds: function() {
        return {
            start: this.viewStart,
            end: this.viewEnd
        };
    },

    /* private
     * Sort events for a single day for display in the calendar.  This sorts allday
     * events first, then non-allday events are sorted either based on event start
     * priority or span priority based on the value of {@link #spansHavePriority}
     * (defaults to event start priority).
     * @param {MixedCollection} evts A {@link Ext.util.MixedCollection MixedCollection}
     * of {@link #Extensible.calendar.data.EventModel EventRecord} objects
     */
    sortEventRecordsForDay: function(evts) {
        if (evts.length < 2) {
            return;
        }
        evts.sortBy(Ext.bind(function(evtA, evtB) {
            var a = evtA.data,
                b = evtB.data,
                M = Extensible.calendar.data.EventMappings;

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
                var diff = Extensible.Date.diffDays;
                if (diff(a[M.StartDate.name], a[M.EndDate.name]) > 0) {
                    if (diff(b[M.StartDate.name], b[M.EndDate.name]) > 0) {
                        // Both events are multi-day
                        if (a[M.StartDate.name].getTime() === b[M.StartDate.name].getTime()) {
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
        }, this));
    },

    /**
     * Updates the view to contain the passed date
     * @param {Date} dt The date to display
     */
    moveTo: function(dt, /*private*/reload) {
        if (Ext.isDate(dt)) {
            this.setStartDate(dt, reload);
            return this.startDate;
        }
        return dt;
    },

    /**
     * Updates the view to the next consecutive date(s)
     * @return {Date} The new view start date
     */
    moveNext: function(/*private*/reload) {
        return this.moveTo(Extensible.Date.add(this.viewEnd, {days: 1}), reload);
    },

    /**
     * Updates the view to the previous consecutive date(s)
     * @return {Date} The new view start date
     */
    movePrev: function(/*private*/reload) {
        var days = Extensible.Date.diffDays(this.viewStart, this.viewEnd)+1;
        return this.moveDays(-days, reload);
    },

    /**
     * Shifts the view by the passed number of months relative to the currently set date
     * @param {Number} value The number of months (positive or negative) by which to shift the view
     * @return {Date} The new view start date
     */
    moveMonths: function(value, /*private*/reload) {
        return this.moveTo(Extensible.Date.add(this.startDate, {months: value}), reload);
    },

    /**
     * Shifts the view by the passed number of weeks relative to the currently set date
     * @param {Number} value The number of weeks (positive or negative) by which to shift the view
     * @return {Date} The new view start date
     */
    moveWeeks: function(value, /*private*/reload) {
        return this.moveTo(Extensible.Date.add(this.startDate, {days: value * 7}), reload);
    },

    /**
     * Shifts the view by the passed number of days relative to the currently set date
     * @param {Number} value The number of days (positive or negative) by which to shift the view
     * @return {Date} The new view start date
     */
    moveDays: function(value, /*private*/reload) {
        return this.moveTo(Extensible.Date.add(this.startDate, {days: value}), reload);
    },

    /**
     * Updates the view to show today
     * @return {Date} Today's date
     */
    moveToday: function(/*private*/reload) {
        return this.moveTo(new Date(), reload);
    },

    /**
     * Sets the event store used by the calendar to display {@link Extensible.calendar.data.EventModel events}.
     * @param {Ext.data.Store} store
     */
    setStore: function(store, initial) {
        var currStore = this.store;

        if (!initial && currStore) {
            currStore.un("load", this.onEventStoreLoad, this);
            currStore.un("clear", this.refresh, this);
            currStore.un("write", this.onWrite, this);
            // Note that this handler is attached to the proxy's exception event. In Ext 4 the store no longer
            // raises an exception event. Store.sync() does accept a callback argument in 4.1+, but in 4.0.x
            // unfortunately the only way to handle this is directly on the proxy, so for ease of compatibility
            // that's what we're doing here.
            currStore.getProxy().un("exception", this.onException, this);
        }
        if (store) {
            store.on("load", this.onEventStoreLoad, this);
            store.on("clear", this.refresh, this);
            store.on("write", this.onWrite, this);
            store.getProxy().on("exception", this.onException, this);
        }
        this.store = store;
    },
    
    onEventStoreLoad: function(store, recs, successful) {
        Extensible.log('AbstractCalendar.onEventStoreLoad: store loaded');
        this.refresh(false);
    },
    
    // No longer used, but kept here for compatibility
    onDataChanged: this.onEventStoreLoad,

    /**
     * This method handles internal housekeeping for cleaning up unsaved records in the store, and also
     * calls {@link #notifyOnException} to provide an easily overrideable mechanism for customizing if/how
     * the user should be notified when an error occurs.
     * @private
     */
    onException: function(proxy, response, operation) {
        // Form edits are explicitly canceled, but we may not know if a drag/drop operation
        // succeeded until after a server round trip. If the server action failed for any reason we have to
        // explicitly reject the changes so that the record doesn't stick around in the store's modified list
        // if the user cancels the action without successfully persisting the change to the server.
        Ext.each(operation.records, function(rec) {
            if (rec.dirty) {
                if (rec.phantom) {
                    this.store.remove(rec);
                }
                else {
                    rec.reject();
                }
            }
        }, this);
        
        if (this.fireEvent('eventexception', this, response, operation) !== false) {
            this.notifyOnException(response, operation);
        }
    },
    
    /**
     * Returns the message to display from {@link #notifyOnException}, generated automatically
     * from the server response and operation objects.
     * @protected
     * @since 1.6.0
     */
    getExceptionMessage: function(response, operation) {
        var msg = '';
        
        if (response.responseText) {
            msg += '<br><b>responseText</b>: ' + response.responseText;
        }
        if (response.message) {
            msg += '<br><b>message</b>: ' + response.message;
        }
        if (response.status) {
            msg += '<br><b>status</b>: ' + response.status;
        }
        if (response.statusText) {
            msg += '<br><b>statusText</b>: ' + response.statusText;
        }
        if (operation.error && operation.error.length) {
            msg += '<br><b>processing error</b>: ' + operation.error;
        }
        
        return msg || ('<br>' + this.notifyOnExceptionDefaultMessage);
    },
    
    /**
     * This is an overrideable method for notifying the user when an exception occurs while attempting to
     * process records via a proxy. The default implementation is to display a standard Ext MessageBox with
     * the returned error message, but you can override this method to provide any desired notification.
     *
     * Note that the view will also raise the {@link #eventexception} event automatically. Event handling
     * functions can return false to bypass this method if application-specific code might conditionally
     * handle exceptions, and still fall back to this method in other cases. To bypass this method globally
     * you can simply remove it like so (or you could do the same thing in a view subclass):
     *		Ext.override(Extensible.calendar.view.AbstractCalendar, {
     *			notifyOnException: Ext.emptyFn
     *		});
     * @param {Object} response The raw response object returned from the server
     * @param {Ext.data.Operation} operation The operation that was processed
     * @since 1.6.0
     */
    notifyOnException: function(response, operation) {
        Ext.Msg.alert(this.notifyOnExceptionTitle, this.notifyOnExceptionText + '<br>' +
            this.getExceptionMessage(response, operation));
    },

    /**
     * Sets the calendar store used by the calendar (contains records of type {@link Extensible.calendar.data.CalendarModel CalendarRecord}).
     * @param {Ext.data.Store} store
     */
    setCalendarStore: function(store, initial) {
        if (!initial && this.calendarStore) {
            this.calendarStore.un("datachanged", this.refresh, this);
            this.calendarStore.un("add", this.refresh, this);
            this.calendarStore.un("remove", this.refresh, this);
            this.calendarStore.un("update", this.refresh, this);
        }
        if (store) {
            store.on("datachanged", this.refresh, this);
            store.on("add", this.refresh, this);
            store.on("remove", this.refresh, this);
            store.on("update", this.refresh, this);
        }
        this.calendarStore = store;
    },

    getEventRecord: function(id) {
        var idx = this.store.find(Extensible.calendar.data.EventMappings.EventId.name, id,
            0,     // start index
            false, // match any part of string
            true,  // case sensitive
            true   // force exact match
        );
        return this.store.getAt(idx);
    },

    getEventRecordFromEl: function(el) {
        return this.getEventRecord(this.getEventIdFromEl(el));
    },

    getEventEditor: function() {
        // only create one instance of the edit window, even if there are multiple CalendarPanels
        this.editWin = this.editWin || Ext.WindowMgr.get('ext-cal-editwin');

        if (!this.editWin) {
            this.editWin = Ext.create('Extensible.calendar.form.EventWindow', {
                id: 'ext-cal-editwin',
                calendarStore: this.calendarStore,
                modal: this.editModal,
                enableEditDetails: this.enableEditDetails,
                startDay: this.startDay,

                listeners: {
                    'eventadd': {
                        fn: function(win, rec, animTarget, options) {
                            //win.hide(animTarget);
                            win.currentView.onEventEditorAdd(null, rec, options);
                        },
                        scope: this
                    },
                    'eventupdate': {
                        fn: function(win, rec, animTarget, options) {
                            //win.hide(animTarget);
                            win.currentView.onEventEditorUpdate(null, rec, options);
                        },
                        scope: this
                    },
                    'eventdelete': {
                        fn: function(win, rec, animTarget, options) {
                            //win.hide(animTarget);
                            win.currentView.onEventEditorDelete(null, rec, options);
                        },
                        scope: this
                    },
                    'editdetails': {
                        fn: function(win, rec, animTarget, view) {
                            // explicitly do not animate the hide when switching to detail
                            // view as it looks weird visually
                            win.animateTarget = null;
                            win.hide();
                            win.currentView.fireEvent('editdetails', win.currentView, rec);
                        },
                        scope: this
                    },
                    'eventcancel': {
                        fn: function(win, rec, animTarget) {
                            this.dismissEventEditor(null, animTarget);
                            win.currentView.onEventEditorCancel();
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
     * {@link Extensible.calendar.form.EventWindow EventEditWindow}).
     * @param {Extensible.calendar.data.EventModel} rec The event record
     * @param {Ext.Element/HTMLNode} animateTarget The reference element that is being edited. By default this is
     * used as the target for animating the editor window opening and closing. If this method is being overridden to
     * supply a custom editor this parameter can be ignored if it does not apply.
     * @return {Extensible.calendar.view.AbstractCalendar} this
     */
    showEventEditor: function(rec, animateTarget) {
        this.getEventEditor().show(rec, animateTarget, this);
        return this;
    },

    /**
     * Dismiss the currently configured event editor view (by default the shared instance of
     * {@link Extensible.calendar.form.EventWindow EventEditWindow}, which will be hidden).
     * @param {String} dismissMethod (optional) The method name to call on the editor that will dismiss it
     * (defaults to 'hide' which will be called on the default editor window)
     * @return {Extensible.calendar.view.AbstractCalendar} this
     */
    dismissEventEditor: function(dismissMethod, /*private*/ animTarget) {
        if (this.newRecord && this.newRecord.phantom) {
            this.store.remove(this.newRecord);
        }
        delete this.newRecord;

        // grab the manager's ref so that we dismiss it properly even if the active view has changed
        var editWin = Ext.WindowMgr.get('ext-cal-editwin');
        if (editWin) {
            editWin[dismissMethod ? dismissMethod : 'hide'](animTarget);
        }
        return this;
    },

    save: function() {
        // If the store is configured as autoSync:true the record's endEdit
        // method will have already internally caused a save to execute on
        // the store. We only need to save manually when autoSync is false,
        // otherwise we'll create duplicate transactions.
        if (!this.store.autoSync) {
            this.store.sync();
        }
    },

    onWrite: function(store, operation) {
        if (operation.wasSuccessful()) {
            //var rec = operation.records[0];

            switch(operation.action) {
                case 'create':
                    this.onAdd(store, operation);
                    break;
                case 'update':
                    this.onUpdate(store, operation, Ext.data.Record.COMMIT);
                    break;
                case 'destroy':
                    this.onRemove(store, operation);
                    break;
            }
        }
    },

    onEventEditorAdd: function(form, rec) {
        this.newRecord = rec;

        if (this.store.indexOf(rec) === -1) {
            this.store.add(rec);
        }
        this.save();
        this.fireEvent('eventadd', this, rec);
    },

    onEventEditorUpdate: function(form, rec) {
        this.save();
        this.fireEvent('eventupdate', this, rec);
    },

    onEventEditorDelete: function(form, rec) {
        rec._deleting = true;
        this.deleteEvent(rec);
    },

    onEventEditorCancel: function(form, rec) {
        this.fireEvent('eventcancel', this, rec);
    },

    // called from subclasses
    onDayClick: function(dt, ad, el) {
        if (this.readOnly === true) {
            return;
        }
        if (this.fireEvent('dayclick', this, Ext.Date.clone(dt), ad, el) !== false) {
            var M = Extensible.calendar.data.EventMappings,
                data = {};

            data[M.StartDate.name] = dt;
            data[M.IsAllDay.name] = ad;

            this.showEventEditor(data, el);
        }
    },

    showEventMenu: function(el, xy) {
        var me = this;

        if (!me.eventMenu) {
            me.eventMenu = Ext.create('Extensible.calendar.menu.Event', {
                startDay: me.startDay,
                ownerCalendarPanel: me,
                listeners: {
                    'editdetails': Ext.bind(me.onEditDetails, me),
                    'eventdelete': Ext.bind(me.onDeleteEvent, me),
                    'eventmove'  : Ext.bind(me.onMoveEvent, me),
                    'eventcopy'  : Ext.bind(me.onCopyEvent, me)
                }
            });
        }

        me.eventMenu.showForEvent(me.getEventRecordFromEl(el), el, xy);
        me.menuActive = true;
    },

    onCopyEvent: function(menu, rec, newStartDate) {
        this.menuActive = false;
        this.shiftEvent(rec, newStartDate, 'copy');
    },

    onMoveEvent: function(menu, rec, newStartDate) {
        this.menuActive = false;
        this.shiftEvent(rec, newStartDate, 'move');
    },

    /**
     * Create a copy of the event with a new start date, preserving the original event duration.
     * @param {Object} rec The original event {@link Extensible.calendar.data.EventModel record}
     * @param {Object} newStartDate The new start date. The end date of the created event copy will be adjusted
     * automatically to preserve the original duration.
     */
    copyEvent: function(rec, newStartDate) {
        this.shiftEvent(rec, newStartDate, 'copy');
    },

    /**
     * Move the event to a new start date, preserving the original event duration.
     * @param {Object} rec The event {@link Extensible.calendar.data.EventModel record}
     * @param {Object} newStartDate The new start date
     */
    moveEvent: function(rec, newStartDate) {
        this.shiftEvent(rec, newStartDate, 'move');
    },

    shiftEvent: function(rec, newStartDate, moveOrCopy) {
        var me = this,
            newRec;

        if (moveOrCopy === 'move') {
            if (Extensible.Date.compare(rec.getStartDate(), newStartDate) === 0) {
                // No changes, so we aren't actually moving. Copying to the same date is OK.
                return;
            }
            newRec = rec;
        }
        else {
            newRec = rec.clone();
        }

        if (me.fireEvent('beforeevent' + moveOrCopy, me, newRec, Ext.Date.clone(newStartDate)) !== false) {
            if (newRec.isRecurring()) {
                //if (me.recurrenceOptions.editSingleOnDrag) {
                    me.onRecurrenceEditModeSelected('single', newRec, newStartDate, moveOrCopy);
                //}
                // else {
                    // Extensible.form.recurrence.RangeEditWindow.prompt({
                        // callback: Ext.bind(me.onRecurrenceEditModeSelected, me, [newRec, newStartDate, moveOrCopy], true),
                        // editModes: ['single', 'future'],
                        // scope: me
                    // });
                // }
            }
            else {
                me.doShiftEvent(newRec, newStartDate, moveOrCopy);
            }
        }
    },

    onRecurrenceEditModeSelected: function(editMode, rec, newStartDate, moveOrCopy) {
        var EventMappings = Extensible.calendar.data.EventMappings;

        if (editMode) {
            if (moveOrCopy === 'copy') {
                rec.clearRecurrence();
            }
            rec.data[EventMappings.REditMode.name] = editMode;
            rec.data[EventMappings.RInstanceStartDate.name] = rec.getStartDate();
            this.doShiftEvent(rec, newStartDate, moveOrCopy);
        }
        // else user canceled
    },

    doShiftEvent: function(rec, newStartDate, moveOrCopy) {
        var EventMappings = Extensible.calendar.data.EventMappings,
            diff = newStartDate.getTime() - rec.getStartDate().getTime(),
            updateData = {};

        updateData[EventMappings.StartDate.name] = newStartDate;
        updateData[EventMappings.EndDate.name] = Extensible.Date.add(rec.getEndDate(), {millis: diff});

        rec.set(updateData);

        if (rec.phantom) {
            this.store.add(rec);
        }

        this.save();
        this.fireEvent('event' + moveOrCopy, this, rec);
    },

    onEditDetails: function(menu, rec, el) {
        this.fireEvent('editdetails', this, rec, el);
        this.menuActive = false;
    },

    // onRecurrenceMoveModeSelected: function(editMode, rec, newStartDate) {
        // if (editMode) {
            // rec.data[Extensible.calendar.data.EventMappings.REditMode.name] = editMode;
            // rec.data[Extensible.calendar.data.EventMappings.RInstanceStartDate.name] = rec.getStartDate();
            // this.doShiftEvent(rec, newStartDate, 'move');
        // }
        // // else user canceled
    // },

    onDeleteEvent: function(menu, rec, el) {
        rec._deleting = true;
        this.deleteEvent(rec, el);
        this.menuActive = false;
    },

    /**
     * Delete the specified event.
     * @param {Object} rec The event {@link Extensible.calendar.data.EventModel record}
     */
    deleteEvent: function(rec, /* private */el) {
        var me = this;

        if (me.fireEvent('beforeeventdelete', me, rec, el) !== false) {
            if (rec.isRecurring()) {
                this.rangeEditWin = this.rangeEditWin || Ext.WindowMgr.get('ext-cal-rangeeditwin');
                if (!this.rangeEditWin) {
                    this.rangeEditWin = new Extensible.form.recurrence.RangeEditWindow();
                }
                this.rangeEditWin.prompt({
                    callback: Ext.bind(me.onRecurrenceDeleteModeSelected, me, [rec, el], true),
                    scope: me
                });
            }
            else {
                me.doDeleteEvent(rec, el);
            }
        }
    },

    onRecurrenceDeleteModeSelected: function(editMode, rec, el) {
        if (editMode) {
            rec.data[Extensible.calendar.data.EventMappings.REditMode.name] = editMode;
            rec.data[Extensible.calendar.data.EventMappings.RInstanceStartDate.name] = rec.getStartDate();
            this.doDeleteEvent(rec, el);
        }
        // else user canceled
    },

    doDeleteEvent: function(rec, /* private */el) {
        this.store.remove(rec);
        this.save();
        this.fireEvent('eventdelete', this, rec, el);
    },

    onContextMenu: function(e, t) {
        var el = e.getTarget(this.eventSelector, 5, true),
            match = false;

        if (el) {
            this.dismissEventEditor().showEventMenu(el, e.getXY());
            match = true;
        }

        if (match || this.suppressBrowserContextMenu === true) {
            e.preventDefault();
        }
    },

    /*
     * Shared click handling.  Each specific view also provides view-specific
     * click handling that calls this first.  This method returns true if it
     * can handle the click (and so the subclass should ignore it) else false.
     */
    onClick: function(e, t) {
        var me = this,
            el = e.getTarget(me.eventSelector, 5);

        if (me.dropZone) {
            me.dropZone.clearShims();
        }
        if (me.menuActive === true) {
            // ignore the first click if a context menu is active (let it close)
            me.menuActive = false;
            return true;
        }
        if (el) {
            var id = me.getEventIdFromEl(el),
                rec = me.getEventRecord(id);
            
            if (rec && me.fireEvent('eventclick', me, rec, el) !== false) {
                if (me.readOnly !== true) {
                    me.showEventEditor(rec, el);
                }
            }
            return true;
        }
    },

    onMouseOver: function(e, t) {
        if (this.trackMouseOver !== false && (this.dragZone === undefined || !this.dragZone.dragging)) {
            if (!this.handleEventMouseEvent(e, t, 'over')) {
                this.handleDayMouseEvent(e, t, 'over');
            }
        }
    },

    onMouseOut: function(e, t) {
        if (this.trackMouseOver !== false && (this.dragZone === undefined || !this.dragZone.dragging)) {
            if (!this.handleEventMouseEvent(e, t, 'out')) {
                this.handleDayMouseEvent(e, t, 'out');
            }
        }
    },

    handleEventMouseEvent: function(e, t, type) {
        var el = e.getTarget(this.eventSelector, this.eventSelectorDepth, true);
        
        if (el) {
            var rel = Ext.get(e.getRelatedTarget());
            
            if (el === rel || el.contains(rel)) {
                return true;
            }

            var evtId = this.getEventIdFromEl(el);

            if (this.eventOverClass !== '') {
                var els = this.getEventEls(evtId);
                els[type === 'over' ? 'addCls' : 'removeCls'](this.eventOverClass);
            }
            
            this.fireEvent('event' + type, this, this.getEventRecord(evtId), el);
            
            return true;
        }
        return false;
    },

    getDateFromId: function(id, delim) {
        var parts = id.split(delim);
        return parts[parts.length-1];
    },

    handleDayMouseEvent: function(e, t, type) {
        t = e.getTarget('td', 3);
        
        if (t) {
            if (t.id && t.id.indexOf(this.dayElIdDelimiter) > -1) {
                var dt = this.getDateFromId(t.id, this.dayElIdDelimiter),
                    rel = Ext.get(e.getRelatedTarget()),
                    relTD, relDate;

                if (rel) {
                    relTD = rel.is('td') ? rel : rel.up('td', 3);
                    relDate = relTD && relTD.id ? this.getDateFromId(relTD.id, this.dayElIdDelimiter) : '';
                }
                if (!rel || dt !== relDate) {
                    var el = this.getDayEl(dt);
                    
                    if (el && !Ext.isEmpty(this.dayOverClass)) {
                        el[type === 'over' ? 'addCls' : 'removeCls'](this.dayOverClass);
                    }
                    this.fireEvent('day' + type, this, Ext.Date.parseDate(dt, "Ymd"), el);
                }
            }
        }
    },

    // MUST be implemented by subclasses
    renderItems: function() {
        throw 'This method must be implemented by a subclass';
    },

    /**
     * Returns true only if this is the active view inside of an owning
     * {@link Extensible.calendar.CalendarPanel CalendarPanel}. If it is not active, or
     * not hosted inside a CalendarPanel, returns false.
     * @return {Boolean} True if this is the active CalendarPanel view, else false
     * @since 1.6.0
     */
    isActiveView: function() {
        var calendarPanel = this.ownerCalendarPanel;
        return (calendarPanel && calendarPanel.getActiveView().id === this.id);
    },

    destroy: function() {
        this.callParent(arguments);

        if (this.el) {
            this.el.un('contextmenu', this.onContextMenu, this);
        }
        Ext.destroy(
            this.editWin,
            this.eventMenu,
            this.dragZone,
            this.dropZone
        );
    }
});