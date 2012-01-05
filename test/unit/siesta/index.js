var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title: 'Extensible Test Suite',
    preload: [
        '../../../../extjs/resources/css/ext-all.css',
        '../../../resources/css/extensible-all.css',
        '../../../../extjs/ext-all-debug.js',
        
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