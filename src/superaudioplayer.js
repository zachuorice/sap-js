/*
The MIT License (MIT)

Copyright (c) 2015 Zachary Richey <zr.public@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
var saplayer = (function() {
	// A single track of audio, and associated data.
	var Track = function(audio, data) {
		this.audio = audio;
		this.data = data;
	}

	// Manages playback of a group of HTML5 audio objects.
	var Playlist = function(tracks) {
		this.tracks = tracks;
        this.active_track = false;

        this.Play = function() {
            track_index = 0;
            if(arguments.length > 0) {
                track_index = arguments[0];
            }
            // NOTE: Don't type check the track_index, simply rely/handle invalid tracks[index].
            return false;
        }

        this.Pause = function() {
            return false;
        }

        this.IsPlaying = function() {
            return false;
        }

        this.Seek = function(new_position) {
            return false;
        }

        this.SeekAhead = function(steps) {
            return false;
        }

        this.SeekBack = function(steps) {
            return this.seekAhead(-steps);
        }

        this.TrackLength = function() {
            return 0;
        }
	}
	
	var make_playlist_from_dom = function(dom) {
		return new Playlist([]);
	}

	return {
		MakePlaylistFromDOM:make_playlist
	};
})();

(function($) {
	$.fn.saplayer = function() {
		// TODO
		return this;
	}
})(jQuery);
