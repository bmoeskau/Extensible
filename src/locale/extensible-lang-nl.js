/*
 * Dutch locale
 * By Tim de Koning, http://www.kingsquare.nl/
 */

Ext.onReady(function() {
	var exists = Ext.Function.bind(Ext.ClassManager.get, Ext.ClassManager);

	Extensible.Date.use24HourTime = true;

	//default dutch translations for ext are really non-standard... :-(
	if(exists('Ext.form.field.Date')) {
		Ext.apply(Ext.form.field.Date.prototype, {
			format: 'd-m-Y'
		});
	}

	if (exists('Extensible.calendar.view.AbstractCalendar')) {
		Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
			startDay: 0,
			todayText: 'Vandaag',
			defaultEventTitleText: '(Geen titel)',
			ddCreateEventText: 'Maak agenda-item voor {0}',
			ddMoveEventText: 'Verplaats agenda-item naar {0}',
			ddResizeEventText: 'Update agenda-item naar {0}'
		});
	}

	if (exists('Extensible.calendar.view.Month')) {
		Ext.apply(Extensible.calendar.view.Month.prototype, {
			moreText: '+{0} meer...', // deprecated
			getMoreText: function(numEvents) {
				return '+{0} meer...';
			},
			detailsTitleDateFormat: 'j F'
		});
	}

	if (exists('Extensible.calendar.CalendarPanel')) {
		Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
			todayText: 'Vandaag',
			dayText: 'Dag',
			weekText: 'Week',
			monthText: 'Maand',
			jumpToText: 'Spring naar:',
			goText: 'Gaan',
			multiDayText: '{0} Dagen', // deprecated
			multiWeekText: '{0} Weken', // deprecated
			getMultiDayText: function(numDays) {
				return '{0} Dagen';
			},
			getMultiWeekText: function(numWeeks) {
				return '{0} Weken';
			}
		});
	}

	if (exists('Extensible.calendar.form.EventWindow')) {
		Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
			width: 600,
			labelWidth: 65,
			titleTextAdd: 'Agenda-item toevoegen',
			titleTextEdit: 'Bewerk agenda-item',
			savingMessage: 'Bezig met opslaan...',
			deletingMessage: 'Bezig met verwijderen...',
			detailsLinkText: 'Wijzig details...',
			saveButtonText: 'Opslaan',
			deleteButtonText: 'Verwijderen',
			cancelButtonText: 'Annuleren',
			titleLabelText: 'Titel',
			datesLabelText: 'Wanneer',
			calendarLabelText: 'Agenda'
		});
	}

	if (exists('Extensible.calendar.form.EventDetails')) {
		Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
			labelWidth: 65,
			labelWidthRightCol: 65,
			title: 'Agenda-item formulier',
			titleTextAdd: 'Agenda-item toevoegen',
			titleTextEdit: 'Agenda-item wijzigen',
			saveButtonText: 'Opslaan',
			deleteButtonText: 'Verwijderen',
			cancelButtonText: 'Annuleren',
			titleLabelText: 'Titel',
			datesLabelText: 'Wanneer',
			reminderLabelText: 'Herinnering',
			notesLabelText: 'Opmerkingen',
			locationLabelText: 'Locatie',
			webLinkLabelText: 'Web Link',
			calendarLabelText: 'Agenda',
			repeatsLabelText: 'Herhalingen'
		});
	}

	if (exists('Extensible.form.field.DateRange')) {
		Ext.apply(Extensible.form.field.DateRange.prototype, {
			toText: 'tot',
			allDayText: 'Hele dag'
		});
	}

	if (exists('Extensible.calendar.form.field.CalendarCombo')) {
		Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
			fieldLabel: 'Agenda'
		});
	}

	if (exists('Extensible.calendar.gadget.CalendarListPanel')) {
		Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
			title: 'Agenda'
		});
	}

	if (exists('Extensible.calendar.gadget.CalendarListMenu')) {
		Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
			displayOnlyThisCalendarText: 'Alleen deze agenda tonen'
		});
	}

	if (exists('Extensible.form.recurrence.Combo')) {
		Ext.apply(Extensible.form.recurrence.Combo.prototype, {
			fieldLabel: 'Herhalingen',
			recurrenceText: {
				none: 'Herhaalt niet',
				daily: 'Dagelijks',
				weekly: 'Wekelijks',
				monthly: 'Maandelijks',
				yearly: 'Jaarlijks'
			}
		});
	}

	if (exists('Extensible.calendar.form.field.ReminderCombo')) {
		Ext.apply(Extensible.calendar.form.field.ReminderCombo.prototype, {
			fieldLabel: 'Herinnering',
			noneText: 'Geen',
			atStartTimeText: 'Op het moment van aanvang',
			getMinutesText: function(numMinutes) {
				return numMinutes === 1 ? 'minuut' : 'minuten';
			},
			getHoursText: function(numHours) {
				return numHours === 1 ? 'uur' : 'uren';
			},
			getDaysText: function(numDays) {
				return numDays === 1 ? 'dag' : 'dagen';
			},
			getWeeksText: function(numWeeks) {
				return numWeeks === 1 ? 'week' : 'weken';
			},
			reminderValueFormat: '{0} {1} voor aanvang' // e.g. "2 hours before start"
		});
	}

	if (exists('Extensible.form.field.DateRange')) {
		Ext.apply(Extensible.form.field.DateRange.prototype, {
			dateFormat: 'd-m-Y'
		});
	}

	if (exists('Extensible.calendar.menu.Event')) {
		Ext.apply(Extensible.calendar.menu.Event.prototype, {
			editDetailsText: 'Bewerk details',
			deleteText: 'Verwijderen',
			moveToText: 'Verplaats naar...'
		});
	}

	if (exists('Extensible.calendar.dd.DropZone')) {
		Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
			dateRangeFormat: '{0}-{1}',
			dateFormat: 'j-n'
		});
	}

	if (exists('Extensible.calendar.dd.DayDropZone')) {
		Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
			dateRangeFormat: '{0}-{1}',
			dateFormat : 'j-n'
		});
	}

	if (exists('Extensible.calendar.template.BoxLayout')) {
		Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
			firstWeekDateFormat: 'j D',
			otherWeeksDateFormat: 'j',
			singleDayDateFormat: 'l, j F Y',
			multiDayFirstDayFormat: 'j M Y',
			multiDayMonthStartFormat: 'j M'
		});
	}

	if (exists('Extensible.calendar.template.Month')) {
		Ext.apply(Extensible.calendar.template.Month.prototype, {
			dayHeaderFormat: 'D',
			dayHeaderTitleFormat: 'l, j F Y'
		});
	}
});