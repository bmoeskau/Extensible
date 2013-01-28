describe("Extensible.form.recurrence.Rule", function() {
    Ext.Loader.setConfig({
        enabled: true,
        disableCaching: false,
        paths: {
            'Extensible': '../../../src'
        }
    });
    
    var rrule = Ext.create('Extensible.form.recurrence.Rule'),
        startDateString = 'Nov 27, 2012 19:18:00',
        startDate = new Date(startDateString);
    
    
    describe('Can create a new Rule instance via config with', function() {
        
        it ("{ frequency: 'DAILY' }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'DAILY'
            });
            expect(rrule.getRule()).toEqual('FREQ=DAILY;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Daily');
        });
        
        it ("{ frequency: 'DAILY', count: 1 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'DAILY',
                count: 1
            });
            expect(rrule.getRule()).toEqual('FREQ=DAILY;COUNT=1;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toEqual(1);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Daily, 1 time');
        });
        
        it ("{ frequency: 'DAILY', interval: 2 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'DAILY',
                interval: 2
            });
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 days');
        });
    
        it ("{ frequency: 'DAILY', interval: 2, count: 5 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'DAILY',
                interval: 2,
                count: 5
            });
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount(), 5);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 days, 5 times');
        });
        
        it ("{ frequency: 'DAILY', interval: 2, count: 5, until: '20121231T235959Z' }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'DAILY',
                interval: 2,
                count: 5,
                until: '20121231T235959Z'
            });
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 days, until Dec 31, 2012');
        });
        
        it ("{ frequency: 'WEEKLY' }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'WEEKLY'
            });
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Weekly on Tuesday');
        });
        
        it ("{ frequency: 'WEEKLY', interval: 2 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'WEEKLY',
                interval: 2
            });
            rrule.setRule('FREQ=WEEKLY;INTERVAL=2;');
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tuesday');
        });
        
        it ("{ frequency: 'WEEKLY', interval: 2, byDay: 'TU,FR' }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'WEEKLY',
                interval: 2,
                byDay: 'TU,FR'
            });
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('TU,FR');
            expect(rrule.getByDayWeekdays().length).toEqual(2);
            expect(rrule.getByDayWeekdays()[0]).toEqual('TU');
            expect(rrule.getByDayWeekdays()[1]).toEqual('FR');
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tuesday and Friday');
        });
        
        it ("{ frequency: 'WEEKLY', interval: 2, byDay: 'TU,TH,FR', count: 5 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'WEEKLY',
                interval: 2,
                byDay: 'TU,TH,FR',
                count: 5
            });
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount(), 5);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('TU,TH,FR');
            expect(rrule.getByDayWeekdays().length).toEqual(3);
            expect(rrule.getByDayWeekdays()[0]).toEqual('TU');
            expect(rrule.getByDayWeekdays()[1]).toEqual('TH');
            expect(rrule.getByDayWeekdays()[2]).toEqual('FR');
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tue, Thu and Fri, 5 times');
        });
        
        it ("{ frequency: 'WEEKLY', interval: 2, byDay: 'TU,TH,FR', count: 5, until: '20121231T235959Z' }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'WEEKLY',
                interval: 2,
                byDay: 'TU,TH',
                count: 5,
                until: '20121231T235959Z'
            });
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('TU,TH');
            expect(rrule.getByDayWeekdays().length).toEqual(2);
            expect(rrule.getByDayWeekdays()[0]).toEqual('TU');
            expect(rrule.getByDayWeekdays()[1]).toEqual('TH');
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tuesday and Thursday, until Dec 31, 2012');
        });
        
        it ("{ frequency: 'MONTHLY', byMonthDay: 22 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'MONTHLY',
                byMonthDay: 22
            });
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), 22);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Monthly on day 22');
        });
        
        it ("{ frequency: 'MONTHLY', byMonthDay: 22, interval: 2 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'MONTHLY',
                byMonthDay: 22,
                interval: 2
            });
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), 22);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on day 22');
        });
        
        it ("{ frequency: 'MONTHLY', byDay: '4TH', interval: 2 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'MONTHLY',
                byDay: '4TH',
                interval: 2
            });
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('4TH');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(4);
            expect(rrule.getByDayNthWeekday().weekday).toEqual('TH');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the fourth Thursday');
        });
        
        it ("{ frequency: 'MONTHLY', byDay: '-1FR', interval: 2 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'MONTHLY',
                byDay: '-1FR',
                interval: 2
            });
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('-1FR');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(-1);
            expect(rrule.getByDayNthWeekday().weekday).toEqual('FR');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the last Friday');
        });
        
        it ("{ frequency: 'MONTHLY', byMonthDay: -1, interval: 2 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'MONTHLY',
                byMonthDay: -1,
                interval: 2
            });
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), -1);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the last day');
        });
        
        it ("{ frequency: 'MONTHLY', byMonthDay: 30, interval: 2, count: 5 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'MONTHLY',
                byMonthDay: 30,
                interval: 2,
                count: 5
            });
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount(), 5);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), 30);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on day 30, 5 times');
        });
        
        it ("{ frequency: 'MONTHLY', byMonthDay: 30, interval: 2, until: '20121231T235959Z' }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'MONTHLY',
                byMonthDay: 30,
                interval: 2,
                until: '20121231T235959Z'
            });
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), 30);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on day 30, until Dec 31, 2012');
        });
        
        it ("{ frequency: 'YEARLY', byMonth: 11 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'YEARLY',
                byMonth: 11
            });
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on November 27');
        });
        
        it ("{ frequency: 'YEARLY', byMonth: 11, interval: 2 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'YEARLY',
                byMonth: 11,
                interval: 2
            });
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Every 2 years on November 27');
        });
        
        it ("{ frequency: 'YEARLY', byMonth: 11, interval: 2, byDay: '4TU' }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'YEARLY',
                byMonth: 11,
                interval: 2,
                byDay: '4TU'
            });
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('4TU');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(4, 'Test getByDayNthWeekday().number');
            expect(rrule.getByDayNthWeekday().weekday).toEqual('TU', 'Test getByDayNthWeekday().weekday');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Every 2 years on the fourth Tuesday of November');
        });
        
        it ("{ frequency: 'YEARLY', byMonth: 11, byDay: '-1FR' }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'YEARLY',
                byMonth: 11,
                byDay: '-1FR'
            });
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toEqual('-1FR');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(-1, 'Test getByDayNthWeekday().number');
            expect(rrule.getByDayNthWeekday().weekday).toEqual('FR', 'Test getByDayNthWeekday().weekday');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on the last Friday of November');
        });
        
        it ("{ frequency: 'YEARLY', byMonth: 11, byMonthDay: -1 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'YEARLY',
                byMonth: 11,
                byMonthDay: -1
            });
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), -1);
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on the last day of November');
        });
        
        it ("{ frequency: 'YEARLY', byMonth: 11, count: 5 }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'YEARLY',
                byMonth: 11,
                count: 5
            });
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount(), 5);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on November 27, 5 times');
        });
        
        it ("{ frequency: 'YEARLY', byMonth: 11, until: '20121231T235959Z' }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'YEARLY',
                byMonth: 11,
                until: '20121231T235959Z'
            });
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on November 27, until Dec 31, 2012');
        });
        
        it ("{ frequency: 'WEEKDAYS', interval: 2, until: '20121231T235959Z' }", function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'WEEKDAYS',
                interval: 2,
                until: '20121231T235959Z'
            });
            expect(rrule.getFrequency()).toEqual('WEEKDAYS');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval(), 2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy;
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weekdays, until Dec 31, 2012');
        });
    });
    
    
    describe('Can call getDescription() without passing start date', function() {
        
        it ('Weekly, byDay = FR, no start date set', function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'WEEKLY',
                byDay: 'FR'
            });
            expect(rrule.getDescription()).toEqual('Weekly on Friday');
        });
        
        it ('Weekly, no day set, no start date set', function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'WEEKLY'
            });
            expect(rrule.getDescription()).toEqual('Weekly');
        });
        
        it ('Weekly, no day set, start date (object) set via config', function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'WEEKLY',
                startDate: startDate
            });
            expect(rrule.getDescription()).toEqual('Weekly on Tuesday');
        });
        
        it ('Weekly, no day set, start date (string) set via config', function() {
            rrule = Ext.create('Extensible.form.recurrence.Rule', {
                frequency: 'WEEKLY',
                startDate: startDateString
            });
            expect(rrule.getDescription()).toEqual('Weekly on Tuesday');
        });
    });
    
    
    describe('Can reconfigure a Rule via individual property setters for', function() {
        
        it ('FREQ=DAILY;', function() {
            rrule.setFrequency('DAILY');
            expect(rrule.getRule()).toEqual('FREQ=DAILY;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Daily');
        });
        
        it ('FREQ=DAILY;COUNT=1;', function() {
            rrule.setFrequency('DAILY');
            rrule.setCount(1);
            expect(rrule.getRule()).toEqual('FREQ=DAILY;COUNT=1;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toEqual(1);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Daily, 1 time');
        });

        it ('FREQ=DAILY;INTERVAL=2;', function() {
            rrule.setFrequency('DAILY');
            rrule.setInterval(2);
            expect(rrule.getRule()).toEqual('FREQ=DAILY;INTERVAL=2;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 days');
        });
        
        it ('FREQ=DAILY;INTERVAL=2;COUNT=5;', function() {
            rrule.setFrequency('DAILY');
            rrule.setInterval(2);
            rrule.setCount(5);
            expect(rrule.getRule()).toEqual('FREQ=DAILY;INTERVAL=2;COUNT=5;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount(), 5);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 days, 5 times');
        });
        
        it ('FREQ=DAILY;INTERVAL=2;UNTIL=20121231T235959Z;', function() {
            rrule.setFrequency('DAILY');
            rrule.setInterval(2);
            rrule.setUntil('20121231T235959Z');
            expect(rrule.getRule()).toEqual('FREQ=DAILY;INTERVAL=2;UNTIL=20121231T235959Z;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 days, until Dec 31, 2012');
        });
        
        it ('FREQ=DAILY;INTERVAL=2;UNTIL=20121231T235959Z;', function() {
            rrule.setFrequency('DAILY');
            rrule.setInterval(2);
            rrule.setUntil(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getRule()).toEqual('FREQ=DAILY;INTERVAL=2;UNTIL=20121231T235959Z;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 days, until Dec 31, 2012');
        });
        
        it ('FREQ=WEEKLY;', function() {
            rrule.setFrequency('WEEKLY');
            expect(rrule.getRule()).toEqual('FREQ=WEEKLY;');
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Weekly on Tuesday');
        });
        
        it ('FREQ=WEEKLY;INTERVAL=2;', function() {
            rrule.setFrequency('WEEKLY');
            rrule.setInterval(2);
            expect(rrule.getRule()).toEqual('FREQ=WEEKLY;INTERVAL=2;');
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tuesday');
        });
        
        it ('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,FR;', function() {
            rrule.setFrequency('WEEKLY');
            rrule.setInterval(2);
            rrule.setByDay('TU,FR'); // Pass a string
            expect(rrule.getRule()).toEqual('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,FR;');
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('TU,FR');
            expect(rrule.getByDayWeekdays().length).toEqual(2);
            expect(rrule.getByDayWeekdays()[0]).toEqual('TU');
            expect(rrule.getByDayWeekdays()[1]).toEqual('FR');
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tuesday and Friday');
        });
        
        it ('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,FR;', function() {
            rrule.setFrequency('WEEKLY');
            rrule.setInterval(2);
            rrule.setByDay(['TU', 'FR']); // Pass an array
            expect(rrule.getRule()).toEqual('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,FR;');
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('TU,FR');
            expect(rrule.getByDayWeekdays().length).toEqual(2);
            expect(rrule.getByDayWeekdays()[0]).toEqual('TU');
            expect(rrule.getByDayWeekdays()[1]).toEqual('FR');
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tuesday and Friday');
        });
        
        it ('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH,FR;COUNT=5;', function() {
            rrule.setFrequency('WEEKLY');
            rrule.setInterval(2);
            rrule.setByDay(['TU', 'TH', 'FR']);
            rrule.setCount(5);
            expect(rrule.getRule()).toEqual('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH,FR;COUNT=5;');
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount(), 5);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('TU,TH,FR');
            expect(rrule.getByDayWeekdays().length).toEqual(3);
            expect(rrule.getByDayWeekdays()[0]).toEqual('TU');
            expect(rrule.getByDayWeekdays()[1]).toEqual('TH');
            expect(rrule.getByDayWeekdays()[2]).toEqual('FR');
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tue, Thu and Fri, 5 times');
        });
        
        it ('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH;UNTIL=20121231T235959Z;', function() {
            rrule.setFrequency('WEEKLY');
            rrule.setInterval(2);
            rrule.setByDay(['TU', 'TH']);
            rrule.setUntil('20121231T235959Z');
            expect(rrule.getRule()).toEqual('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH;UNTIL=20121231T235959Z;');
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('TU,TH');
            expect(rrule.getByDayWeekdays().length).toEqual(2);
            expect(rrule.getByDayWeekdays()[0]).toEqual('TU');
            expect(rrule.getByDayWeekdays()[1]).toEqual('TH');
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tuesday and Thursday, until Dec 31, 2012');
        });
        
        it ('FREQ=MONTHLY;BYMONTHDAY=22;', function() {
            rrule.setFrequency('MONTHLY');
            rrule.setByMonthDay(22);
            expect(rrule.getRule()).toEqual('FREQ=MONTHLY;BYMONTHDAY=22;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), 22);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Monthly on day 22');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=22;', function() {
            rrule.setFrequency('MONTHLY');
            rrule.setInterval(2);
            rrule.setByMonthDay(22);
            expect(rrule.getRule()).toEqual('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=22;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), 22);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on day 22');
        }); 
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYDAY=4TH', function() {
            rrule.setFrequency('MONTHLY');
            rrule.setInterval(2);
            rrule.setByDay('4TH'); // As string
            expect(rrule.getRule()).toEqual('FREQ=MONTHLY;INTERVAL=2;BYDAY=4TH;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('4TH');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(4, 'Test getByDayNthWeekday().number');
            expect(rrule.getByDayNthWeekday().weekday).toEqual('TH', 'Test getByDayNthWeekday().weekday');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the fourth Thursday');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYDAY=4TH', function() {
            rrule.setFrequency('MONTHLY');
            rrule.setInterval(2);
            rrule.setByDay({number: 4, weekday: 'TH'}); // As object
            expect(rrule.getRule()).toEqual('FREQ=MONTHLY;INTERVAL=2;BYDAY=4TH;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('4TH');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(4, 'Test getByDayNthWeekday().number');
            expect(rrule.getByDayNthWeekday().weekday).toEqual('TH', 'Test getByDayNthWeekday().weekday');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the fourth Thursday');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYDAY=-1FR;', function() {
            rrule.setFrequency('MONTHLY');
            rrule.setInterval(2);
            rrule.setByDay('-1FR'); // As string
            expect(rrule.getRule()).toEqual('FREQ=MONTHLY;INTERVAL=2;BYDAY=-1FR;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('-1FR');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(-1);
            expect(rrule.getByDayNthWeekday().weekday).toEqual('FR');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the last Friday');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYDAY=-1FR;', function() {
            rrule.setFrequency('MONTHLY');
            rrule.setInterval(2);
            rrule.setByDay({number: -1, weekday: 'FR'}); // As object
            expect(rrule.getRule()).toEqual('FREQ=MONTHLY;INTERVAL=2;BYDAY=-1FR;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('-1FR');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(-1);
            expect(rrule.getByDayNthWeekday().weekday).toEqual('FR');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the last Friday');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=-1;', function() {
            rrule.setFrequency('MONTHLY');
            rrule.setInterval(2);
            rrule.setByMonthDay(-1);
            expect(rrule.getRule()).toEqual('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=-1;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), -1);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the last day');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=30;COUNT=5;', function() {
            rrule.setFrequency('MONTHLY');
            rrule.setInterval(2);
            rrule.setByMonthDay(30);
            rrule.setCount(5);
            expect(rrule.getRule()).toEqual('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=30;COUNT=5;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount(), 5);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), 30);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on day 30, 5 times');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=30;UNTIL=20121231T235959Z;', function() {
            rrule.setFrequency('MONTHLY');
            rrule.setInterval(2);
            rrule.setByMonthDay(30);
            rrule.setUntil(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getRule()).toEqual('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=30;UNTIL=20121231T235959Z;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), 30);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on day 30, until Dec 31, 2012');
        });
        
        it ('FREQ=YEARLY;BYMONTH=11;', function() {
            rrule.setFrequency('YEARLY');
            rrule.setByMonth(11);
            expect(rrule.getRule()).toEqual('FREQ=YEARLY;BYMONTH=11;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on November 27');
        });
        
        it ('FREQ=YEARLY;INTERVAL=2;BYMONTH=11;', function() {
            rrule.setFrequency('YEARLY');
            rrule.setInterval(2);
            rrule.setByMonth(11);
            expect(rrule.getRule()).toEqual('FREQ=YEARLY;INTERVAL=2;BYMONTH=11;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Every 2 years on November 27');
        });
        
        it ('FREQ=YEARLY;INTERVAL=2;BYDAY=4TU;BYMONTH=11;', function() {
            rrule.setFrequency('YEARLY');
            rrule.setInterval(2);
            rrule.setByMonth(11);
            rrule.setByDay({number: 4, weekday: 'TU'});
            expect(rrule.getRule()).toEqual('FREQ=YEARLY;INTERVAL=2;BYDAY=4TU;BYMONTH=11;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('4TU');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(4, 'Test getByDayNthWeekday().number');
            expect(rrule.getByDayNthWeekday().weekday).toEqual('TU', 'Test getByDayNthWeekday().weekday');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Every 2 years on the fourth Tuesday of November');
        });
        
        it ('FREQ=YEARLY;BYDAY=-1FR;BYMONTH=11;', function() {
            rrule.setFrequency('YEARLY');
            rrule.setByMonth(11);
            rrule.setByDay('-1FR');
            expect(rrule.getRule()).toEqual('FREQ=YEARLY;BYDAY=-1FR;BYMONTH=11;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toEqual('-1FR');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(-1, 'Test getByDayNthWeekday().number');
            expect(rrule.getByDayNthWeekday().weekday).toEqual('FR', 'Test getByDayNthWeekday().weekday');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on the last Friday of November');
        });
        
        it ('FREQ=YEARLY;BYMONTHDAY=-1;BYMONTH=11;', function() {
            rrule.setFrequency('YEARLY');
            rrule.setByMonth(11);
            rrule.setByMonthDay(-1);
            expect(rrule.getRule()).toEqual('FREQ=YEARLY;BYMONTHDAY=-1;BYMONTH=11;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), -1);
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on the last day of November');
        });
        
        it ('FREQ=YEARLY;BYMONTH=11;COUNT=5;', function() {
            rrule.setFrequency('YEARLY');
            rrule.setByMonth(11);
            rrule.setCount(5);
            expect(rrule.getRule()).toEqual('FREQ=YEARLY;BYMONTH=11;COUNT=5;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount(), 5);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on November 27, 5 times');
        });
        
        it ('FREQ=YEARLY;BYMONTH=11;UNTIL=20121231T235959Z;', function() {
            rrule.setFrequency('YEARLY');
            rrule.setByMonth(11);
            rrule.setUntil(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getRule()).toEqual('FREQ=YEARLY;BYMONTH=11;UNTIL=20121231T235959Z;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on November 27, until Dec 31, 2012');
        });
    });
    
    
    describe('Can parse an RRULE string via setRule() with', function() {
        
        it ('FREQ=DAILY;', function() {
            rrule.setRule('FREQ=DAILY;');
            expect(rrule.getRule()).toEqual('FREQ=DAILY;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Daily');
        });
        
        it ('FREQ=DAILY;COUNT=1;', function() {
            rrule.setRule('FREQ=DAILY;COUNT=1;');
            expect(rrule.getRule()).toEqual('FREQ=DAILY;COUNT=1;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toEqual(1);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Daily, 1 time');
        });
    
        it ('FREQ=DAILY;INTERVAL=2;', function() {
            rrule.setRule('FREQ=DAILY;INTERVAL=2;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 days');
        });
    
        it ('FREQ=DAILY;INTERVAL=2;COUNT=5;', function() {
            rrule.setRule('FREQ=DAILY;INTERVAL=2;COUNT=5;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount(), 5);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 days, 5 times');
        });
        
        it ('FREQ=DAILY;INTERVAL=2;UNTIL=20121231T235959Z;', function() {
            rrule.setRule('FREQ=DAILY;INTERVAL=2;UNTIL=20121231T235959Z;');
            expect(rrule.getFrequency()).toEqual('DAILY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 days, until Dec 31, 2012');
        });
        
        it ('FREQ=WEEKLY;', function() {
            rrule.setRule('FREQ=WEEKLY;');
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Weekly on Tuesday');
        });
        
        it ('FREQ=WEEKLY;INTERVAL=2;', function() {
            rrule.setRule('FREQ=WEEKLY;INTERVAL=2;');
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tuesday');
        });
        
        it ('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,FR;', function() {
            rrule.setRule('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,FR;');
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('TU,FR');
            expect(rrule.getByDayWeekdays().length).toEqual(2);
            expect(rrule.getByDayWeekdays()[0]).toEqual('TU');
            expect(rrule.getByDayWeekdays()[1]).toEqual('FR');
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tuesday and Friday');
        });
        
        it ('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH,FR;COUNT=5;', function() {
            rrule.setRule('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH,FR;COUNT=5;');
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount(), 5);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('TU,TH,FR');
            expect(rrule.getByDayWeekdays().length).toEqual(3);
            expect(rrule.getByDayWeekdays()[0]).toEqual('TU');
            expect(rrule.getByDayWeekdays()[1]).toEqual('TH');
            expect(rrule.getByDayWeekdays()[2]).toEqual('FR');
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tue, Thu and Fri, 5 times');
        });
        
        it ('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH;UNTIL=20121231T235959Z;', function() {
            rrule.setRule('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH;UNTIL=20121231T235959Z;');
            expect(rrule.getFrequency()).toEqual('WEEKLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('TU,TH');
            expect(rrule.getByDayWeekdays().length).toEqual(2);
            expect(rrule.getByDayWeekdays()[0]).toEqual('TU');
            expect(rrule.getByDayWeekdays()[1]).toEqual('TH');
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 weeks on Tuesday and Thursday, until Dec 31, 2012');
        });
        
        it ('FREQ=MONTHLY;BYMONTHDAY=22;', function() {
            rrule.setRule('FREQ=MONTHLY;BYMONTHDAY=22;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), 22);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Monthly on day 22');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=22;', function() {
            rrule.setRule('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=22;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), 22);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on day 22');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYDAY=4TH', function() {
            rrule.setRule('FREQ=MONTHLY;INTERVAL=2;BYDAY=4TH');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('4TH');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(4);
            expect(rrule.getByDayNthWeekday().weekday).toEqual('TH');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the fourth Thursday');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYDAY=-1FR;', function() {
            rrule.setRule('FREQ=MONTHLY;INTERVAL=2;BYDAY=-1FR;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('-1FR');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(-1);
            expect(rrule.getByDayNthWeekday().weekday).toEqual('FR');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the last Friday');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=-1;', function() {
            rrule.setRule('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=-1;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), -1);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the last day');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=30;COUNT=5;', function() {
            rrule.setRule('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=30;COUNT=5;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount(), 5);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), 30);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on day 30, 5 times');
        });
        
        it ('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=30;UNTIL=20121231T235959Z;', function() {
            rrule.setRule('FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=30;UNTIL=20121231T235959Z;');
            expect(rrule.getFrequency()).toEqual('MONTHLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), 30);
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every 2 months on day 30, until Dec 31, 2012');
        });
        
        it ('FREQ=YEARLY;BYMONTH=11;', function() {
            rrule.setRule('FREQ=YEARLY;BYMONTH=11;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on November 27');
        });
        
        it ('FREQ=YEARLY;INTERVAL=2;BYMONTH=11;', function() {
            rrule.setRule('FREQ=YEARLY;INTERVAL=2;BYMONTH=11;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Every 2 years on November 27');
        });
        
        it ('FREQ=YEARLY;INTERVAL=2;BYMONTH=11;BYDAY=4TU;', function() {
            rrule.setRule('FREQ=YEARLY;INTERVAL=2;BYMONTH=11;BYDAY=4TU;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval()).toEqual(2);
            expect(rrule.getByDay()).toEqual('4TU');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(4, 'Test getByDayNthWeekday().number');
            expect(rrule.getByDayNthWeekday().weekday).toEqual('TU', 'Test getByDayNthWeekday().weekday');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Every 2 years on the fourth Tuesday of November');
        });
        
        it ('FREQ=YEARLY;BYMONTH=11;BYDAY=-1FR;', function() {
            rrule.setRule('FREQ=YEARLY;BYMONTH=11;BYDAY=-1FR;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toEqual('-1FR');
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday().number).toEqual(-1, 'Test getByDayNthWeekday().number');
            expect(rrule.getByDayNthWeekday().weekday).toEqual('FR', 'Test getByDayNthWeekday().weekday');
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on the last Friday of November');
        });
        
        it ('FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=-1;', function() {
            rrule.setRule('FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=-1;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay(), -1);
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on the last day of November');
        });
        
        it ('FREQ=YEARLY;BYMONTH=11;COUNT=5;', function() {
            rrule.setRule('FREQ=YEARLY;BYMONTH=11;COUNT=5;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount(), 5);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on November 27, 5 times');
        });
        
        it ('FREQ=YEARLY;BYMONTH=11;UNTIL=20121231T235959Z;', function() {
            rrule.setRule('FREQ=YEARLY;BYMONTH=11;UNTIL=20121231T235959Z;');
            expect(rrule.getFrequency()).toEqual('YEARLY');
            expect(rrule.getCount()).toBeFalsy();
            expect(rrule.getUntil()).toEqual(new Date(2012, 11, 31, 23, 59, 59));
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth(), 11);
            expect(rrule.getDescription(startDate)).toEqual('Yearly on November 27, until Dec 31, 2012');
        });
        
        it ('FREQ=WEEKDAYS;COUNT=10;', function() {
            rrule.setRule('FREQ=WEEKDAYS;COUNT=10;');
            expect(rrule.getFrequency()).toEqual('WEEKDAYS');
            expect(rrule.getCount()).toEqual(10);
            expect(rrule.getUntil()).toBeFalsy();
            expect(rrule.getInterval(), 1);
            expect(rrule.getByDay()).toBeFalsy();
            expect(rrule.getByDayWeekdays()).toBeFalsy();
            expect(rrule.getByDayNthWeekday()).toBeFalsy();
            expect(rrule.getByMonthDay()).toBeFalsy();
            expect(rrule.getByMonth()).toBeFalsy();
            expect(rrule.getDescription(startDate)).toEqual('Every weekday (Mon-Fri), 10 times');
        });
    });
    
    
    describe('Can update existing rules via setRule() for', function() {
        
        describe('FREQ=MONTHLY;INTERVAL=2;BYDAY=-1FR; passing', function() {
            
            it ('BYMONTHDAY=30', function() {
                rrule.setRule('FREQ=MONTHLY;INTERVAL=2;BYDAY=-1FR;');
                rrule.setRule('BYMONTHDAY=30');
                expect(rrule.getFrequency()).toEqual('MONTHLY');
                expect(rrule.getCount()).toBeFalsy();
                expect(rrule.getUntil()).toBeFalsy();
                expect(rrule.getInterval()).toEqual(2);
                expect(rrule.getByDay()).toBeFalsy();
                expect(rrule.getByDayWeekdays()).toBeFalsy();
                expect(rrule.getByDayNthWeekday()).toBeFalsy();
                expect(rrule.getByMonthDay(), 30);
                expect(rrule.getByMonth()).toBeFalsy();
                expect(rrule.getDescription(startDate)).toEqual('Every 2 months on day 30');
            });
        
            it ('BYMONTHDAY=-1', function() {
                rrule.setRule('FREQ=MONTHLY;INTERVAL=2;BYDAY=-1FR;');
                rrule.setRule('BYMONTHDAY=-1');
                expect(rrule.getFrequency()).toEqual('MONTHLY');
                expect(rrule.getCount()).toBeFalsy();
                expect(rrule.getUntil()).toBeFalsy();
                expect(rrule.getInterval()).toEqual(2);
                expect(rrule.getByDay()).toBeFalsy();
                expect(rrule.getByDayWeekdays()).toBeFalsy();
                expect(rrule.getByDayNthWeekday()).toBeFalsy();
                expect(rrule.getByMonthDay(), -1);
                expect(rrule.getByMonth()).toBeFalsy();
                expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the last day');
            });
        
            it ('BYDAY=4FR', function() {
                rrule.setRule('FREQ=MONTHLY;INTERVAL=2;BYDAY=-1FR;');
                rrule.setRule('BYDAY=4FR');
                expect(rrule.getFrequency()).toEqual('MONTHLY');
                expect(rrule.getCount()).toBeFalsy();
                expect(rrule.getUntil()).toBeFalsy();
                expect(rrule.getInterval()).toEqual(2);
                expect(rrule.getByDay()).toEqual('4FR');
                expect(rrule.getByDayWeekdays()).toBeFalsy();
                expect(rrule.getByDayNthWeekday().number).toEqual(4);
                expect(rrule.getByDayNthWeekday().weekday).toEqual('FR');
                expect(rrule.getByMonthDay()).toBeFalsy();
                expect(rrule.getByMonth()).toBeFalsy();
                expect(rrule.getDescription(startDate)).toEqual('Every 2 months on the fourth Friday');
            });
        });
        
        describe('FREQ=YEARLY;INTERVAL=2;BYMONTH=11; passing', function() {

            it ('BYMONTHDAY=-1', function() {
                rrule.setRule('FREQ=YEARLY;INTERVAL=2;BYMONTH=11;');
                rrule.setRule('BYMONTHDAY=-1');
                expect(rrule.getFrequency()).toEqual('YEARLY');
                expect(rrule.getCount()).toBeFalsy();
                expect(rrule.getUntil()).toBeFalsy();
                expect(rrule.getInterval()).toEqual(2);
                expect(rrule.getByDay()).toBeFalsy();
                expect(rrule.getByDayWeekdays()).toBeFalsy();
                expect(rrule.getByDayNthWeekday()).toBeFalsy();
                expect(rrule.getByMonthDay(), -1);
                expect(rrule.getByMonth(), 11);
                expect(rrule.getDescription(startDate)).toEqual('Every 2 years on the last day of November');
            });
        
            it ('BYDAY=-1FR', function() {
                rrule.setRule('FREQ=YEARLY;INTERVAL=2;BYMONTH=11;');
                rrule.setRule('BYDAY=-1FR');
                expect(rrule.getFrequency()).toEqual('YEARLY');
                expect(rrule.getCount()).toBeFalsy();
                expect(rrule.getUntil()).toBeFalsy();
                expect(rrule.getInterval()).toEqual(2);
                expect(rrule.getByDay()).toEqual('-1FR');
                expect(rrule.getByDayWeekdays()).toBeFalsy();
                expect(rrule.getByDayNthWeekday().number).toEqual(-1);
                expect(rrule.getByDayNthWeekday().weekday).toEqual('FR');
                expect(rrule.getByMonthDay()).toBeFalsy();
                expect(rrule.getByMonth(), 11);
                expect(rrule.getDescription(startDate)).toEqual('Every 2 years on the last Friday of November');
            });
        
            it ('BYDAY=4TH', function() {
                rrule.setRule('FREQ=YEARLY;INTERVAL=2;BYMONTH=11;');
                rrule.setRule('BYDAY=4TH');
                expect(rrule.getFrequency()).toEqual('YEARLY');
                expect(rrule.getCount()).toBeFalsy();
                expect(rrule.getUntil()).toBeFalsy();
                expect(rrule.getInterval()).toEqual(2);
                expect(rrule.getByDay()).toEqual('4TH');
                expect(rrule.getByDayWeekdays()).toBeFalsy();
                expect(rrule.getByDayNthWeekday().number).toEqual(4);
                expect(rrule.getByDayNthWeekday().weekday).toEqual('TH');
                expect(rrule.getByMonthDay()).toBeFalsy();
                expect(rrule.getByMonth(), 11);
                expect(rrule.getDescription(startDate)).toEqual('Every 2 years on the fourth Thursday of November');
            });
        });
    });
    
    
    //TODO: Error handling
    
    // describe('Handles it gracefully', function() {
//         
        // describe('When the RRULE is invalid', function() {
//             
            // it ('should handle invalid RRULE parameters', function() {
                // rrule.setRule('ABC=foo');
            // })
        // });
    // });
});