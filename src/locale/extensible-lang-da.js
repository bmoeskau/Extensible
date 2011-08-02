/*
 * Danish locale
 * By Niels Olsen
 */

Extensible.Date.use24HourTime = true;

if(Extensible.calendar.view.AbstractCalendar) {
    Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
        startDay: 1,
        todayText: 'Idag',
        defaultEventTitleText: '(Ingen titel)',
        ddCreateEventText: 'Opret begivenhed den {0}',
        ddMoveEventText: 'Flyt begivenhed til {0}',
        ddResizeEventText: 'Opdatér begivenhed til {0}'
    });
}

if(Extensible.calendar.view.Month) {
    Ext.apply(Extensible.calendar.view.Month.prototype, {
        moreText: '+{0} flere...',
        getMoreText: function(numEvents){
            return '+{0} flere...';
        },
        detailsTitleDateFormat: 'd F'
    });
}

if(Extensible.calendar.CalendarPanel) {
    Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
        todayText: 'Idag',
        dayText: 'Dag',
        weekText: 'Uge',
        monthText: 'Måned',
        jumpToText: 'Gå til:',
        goText: 'Gå',
        multiDayText: '{0} dage',
        multiWeekText: '{0} uger',
        getMultiDayText: function(numDays){
            return '{0} dage';
        },
        getMultiWeekText: function(numWeeks){
            return '{0} uger';
        }
    });
}

if(Extensible.calendar.form.EventWindow) {
    Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Tilføj begivenhed',
        titleTextEdit: 'Ret begivenhed',
        savingMessage: 'Gemmer ændringer...',
        deletingMessage: 'Sletter begivenhed...',
        detailsLinkText: 'Ret detaljer...',
        saveButtonText: 'Gem',
        deleteButtonText: 'Slet',
        cancelButtonText: 'Annulér',
        titleLabelText: 'Titel',
        datesLabelText: 'Hvornår',
        calendarLabelText: 'Kalender'
    });
}

if(Extensible.calendar.form.EventDetails) {
    Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: 'Begivenhed formular',
        titleTextAdd: 'Tilføj begivenhed',
        titleTextEdit: 'Ret begivenhed',
        saveButtonText: 'Gem',
        deleteButtonText: 'Slet',
        cancelButtonText: 'Annulér',
        titleLabelText: 'Title',
        datesLabelText: 'Hvornår',
        reminderLabelText: 'Påmindelse',
        notesLabelText: 'Noter',
        locationLabelText: 'Placering',
        webLinkLabelText: 'Web link',
        calendarLabelText: 'Kalender',
        repeatsLabelText: 'Gentagelser'
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        toText: 'til',
        allDayText: 'Hele dagen'
    });
}

if(Extensible.calendar.form.field.CalendarCombo) {
    Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
        fieldLabel: 'Kalender'
    });
}

if(Extensible.calendar.gadget.CalendarListPanel) {
    Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
        title: 'Kalendere'
    });
}

if(Extensible.calendar.gadget.CalendarListMenu) {
    Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Vis kun denne kalender'
    });
}

if(Extensible.form.recurrence.Combo) {
    Ext.apply(Extensible.form.recurrence.Combo.prototype, {
        fieldLabel: 'Gentagelser',
        recurrenceText: {
            none: 'Gentages ikke',
            daily: 'Daglig',
            weekly: 'Ugentlig',
            monthly: 'Månedlig',
            yearly: 'Årlig'
        }
    });
}

if(Extensible.calendar.form.field.ReminderCombo) {
    Ext.apply(Extensible.calendar.form.field.ReminderCombo.prototype, {
        fieldLabel: 'Påmindelse',
        noneText: 'Ingen',
        atStartTimeText: 'Ved start tidspunkt',
        getMinutesText: function(numMinutes){
            return numMinutes === 1 ? 'minute' : 'minutter';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'time' : 'timer';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'dag' : 'dage';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'uge' : 'uger';
        },
        reminderValueFormat: '{0} {1} før start' // f.eks. "2 timer før start"
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        dateFormat: 'd/m/Y'
    });
}

if(Extensible.calendar.menu.Event) {
    Ext.apply(Extensible.calendar.menu.Event.prototype, {
        editDetailsText: 'Ret detaljer',
        deleteText: 'Slet',
        moveToText: 'Flyt til...'
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
