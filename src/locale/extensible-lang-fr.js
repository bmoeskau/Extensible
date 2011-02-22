/*
 * French (France) locale
 * Contributors: devil1591, Alain Deseine, Yannick Torres
 */

Ext.ensible.Date.use24HourTime = true;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 1,
        todayText: 'Aujourd\'hui',
        defaultEventTitleText: '(Pas de titre)',
        ddCreateEventText: 'Créer évènement le {0}',
        ddMoveEventText: 'Déplacer évènement le {0}',
        ddResizeEventText: 'Mettre à jour l\'événement au {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} autres ...',
        detailsTitleDateFormat: 'd F'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Aujourd\'hui',
        dayText: 'Jour',
        weekText: 'Semaine',
        monthText: 'Mois',
        jumpToText: 'Aller au :',
        goText: 'Ok',
        multiDayText: '{0} jours',
        multiWeekText: '{0} semaines'
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 650,
        labelWidth: 65,
        titleTextAdd: 'Ajouter évènement',
        titleTextEdit: 'Editer évènement',
        savingMessage: 'Sauvegarde des changements...',
        deletingMessage: 'Suppression de l\'évènement...',
        detailsLinkText: 'Détail de l\'événement...',
        saveButtonText: 'Enregistrer',
        deleteButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        titleLabelText: 'Titre',
        datesLabelText: 'Quand',
        calendarLabelText: 'Agenda'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 55,
        labelWidthRightCol: 80,
        title: 'Formulaire évènement',
        titleTextAdd: 'Ajouter évènement',
        titleTextEdit: 'Editer évènement',
        saveButtonText: 'Enregistrer',
        deleteButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        titleLabelText: 'Titre',
        datesLabelText: 'Quand',
        reminderLabelText: 'Rappel',
        notesLabelText: 'Notes',
        locationLabelText: 'Lieu',
        webLinkLabelText: 'Lien internet',
        calendarLabelText: 'Agenda',
        repeatsLabelText: 'Répéter'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'au',
        allDayText: 'Toute la journée'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Agenda'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Agendas'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'N\'afficher que cet agenda'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
        fieldLabel: 'Réccurence',
        recurrenceText: {
            none: 'Ne pas répéter',
            daily: 'Quotidien',
            weekly: 'Hebdomadaire',
            monthly: 'Mensuel',
            yearly: 'Annuel'
        }
    });
}

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Rappel',
        noneText: 'Aucun',
        atStartTimeText: 'au début',
        minutesText: 'minutes',
        hourText: 'heure',
        hoursText: 'heures',
        dayText: 'jour',
        daysText: 'jours',
        weekText: 'semaine',
        weeksText: 'semaines',
        reminderValueFormat: '{0} {1} avant le début' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'd/m/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Éditer les détails',
        deleteText: 'Effacer',
        moveToText: 'Déplacer au...'
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
