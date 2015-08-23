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

    // Check the track data is correct.
    var titles = ["Uno", "Dos", "Tres"];
    var extra_info = [false, "Some cool extra information!", false];
    var audio_sources = ["uno.ogg", "dos.ogg", "tres.ogg"];

    var test_tracks = function(tracks, tracks_name) {
        tracks.forEach(function(track, index) {
            var identifier = tracks_name + "." + index + ": ";
            assert.ok(track.audio.src == audio_sources[index], identifier + "Audio src matches");
            assert.ok(track.data.title == titles[index], identifier + "Audio title matches");
            assert.ok(!track.data.extra || 
                track.data.extra.text() == extra_info[index], 
                identifier + "Extra data matches");
        });
    }

    test_tracks(t1.tracks, "t1");
    test_tracks(t2.tracks, "t2");
    test_tracks(t3.tracks, "t3");
});
