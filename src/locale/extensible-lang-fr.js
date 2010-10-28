/*
 * French (France) locale
 * By devil1591 (Oct-26-2010)
 */

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 1,
        todayText: 'Aujourd\'hui',
        ddCreateEventText: 'Créer évènement le {0}',
        ddMoveEventText: 'Déplacer évènement le {0}'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Aujourd\'hui',
        dayText: 'Jour',
        weekText: 'Semaine',
        monthText: 'Mois',
        jumpToText: 'Aller au :',
        goText: 'OK',
        multiDayText: '{0} jours',
        weekText: 'Semaine',
        multiWeekText: '{0} semaines'
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        titleTextAdd: 'Ajouter évènement',
        titleTextEdit: 'Editer évènement',
        savingMessage: 'Sauvegarde des changements...',
        deletingMessage: 'Suppression de l\'évènement...'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'N\'afficher que ce calendrier'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Calendriers'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        title: 'Formulaire évènement',
        titleTextAdd: 'Ajouter évènement',
        titleTextEdit: 'Editer évènement'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'au',
        allDayText: 'Toute la journée'
    });
}