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
        this.activeTrack = false;

        // Change the active track to a new one by index.
        this.changeTrack = function(index) {
            var track = this.tracks[index];
            if(track) {
                var playing = this.isPlaying();
                this.stop();
                this.activeTrack = track;
                if(playing) {
                    this.play();
                }
                return true;
            }
            return false;
        }

        this.play = function() {
            var trackIndex = 0;
            if(arguments.length > 0) {
                trackIndex = arguments[0];
            }
            if(this.activeTrack || this.changeTrack(trackIndex)) {
                if(this.activeTrack) {
                    this.activeTrack.audio.play();
                    return true;
                }
            }
            return false;
        }

        this.currentTrackIndex = function() {
            if(this.activeTrack) {
                return this.tracks.indexOf(this.activeTrack);
            }
            return 0;
        }

        this.hasNextTrack = function() {
            return this.currentTrackIndex() + 1 < this.tracks.length;
        }

        this.hasPreviousTrack = function() {
            return this.currentTrackIndex() - 1 >= 0
        }

        this.nextTrack = function() {
            if(this.hasNextTrack()) {
                var nextTrackIndex = this.currentTrackIndex() + 1;
                this.changeTrack(nextTrackIndex);
            }
        }

        this.previousTrack = function() {
            if(this.hasPreviousTrack()) {
                var previousTrackIndex = this.currentTrackIndex() - 1;
                this.changeTrack(previousTrackIndex);
            }
        }

        this.pause = function() {
            if(this.activeTrack) {
                this.activeTrack.audio.pause();
                return true;
            }
            return false;
        }

        this.stop = function() {
            if(this.activeTrack) {
                this.activeTrack.audio.load();
                this.activeTrack = false;
                return true;
            }
            return false;
        }

        this.isPlaying = function() {
            if(this.activeTrack) {
                return !this.activeTrack.paused;
            }
            return false;
        }

        this.seek = function(newSeconds) {
            if(this.activeTrack) {
                this.activeTrack.audio.currentTime = newSeconds;
                return true;
            }
            return false;
        }

        this.seekAhead = function(seconds) {
            if(this.activeTrack) {
                this.activeTrack.audio.currentTime += seconds;
                return true;
            }
            return false;
        }

        this.seekBack = function(seconds) {
            return this.seekAhead(-seconds);
        }

        // Return the current time as a double between 0 and 1.
        this.currentTime  = function() {
            if(this.activeTrack) {
                return this.activeTrack.audio.currentTime / this.activeTrack.audio.duration;
            }
            return 0.00;
        }

        this.trackLength = function() {
            var trackIndex = false;
            if(arguments.length > 0) {
                trackIndex = arguments[0];
            }
            if(!trackIndex && this.activeTrack) {
                return this.activeTrack.audio.duration;
            } else if (trackIndex) {
                return this.tracks[trackIndex].get(0).audio.duration;
            }
            return 0;
        }

        // Set up a statechange event to be triggered on a given element
        // whenever the state of the active track changes.
        this.stateWatcher = function(elem, callback, events) {
            function addWatcher(eventName, track) {
                $(track.audio).on(eventName, function(evt) {
                    $(elem).trigger("statechange", eventName);
                });
            }

            if(events === undefined) {
                events = ["play", "pause", "ended", "abort"];
            }

            $(this.tracks).each(function(index) {
                var track = this;
                $(events).each(function(index) {
                    addWatcher(this.toString(), track);
                })
            });

            if(callback !== undefined) {
                $(elem).on("statechange", callback);
            }
        }
	}
	
	var makePlaylistFromDOM = function(dom) {
        var tracks = [];
        $(dom).find("li").each(function(index) {
            var audio = $(this).find("audio.sap-playlist-track-audio").first().get(0);
            var title = $(this).find("span.sap-playlist-track-title").text();
            var extra = $(this).find("div.sap-playlist-track-frame").first();
            if(extra.length > 0) {
                extra = extra.clone();
            }
            else {
                extra = false;
            }
            tracks.push(new Track(audio, {title:title, extra:extra}));
        });
		return new Playlist(tracks);
	}

    // Create, setup, and return the DOM for the SAP Player controls.
    //
    // buttons: An array which will determine the order of and types of
    // controls on the player. Values allowed in array: play, pause, stop, next, prev
    var sapPlayer = function(playlist, buttons) {
        if(buttons === undefined) {
            buttons = ["play", "pause", "stop", "prev", "next"];
        }
        var root = $($.parseHTML('<div class="sap-controls"></div>')[0]);
        var buttonToIcon = {play:"fa-play", pause:"fa-pause", stop:"fa-stop", 
            next:"fa-step-forward", prev:"fa-step-backward"};

        var buttonEvents = {
            play:function() 
            {
                console.debug("play");
                playlist.play();
            }, 
            pause:function() 
            {
                console.debug("pause");
                playlist.pause();
            },
            stop:function() 
            {
                console.debug("stop");
                playlist.stop();
            },
            next:function() 
            {
                console.debug("next");
                playlist.nextTrack();
            },
            prev:function() 
            {
                console.debug("prev");
                playlist.previousTrack();
            }
        };


        $.each(buttons, function(index) {
            var button = $($.parseHTML('<button type="button" class="sap-control sap-' 
                    + this + '"><i class="fa ' + 
                    buttonToIcon[this] + '"></i></button>'));
            button.click(buttonEvents[this]);
            root.append(button);
        });

        playlist.stateWatcher(root, function(evt, stateChange) {
            console.debug("statechange: " + stateChange);
            // TODO: Would be better to change this to do state changes using CSS classes and styling.
            if(stateChange == "play") {
                $(root).find("button.sap-play").attr("disabled", true);
                $(root).find("button.sap-pause").removeAttr("disabled");
                $(root).find("button.sap-stop").removeAttr("disabled");
            }
            else if(stateChange == "pause" || stateChange == "abort" || stateChange == "ended") {
                $(root).find("button.sap-pause").attr("disabled", true);
                $(root).find("button.sap-play").removeAttr("disabled");
            }
            if (stateChange == "abort" || stateChange == "ended") {
                $(root).find("button.sap-stop").attr("disabled", true);
            }

            // Not a fan of this, it's inefficient and relies on a side effect
            // of stateWatcher execution rather than an explicit code path for
            // performing this update.
            if(!playlist.hasNextTrack()) {
                $(root).find("button.sap-next").attr("disabled", true);
            } else {
                $(root).find("button.sap-next").removeAttr("disabled");
            }

            if(!playlist.hasPreviousTrack()) {
                $(root).find("button.sap-prev").attr("disabled", true);
            } else {
                $(root).find("button.sap-prev").removeAttr("disabled");
            }
        });
        $(root).trigger("statechange", "ended");

        return root;
    }

    // Create, setup, and return the DOM for the SAP Scrubber controls.
    var sapScrubber = function(playlist) {
        var root = $($.parseHTML('<div class="sap-audio-scrubber-chrome">' + 
                    '<div class="sap-audio-scrubber sap-audio-scrubber-current"></div>' + 
                    '<div class="sap-audio-scrubber sap-audio-scrubber-total"></div></div>'));

        playlist.stateWatcher(root, function(evt, stateChange) {
            var timePassed = playlist.currentTime();
            root.find(".sap-audio-scrubber-current").css("transform", 
                "scaleX(" + timePassed.toString() + ")");
        }, ["play", "pause", "ended", "abort", "durationchange", "timeupdate"]);

        root.click(function(evt) {
            console.debug("click: " + evt.offsetX + ',' + evt.offsetY);
            var seekRatio = evt.offsetX / root.width();
            if(!playlist.isPlaying()) {
                playlist.play();
            }
            var newTime = Math.floor(seekRatio * playlist.trackLength());
            playlist.seek(newTime);
        });

        root.trigger("statechange", "ended");

        return root;
    }

	return {
		makePlaylistFromDOM:makePlaylistFromDOM,
        sapPlayer:sapPlayer,
        sapScrubber:sapScrubber
	};
})();

(function($) {
	$.fn.saplayer = function() {
		// TODO
		return this;
	}
})(jQuery);
