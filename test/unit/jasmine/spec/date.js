describe("Extensible.Date", function() {
    Ext.Loader.setConfig({
        enabled: true,
        disableCaching: false,
        paths: {
            'Extensible': '../../../src'
        }
    });
    
    var ExteDate = Extensible.Date;
    
    var toMillis = function(options) {
        var millis = options.millis || 0;
        
        if (options.secs) millis += (options.secs * 1000);
        if (options.mins) millis += (options.mins * 1000 * 60);
        if (options.hrs)  millis += (options.hrs  * 1000 * 60 * 60);
        if (options.days) millis += (options.days * 1000 * 60 * 60 * 24);
        
        return millis;
    };
    // hour = 3600000
    // day = 86400000
    
    describe('Date.diff() with', function() {
        
        it ('basic dates, start < end', function() {
            var start = new Date('2013-01-15T00:00:00-0600'),
                end   = new Date('2013-01-16T00:00:00-0600'),
                diff  = ExteDate.diff(start, end);
            
            expect(diff).toEqual(toMillis({ days: 1 }));
        });
        
        it ('basic dates, start > end', function() {
            var start = new Date('2013-01-16T00:00:00-0600'),
                end   = new Date('2013-01-15T00:00:00-0600'),
                diff  = ExteDate.diff(start, end);
            
            expect(diff).toEqual(toMillis({ days: -1 }));
        });
        
        it ('basic dates + times', function() {
            var start = new Date('2013-01-15T01:00:00-0600'),
                end   = new Date('2013-01-16T02:15:00-0600'),
                diff  = ExteDate.diff(start, end);
            
            expect(diff).toEqual(toMillis({ days: 1, mins: 75 }));
        });
        
        it ('spanning dates + times', function() {
            var start = new Date('2013-01-15T01:00:00-0600'),
                end   = new Date('2013-01-20T10:15:00-0600'),
                diff  = ExteDate.diff(start, end);
            
            expect(diff).toEqual(toMillis({ days: 5, hrs: 9, mins: 15 }));
        });
        
        it ('spanning dates + times, passing "seconds" as the unit', function() {
            var start  = new Date('2013-01-15T01:00:00-0600'),
                end    = new Date('2013-01-20T10:15:00-0600'),
                diff   = ExteDate.diff(start, end, 'seconds'),
                millis = toMillis({ days: 5, hrs: 9, mins: 15 });
            
            expect(diff).toEqual(Math.round(millis / 1000));
        });
        
        it ('spanning dates + times, passing "minutes" as the unit', function() {
            var start  = new Date('2013-01-15T01:00:00-0600'),
                end    = new Date('2013-01-20T10:15:00-0600'),
                diff   = ExteDate.diff(start, end, 'minutes'),
                millis = toMillis({ days: 5, hrs: 9, mins: 15 });
            
            expect(diff).toEqual(Math.round(millis / (1000 * 60)));
        });
        
        it ('spanning dates + times, passing "hours" as the unit', function() {
            var start  = new Date('2013-01-15T01:00:00-0600'),
                end    = new Date('2013-01-20T10:15:00-0600'),
                diff   = ExteDate.diff(start, end, 'hours'),
                millis = toMillis({ days: 5, hrs: 9, mins: 15 });
            
            expect(diff).toEqual(Math.round(millis / (1000 * 60 * 60)));
        });
        
        it ('DST sanity checks', function() {
            expect(new Date('2013-03-10T02:00:00-0600')).toEqual(new Date('2013-03-10T03:00:00-0500'));
            expect(new Date('2013-11-03T02:00:00-0500')).toEqual(new Date('2013-11-03T01:00:00-0600'));
        });
        
        it ('spanning spring DST boundary (US)', function() {
            // On March 10, 2013 at 2am US Central standard time (CST), skip forward to 3am CDT
            var start = new Date('2013-03-10T01:00:00-0600'),
                end   = new Date('2013-03-10T03:00:00-0500'),
                diff  = ExteDate.diff(start, end);
            
            // 2 hours, minus the 1 skipped hour
            expect(diff).toEqual(toMillis({ hrs: 1 }));
        });
        
        it ('spanning fall DST boundary (US)', function() {
            // On Nov 3, 2013 at 2am US Central Daylight time (CDT), fall back to 1am CST and repeat 2am
            var start = new Date('2013-11-03T01:00:00-0500'),
                end   = new Date('2013-11-03T03:00:00-0600'),
                diff  = ExteDate.diff(start, end);
            
            // 2 hours, plus the 1 added hour
            expect(diff).toEqual(toMillis({ hrs: 3 }));
        });
        
        it ('spanning fall DST boundary (US), passing "hours" as the unit', function() {
            // On Nov 3, 2013 at 2am US Central Daylight time (CDT), fall back to 1am CST and repeat 2am
            var start = new Date('2013-11-03T01:00:00-0500'),
                end   = new Date('2013-11-03T03:00:00-0600'),
                diff  = ExteDate.diff(start, end, 'hours');
            
            // 2 hours, plus the 1 added hour
            expect(diff).toEqual(3);
        });
    });
    
    /**
     * Note that these tests are only guaranteed to work when executed in the same
     * system timezone as specified in the test dates. Day boundaries change with
     * changes in timezone for the same dates.
     */
    describe('Date.diffDays()', function() {
        
        var tzOffsetStandard = '-0600',
            tzOffsetDst = '-0500';
        
        it ('for the same dates', function() {
            var start = new Date('2013-01-15T01:00:00' + tzOffsetStandard),
                end   = new Date('2013-01-15T22:00:00' + tzOffsetStandard),
                diff  = ExteDate.diffDays(start, end);
            
            expect(diff).toEqual(0);
        });
        
        it ('across 2 calendar days', function() {
            var start = new Date('2013-01-15T01:00:00' + tzOffsetStandard),
                end   = new Date('2013-01-16T02:15:00' + tzOffsetStandard),
                diff  = ExteDate.diffDays(start, end);
            
            expect(diff).toEqual(1);
        });
        
        it ('across 3 calendar days (near boundaries)', function() {
            var start = new Date('2013-01-15T23:00:00' + tzOffsetStandard),
                end   = new Date('2013-01-17T01:00:00' + tzOffsetStandard),
                diff  = ExteDate.diffDays(start, end);
            
            expect(diff).toEqual(2);
        });
        
        it ('across multiple weeks + month boundary', function() {
            var start = new Date('2013-01-15T10:00:00' + tzOffsetStandard),
                end   = new Date('2013-02-10T10:00:00' + tzOffsetStandard),
                diff  = ExteDate.diffDays(start, end);
            
            expect(diff).toEqual(26);
        });
        
        it ('spanning spring DST boundary (US)', function() {
            var start = new Date('2013-03-09T01:00:00' + tzOffsetStandard),
                end   = new Date('2013-03-11T01:00:00' + tzOffsetDst),
                diff  = ExteDate.diffDays(start, end);
            
            expect(diff).toEqual(2);
        });
        
        it ('spanning spring DST boundary (US) for a few hours only', function() {
            var start = new Date('2013-03-10T00:00:00' + tzOffsetStandard),
                end   = new Date('2013-03-10T03:00:00' + tzOffsetDst),
                diff  = ExteDate.diffDays(start, end);
            
            expect(diff).toEqual(0);
        });
        
        it ('spanning fall DST boundary (US)', function() {
            var start = new Date('2013-11-02T01:00:00' + tzOffsetDst),
                end   = new Date('2013-11-04T01:00:00' + tzOffsetStandard),
                diff  = ExteDate.diffDays(start, end);
            
            expect(diff).toEqual(2);
        });
    });
    
    describe('Date.copyTime()', function() {
        
        it('returns a new Date instance', function() {
            var source = new Date('2013-01-15T12:00:00-0600'),
                target = new Date('2013-01-20T12:00:00-0600');
                copy   = ExteDate.copyTime(source, target);
            
            expect(target === copy).not.toBe(true); // different instances
            expect(target.getTime() === copy.getTime()).toBe(true); // same values
        });
        
        it('copies the time only without altering the date', function() {
            var source = new Date('2013-01-15T12:00:00-0600'),
                target = new Date('2012-02-20T14:15:30-0600');
                copy   = ExteDate.copyTime(source, target);
            
            // The copy should still have target's date values
            expect(copy.getFullYear()).toEqual(target.getFullYear());
            expect(copy.getMonth()).toEqual(target.getMonth());
            expect(copy.getDate()).toEqual(target.getDate());
            
            // The copy should now have source's time values
            expect(copy.getHours()).toEqual(source.getHours());
            expect(copy.getMinutes()).toEqual(source.getMinutes());
            expect(copy.getSeconds()).toEqual(source.getSeconds());
            expect(copy.getMilliseconds()).toEqual(source.getMilliseconds());
        });
        
    });
});