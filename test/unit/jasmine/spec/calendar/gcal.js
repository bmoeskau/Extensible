Ext.Loader.setConfig({
    enabled: true,
    //disableCaching: false,
    paths: {
        "Extensible": "../../../src"
    }
});
Ext.require([
    'Ext.data.*',
    'Extensible.calendar.plugins.gcal.model.Event',
    'Extensible.calendar.plugins.gcal.model.EventList'
]);

describe('Google Calendar', function() {

    it('should load lib dependencies', function() {
        expect(Ext).toBeDefined();
        expect(Extensible).toBeDefined();
    });
    
    var eventListStore;
    
    beforeEach(function() {
        // Google calendar data subsetted from:
        // https://www.googleapis.com/calendar/v3/calendars/en.usa%23holiday%40group.v.calendar.google.com/events?key=AIzaSyB3JoleKFzjEQricJrXimhoHwkhLnbdSlg
        eventListStore = Ext.create('Ext.data.Store', {
            model: 'Extensible.calendar.plugins.gcal.model.EventList',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            },
            data: {
                "kind": "calendar#events",
                "etag": "\"y3Ec45PWr056tgI9oyp5WeT3BzE/dkz46gqYADdLgpILogSl5GyLygc\"",
                "summary": "US Holidays",
                "description": "US Holidays",
                "updated": "2012-08-14T02:04:12.000Z",
                "timeZone": "UTC",
                "accessRole": "reader",
                "items": [{
                    "kind": "calendar#event",
                    "etag": "\"y3Ec45PWr056tgI9oyp5WeT3BzE/Q09ENl9wYVNKeEVBQUFBQUFBQUFBQT09\"",
                    "id": "h@00fc4431adb8e05371ee936f9e2e11aa73fc2817",
                    "status": "confirmed",
                    "htmlLink": "https://www.google.com/calendar/event?eid=aEAwMGZjNDQzMWFkYjhlMDUzNzFlZTkzNmY5ZTJlMTFhYTczZmMyODE3IGVuLnVzYSNob2xpZGF5QHY",
                    "created": "2012-08-14T02:04:12.000Z",
                    "updated": "2012-08-14T02:04:12.000Z",
                    "summary": "Daylight Saving Time Ends",
                    "creator": {
                        "email": "en.usa#holiday@group.v.calendar.google.com",
                        "displayName": "US Holidays",
                        "self": true
                    },
                    "organizer": {
                        "email": "en.usa#holiday@group.v.calendar.google.com",
                        "displayName": "US Holidays",
                        "self": true
                    },
                    "start": {
                        "date": "2011-11-06"
                    },
                    "end": {
                        "date": "2011-11-07"
                    },
                    "visibility": "public",
                    "iCalUID": "h@00fc4431adb8e05371ee936f9e2e11aa73fc2817@google.com",
                    "sequence": 1
                },{
                    "kind": "calendar#event",
                    "etag": "\"y3Ec45PWr056tgI9oyp5WeT3BzE/Q09ENl9wYVNKeEVBQUFBQUFBQUFBQT09\"",
                    "id": "h@01739835458ad3fe022d906374a9419269cf4a76",
                    "status": "confirmed",
                    "htmlLink": "https://www.google.com/calendar/event?eid=aEAwMTczOTgzNTQ1OGFkM2ZlMDIyZDkwNjM3NGE5NDE5MjY5Y2Y0YTc2IGVuLnVzYSNob2xpZGF5QHY",
                    "created": "2012-08-14T02:04:12.000Z",
                    "updated": "2012-08-14T02:04:12.000Z",
                    "summary": "Patriot Day",
                    "creator": {
                        "email": "en.usa#holiday@group.v.calendar.google.com",
                        "displayName": "US Holidays",
                        "self": true
                    },
                    "organizer": {
                        "email": "en.usa#holiday@group.v.calendar.google.com",
                        "displayName": "US Holidays",
                        "self": true
                    },
                    "start": {
                        "date": "2012-09-11"
                    },
                    "end": {
                        "date": "2012-09-12"
                    },
                    "visibility": "public",
                    "iCalUID": "h@01739835458ad3fe022d906374a9419269cf4a76@google.com",
                    "sequence": 1
                }]
             }
        });
    });
    
    it('should load EventList record header', function() {
        expect(eventListStore.getCount()).toEqual(1);
        
        var eventList = eventListStore.data.items[0].data;
        
        expect(eventList.kind).toEqual('calendar#events');
        expect(eventList.etag).toEqual('\"y3Ec45PWr056tgI9oyp5WeT3BzE/dkz46gqYADdLgpILogSl5GyLygc\"');
        expect(eventList.summary).toEqual('US Holidays');
        expect(eventList.description).toEqual('US Holidays');
        expect(eventList.updated).toEqual('2012-08-14T02:04:12.000Z');
        expect(eventList.timeZone).toEqual('UTC');
        expect(eventList.accessRole).toEqual('reader');
    });
    
    it('should load EventList child event records', function() {
        debugger;
        var eventList = eventListStore.data.items[0].data,
            eventStore = eventList.events(),
            firstEvent = eventStore.data.items[0];
        
        expect(events.getCount()).toEqual(2);
        expect(firstEvent.kind).toEqual('calendar#event');
        
    });

});