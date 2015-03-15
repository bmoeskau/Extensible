/*!
 * Extensible 1.6.0-rc.1
 * Copyright(c) 2010-2013 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
/*!
 * Extensible 1.6.0-rc.1
 * Copyright(c) 2010-2013 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
/*
 * Farsi (fa) locale
 * By Mehran Ziadloo
 */

/* JalaliCalendar.js  Gregorian to Jalali and inverse date convertor
 * Copyright (C) 2001  Roozbeh Pournader <roozbeh@sharif.edu>
 * Copyright (C) 2001  Mohammad Toossi <mohammad@bamdad.org>
 * Copyright (C) 2003,2008  Behdad Esfahbod <js@behdad.org>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You can receive a copy of GNU Lesser General Public License at the
 * World Wide Web address <http://www.gnu.org/licenses/lgpl.html>.
 *
 * For licensing issues, contact The FarsiWeb Project Group,
 * Computing Center, Sharif University of Technology,
 * PO Box 11365-8515, Tehran, Iran, or contact us the
 * email address <FWPG@sharif.edu>.
 */

/* Changes:
 * 
 * 2008-Jul-32:
 *      Use a remainder() function to fix conversion of ancient dates
 *      (before 1600 gregorian).  Reported by Shamim Rezaei.
 *
 * 2003-Mar-29:
 *      Ported to javascript by Behdad Esfahbod
 *
 * 2001-Sep-21:
 *      Fixed a bug with "30 Esfand" dates, reported by Mahmoud Ghandi
 *
 * 2001-Sep-20:
 *      First LGPL release, with both sides of conversions
 */

var JalaliCalendar = {
    g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    , j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
    , farsiMonthNames: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]

    , div: function(a,b) {
        return Math.floor(a/b);
    }

    , remainder: function(a,b) {
        return a - JalaliCalendar.div(a,b)*b;
    }

    , g2j: function(date) {
        var g = [
            date.getFullYear()
            , date.getMonth() + 1
            , date.getDate()
        ];

        var gy, gm, gd;
        var jy, jm, jd;
        var g_day_no, j_day_no;
        var j_np;
        
        var i;

        gy = g[0]-1600;
        gm = g[1]-1;
        gd = g[2]-1;

        g_day_no = 365*gy + JalaliCalendar.div((gy+3), 4) - JalaliCalendar.div((gy+99), 100) + JalaliCalendar.div((gy+399), 400);
        for (i=0; i<gm; ++i)
            g_day_no += JalaliCalendar.g_days_in_month[i];
        if (gm>1 && ((gy%4==0 && gy%100!=0) || (gy%400==0)))
        /* leap and after Feb */
            ++g_day_no;
        g_day_no += gd;
        
        j_day_no = g_day_no-79;
        
        j_np = JalaliCalendar.div(j_day_no, 12053);
        j_day_no = JalaliCalendar.remainder(j_day_no, 12053);
        
        jy = 979+33*j_np+4 * JalaliCalendar.div(j_day_no,1461);
        j_day_no = JalaliCalendar.remainder(j_day_no, 1461);
        
        if (j_day_no >= 366) {
            jy += JalaliCalendar.div((j_day_no-1),365);
            j_day_no = JalaliCalendar.remainder((j_day_no-1), 365);
        }
        
        for (i = 0; i < 11 && j_day_no >= JalaliCalendar.j_days_in_month[i]; ++i) {
            j_day_no -= JalaliCalendar.j_days_in_month[i];
        }
        jm = i+1;
        jd = j_day_no+1;

        return [jy, jm - 1, jd];
    }

    , j2g: function(j /* array containing year, month-1, day*/ ) {
        var gy, gm, gd;
        var jy, jm, jd;
        var g_day_no, j_day_no;
        var leap;

        var hour = 0;
        var min = 0;
        var second = 0;
        if (typeof j[3] !== "undefined") {
            hour = j[3];
        }
        if (typeof j[4] !== "undefined") {
            min = j[4];
        }
        if (typeof j[5] !== "undefined") {
            second = j[5];
        }

        var i;

        jy = j[0]-979;
        jm = j[1];
        jd = j[2]-1;

        j_day_no = 365*jy + JalaliCalendar.div(jy,33)*8 + JalaliCalendar.div((JalaliCalendar.remainder(jy, 33)+3),4);
        for (i=0; i < jm; ++i)
            j_day_no += JalaliCalendar.j_days_in_month[i];

        j_day_no += jd;

        g_day_no = j_day_no+79;

        gy = 1600 + 400 * JalaliCalendar.div(g_day_no,146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
        g_day_no = JalaliCalendar.remainder(g_day_no, 146097);

        leap = 1;
        if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */
        {
            g_day_no--;
            gy += 100 * JalaliCalendar.div(g_day_no,36524); /* 36524 = 365*100 + 100/4 - 100/100 */
            g_day_no = JalaliCalendar.remainder(g_day_no, 36524);
            
            if (g_day_no >= 365)
                g_day_no++;
            else
                leap = 0;
        }

        gy += 4 * JalaliCalendar.div(g_day_no,1461); /* 1461 = 365*4 + 4/4 */
        g_day_no = JalaliCalendar.remainder(g_day_no, 1461);

        if (g_day_no >= 366) {
            leap = 0;

            g_day_no--;
            gy += JalaliCalendar.div(g_day_no, 365);
            g_day_no = JalaliCalendar.remainder(g_day_no, 365);
        }

        for (i = 0; g_day_no >= JalaliCalendar.g_days_in_month[i] + (i == 1 && leap); i++)
            g_day_no -= JalaliCalendar.g_days_in_month[i] + (i == 1 && leap);
        gm = i+1;
        gd = g_day_no+1;

        return new Date(gy, gm-1, gd, hour, min, second, 0);
    }

    , today: function() {
        Today = new Date();
        var j = JalaliCalendar.g2j(Today);
        return j[2]+"/"+(j[1]+1)+"/"+j[0];
    }
};


Ext.onReady(function() {
    var exists = Ext.Function.bind(Ext.ClassManager.get, Ext.ClassManager);
    
    Extensible.Date.use24HourTime = true;
    
    if (exists('Extensible.calendar.CalendarPanel')) {
        Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
            startDay: 6
        });
    }
    if (exists('Extensible.calendar.menu.Event')) {
        Ext.apply(Extensible.calendar.menu.Event.prototype, {
            startDay: 6
        });
    }
    if (exists('Extensible.calendar.form.EventWindow')) {
        Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
            startDay: 6
        });
    }
    if (exists('Extensible.calendar.form.EventDetails')) {
        Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
            startDay: 6
        });
    }
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            startDay: 6
        });
    }
    if (exists('Extensible.form.recurrence.AbstractOption')) {
        Ext.apply(Extensible.form.recurrence.AbstractOption.prototype, {
            startDay: 6
        });
    }
    if (exists('Extensible.form.recurrence.option.Weekly')) {
        Ext.apply(Extensible.form.recurrence.option.Weekly.prototype, {
            startDay: 6
        });
    }
    if (exists('Extensible.form.recurrence.Fieldset')) {
        Ext.apply(Extensible.form.recurrence.Fieldset.prototype, {
            startDay: 6
        });
    }
    if (exists('Extensible.calendar.view.AbstractCalendar')) {
        Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
            startDay: 6,
            dayCount: 7,
            todayText: 'امروز',
            defaultEventTitleText: '(بدون عنوان)',
            ddCreateEventText: 'ایجاد یک واقعه برای {0}',
            ddMoveEventText: 'انتقال واقعه به {0}',
            ddResizeEventText: 'به‌روز رسانی واقعه به‌‌ {0}'
        });
    }
    
    if (exists('Extensible.calendar.view.Month')) {
        Ext.apply(Extensible.calendar.view.Month.prototype, {
            moreText: '+{0} ادامه...', // deprecated
            getMoreText: function(numEvents){
                return '+{0} ادامه...';
            },
            detailsTitleDateFormat: 'F j'
        });
    }
    
    if (exists('Extensible.calendar.CalendarPanel')) {
        Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
            todayText: 'امروز',
            dayText: 'روز',
            weekText: 'هفته',
            monthText: 'ماه',
            jumpToText: 'پرش به:',
            jumpToDateFormat: 'Y/n/j',
            goText: 'انتقال',
            multiDayText: '{0} روز', // deprecated
            multiWeekText: '{0} هفته', // deprecated
            getMultiDayText: function(numDays){
                return '{0} روز';
            },
            getMultiWeekText: function(numWeeks){
                return '{0} هفته';
            }
        });
    }
    
    if (exists('Extensible.calendar.form.EventWindow')) {
        Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
            width: 600,
            labelWidth: 65,
            titleTextAdd: 'ایجاد واقعه',
            titleTextEdit: 'ویرایش واقعه',
            savingMessage: 'ذخیره سازی تغییرات...',
            deletingMessage: 'حذف واقعه...',
            detailsLinkText: 'ویرایش جزئیات...',
            saveButtonText: 'ذخیره',
            deleteButtonText: 'حذف',
            cancelButtonText: 'لغو',
            titleLabelText: 'عنوان',
            datesLabelText: 'زمان',
            calendarLabelText: 'تقویم'
        });
    }
    
    if (exists('Extensible.calendar.form.EventDetails')) {
        Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
            labelWidth: 65,
            labelWidthRightCol: 65,
            title: 'فرم واقعه',
            titleTextAdd: 'ایجاد واقعه',
            titleTextEdit: 'ویرایش واقعه',
            saveButtonText: 'ذخیره',
            deleteButtonText: 'حذف',
            cancelButtonText: 'لغو',
            titleLabelText: 'عنوان',
            datesLabelText: 'زمان',
            reminderLabelText: 'یادآوری',
            notesLabelText: 'دست نوشته',
            locationLabelText: 'مکان',
            webLinkLabelText: 'لینک وب',
            calendarLabelText: 'تقویم',
            repeatsLabelText: 'تکرار'
        });
    }
    
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            toText: 'تا',
            allDayText: 'تمام روز'
        });
    }
    
    if (exists('Extensible.calendar.form.field.CalendarCombo')) {
        Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
            fieldLabel: 'تقویم'
        });
    }
    
    if (exists('Extensible.calendar.gadget.CalendarListPanel')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
            title: 'تقویم‌ها‌'
        });
    }
    
    if (exists('Extensible.calendar.gadget.CalendarListMenu')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
            displayOnlyThisCalendarText: 'تنها همین تقویم را نمایش بده'
        });
    }
    
    if (exists('Extensible.form.recurrence.Combo')) {
        Ext.apply(Extensible.form.recurrence.Combo.prototype, {
            fieldLabel: 'تکرارها',
            recurrenceText: {
                none: 'تکرار نمی‌شود',
                daily: 'روزانه',
                weekly: 'هفتگی',
                monthly: 'ماهانه',
                yearly: 'سالانه'
            }
        });
    }
    
    if (exists('Extensible.calendar.form.field.ReminderCombo')) {
        Ext.apply(Extensible.calendar.form.field.ReminderCombo.prototype, {
            fieldLabel: 'یادآوری',
            noneText: 'هیچ کدام',
            atStartTimeText: 'در زمان شروع',
            getMinutesText: function(numMinutes){
                return numMinutes === 1 ? 'دقیقه' : 'دقیقه';
            },
            getHoursText: function(numHours){
                return numHours === 1 ? 'ساعت' : 'ساعت';
            },
            getDaysText: function(numDays){
                return numDays === 1 ? 'روز' : 'روز';
            },
            getWeeksText: function(numWeeks){
                return numWeeks === 1 ? 'هفته' : 'هفته';
            },
            reminderValueFormat: '{0} {1} قبل از شروع' // e.g. "2 hours before start"
        });
    }
    
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            dateFormat: 'Y/n/j'
        });
    }
    
    if (exists('Extensible.calendar.menu.Event')) {
        Ext.apply(Extensible.calendar.menu.Event.prototype, {
            editDetailsText: 'ویرایش جزئیات',
            deleteText: 'حذف',
            moveToText: 'انتقال به...'
        });
    }
    
    if (exists('Extensible.calendar.dd.DropZone')) {
        Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat: 'n/j'
        });
    }
    
    if (exists('Extensible.calendar.dd.DayDropZone')) {
        Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat : 'n/j'
        });
    }
    
    if (exists('Extensible.calendar.template.BoxLayout')) {
        Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
            firstWeekDateFormat: 'D j',
            otherWeeksDateFormat: 'j',
            singleDayDateFormat: 'l, j F Y',
            multiDayFirstDayFormat: 'j F Y',
            multiDayMonthStartFormat: 'j F'
        });
    }
    
    if (exists('Extensible.calendar.template.Month')) {
        Ext.apply(Extensible.calendar.template.Month.prototype, {
            dayHeaderFormat: 'D',
            dayHeaderTitleFormat: 'l, j F Y'
        });
    }

    /*
     * Recurrence strings added in v.1.6.0
     */
    if (exists('Extensible.form.recurrence.Rule')) {
        Ext.apply(Extensible.form.recurrence.Rule.prototype, {
            strings: {
                dayNamesShort: {
                    SU: 'یکشنبه',
                    MO: 'دوشنبه',
                    TU: 'سه‌شنبه',
                    WE: 'چهارشنبه',
                    TH: 'پنج‌شنبه',
                    FR: 'جمعه',
                    SA: 'شنبه'
                },

                dayNamesShortByIndex: [
                    'یکشنبه',
                    'دوشنبه',
                    'سه‌شنبه',
                    'چهارشنبه',
                    'پنج‌شنبه',
                    'جمعه',
                    'شنبه'
                ],

                dayNamesLong: {
                    SU: 'یکشنبه',
                    MO: 'دوشنبه',
                    TU: 'سه‌شنبه',
                    WE: 'چهارشنبه',
                    TH: 'پنج‌شنبه',
                    FR: 'جمعه',
                    SA: 'شنبه'
                },

                ordinals: {
                    1: 'اول',
                    2: 'دوم',
                    3: 'سوم',
                    4: 'چهارم',
                    5: 'پنجم',
                    6: 'ششم'
                },

                frequency: {
                    none: 'تکرار نمی‌شود',
                    daily: 'روزانه',
                    weekly: 'هفتگی',
                    weekdays: 'هر (شنبه-جمعه)',
                    monthly: 'ماهانه',
                    yearly: 'سالانه'
                },

                every: 'هر',       // e.g. Every 2 days
                days: 'روز',
                weeks: 'هفته',
                weekdays: 'روزهای هفته',
                months: 'ماه',
                years: 'سال',
                time: 'بار',        // e.g. Daily, 1 time
                times: 'بار',      // e.g. Daily, 5 times
                until: 'تا',      // e.g. Daily, until Dec, 31 2012
                untilFormat: 'j F Y', // e.g. Dec 10, 2012
                and: 'و',          // e.g. Weekly on Tuesday and Friday
                on: 'در',            // e.g. Weekly on Thursday
                onDay: 'در',     // e.g. Monthly on day 23
                onDayPostfix: 'هر',    // In some languages a postfix is need for the onDay term,
                // for example in German: 'Monatlich am 23.'
                // Here the postfix would be '.'
                onThe: 'در',     // e.g. Monthly on the first Thursday
                onTheLast: 'آخر', // e.g. Monthly on the last Friday
                onTheLastDay: 'آخرین روز', // e.g. Monthly on the last day
                of: '',            // e.g. Annually on the last day of November
                monthFormat: 'F',    // e.g. November
                monthDayFormat: 'j F' // e.g. November 10
            }
        });
    }

    if (Extensible.form.recurrence.FrequencyCombo) {
        Ext.apply(Extensible.form.recurrence.FrequencyCombo.prototype, {
            fieldLabel: 'تکرارها'
        });
    }

    if (Extensible.form.recurrence.RangeEditWindow) {
        Ext.apply(Extensible.form.recurrence.RangeEditWindow.prototype, {
            title: 'Recurring Event Options',
            saveButtonText: 'ذخیره سازی',
            cancelButtonText: 'لغو'
        });
    }

    if (Extensible.form.recurrence.RangeEditPanel) {
        Ext.apply(Extensible.form.recurrence.RangeEditPanel.prototype, {
            headerText: 'وقایع متعددی در این مجموعه وجود دارد. چگونه می‌بایست درخواست‌تان اعمال گردد؟',
            optionSingleButtonText: 'تکی',
            optionSingleDescription: 'فقط بر روی همین یک واقعه اعمال گردد. وقایع دیگر تغییری نخواهند کرد.',
            optionFutureButtonText: 'آینده',
            optionFutureDescription: 'بر روی این واقعه و وقایع بعدی اعمال گردد. وقایع گذشته تغییری نخواهند کرد.',
            optionAllButtonText: 'تمام وقایع',
            optionAllDescription: 'بر روی تمام وقایع این مجموعه اعمال گردد.'
        });
    }

    if (Extensible.form.recurrence.option.Interval) {
        Ext.apply(Extensible.form.recurrence.option.Interval.prototype, {
            dateLabelFormat: 'l, F j',
            strings: {
                repeatEvery: 'موارد تکرار',
                beginning: 'شروع',
                day: 'روز',
                days: 'روز',
                week: 'هفته',
                weeks: 'هفته',
                month: 'ماه',
                months: 'ماه',
                year: 'سال',
                years: 'سال'
            }
        });
    }

    if (Extensible.form.recurrence.option.Duration) {
        Ext.apply(Extensible.form.recurrence.option.Duration.prototype, {
            strings: {
                andContinuing: 'و در ادامه',
                occurrences: 'دفعات وقوع',
                forever: 'برای همیشه',
                forText: 'برای',
                until: 'تا'
            }
        });
    }

    if (Extensible.form.recurrence.option.Weekly) {
        Ext.apply(Extensible.form.recurrence.option.Weekly.prototype, {
            strings: {
                on: 'در'
            }
        });
    }

    if (Extensible.form.recurrence.option.Monthly) {
        Ext.apply(Extensible.form.recurrence.option.Monthly.prototype, {
            strings: {
                // E.g. "on the 15th day of each month/year"
                onThe: 'در',
                ofEach: 'برای هر',
                inText: 'در',
                day: 'روز',
                month: 'ماه',
                year: 'سال',
                last: 'آخر',
                lastDay: 'آخرین روز',
                monthDayDateFormat: 'jS',
                nthWeekdayDateFormat: 'ام' // displays the ordinal postfix, e.g. th for 5th.

            }
        });
    }

    Ext.override(Extensible.Date, {
        isWeekend: function(dt){
            return dt.getDay() == 5;
        }
        , getMonth: function(dt) {
            var j = JalaliCalendar.g2j(dt);
            return j[1];
        }
        , getDate: function(dt) {
            var j = JalaliCalendar.g2j(dt);
            return parseInt(j[2]);
        }
    });

});