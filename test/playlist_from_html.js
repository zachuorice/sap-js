QUnit.test("Playlist Generation from Semantic HTML", function(assert) {
	var t1 = saplayer.MakePlaylistFromDOM($("#tracklist-input-t1"));
	var t2 = saplayer.MakePlaylistFromDOM($("#tracklist-input-t2"));
	var t3 = saplayer.MakePlaylistFromDOM($("#tracklist-input-t3"));

    // Check that the playlists are setup correctly, and have the right starting values.
	assert.ok(t1.tracks.length == 0, "t1 tracks array should be empty");
	assert.ok(t2.tracks.length == 2, "t2 tracks array should contain two entries");
	assert.ok(t3.tracks.length == 3, "t3 tracks array should contain three entries");

    assert.ok(t1.active_track === false, "t1 should have no active track");
    assert.ok(t2.active_track === false, "t2 should have no active track");
    assert.ok(t3.active_track === false, "t3 should have no active track");

    // Test Play().
    assert.ok(t1.Play() === false, "t1.Play(): Returns false on no track to play");
    assert.ok(t1.active_track === false, "t1.Play(): Shouldn't change active_track");
    assert.ok(t2.Play(), "t2.Play(): Returns true with track to play");
    assert.ok(t2.active_track === t2.tracks[0], "t2.Play(): Should set active track to first");
    assert.ok(t3.Play(1), "t3.Play(1): Returns true with valid track index given");
    assert.ok(t3.active_track === t3.tracks[1], "t3.Play(1): Should set active track to second");
});
