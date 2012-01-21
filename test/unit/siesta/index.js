var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title: 'Extensible Test Suite',
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
    group: 'Visual',
    items: [
        'visual/calendar.js'
    ]
});