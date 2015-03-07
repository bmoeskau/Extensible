/*
 * German (DE) locale
 *
 * Contributors:
 * - Tobias Uhlig
 * - Gunnar Beushausen
 * - Joern Heid
 * - Gabriel Sidler, http://teamup.com
 */

Ext.onReady(function() {
    var exists = Ext.Function.bind(Ext.ClassManager.get, Ext.ClassManager);

    Extensible.Date.use24HourTime = true;

    if (exists('Extensible.calendar.view.AbstractCalendar')) {
        Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
            startDay: 0,
            todayText: 'Heute',
            defaultEventTitleText: '(kein titel)',
            ddCreateEventText: 'Termin erstellen f\u00FCr {0}',
            ddMoveEventText: 'Termin verschieben nach {0}',
            ddResizeEventText: 'Termin updaten nach {0}'
        });
    }

    if (exists('Extensible.calendar.view.Month')) {
        Ext.apply(Extensible.calendar.view.Month.prototype, {
            moreText: '+{0} weitere...',
            getMoreText: function(numEvents) {
                return '+{0} weitere...';
            },
            detailsTitleDateFormat: 'j. F'
        });
    }

    if (exists('Extensible.calendar.CalendarPanel')) {
        Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
            todayText: 'Heute',
            dayText: 'Tag',
            weekText: 'Woche',
            monthText: 'Monat',
            agendaText: 'Agenda',
            listText: 'Liste',
            jumpToText: 'Springe zu:',
            goText: 'Los',
            multiDayText: '{0} Tage',
            multiWeekText: '{0} Wochen',
            getMultiDayText: function(numDays) {
                return '{0} Tage';
            },
            getMultiWeekText: function(numWeeks) {
                return '{0} Wochen';
            }
        });
    }

    if (exists('Extensible.calendar.form.EventWindow')) {
        Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
            width: 640,
            labelWidth: 65,
            titleTextAdd: 'Termin erstellen',
            titleTextEdit: 'Termin editieren',
            savingMessage: 'Speichere Daten...',
            deletingMessage: 'L\u00F6sche Termin...',
            detailsLinkText: 'Einzelheiten bearbeiten...',
            saveButtonText: 'Speichern',
            deleteButtonText: 'L\u00F6schen',
            cancelButtonText: 'Abbrechen',
            titleLabelText: 'Titel',
            datesLabelText: 'Wann',
            calendarLabelText: 'Kalender'
        });
    }

    if (exists('Extensible.calendar.form.EventDetails')) {
        Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
            labelWidth: 65,
            labelWidthRightCol: 65,
            title: 'Termin Formular',
            titleTextAdd: 'Termin hinzuf\u00FCgen',
            titleTextEdit: 'Termin editieren',
            saveButtonText: 'Speichern',
            deleteButtonText: 'L\u00F6schen',
            cancelButtonText: 'Abbrechen',
            titleLabelText: 'Titel',
            datesLabelText: 'Wann',
            reminderLabelText: 'Erinnerung',
            notesLabelText: 'Notizen',
            locationLabelText: 'Ort',
            webLinkLabelText: 'Web Link',
            calendarLabelText: 'Kalender',
            repeatsLabelText: 'Wiederholungen'
        });
    }

    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            toText: 'bis',
            allDayText: 'ganzer Tag'
        });
    }

    if (exists('Extensible.calendar.form.field.CalendarCombo')) {
        Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
            fieldLabel: 'Kalender'
        });
    }

    if (exists('Extensible.calendar.gadget.CalendarListPanel')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
            title: 'Kalender'
        });
    }

    if (exists('Extensible.calendar.gadget.CalendarListMenu')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
            displayOnlyThisCalendarText: 'Nur diesen Kalender anzeigen'
        });
    }

    if (exists('Extensible.form.recurrence.Combo')) {
        Ext.apply(Extensible.form.recurrence.Combo.prototype, {
            fieldLabel: 'Wiederholungen',
            recurrenceText: {
                none: 'keine Wiederholungen',
                daily: 't\u00E4glich',
                weekly: 'w\u00F6chentlich',
                monthly: 'monatlich',
                yearly: 'j\u00E4hrlich'
            }
        });
    }

    if (exists('Extensible.calendar.form.field.ReminderCombo')) {
        Ext.apply(Extensible.calendar.form.field.ReminderCombo.prototype, {
            fieldLabel: 'Erinnerung',
            noneText: 'keine',
            atStartTimeText: 'zur Startzeit',
            getMinutesText: function(numMinutes) {
                return numMinutes === 1 ? 'Minute' : 'Minuten';
            },
            getHoursText: function(numHours) {
                return numHours === 1 ? 'Stunde' : 'Stunden';
            },
            getDaysText: function(numDays) {
                return numDays === 1 ? 'Tag' : 'Tage';
            },
            getWeeksText: function(numWeeks) {
                return numWeeks === 1 ? 'Woche' : 'Wochen';
            },
            reminderValueFormat: '{0} {1} vor Terminbeginn' // e.g. "2 hours before start"
        });
    }

    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            dateFormat: 'j.n.Y'
        });
    }

    if (exists('Extensible.calendar.menu.Event')) {
        Ext.apply(Extensible.calendar.menu.Event.prototype, {
            editDetailsText: 'Einzelheiten bearbeiten',
            deleteText: 'L\u00F6schen',
            moveToText: 'Verschieben nach...'
        });
    }

    if (exists('Extensible.calendar.dd.DropZone')) {
        Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat: 'j.n.'
        });
    }

    if (exists('Extensible.calendar.dd.DayDropZone')) {
        Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat : 'j.n.'
        });
    }

    if (exists('Extensible.calendar.template.BoxLayout')) {
        Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
            firstWeekDateFormat: 'D j',
            otherWeeksDateFormat: 'j',
            singleDayDateFormat: 'l, j. F Y',
            multiDayFirstDayFormat: 'j. M. Y',
            multiDayMonthStartFormat: 'M j'
        });
    }

    if (exists('Extensible.calendar.template.Month')) {
        Ext.apply(Extensible.calendar.template.Month.prototype, {
            dayHeaderFormat: 'D',
            dayHeaderTitleFormat: 'l, j. F Y'
        });
    }

    /*
     * Recurrence strings added in v.1.6.0
     */
    if (exists('Extensible.form.recurrence.Rule')) {
        Ext.apply(Extensible.form.recurrence.Rule.prototype, {
            strings: {
                dayNamesShort: {
                    SU: 'So',
                    MO: 'Mo',
                    TU: 'Di',
                    WE: 'Mi',
                    TH: 'Do',
                    FR: 'Fr',
                    SA: 'Sa'
                },

                dayNamesShortByIndex: [
                    'So',
                    'Mo',
                    'Di',
                    'Mi',
                    'Do',
                    'Fr',
                    'Sa'
                ],

                dayNamesLong: {
                    SU: 'Sonntag',
                    MO: 'Montag',
                    TU: 'Dienstag',
                    WE: 'Mittwoch',
                    TH: 'Donnerstag',
                    FR: 'Freitag',
                    SA: 'Samstag'
                },

                ordinals: {
                    1: 'ersten',
                    2: 'zweiten',
                    3: 'dritten',
                    4: 'vierten',
                    5: 'fünften',
                    6: 'sechsten'
                },

                frequency: {
                    none: 'Nicht wiederholen',
                    daily: 'Täglich',
                    weekly: 'Wöchentlich',
                    weekdays: 'Jeden Werktag (Mo-Fr)',
                    monthly: 'Monatlich',
                    yearly: 'Jährlich'
                },

                every: 'Alle',       // e.g. Every 2 days
                days: 'Tage',
                weeks: 'Wochen',
                weekdays: 'Werktage',
                months: 'Monate',
                years: 'Jahre',
                time: 'Mal',        // e.g. Daily, 1 time
                times: 'Mal',      // e.g. Daily, 5 times
                until: 'bis',      // e.g. Daily, until Dec, 31 2012
                untilFormat: 'j. M. Y', // e.g. Dec 10, 2012
                and: 'und',          // e.g. Weekly on Tuesday and Friday
                on: 'am',            // e.g. Weekly on Thursday
                onDay: 'am',     // e.g. Monthly on day 23
                onDayPostfix: '.',    // In some languages a postfix is need for the onDay term,
                // for example in German: 'Monatlich am 23.'
                // Here the postfix would be '.'
                onThe: 'am',     // e.g. Monthly on the first Thursday
                onTheLast: 'am letzten', // e.g. Monthly on the last Friday
                onTheLastDay: 'am letzten Tag', // e.g. Monthly on the last day
                of: 'des',            // e.g. Annually on the last day of November
                monthFormat: 'F',    // e.g. November
                monthDayFormat: 'j. F' // e.g. November 10
            }
        });
    }

    if (exists('Extensible.form.recurrence.FrequencyCombo')) {
        Ext.apply(Extensible.form.recurrence.FrequencyCombo.prototype, {
            fieldLabel: 'Wiederholen'
        });
    }

    if (exists('Extensible.form.recurrence.RangeEditWindow')) {
        Ext.apply(Extensible.form.recurrence.RangeEditWindow.prototype, {
            title: 'Wiederkehrender Termin',
            saveButtonText: 'Speichern',
            cancelButtonText: 'Abbrechen'
        });
    }

    if (exists('Extensible.form.recurrence.RangeEditPanel')) {
        Ext.apply(Extensible.form.recurrence.RangeEditPanel.prototype, {
            headerText: 'Auf welche Termine dieser Termin-Serie möchten Sie Ihre Änderungen anwenden?',
            optionSingleButtonText: 'Nur diesen',
            optionSingleDescription: 'Änderungen nur auf diesen Termin anwenden. Andere Termine dieser Serie werden nicht geändert.',
            optionFutureButtonText: 'Folgende',
            optionFutureDescription: 'Änderungen nur auf diesen und folgende Termine anwenden. Frühere Termine werden nicht geändert.',
            optionAllButtonText: 'Alle',
            optionAllDescription: 'Änderungen auf alle Termine dieser Serie anwenden.'
        });
    }

    if (exists('Extensible.form.recurrence.option.Interval')) {
        Ext.apply(Extensible.form.recurrence.option.Interval.prototype, {
            dateLabelFormat: 'l, j. F',
            strings: {
                repeatEvery: 'Wiederholen alle',
                beginning: 'ab',
                day: 'Tag',
                days: 'Tage',
                week: 'Woche',
                weeks: 'Wochen',
                month: 'Monat',
                months: 'Monate',
                year: 'Jahr',
                years: 'Jahre'
            }
        });
    }

    if (exists('Extensible.form.recurrence.option.Duration')) {
        Ext.apply(Extensible.form.recurrence.option.Duration.prototype, {
            strings: {
                andContinuing: 'und endet',
                occurrences: 'Wiederholungen',
                forever: 'nie',
                forText: 'nach',
                until: 'am'
            }
        });
    }

    if (exists('Extensible.form.recurrence.option.Weekly')) {
        Ext.apply(Extensible.form.recurrence.option.Weekly.prototype, {
            strings: {
                on: 'am'
            }
        });
    }

    if (exists('Extensible.form.recurrence.option.Monthly')) {
        Ext.apply(Extensible.form.recurrence.option.Monthly.prototype, {
            strings: {
                // E.g. "on the 15th day of each month/year"
                onThe: 'am',
                ofEach: 'jedes',
                inText: 'im',
                day: 'Tag',
                month: 'Monats',
                year: 'Jahres',
                last: 'letzten',
                lastDay: 'letzten Tag',
                monthDayDateFormat: 'j.',
                nthWeekdayDateFormat: '.' // displays the ordinal postfix, e.g. . for 5.

            }
        });
    }

    /*
     * Strings for agenda view, added in x.x.x
     */
    if (exists('Extensible.calendar.template.AgendaBody')) {
        Ext.apply(Extensible.calendar.template.AgendaBody.prototype, {
            dayDateFormat: 'D. j. M.',
            hourFormat: 'G:i',
            allDayText: 'Ganzer Tag',
            locationText: 'Ort',
            webLinkText: 'Web Link',
            notesText: 'Bemerkung',
            noEventsText: 'Für den gewählten Datumsbereich existieren keine Termine.',
            prevLinkText: 'Zurück',
            nextLinkText: 'Weiter',
            reminderTooltip: 'Erinnerung ist aktiviert',
            recurringTooltip: 'Wiederkehrender Termin'
        });
    }

    if (exists('Extensible.calendar.view.AgendaHeader')) {
        Ext.apply(Extensible.calendar.view.AgendaHeader.prototype, {
            dateRangeOneDay: 'Ein Tag',
            dateRangeOneWeek: 'Eine Woche',
            dateRangeOneMonth: 'Ein Monat',
            dateRangeThreeMonths: 'Drei Monate',
            dateRangeOneYear: 'Ein Jahr',
            dateRangeText: 'Datumsbereich',
            groupByMonths: 'Monat',
            groupByWeek: 'Woche',
            groupByNone: 'Nichts',
            groupByText: 'Gruppieren nach',
            showDetailsText: 'Details zeigen',
            addBtnText: 'Neuer Termin',
            resetBtnText: 'Zurücksetzen'
        });
    }

});