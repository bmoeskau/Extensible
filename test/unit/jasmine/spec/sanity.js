Ext.Loader.setConfig({
    enabled: true,
    paths: {
        "Extensible": "../../src"
    }
});

describe('Unit test sanity checks', function() {

    it('should load lib dependencies', function() {
        expect(Ext).toBeDefined();
        expect(Extensible).toBeDefined();
    });
    
    it('should be using Ext version 4.0.1+', function() {
        expect(Ext.getVersion().isGreaterThan('4.0.1')).toBe(true);
    })

});