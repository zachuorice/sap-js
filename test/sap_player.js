QUnit.test("SAP Player Tests", function(assert) {
	var t1 = saplayer.makePlaylistFromDOM($("#tracklist-input-t1"));
	var t2 = saplayer.makePlaylistFromDOM($("#tracklist-input-t2"));
	var t3 = saplayer.makePlaylistFromDOM($("#tracklist-input-t3"));

    var t1_dom = saplayer.sapPlayer(t1);
    var t2_dom = saplayer.sapPlayer(t2, ["play", "pause"]);
    var t3_dom = saplayer.sapPlayer(t3, ["pause", "next", "play"]);

    var t1_dom_timer = saplayer.sapScrubber(t1);
    var t2_dom_timer = saplayer.sapScrubber(t2);
    var t3_dom_timer = saplayer.sapScrubber(t3);

    var t1_dom_list = saplayer.sapTrackList(t1);
    var t2_dom_list = saplayer.sapTrackList(t2);
    var t3_dom_list = saplayer.sapTrackList(t3);

    assert.ok(t1_dom.hasClass("sap-controls-chrome"), "Returned object should have class 'sap-controls-chrome'");
    assert.ok(t2_dom.hasClass("sap-controls-chrome"), "Returned object should have class 'sap-controls-chrome'");
    assert.ok(t3_dom.hasClass("sap-controls-chrome"), "Returned object should have class 'sap-controls-chrome'");

    assert.ok(t1_dom.find(".sap-play,.sap-pause,.sap-stop,.sap-next,.sap-prev").length == 5, 
        "t1: All five controls should be present");
    assert.ok(t1_dom.find(".sap-play,.sap-pause").length == 2, 
        "t2: Two controls should be present");
    assert.ok(t1_dom.find(".sap-pause,.sap-next,.sap-play").length == 3, 
       "t3: Three controls should be present");   

    $(".player-box").append($("<div>").append(t1_dom_timer).append(t1_dom).append(t1_dom_list));
    $(".player-box").append($("<div>").append(t2_dom_timer).append(t2_dom).append(t2_dom_list));
    $(".player-box").append($("<div>").append(t3_dom_timer).append(t3_dom).append(t3_dom_list));

});
