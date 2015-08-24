QUnit.test("SAP Player Tests", function(assert) {
	var t1 = saplayer.makePlaylistFromDOM($("#tracklist-input-t1"));
	var t2 = saplayer.makePlaylistFromDOM($("#tracklist-input-t2"));
	var t3 = saplayer.makePlaylistFromDOM($("#tracklist-input-t3"));

    var t1_dom = saplayer.sapPlayer(t1);
    var t2_dom = saplayer.sapPlayer(t2, ["play", "pause"]);
    var t3_dom = saplayer.sapPlayer(t3, ["pause", "next", "play"]);

    assert.ok(t1_dom.hasClass("sap-controls"), "Returned object should have class 'sap-controls'");
    assert.ok(t2_dom.hasClass("sap-controls"), "Returned object should have class 'sap-controls'");
    assert.ok(t3_dom.hasClass("sap-controls"), "Returned object should have class 'sap-controls'");

    // TODO Test for each expected element
    
    // TODO Trigger events on each element and check that changes reflected in Playlist (where possible)
    //      ^ May have to add DOM objects to document for events to work, not sure.
});
