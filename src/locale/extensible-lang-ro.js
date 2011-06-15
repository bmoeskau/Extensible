/*
 * Romanian (Romania) locale
 * By Laurentiu Macovei, DotNetWise, http://www.dotnetwise.com
 */

Ext.ensible.Date.use24HourTime = false;

if(Extensible.calendar.view.AbstractCalendar) {
    Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
        startDay: 1,
        todayText: 'Astăzi',
        defaultEventTitleText: '(Fără titlu)',
        ddCreateEventText: 'Creează eveniment pentru {0}',
        ddMoveEventText: 'Muta eveniment în {0}',
        ddResizeEventText: 'Actualizează eveniment în {0}'
    });
}

if(Extensible.calendar.view.Month) {
    Ext.apply(Extensible.calendar.view.Month.prototype, {
        moreText: '+ încă {0}...',
        getMoreText: function(numEvents){
            return '+ încă {0}...';
        },
        detailsTitleDateFormat: 'F j'
    });
}

if(Extensible.calendar.CalendarPanel) {
    Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
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

if(Extensible.calendar.form.EventWindow) {
    Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
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

if(Extensible.calendar.form.EventDetails) {
    Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
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

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        toText: 'la',
        allDayText: 'Toată ziua'
    });
}

if(Extensible.calendar.form.field.CalendarCombo) {
    Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
        fieldLabel: 'Calendar'
    });
}

if(Extensible.calendar.gadget.CalendarListPanel) {
    Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
        title: 'Calendare'
    });
}

if(Extensible.calendar.gadget.CalendarListMenu) {
    Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Afișează doar acest calendar'
    });
}

if(Extensible.form.recurrence.Combo) {
    Ext.apply(Extensible.form.recurrence.Combo.prototype, {
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

if(Extensible.calendar.ReminderField) {
    Ext.apply(Extensible.calendar.ReminderField.prototype, {
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

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        dateFormat: 'd/m/Y'
    });
}

if(Extensible.calendar.menu.Event) {
    Ext.apply(Extensible.calendar.menu.Event.prototype, {
        editDetailsText: 'Editează Detalii',
        deleteText: 'Șterge',
        moveToText: 'Mută în...'
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