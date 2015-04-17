/**
 * @class Extensible.calendar.view.Agenda
 * @extends Ext.Container
 *
 * <p><b>This class is currently beta code and the API is still subject to change before the next release.</b></p>
 *
 * <p>Agenda view display events as a chronologically sorted list. It supports two types of list:</p>
 *
 * <p><b>1) Agenda lists</b>: An agenda list is a list where for each day of the view period all events that are taking place
 * on that day are listed. For example, an event that lasts seven days is listed seven times, once for each day.
 * This view is very similar to the agenda view in Google calendar.</p>
 *
 * <p><b>2) Simple lists</b>: A simple list is a list where each event is listed once, independent of the duration of the
 * event. This is suited for event calendars or to present the results of a search for events. Simple list mode is
 * activated by setting property {@link #simpleList} to <tt>true</tt>.<br />
 * Additionally, simple lists support grouping of events by month and week. Grouping is enabled with property
 * {@link #groupBy}. If grouping is enabled, each group of events starts with a group header displaying the
 * month or week.</p>
 *
 * <p>Agenda view supports CRUD operations on events, filtering of events based on calendar and a selectable date
 * range. The view can be switched between a summary view and a details view.</p>
 *
 * <p>The view is divided into two main sections: the {@link Extensible.calendar.view.AgendaHeader header} and the
 * {@link Extensible.calendar.view.AgendaBody event list}. The header hosts a form and a toolbar that can be
 * used to filter events, choose display options, apply action on events, etc. Both header and toolbar are
 * easily configurable.</p>
 *
 * <p>Unlike other calendar views, this view is not actually a subclass of {@link Extensible.calendar.view.AbstractCalendar AbstractCalendar}.
 * Instead it is a {@link Ext.Container} subclass that internally creates and manages the layouts of
 * a {@link Extensible.calendar.view.AgendaHeader AgendaHeader} and a {@link Extensible.calendar.view.AgendaBody AgendaBody}.
 * As such this class accepts any config values that are valid for AgendaHeaderView and AgendaBodyView and passes those through
 * to the contained views. It also supports the interface required of any calendar view and in turn calls methods
 * on the contained views as necessary.</p>
 *
 * @author Gabriel Sidler, sidler@teamup.com
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Extensible.calendar.view.Agenda', {
    extend: 'Ext.Container',
    alias: 'widget.extensible.agendaview',

    requires: [
        'Extensible.calendar.view.AbstractCalendar',
        'Extensible.calendar.view.AgendaHeader',
        'Extensible.calendar.view.AgendaBody'
    ],

    /**
     * @cfg {String} hideMode
     * <p>How this component should be hidden. Supported values are <tt>'visibility'</tt>
     * (css visibility), <tt>'offsets'</tt> (negative offset position) and <tt>'display'</tt>
     * (css display).</p>
     * <br><p><b>Note</b>: For calendar views the default is 'offsets' rather than the Ext JS default of
     * 'display' in order to preserve scroll position after hiding/showing a scrollable view like Day or Week.</p>
     */
    hideMode: 'offsets',

    /**
     * @cfg {Boolean} simpleList
     * <p>If true, a simple list of events is displayed, else, an agenda-style list is displayed. See the introduction
     * of this class for more details. Defaults to false.</p>
     */
    simpleList: false,

    /**
     * @cfg {String} groupBy
     * <p>Defines the grouping to be applied to the list of events. This property only has an effect if property
     * {@link #simpleList} is true. Supported values are <tt>month</tt>, <tt>week</tt> and <tt>none</tt>. Any other
     * values will disable grouping. Default value is <tt>none</tt>.</p>
     */
    groupBy: 'none',

    /**
     * @property ownerCalendarPanel
     * @type Extensible.calendar.CalendarPanel
     * If this view is hosted inside a {@link Extensible.calendar.CalendarPanel} this property will reference
     * it. If the view was created directly outside of a CalendarPanel this property will be undefined. Read-only.
     */

    // private
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    // private
    isAgendaView: true,

    // private
    initComponent : function(){

        // Pass on initial configuration to sub-components
        var cfg = Ext.apply({}, this.initialConfig);

        var header = Ext.applyIf({
            xtype: 'extensible.agendaheaderview',
            id: this.id+'-hd',
            stateful: this.stateful,
            stateId: this.id+'-hd',
            ownerCalendarView: this,
            listeners: {
                formchange: {fn: this.onFormChange, scope: this},
                addevent: {fn: this.onAddEvent, scope: this}
            }
        }, cfg);

        var body = Ext.applyIf({
            xtype: 'extensible.agendabodyview',
            id: this.id+'-bd',
            simpleList: this.simpleList,
            groupBy: this.groupBy,
            ownerCalendarPanel: this.ownerCalendarPanel,
            ownerCalendarView: this
        }, cfg);

        this.items = [header, body];
        this.addCls('ext-cal-agenda ext-cal-ct');

        this.callParent(arguments);
    },

    // private
    afterRender : function(){
        var filterConfig;

        this.callParent(arguments);

        this.header = Ext.getCmp(this.id+'-hd');
        this.body = Ext.getCmp(this.id+'-bd');

        this.body.on('eventsrendered', this.forceSize, this);
        this.on('resize', this.onResize, this);

        filterConfig = this.header.getForm().getFieldValues();
        this.body.setFilterConfig(filterConfig);
    },

    // private
    refresh : function(){
        Extensible.log('refresh (AgendaView)');
        // this.header.refresh();
        this.body.refresh();
    },


    // private
    onFormChange: function(header, form, field) {
        var filterConfig = form.getFieldValues();

        this.body.setFilterConfig(filterConfig);
        if (field.getId() == this.id + '-hd-showdetails') {
            // Refresh the header form without reloading the events
            this.body.refresh(false);
        } else {
            // Reset start date. This will trigger a reload of the events with the changed filter settings.
            this.setStartDate(this.getStartDate());
        }
    },

    // private
    onAddEvent: function(hd, bt) {
        var M = Extensible.calendar.data.EventMappings,
            D = Ext.Date,
            data = {},
            // now = new Date(),
            now = this.body.getStartDate(),
            today = D.clearTime(now, true);

        data[M.StartDate.name] = D.add(today, D.HOUR, now.getHours() + 1);
        data[M.EndDate.name] = D.add(today, D.HOUR, now.getHours() + 2);
        data[M.IsAllDay.name] = true;

        this.body.showEventEditor(data, bt.getEl());
    },

    // private
    forceSize: function(){
        // The defer call is mainly for good ol' IE, but it doesn't hurt in
        // general to make sure that the window resize is good and done first
        // so that we can properly calculate sizes.
        /*
        Ext.defer(function(){
            var ct = this.el.up('.x-panel-body'),
                hd = this.el.down('.ext-cal-agenda-header'),
                h = ct.getHeight() - hd.getHeight();

            this.el.down('.ext-cal-body-ct').setHeight(h-1);
        }, 1, this);
        */
    },

    // private
    onResize : function(){
        this.forceSize();
        Ext.defer(this.refresh, Ext.isIE ? 1 : 0, this); //IE needs the defer
    },

    /*
     * We have to "relay" this Component method so that the hidden
     * state will be properly reflected when the views' active state changes
     */
    doHide: function(){
        this.header.doHide.apply(this, arguments);
        this.body.doHide.apply(this, arguments);
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
        return this.body.getViewBounds();
    },

    /**
     * Returns the start date of the view, as set by {@link #setStartDate}. Note that this may not
     * be the first date displayed in the rendered calendar -- to get the start and end dates displayed
     * to the user use {@link #getViewBounds}.
     * @return {Date} The start date
     */
    getStartDate : function(){
        return this.body.getStartDate();
    },

    /**
     * Sets the start date used to calculate the view boundaries to display. The displayed view will be the
     * earliest and latest dates that match the view requirements and contain the date passed to this function.
     * @param {Date} dt The date used to calculate the new view boundaries
     */
    setStartDate: function(dt){
        this.body.setStartDate(dt, true);
    },

    // private
    renderItems: function(){
        this.body.renderItems();
    },

    /**
     * Returns true if the view is currently displaying today's date, else false.
     * @return {Boolean} True or false
     */
    isToday : function(){
        return this.body.isToday();
    },

    /**
     * Updates the view to contain the passed date
     * @param {Date} dt The date to display
     * @return {Date} The new view start date
     */
    moveTo : function(dt){
        var newDt = this.body.moveTo(dt, true);
        this.header.moveTo(newDt);
        return newDt;
    },

    /**
     * Updates the view to the next consecutive date(s)
     * @return {Date} The new view start date
     */
    moveNext : function(){
        var newDt = this.body.moveNext(true);
        this.header.moveTo(newDt);
        return newDt;
    },

    /**
     * Updates the view to the previous consecutive date(s)
     * @return {Date} The new view start date
     */
    movePrev : function(){
        var newDt = this.body.movePrev(true);
        this.header.moveTo(newDt);
        return newDt;
    },

    /**
     * Shifts the view by the passed number of days relative to the currently set date
     * @param {Number} value The number of days (positive or negative) by which to shift the view
     * @return {Date} The new view start date
     */
    moveDays : function(value){
        var newDt = this.body.moveDays(value, true);
        this.header.moveTo(newDt);
        return newDt;
    },

    /**
     * Updates the view to show today
     * @return {Date} Today's date
     */
    moveToday : function(){
        var newDt = this.body.moveToday(true);
        this.header.moveTo(newDt);
        return newDt;
    },

    /**
     * Show the currently configured event editor view (by default the shared instance of
     * {@link Extensible.calendar.form.EventWindow EventEditWindow}).
     * @param {Extensible.calendar.data.EventModel} rec The event record
     * @param {Ext.Element/HTMLNode} animateTarget The reference element that is being edited. By default this is
     * used as the target for animating the editor window opening and closing. If this method is being overridden to
     * supply a custom editor this parameter can be ignored if it does not apply.
     * @return {Extensible.calendar.view.Day} this
     */
    showEventEditor : function(rec, animateTarget){
        return Extensible.calendar.view.AbstractCalendar.prototype.showEventEditor.apply(this, arguments);
    },

    /**
     * Dismiss the currently configured event editor view (by default the shared instance of
     * {@link Extensible.calendar.form.EventWindow EventEditWindow}, which will be hidden).
     * @param {String} dismissMethod (optional) The method name to call on the editor that will dismiss it
     * (defaults to 'hide' which will be called on the default editor window)
     * @return {Extensible.calendar.view.Day} this
     */
    dismissEventEditor : function(dismissMethod){
        return Extensible.calendar.view.AbstractCalendar.prototype.dismissEventEditor.apply(this, arguments);
    }
});