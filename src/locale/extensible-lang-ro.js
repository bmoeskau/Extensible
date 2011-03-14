/*
 * Romanian (Romania) locale
 * By Laurentiu Macovei, DotNetWise, http://www.dotnetwise.com
 */

Ext.ensible.Date.use24HourTime = false;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 1,
        todayText: 'Astăzi',
        defaultEventTitleText: '(Fără titlu)',
        ddCreateEventText: 'Creează eveniment pentru {0}',
        ddMoveEventText: 'Muta eveniment în {0}',
        ddResizeEventText: 'Actualizează eveniment în {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+ încă {0}...',
        getMoreText: function(numEvents){
            return '+ încă {0}...';
        },
        detailsTitleDateFormat: 'F j'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Astăzi',
        dayText: 'Zi',
        weekText: 'Săptămână',
        monthText: 'Lună',
        jumpToText: 'Sari la:',
        goText: 'Vezi',
        multiDayText: '{0} Zile',
        multiWeekText: '{0} Săptămâni',
        getMultiDayText: function(numDays){
            return '{0} Zile';
        },
        getMultiWeekText: function(numWeeks){
            return '{0} Săptămâni';
        }
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Adaugă Eveniment',
        titleTextEdit: 'Editează Eveniment',
        savingMessage: 'Salvez schimbările...',
        deletingMessage: 'Șterge eveninment...',
        detailsLinkText: 'Editează Detaliile...',
        saveButtonText: 'Salvează',
        deleteButtonText: 'Șterge',
        cancelButtonText: 'Renunță',
        titleLabelText: 'Titlu',
        datesLabelText: 'Când',
        calendarLabelText: 'Calendar'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 80,
        title: 'Formular Eveniment',
        titleTextAdd: 'Adaugă Eveniment',
        titleTextEdit: 'Editayă Eveniment',
        saveButtonText: 'Salvează',
        deleteButtonText: 'Șterge',
        cancelButtonText: 'Renunță',
        titleLabelText: 'Titlu',
        datesLabelText: 'Când',
        reminderLabelText: 'Anunță-mă',
        notesLabelText: 'Note',
        locationLabelText: 'Locația',
        webLinkLabelText: 'Adresă web',
        calendarLabelText: 'Calendar',
        repeatsLabelText: 'Se repetă'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'la',
        allDayText: 'Toată ziua'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Calendar'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Calendare'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Afișează doar acest calendar'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
        fieldLabel: 'Se repetă',
        recurrenceText: {
            none: 'Nu se repetă',
            daily: 'Zilnic',
            weekly: 'Săptpmânal',
            monthly: 'Lunar',
            yearly: 'Anual'
        }
    });
}

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Anunță-mă',
        noneText: 'Niciodată',
        atStartTimeText: 'La începutul evenimentului',
        getMinutesText: function(numMinutes){
            return numMinutes === 1 ? 'minut' : 'minute';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'ora' : 'ore';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'zi' : 'zile';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'săptămână' : 'săptămâni';
        },
        reminderValueFormat: '{0} {1} înainte de început' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'd/m/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Editează Detalii',
        deleteText: 'Șterge',
        moveToText: 'Mută în...'
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