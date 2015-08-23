QUnit.test("Playlist Generation from Semantic HTML", function(assert) {
	var t1 = saplayer.makePlaylistFromDOM($("#tracklist-input-t1"));
	var t2 = saplayer.makePlaylistFromDOM($("#tracklist-input-t2"));
	var t3 = saplayer.makePlaylistFromDOM($("#tracklist-input-t3"));

    // Check that the playlists are setup correctly, and have the right starting values.
	assert.ok(t1.tracks.length == 0, "t1 tracks array should be empty");
	assert.ok(t2.tracks.length == 2, "t2 tracks array should contain two entries");
	assert.ok(t3.tracks.length == 3, "t3 tracks array should contain three entries");

    assert.ok(t1.activeTrack === false, "t1 should have no active track");
    assert.ok(t2.activeTrack === false, "t2 should have no active track");
    assert.ok(t3.activeTrack === false, "t3 should have no active track");

    // Check the track data is correct.
    var titles = ["Uno", "Dos", "Tres"];
    var extraInfo = "Some cool extra information!";
    var audioSources = ["uno.ogg", "dos.ogg", "tres.ogg"];

    var testTracks = function(tracks, tracksName) {
        tracks.forEach(function(track, index) {
            var identifier = tracksName + "." + index + ": ";
            assert.ok(track.audio.attr("src") == audioSources[index], 
                identifier + "Audio src matches (" + track.audio.attr("src") + ")");
            assert.ok(track.data.title == titles[index], 
                identifier + "Audio title matches (" + track.data.title + ")");
            assert.ok(track.data.extra === false ||
                track.data.extra.text() == extraInfo, 
                identifier + "Extra data matches (either: false or: " + extraInfo + ")");
        });
    }

    testTracks(t1.tracks, "t1");
    testTracks(t2.tracks, "t2");
    testTracks(t3.tracks, "t3");
});
