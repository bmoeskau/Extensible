/*
 * Swedish locale
 * By Mats Bryntse, http://ext-scheduler.com
 */

Ext.ensible.Date.use24HourTime = true;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 1,
        todayText: 'Idag',
        defaultEventTitleText: '(Ingen titel)',
        ddCreateEventText: 'Skapa ny aktivitet den {0}',
        ddMoveEventText: 'Flytta aktivitet till {0}',
        ddResizeEventText: 'Uppdatera aktivitet till {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} ytterligare...',
        detailsTitleDateFormat: 'd F'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Idag',
        dayText: 'Dag',
        weekText: 'Vecka',
        monthText: 'Månad',
        jumpToText: 'Gå till:',
        goText: 'Gå',
        multiDayText: '{0} dagar',
        multiWeekText: '{0} veckor'
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
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

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
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

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'till',
        allDayText: 'Hela dagen'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Kalender'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Kalendrar'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Visa endat denna kalender'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
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

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Påminnelse',
        noneText: 'Ingen',
        atStartTimeText: 'Vid start',
        minutesText: 'minuter',
        hourText: 'timme',
        hoursText: 'timmar',
        dayText: 'dag',
        daysText: 'dagar',
        weekText: 'vecka',
        weeksText: 'veckor',
        reminderValueFormat: '{0} {1} före start' // f.eks. "2 timmar före start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'd/m/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Ändra detaljer',
        deleteText: 'Ta bort',
        moveToText: 'Flytta till...'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'd/m'
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'd/m'
    });
}

if(Ext.ensible.cal.BoxLayoutTemplate) {
    Ext.apply(Ext.ensible.cal.BoxLayoutTemplate.prototype, {
        firstWeekDateFormat: 'D d',
        otherWeeksDateFormat: 'd',
        singleDayDateFormat: 'l d F Y',
        multiDayFirstDayFormat: 'd M Y',
        multiDayMonthStartFormat: 'd M'
    });
}

if(Ext.ensible.cal.MonthViewTemplate) {
    Ext.apply(Ext.ensible.cal.MonthViewTemplate.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l d F Y'
    });
}
