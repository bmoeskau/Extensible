/*
 * Portugues (BR) locale
 * By Wemerson Januario <wemerson.januario@gmail.com> Goiânia GO, Brazil
 */

Ext.ensible.Date.use24HourTime = false;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: 'Hoje',
        defaultEventTitleText: '(Sem Titulo)',
        ddCreateEventText: 'Criar Evento para {0}',
        ddMoveEventText: 'Mover Evento para {0}',
        ddResizeEventText: 'Alterar Evento para {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} mais...',
        getMoreText: function(numEvents){
            return '+{0} mais...';
        },
        detailsTitleDateFormat: 'F j'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Hoje',
        dayText: 'Dia',
        weekText: 'Semana',
        monthText: 'Mês',
        jumpToText: 'Ir para:',
        goText: 'Prosseguir',
        multiDayText: '{0} Dias',
        multiWeekText: '{0} Semanas',
        getMultiDayText: function(numDays){
            return '{0} Dias';
        },
        getMultiWeekText: function(numWeeks){
            return '{0} Semanas';
        }
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Adicionar Evento',
        titleTextEdit: 'Alterar Evento',
        savingMessage: 'Salvando...',
        deletingMessage: 'Excluindo Evento...',
        detailsLinkText: 'Alterar Detalhes...',
        saveButtonText: 'Salvar',
        deleteButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        titleLabelText: 'Título',
        datesLabelText: 'Quando',
        calendarLabelText: 'Calendário'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: 'Formulário de Evento',
        titleTextAdd: 'Adicionar Evento',
        titleTextEdit: 'Alterar Evento',
        saveButtonText: 'Salvar',
        deleteButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        titleLabelText: 'Título',
        datesLabelText: 'Quando',
        reminderLabelText: 'Lembrete',
        notesLabelText: 'Observação',
        locationLabelText: 'Local',
        webLinkLabelText: 'Site',
        calendarLabelText: 'Calendário',
        repeatsLabelText: 'Repetiçoes'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'para',
        allDayText: 'Dia todo'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Calendário'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Calendários'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Mostrar apenas esse Calendário'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
        fieldLabel: 'Repetiçoes',
        recurrenceText: {
            none: 'Não repetir',
            daily: 'Diariamente',
            weekly: 'Semanalmente',
            monthly: 'Mensalmente',
            yearly: 'Anualmente'
        }
    });
}

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Lembrete',
        noneText: 'Nenhum',
        atStartTimeText: 'No horário exato',
        getMinutesText: function(numMinutes){
            return numMinutes === 1 ? 'minuto' : 'minutos';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'hora' : 'horas';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'dia' : 'dias';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'semana' : 'semanadas';
        },
        reminderValueFormat: '{0} {1} antes do programado' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'j/n/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Alterar detalhes',
        deleteText: 'Excluir',
        moveToText: 'Mover para...'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'j/n'
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'j/n'
    });
}

if(Ext.ensible.cal.BoxLayoutTemplate) {
    Ext.apply(Ext.ensible.cal.BoxLayoutTemplate.prototype, {
        firstWeekDateFormat: 'D j',
        otherWeeksDateFormat: 'j',
        singleDayDateFormat: 'l, F j, Y',
        multiDayFirstDayFormat: 'j M , Y',
        multiDayMonthStartFormat: 'j M'
    });
}

if(Ext.ensible.cal.MonthViewTemplate) {
    Ext.apply(Ext.ensible.cal.MonthViewTemplate.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l, F j, Y'
    });
}

// This is an override of Ext's default dayNames. Ext uses HTML char equivalents
// like &aacute; but in abbreviations it's wrong. E.g., Sábado is
// abbreviated as S&a. This seems to be a bug in Ext's abbreviation logic
// so for our purposes just include the actual chars here.
Date.dayNames = [
   "Domingo",
   "Segunda",
   "Terça",
   "Quarta",
   "Quinta",
   "Sexta",
   "Sábado"
];