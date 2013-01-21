var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title: 'Extensible Test Suite',
    
    // important to avoid issues with Ext's TaskManager, used by the calendar:
    overrideSetTimeout: false,
    
    autoCheckGlobals: true,
    expectedGlobals: ['Ext', 'Extensible'],
    
    preload: [
        '../../../../ext-current/resources/css/ext-all.css',
        '../../../resources/css/extensible-all.css',
        '../../../../ext-current/ext-all-debug.js',
        
        // Extensible main class, required when loading via Ext.Loader
        '../../../src/Extensible.js'
    ]
});

Harness.start({
    group: 'Core',
    items: [
        'core/_sanity.js'
    ]
},{
    group: 'Calendar',
    items: [
        'calendar/basic.js',
        'calendar/read-only.js',
        'calendar/list.js',
        'calendar/recurrence-basic.js'
    ]
});