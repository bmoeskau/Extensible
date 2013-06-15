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

        Extensible.calendar.template.AgendaBody.superclass.constructor.call(this,
            '<table class="ext-cal-evt-agenda" cellpadding="2" cellspacing="0" width="100%" border="0">',
                '<tbody>',
                    '<tpl for="days">',
                        '<tr>',
                            // '<td  rowspan="{[values.events.length]}" nowrap>{[Ext.Date.format(values.date, \"D M j\")]}</td>',
                            '<td  rowspan="{[values.events.length]}" nowrap>',
                                '<span ',
                                    config.linkDatesToDayView ? 'id="ext-cal-day-{[Ext.Date.format(values.date, "Ymd")]}" class="ext-cal-day-link ext-cal-day-{[Ext.Date.format(values.date, "Ymd")]}"' : '',
                                '>{[Ext.Date.format(values.date, this.dayDateFormat)]}</span>',
                            '</td>',
                            '<tpl for="events.getRange()">', // events is a MixedCollection
                                '<tpl if="xindex&gt;1">',
                                    '<tr>',
                                '</tpl>',
                                        '<td nowrap>{[this.getEventTimesMarkup(values, parent.date)]}</td>',
                                        '<td width="90%">',
                                            '<tpl if="!this.showEventDetails">',
                                                // Display a one-line summary of the event
                                                '{[this.getTitleMarkup(values)]}',
                                                '{[this.getReminderFlagMarkup(values)]}',
                                                '{[this.getRecurrenceFlagMarkup(values)]}',
                                            '</tpl>',
                                            '<tpl if="this.showEventDetails">',
                                                // Display event with all details
                                                '{[this.getTitleMarkup(values)]}',
                                                '{[this.getReminderFlagMarkup(values)]}',
                                                '{[this.getRecurrenceFlagMarkup(values)]}',
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
                    '<tr><td colspan="3">',
                        '<br /></a><a class="', this.prevLinkSelector, '" href="#" onclick="return false;">', this.prevLinkText, '</a> | <a class="', this.nextLinkSelector, '" href="#" onclick="return false;">', this.nextLinkText, '</a><br /><br /><br />',
                    '</td></tr>',
                '</tbody>',
            '</table>',
            {
                eventHasLocation: function(evt) {
                    var l = evt.data[Extensible.calendar.data.EventMappings.Location.name];
                    return l && l != "";
                },
                eventHasLink: function(evt) {
                    var url = evt.data[Extensible.calendar.data.EventMappings.Url.name];
                    return url && url != "";
                },
                eventHasNotes: function(evt) {
                    var n = evt.data[Extensible.calendar.data.EventMappings.Notes.name];
                    return n && n != "";
                }
           }
        );
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
    * Returns event start and end times formatted for output.
    * @param {Extensible.calendar.data.EventModel} evt
    * @param {Date} dt The date for which to produce output.
    * @return {String}
    */
    getEventTimesMarkup: function(evt, dt) {
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
    * Returns the markup for the event title.
    * @param {Extensible.calendar.data.EventModel} evt
    * @return {String}
     '{[this.getTitleMarkup(values)]}',
     '{[values.data[Extensible.calendar.data.EventMappings.Location.name] != "" ? " - " + values.data[Extensible.calendar.data.EventMappings.Location.name] : ""]}',
    */
    getTitleMarkup: function(evt) {
        var result,
            M = Extensible.calendar.data.EventMappings,
            title = evt.data[M.Title.name];
        result = [
            '<span class="ext-cal-evt ', evt.data['_extraCls'], '"><strong>',
                !title || title.length == 0 ? this.defaultEventTitleText : title,
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
    }

},
function() {
    this.createAlias('apply', 'applyTemplate');
});