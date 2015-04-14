Ext.define('Extensible.example', {
    statics: {
        msg: function(title, format){
            if(!this.msgCt){
                this.msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            this.msgCt.alignTo(document, 't-t');
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.core.DomHelper.append(this.msgCt, {html:'<div class="msg"><h3>' + title + '</h3><p>' + s + '</p></div>'}, true);

            m.slideIn('t').ghost('t', {remove:true, duration: 3000});
        },
        
        insertExamplesMenuLink: function() {
            var sampleCt = Ext.get('sample-overview');
            if (sampleCt) {
                Ext.DomHelper.insertFirst(sampleCt, {
                    tag: 'a',
                    href: '../../',
                    html: 'Back to Examples Menu'
                });
            }
        },
        
        insertViewSourceLink: function() {
            var sampleCt = Ext.get('sample-overview');
            if (sampleCt) {
                Ext.DomHelper.append(sampleCt, {
                    tag: 'p',
                    cls: 'view-src',
                    children: [{
                        tag: 'a',
                        href: 'remote.js',
                        target: '_blank',
                        html: 'View the source'
                    }]
                });
            }
        }
    }
});

Ext.onReady(function() {
    // Basic sanity check that Extensible is loaded properly
    if (!Extensible.log) {
        var msg = 'The Extensible class is not available. This means that you ' +
                  'either need to build the project first (see the included README ' +
                  'file) or you should download the pre-built files from the <a ' +
                  'href="http://ext.ensible.com/products/" target="_blank">Extensible website</a>.';
        
        Ext.Msg.show({
            title: 'Extensible Not Ready',
            msg: msg,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.ERROR,
            maxWidth: 400
        });
    }
});