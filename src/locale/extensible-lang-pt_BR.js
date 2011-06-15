/*
 * Portugues (BR) locale
 * By Wemerson Januario <wemerson.januario@gmail.com> Goiânia GO, Brazil
 */

Ext.ensible.Date.use24HourTime = false;

if(Extensible.calendar.view.AbstractCalendar) {
    Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
        startDay: 0,
        todayText: 'Hoje',
        defaultEventTitleText: '(Sem Titulo)',
        ddCreateEventText: 'Criar Evento para {0}',
        ddMoveEventText: 'Mover Evento para {0}',
        ddResizeEventText: 'Alterar Evento para {0}'
    });
}

if(Extensible.calendar.view.Month) {
    Ext.apply(Extensible.calendar.view.Month.prototype, {
        moreText: '+{0} mais...',
        getMoreText: function(numEvents){
            return '+{0} mais...';
        },
        detailsTitleDateFormat: 'F j'
    });
}

if(Extensible.calendar.CalendarPanel) {
    Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
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

if(Extensible.calendar.form.EventWindow) {
    Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
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

if(Extensible.calendar.form.EventDetails) {
    Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
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

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        toText: 'para',
        allDayText: 'Dia todo'
    });
}

if(Extensible.calendar.form.field.CalendarCombo) {
    Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
        fieldLabel: 'Calendário'
    });
}

if(Extensible.calendar.gadget.CalendarListPanel) {
    Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
        title: 'Calendários'
    });
}

if(Extensible.calendar.gadget.CalendarListMenu) {
    Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Mostrar apenas esse Calendário'
    });
}

if(Extensible.form.recurrence.Combo) {
    Ext.apply(Extensible.form.recurrence.Combo.prototype, {
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

if(Extensible.calendar.ReminderField) {
    Ext.apply(Extensible.calendar.ReminderField.prototype, {
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

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        dateFormat: 'j/n/Y'
    });
}

if(Extensible.calendar.menu.Event) {
    Ext.apply(Extensible.calendar.menu.Event.prototype, {
        editDetailsText: 'Alterar detalhes',
        deleteText: 'Excluir',
        moveToText: 'Mover para...'
    });
}

if(Extensible.calendar.dd.DropZone) {
    Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'j/n'
    });
}

if(Extensible.calendar.dd.DayDropZone) {
    Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'j/n'
    });
}

if(Extensible.calendar.template.BoxLayout) {
    Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
        firstWeekDateFormat: 'D j',
        otherWeeksDateFormat: 'j',
        singleDayDateFormat: 'l, F j, Y',
        multiDayFirstDayFormat: 'j M , Y',
        multiDayMonthStartFormat: 'j M'
    });
}

if(Extensible.calendar.template.Month) {
    Ext.apply(Extensible.calendar.template.Month.prototype, {
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