/**
 * @class Extensible.calendar.template.AgendaBody
 * @extends Ext.XTemplate
 *
 * <p><b>This class is currently beta code and the API is still subject to change before the next release.</b></p>
 *
 * <p>This is the template used to render the {@link Extensible.calendar.view.AgendaBody AgendaBody}.</p>
 *
 * <p>This template is automatically bound to the underlying event store by the
 * calendar components and expects records of type {@link Extensible.calendar.data.EventModel}.</p>
 *
 * @author Gabriel Sidler, sidler@teamup.com
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Extensible.calendar.template.AgendaBody', {
    extend: 'Ext.XTemplate',

    requires: [],

    /**
     * @cfg {Boolean} linkDatesToDayView
     * True to link dates to the {@link Extensible.calendar.view.Day day view}.
     */
    linkDatesToDayView: true,

    /**
     * @cfg {Boolean} simpleList
     * <p>If true, a simple list of events is displayed, else, an agenda-style list is displayed.
     * Defaults to false.</p>
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
     * @cfg {String} dayDateFormat
     * The date format for day's date in the list of events (defaults to 'D M j').
     */
    dayDateFormat: 'D M j',
    /**
     * @cfg {String} hourFormat
     * The format for event start and end times (defaults to 'g:ia').
     */
    hourFormat: 'g:ia',
    /**
     * @cfg {String} allDayText
     * Text used to display in times column for all-day events and for events that last the entire day.
     */
    allDayText: 'All day',
    /**
     * @cfg {String} locationText
     * Label used for the event location output.
     */
    locationText: 'Location',
    /**
     * @cfg {String} webLinkText
     * Label used for the web link output.
     */
    webLinkText: 'Web Link',
    /**
     * @cfg {String} notesText
     * Label used for the event notes output.
     */
    notesText: 'Notes',
    /**
     * @cfg {String} noEventsText
     * Text used where there are no events for the selected date range.
     */
    noEventsText: 'There are no events for the selected date range.',

    /**
     * @cfg {String} prevLinkText
     * Text used for the previous link.
     */
    prevLinkText: 'Previous',

    /**
     * @cfg {String} nextLinkText
     * Text used for the next link.
     */
    nextLinkText: 'Next',

    /**
     * @cfg {String} reminderTooltip
     * Text used as tooltip for the reminder icon.
     */
    reminderTooltip: 'Reminder is activated',

    /**
     * @cfg {String} recurringTooltip
     * Text used as tooltip for the reminder icon.
     */
    recurringTooltip: 'Recurring event',

    /**
     * @cfg {String} showEventDetails
     * If true, events are displayed with all details, otherwise only a one-line summary is shown.
     */
    showEventDetails: false,
    /**
     * @cfg {Integer} maxNotesLength
     * The maximum number of characters shown for the notes text.
     */
    maxNotesLength: 100,
    /**
     * @cfg {String} prevLinkSelector
     * The class name applied to the <i>previous link</i>.
     */
    prevLinkSelector: 'ext-cal-agenda-bd-prev-link',
    /**
     * @cfg {String} nextLinkSelector
     * The class name applied to the <i>previous link</i>.
     */
    nextLinkSelector: 'ext-cal-agenda-bd-next-link',


    // private
    constructor: function(config){

        Ext.apply(this, config);

        // AgendaBody support two templates, an agenda list template and a simple list template.
        if (this.simpleList){
            Extensible.calendar.template.AgendaBody.superclass.constructor.call(this, this.getTemplateForSimpleList());
        } else {
            Extensible.calendar.template.AgendaBody.superclass.constructor.call(this, this.getTemplateForAgendaList());
        }
    },

    // private
    applyTemplate : function(o){
        if (Ext.getVersion().isLessThan('4.1')) {
            return Extensible.calendar.template.AgendaBody.superclass.applyTemplate.call(this, o);
        }
        else {
            return this.applyOut(o, []).join('');
        }
    },

    /**
     * Returns the template used for the agenda list.
     * @return {Array} A array of strings making up the template.
     */
    getTemplateForAgendaList: function() {
        return [
            '<table class="ext-cal-evt-agenda" cellpadding="2" cellspacing="0" width="100%" border="0">',
                '<tbody>',
                    '<tpl for="days">',
                        '<tr>',
                            // '<td  rowspan="{[values.events.length]}" nowrap>{[Ext.Date.format(values.date, \"D M j\")]}</td>',
                            '<td  rowspan="{[values.events.length]}" nowrap>',
                                '<span ',
                                    this.linkDatesToDayView ? 'id="ext-cal-day-{[Ext.Date.format(values.date, "Ymd")]}" class="ext-cal-day-link ext-cal-day-{[Ext.Date.format(values.date, "Ymd")]}"' : '',
                                '>{[Ext.Date.format(values.date, this.dayDateFormat)]}</span>',
                            '</td>',
                            '<tpl for="events.getRange()">', // events is a MixedCollection
                                '<tpl if="xindex&gt;1">',
                                    '<tr>',
                                '</tpl>',
                                        '<td nowrap>{[this.getEventTimesMarkupForAgendaList(values, parent.date)]}</td>',
                                        '<td width="90%">',
                                            '{[this.getTitleMarkup(values)]}',
                                            '<tpl if="this.showEventDetails">',
                                                // Display event with all details
                                                '<table class="ext-cal-evt-agenda-details" cellspacing="0" cellpadding="0" width="100%" border="0">',
                                                    '<tpl if="this.eventHasLocation(values)">',
                                                        '<tr>',
                                                            '<td nowrap>', this.locationText, ':</td>',
                                                            '<td width="95%">{[values.data[Extensible.calendar.data.EventMappings.Location.name]]}</td>',
                                                        '</tr>',
                                                    '</tpl>',
                                                    '<tpl if="this.eventHasLink(values)">',
                                                        '<tr>',
                                                            '<td nowrap>', this.webLinkText, ':</td>',
                                                            '<td width="95%"><a href="{[this.getWebLinkMarkup(values)]}" target="_blank">{[this.getWebLinkMarkup(values, true)]}</a></td>',
                                                        '</tr>',
                                                    '</tpl>',
                                                    '<tpl if="this.eventHasNotes(values)">',
                                                        '<tr>',
                                                            '<td nowrap>', this.notesText, ':</td>',
                                                            '<td width="95%">{[this.getNotesMarkup(values)]}</td>',
                                                        '</tr>',
                                                    '</tpl>',
                                                '</table>',
                                            '</tpl>',
                                        '</td>',
                                '</tr>',
                            '</tpl>',
                        '<tr>',
                            '<td colspan="3" style=""><hr /></td>',
                        '</tr>',
                    '</tpl>',
                    '<tpl if="days.length==0">',
                        '<tr><td colspan="3"><i>',
                            this.noEventsText,
                        '</i></td></tr>',
                    '</tpl>',
                    '<tr class="ext-cal-agenda-bd-prev-next-links"><td colspan="3">',
                        '<br /></a><a class="', this.prevLinkSelector, '" href="#" onclick="return false;">', this.prevLinkText, '</a> | <a class="', this.nextLinkSelector, '" href="#" onclick="return false;">', this.nextLinkText, '</a><br /><br /><br />',
                    '</td></tr>',
                '</tbody>',
            '</table>'
        ];
    },

    /**
     * Returns the template used for the simple list.
     * @return {Array} A array of strings making up the template.
     */
    getTemplateForSimpleList: function() {
        return [
            '<table class="ext-cal-evt-agenda" cellpadding="2" cellspacing="0" width="100%" border="0">',
                '<tbody>',
                    '<tpl for="groups">',
                        '<tpl if="this.hasGroupTitle()">',
                            '<tr>',
                                '<td colspan="6" class="ext-cal-agenda-group-header">{[this.getGroupHeaderMarkup(values)]}</td>',
                            '</tr>',
                            '<tr>',
                                '<td colspan="6" style=""><hr /></td>',
                            '</tr>',
                        '</tpl>',
                        '<tpl for="days">',
                            '<tr>',
                                '<td  rowspan="{[values.events.length]}" nowrap>',
                                    '<span ',
                                        this.linkDatesToDayView ? 'id="ext-cal-day-{[Ext.Date.format(values.date, "Ymd")]}" class="ext-cal-day-link ext-cal-day-{[Ext.Date.format(values.date, "Ymd")]}"' : '',
                                    '>{[Ext.Date.format(values.date, this.dayDateFormat)]}</span>',
                                '</td>',
                                '<tpl for="events.getRange()">', // events is a MixedCollection
                                    '<tpl if="xindex&gt;1">',
                                        '<tr>',
                                    '</tpl>',
                                            '{[this.getEventTimesMarkupForSimpleList(values, parent.date)]}',
                                            '<td width="90%">',
                                                '{[this.getTitleMarkup(values)]}',
                                                '<tpl if="this.showEventDetails">',
                                                    // Display event with all details
                                                    '<table class="ext-cal-evt-agenda-details" cellspacing="0" cellpadding="0" width="100%" border="0">',
                                                        '<tpl if="this.eventHasLocation(values)">',
                                                            '<tr>',
                                                                '<td nowrap>', this.locationText, ':</td>',
                                                                '<td width="95%">{[values.data[Extensible.calendar.data.EventMappings.Location.name]]}</td>',
                                                            '</tr>',
                                                        '</tpl>',
                                                        '<tpl if="this.eventHasLink(values)">',
                                                            '<tr>',
                                                                '<td nowrap>', this.webLinkText, ':</td>',
                                                                '<td width="95%"><a href="{[this.getWebLinkMarkup(values)]}" target="_blank">{[this.getWebLinkMarkup(values, true)]}</a></td>',
                                                            '</tr>',
                                                        '</tpl>',
                                                        '<tpl if="this.eventHasNotes(values)">',
                                                            '<tr>',
                                                                '<td nowrap>', this.notesText, ':</td>',
                                                                '<td width="95%">{[this.getNotesMarkup(values)]}</td>',
                                                            '</tr>',
                                                        '</tpl>',
                                                    '</table>',
                                                '</tpl>',
                                            '</td>',
                                    '</tr>',
                                '</tpl>',
                            '<tr>',
                                '<td colspan="6" style=""><hr /></td>',
                            '</tr>',
                        '</tpl>',
                    '</tpl>',
                    '<tpl if="groups.length==0">',
                        '<tr><td colspan="6"><i>',
                            this.noEventsText,
                        '</i></td></tr>',
                    '</tpl>',
                    '<tr class="ext-cal-agenda-bd-prev-next-links"><td colspan="6">',
                        '<br /></a><a class="', this.prevLinkSelector, '" href="#" onclick="return false;">', this.prevLinkText, '</a> | <a class="', this.nextLinkSelector, '" href="#" onclick="return false;">', this.nextLinkText, '</a><br /><br /><br />',
                    '</td></tr>',
                '</tbody>',
            '</table>'
            ];
    },

    /**
    * Returns event start and end times formatted for output on the agenda list. See also {@link #getEventTimesMarkupForSimpleList}.
    * @param {Extensible.calendar.data.EventModel} evt
    * @param {Date} dt The date for which to produce output.
    * @return {String}
    */
    getEventTimesMarkupForAgendaList: function(evt, dt) {
        var result,
            M = Extensible.calendar.data.EventMappings,
            currentDt = Ext.Date.clearTime(dt),
            startDt = Ext.Date.clearTime(evt.data[M.StartDate.name], true),
            endDt = Ext.Date.clearTime(evt.data[M.EndDate.name], true),
            startDtTime = evt.data[M.StartDate.name],
            endDtTime = evt.data[M.EndDate.name];

        // There are five cases to consider:
        // Case                                                             Output example
        // ---------------------------------------------------------------+---------------
        // 1) Event is all-day event                                        All day
        // 2) Event is not all-day event
        //    2.1) Start time and end time are on the current day           8:00am - 11:00am
        //    2.2) Start time on current date, end time on later date       8:00 >>
        //    2.3) Start time on earlier date, end time on current date     >> 11:00am
        //    2.4) Start time on earlier date, end time on later day        All day
        if (evt.data[M.IsAllDay.name]) {
            result = this.allDayText; // Case 1
        } else {
            if (Extensible.Date.compare(currentDt, startDt) == 0) {
                if (Extensible.Date.compare(currentDt, endDt) == 0) {
                    result = Ext.Date.format(startDtTime, this.hourFormat) + ' - ' + Ext.Date.format(endDtTime, this.hourFormat); // Case 2.1
                } else {
                    result = Ext.Date.format(startDtTime, this.hourFormat) + ' &raquo;'; // Case 2.2
                }
            } else {
                if (Extensible.Date.compare(currentDt, endDt) == 0) {
                    result = '&raquo; ' + Ext.Date.format(endDtTime, this.hourFormat); // Case 2.3
                } else {
                    result = this.allDayText; // Case 2.4
                }
            }
        }
        return result;
    },

    /**
     * Returns event start and end times formatted for output on the simple list. See also {@link #getEventTimesMarkupForAgendaList}.
     * @param {Extensible.calendar.data.EventModel} evt
     * @param {Date} dt The date for which to produce output.
     * @return {String}
     */
    getEventTimesMarkupForSimpleList: function(evt, dt) {
        var result,
            M = Extensible.calendar.data.EventMappings,
            currentDt = Ext.Date.clearTime(dt),
            startDt = Ext.Date.clearTime(evt.data[M.StartDate.name], true),
            endDt = Ext.Date.clearTime(evt.data[M.EndDate.name], true),
            startDtTime = evt.data[M.StartDate.name],
            endDtTime = evt.data[M.EndDate.name],
            startHourStr = '',
            untilStr = '-',
            endDtStr = '',
            endHourStr = '';

        // This function generates HTML output that contains the following information:
        // - Event start hour
        // - Event end date
        // - Event end hour
        // Note that the event start date is not part of the output because the start date is displayed once for
        // all events on the same day.
        //
        // There are several cases to consider:
        // 1) All-day event that starts and ends on the current day.
        // 2) All-day event that starts on the current day and ends on a later day.
        // 3) Non-all-day event that starts and ends on the current day.
        // 4) Non-all-day event that starts on the current day and ends on a later day.
        //
        // Generated values for the four cases are:
        //    Evt start hour | Evt end date | Evt end hour
        // 1)    All day     |              |
        // 2)    All day     | Mon May 18   |
        // 3)    8:00am      | 5:00pm       |
        // 4)    8:00am      | Mon May 18   | 5:00pm

        if (evt.data[M.IsAllDay.name])    {
            if (startDt.getTime() == endDt.getTime()) {
                // Case 1
                startHourStr = this.allDayText;
                untilStr = '';
            } else {
                // Case 2
                startHourStr = this.allDayText;
                endDtStr = Ext.Date.format(endDt, this.dayDateFormat);
            }
        } else {
            if (startDt.getTime() == endDt.getTime()) {
                // Case 3
                startHourStr = Ext.Date.format(startDtTime, this.hourFormat);
                endDtStr = Ext.Date.format(endDtTime, this.hourFormat);
            } else {
                // Case 4
                startHourStr = Ext.Date.format(startDtTime, this.hourFormat);
                endDtStr = Ext.Date.format(endDt, this.dayDateFormat);
                endHourStr = Ext.Date.format(endDtTime, this.hourFormat);
            }
        }

        result = [
            '<td class="ext-cal-evt-hours" nowrap>', startHourStr, '</td><td class="ext-cal-evt-hours" >', untilStr, '</td>',
            '<td class="ext-cal-evt-hours" nowrap>', endDtStr, '</td><td class="ext-cal-evt-hours" nowrap>', endHourStr, '</td>'];
        return result.join('');
    },

   /**
    * Returns the markup for the event title.
    * @param {Extensible.calendar.data.EventModel} evt
    * @return {String}
    */
    getTitleMarkup: function(evt) {
        var result,
            M = Extensible.calendar.data.EventMappings,
            title = evt.data[M.Title.name];
        result = [
            '<span class="ext-cal-evt ', evt.data['_extraCls'], '"><strong>',
                !title || title.length == 0 ? this.defaultEventTitleText : title,
                this.getReminderFlagMarkup(evt),
                this.getRecurrenceFlagMarkup(evt),
            '</strong></span>'
        ];
        if (evt.data[M.Location.name] && evt.data[M.Location.name] != '' && !this.showEventDetails) {
            result.push(
                ' - ',
                evt.data[M.Location.name]
            );
        }
        return result.join('');
    },

    /**
    * Returns the markup for the reminder flag, if a reminder is active. Otherwise an empty string is returned.
    * @param {Extensible.calendar.data.EventModel} evt
    * @return {String}
    */
    getReminderFlagMarkup: function(evt) {
        var M = Extensible.calendar.data.EventMappings;
        return evt.data[M.Reminder.name] && evt.data[M.Reminder.name] != '' ? '<i title="' + this.reminderTooltip + '" class="ext-cal-ic ext-cal-ic-rem">&#160;</i>' : '';
    },

    /**
    * Returns the markup for the recurrence flag, if recurrence is active. Otherwise an empty string is returned.
    * @param {Extensible.calendar.data.EventModel} evt
    * @return {String}
    */
    getRecurrenceFlagMarkup: function(evt) {
        var M = Extensible.calendar.data.EventMappings;
        return evt.data[M.RRule.name] && evt.data[M.RRule.name] != '' ? '<i title="' + this.recurringTooltip + '" class="ext-cal-ic ext-cal-ic-rcr">&#160;</i>' : '';
    },

    /**
     * Returns the markup for the web link. If no web link is defined, an empty string is returned.
     * @param {Extensible.calendar.data.EventModel} evt
     * @param {Boolean} removeProtocol If true the 'http://' string is removed from the web link. This can be useful
     * to display the web link in a user friendly way. If the web link is missing the protocol string and this
     * parameter is false, then the protocol string is prepended. Defaults to false.
     * @return {String}
     */
    getWebLinkMarkup: function(evt, removeProtocol) {
        var M = Extensible.calendar.data.EventMappings,
            l = evt.data[M.Url.name];
        if (l && l != "") {
            if (l.indexOf('http://') == 0) {
                l = l.substr(7);
            }
            if (removeProtocol) {
                return l;
            } else {
                return 'http://' + l;
            }
        } else {
            return '';
        }
    },

    /**
     * Returns the markup for the event notes. If no event notes are defined, an empty string is returned. The notes
     * are limited to the number of characters specified by configuration option {@link #maxNotesLength}.
     * @param {Extensible.calendar.data.EventModel} evt
     * @return {String}
     */
    getNotesMarkup: function(evt) {
        var M = Extensible.calendar.data.EventMappings,
            n = evt.data[M.Notes.name];
        return n.length > this.maxNotesLength ? n.substring(0, this.maxNotesLength-3) + '...' : n;
    },


    /**
     * Returns the markup for an event group header. The type of group header returned depends on the configured
     * event grouping (see {@link #groupBy}). For example:
     * Monthly grouping: June 2012
     * Weekly grouping: Week 23: Mon Jun 3 - Sun Jun 10
     * No grouping: Empty string
     * @param {Object} group
     * @return {String}
     */
    getGroupHeaderMarkup: function(group) {
        var result;

        if (this.groupBy == 'month') {
            result = [Ext.Date.format(group.startDt, "F Y")];
        } else if (this.groupBy == 'week') {
            if (Ext.Date.clearTime(group.startDt, true).getTime() == Ext.Date.clearTime(group.endDt, true).getTime()) {
                // This is a partical week with only one day left. Don't show date range, just current date.
                result = ['Week ', group.weekNo,  ': ', Ext.Date.format(group.startDt, this.dayDateFormat)];
            } else {
                result = ['Week ', group.weekNo,  ': ', Ext.Date.format(group.startDt, this.dayDateFormat), ' - ', Ext.Date.format(group.endDt, this.dayDateFormat)];
            }
        } else {
            result = [''];
        }
        return result.join('');
    },

    /**
     * Returns true if passed event has notes, false otherwise. This is a small helper function for the template.
     * @param {Extensible.calendar.data.EventModel} An event record.
     * @return {Boolean}
     */
    eventHasNotes: function(evt) {
        var n = evt.data[Extensible.calendar.data.EventMappings.Notes.name];
        return n && n != "";
    },

    /**
     * Returns true if passed event has a location assigned, false otherwise. This is a small helper function for the template.
     * @param {Extensible.calendar.data.EventModel} An event record.
     * @return {Boolean}
     */
    eventHasLocation: function(evt) {
        var l = evt.data[Extensible.calendar.data.EventMappings.Location.name];
        return l && l != "";
    },

    /**
     * Returns true if passed event has a link assigned, false otherwise. This is a small helper function for the template.
     * @param {Extensible.calendar.data.EventModel} An event record.
     * @return {Boolean}
     */
    eventHasLink: function(evt) {
        var url = evt.data[Extensible.calendar.data.EventMappings.Url.name];
        return url && url != "";
    },

    /**
     * Returns true if group titles are to be displayed. This is a small helper function for the template.
     * @return {Boolean}
     */
    hasGroupTitle: function() {
        return this.groupBy == 'month' || this.groupBy == 'week' ? true : false;
    }

},
function() {
    this.createAlias('apply', 'applyTemplate');
});