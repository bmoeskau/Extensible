Ext.define('Extensible.example', {
    statics: {
        msg: function(title, format){
            if(!this.msgCt){
                this.msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            this.msgCt.alignTo(document, 't-t');
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.core.DomHelper.append(this.msgCt, {html:'<div class="msg"><h3>' + title + '</h3><p>' + s + '</p></div>'}, true);
        
            m.slideIn('t').pause(3000).ghost('t', {remove:true});
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
    //Extensible.example.insertExamplesMenuLink();
    //Extensible.example.insertViewSourceLink();
});