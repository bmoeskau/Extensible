Ext.Loader.setConfig({
    enabled: true,
    paths: {
        "Extensible": "../../../src"
    }
});
Ext.require([
    'Ext.Date',
    'Extensible.Date'
]);

describe('Extensible.Date', function() {
    var ED = Extensible.Date,
        dt = function(s) {
            return new Date(s);
        };
    
    describe('.today()', function() {
        it('should return the current date', function() {
            expect(ED.today()).toEqual(Ext.Date.clearTime(new Date()));
        })
    });
    
    describe('.isToday()', function() {
        var today = Ext.Date.clearTime(new Date());
        
        it('should return true for the current date', function() {
            expect(ED.today()).toEqual(today);
        });
        it('should return false for a different date', function() {
            expect(ED.today()).not.toEqual(dt('1/1/12'));
        });
    });
    
    describe('.diffDays()', function() {
        it('should return 0 for the same dates', function() {
            expect(ED.diffDays(dt('5/1/12'), dt('5/1/12'))).toBe(0);
        });
        it('should return 1 for adjacent dates', function() {
            expect(ED.diffDays(dt('5/1/12'), dt('5/2/12'))).toBe(1);
        });
        it('should return 10 for 5/1/12 and 5/11/12', function() {
            expect(ED.diffDays(dt('5/1/12'), dt('5/11/12'))).toBe(10);
        });
        it('should return 1 for adjacent dates with time values', function() {
            expect(ED.diffDays(dt('5/1/12 10:00:00'), dt('5/2/12 23:00:00'))).toBe(1);
        });
        it('should return 2 for 5/1/12-11pm and 5/3/12-1am', function() {
            expect(ED.diffDays(dt('5/1/12 23:00:00'), dt('5/3/12 1:00:00'))).toBe(2);
        });
        it('should return 2 for 4/30/12 and 5/2/12', function() {
            expect(ED.diffDays(dt('4/30/12'), dt('5/2/12'))).toBe(2);
        });
    });
    
    describe('.isWeekend()', function() {
        it('should return false for 9/28/12', function() {
            expect(ED.isWeekend(dt('9/28/12'))).toBe(false);
        });
        it('should return true for 9/29/12', function() {
            expect(ED.isWeekend(dt('9/29/12'))).toBe(true);
        });
        it('should return true for 9/30/12', function() {
            expect(ED.isWeekend(dt('9/30/12'))).toBe(true);
        });
        it('should return true for 9/30/12-11:59pm', function() {
            expect(ED.isWeekend(dt('9/30/12 23:59:59'))).toBe(true);
        });
        it('should return false for 10/1/12', function() {
            expect(ED.isWeekend(dt('10/1/12'))).toBe(false);
        });
    });
    
    describe('.isWeekday()', function() {
        it('should return true for 9/28/12', function() {
            expect(ED.isWeekday(dt('9/28/12'))).toBe(true);
        });
        it('should return false for 9/29/12', function() {
            expect(ED.isWeekday(dt('9/29/12'))).toBe(false);
        });
        it('should return false for 9/30/12', function() {
            expect(ED.isWeekday(dt('9/30/12'))).toBe(false);
        });
        it('should return true for 10/1/12', function() {
            expect(ED.isWeekday(dt('10/1/12'))).toBe(true);
        });
    });
    
    describe('.isMidnight()', function() {
        it('should return true for 9/1/12 (no time)', function() {
            expect(ED.isMidnight(dt('9/1/12'))).toBe(true);
        });
        it('should return true for 9/1/12-12:00am', function() {
            expect(ED.isMidnight(dt('9/1/12 00:00:00'))).toBe(true);
        });
        it('should return false for 9/1/12-12:01am', function() {
            expect(ED.isMidnight(dt('9/1/12 00:01:00'))).toBe(false);
        });
    })
});