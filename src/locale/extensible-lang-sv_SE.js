/*
 * Swedish locale
 * By Mats Bryntse, http://ext-scheduler.com
 */

Extensible.Date.use24HourTime = true;

if(Extensible.calendar.view.AbstractCalendar) {
    Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
        startDay: 1,
        todayText: 'Idag',
        defaultEventTitleText: '(Ingen titel)',
        ddCreateEventText: 'Skapa ny aktivitet den {0}',
        ddMoveEventText: 'Flytta aktivitet till {0}',
        ddResizeEventText: 'Uppdatera aktivitet till {0}'
    });
}

if(Extensible.calendar.view.Month) {
    Ext.apply(Extensible.calendar.view.Month.prototype, {
        moreText: '+{0} ytterligare...',
        getMoreText: function(numEvents){
            return '+{0} ytterligare...';
        },
        detailsTitleDateFormat: 'd F'
    });
}

if(Extensible.calendar.CalendarPanel) {
    Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
        todayText: 'Idag',
        dayText: 'Dag',
        weekText: 'Vecka',
        monthText: 'Månad',
        jumpToText: 'Gå till:',
        goText: 'Gå',
        multiDayText: '{0} dagar',
        multiWeekText: '{0} veckor',
        getMultiDayText: function(numDays){
            return '{0} dagar';
        },
        getMultiWeekText: function(numWeeks){
            return '{0} veckor';
        }
    });
}

if(Extensible.calendar.form.EventWindow) {
    Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Lägg till aktivitet',
        titleTextEdit: 'Ändra aktivitet',
        savingMessage: 'Sparar ändringar...',
        deletingMessage: 'Tar bort aktivitet...',
        detailsLinkText: 'Ändra detaljer...',
        saveButtonText: 'Spara',
        deleteButtonText: 'Ta bort',
        cancelButtonText: 'Avbryt',
        titleLabelText: 'Titel',
        datesLabelText: 'När',
        calendarLabelText: 'Kalender'
    });
}

if(Extensible.calendar.form.EventDetails) {
    Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 75,
        title: 'aktivitetformulär',
        titleTextAdd: 'Lägg till aktivitet',
        titleTextEdit: 'Ändra aktivitet',
        saveButtonText: 'Spara',
        deleteButtonText: 'Ta bort',
        cancelButtonText: 'Avbryt',
        titleLabelText: 'Titel',
        datesLabelText: 'När',
        reminderLabelText: 'Påminnelse',
        notesLabelText: 'Anteckningar',
        locationLabelText: 'Placering',
        webLinkLabelText: 'Webblänk',
        calendarLabelText: 'Kalender',
        repeatsLabelText: 'Upprepa'
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        toText: 'till',
        allDayText: 'Hela dagen'
    });
}

if(Extensible.calendar.form.field.CalendarCombo) {
    Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
        fieldLabel: 'Kalender'
    });
}

if(Extensible.calendar.gadget.CalendarListPanel) {
    Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
        title: 'Kalendrar'
    });
}

if(Extensible.calendar.gadget.CalendarListMenu) {
    Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Visa endat denna kalender'
    });
}

if(Extensible.form.recurrence.Combo) {
    Ext.apply(Extensible.form.recurrence.Combo.prototype, {
        fieldLabel: 'Upprepa',
        recurrenceText: {
            none: 'Aldrig',
            daily: 'Daglig',
            weekly: 'Vecklig',
            monthly: 'Månatlig',
            yearly: 'Årlig'
        }
    });
}

if(Extensible.calendar.ReminderField) {
    Ext.apply(Extensible.calendar.ReminderField.prototype, {
        fieldLabel: 'Påminnelse',
        noneText: 'Ingen',
        atStartTimeText: 'Vid start',
        getMinutesText: function(numMinutes){
            return numMinutes === 1 ? 'minut' : 'minuter';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'timme' : 'timmar';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'dag' : 'daggar';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'veka' : 'veckor';
        },
        reminderValueFormat: '{0} {1} före start' // f.eks. "2 timmar före start"
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        dateFormat: 'd/m/Y'
    });
}

if(Extensible.calendar.menu.Event) {
    Ext.apply(Extensible.calendar.menu.Event.prototype, {
        editDetailsText: 'Ändra detaljer',
        deleteText: 'Ta bort',
        moveToText: 'Flytta till...'
    });
}

if(Extensible.calendar.dd.DropZone) {
    Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'd/m'
    });
}

if(Extensible.calendar.dd.DayDropZone) {
    Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'd/m'
    });
}

if(Extensible.calendar.template.BoxLayout) {
    Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
        firstWeekDateFormat: 'D d',
        otherWeeksDateFormat: 'd',
        singleDayDateFormat: 'l d F Y',
        multiDayFirstDayFormat: 'd M Y',
        multiDayMonthStartFormat: 'd M'
    });
}

if(Extensible.calendar.template.Month) {
    Ext.apply(Extensible.calendar.template.Month.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l d F Y'
    });
}
