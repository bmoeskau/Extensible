Ext.define('Extensible.calendar.google.CalendarSettings', {
    
    singleton: true,
    
    userTimeZoneName: '',
    
    expandRecurringEvents: true
    
});

Ext.require([
    'Extensible.calendar.CalendarPanel'
],
function() {
    Extensible.calendar.CalendarPanel.prototype.recurrence = true;
    Extensible.calendar.form.EventDetails.prototype.recurrence = true;
    Extensible.calendar.view.AbstractCalendar.prototype.dateParamStart = 'timeMin';
    Extensible.calendar.view.AbstractCalendar.prototype.dateParamEnd = 'timeMax';
    Extensible.calendar.view.AbstractCalendar.prototype.dateParamFormat = 'c';
});