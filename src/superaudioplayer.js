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
                this.reset();
                this.activeTrack = track;
                $(this.activeTrack.audio).trigger("trackChange");
                return true;
            }
            return false;
        }

        // Start playback of current track, or first track if no track selected.
        this.play = function() {
            if(this.activeTrack || this.changeTrack(0)) {
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
            return this.currentTrackIndex() + 1 < this.tracks.length || 
                (this.currentTrackIndex() == 0 && !this.activeTrack);
        }

        this.hasPreviousTrack = function() {
            return this.currentTrackIndex() - 1 >= 0
        }

        this.nextTrack = function() {
            if(this.hasNextTrack()) {
                if(this.currentTrackIndex() == 0 && !this.activeTrack) {
                    return this.changeTrack(0);
                }
                var nextTrackIndex = this.currentTrackIndex() + 1;
                this.changeTrack(nextTrackIndex);
            }
            return false;
        }

        this.previousTrack = function() {
            if(this.hasPreviousTrack()) {
                var previousTrackIndex = this.currentTrackIndex() - 1;
                return this.changeTrack(previousTrackIndex);
            }
            return false;
        }

        // Pause playback.
        this.pause = function() {
            if(this.activeTrack) {
                this.activeTrack.audio.pause();
                return true;
            }
            return false;
        }

        // Reset the active track to the start and pause it.
        this.reset = function() {
            if(this.activeTrack) {
                this.pause();
                this.activeTrack.audio.currentTime = 0;
                return true;
            }
            return false;
        }

        // Stop playback and clear the active track.
        this.stop = function() {
            if(this.activeTrack) {
                this.reset();
                var old_audio = this.activeTrack.audio;
                this.activeTrack = false;
                $(old_audio).trigger("stop");
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
                events = ["play", "pause", "ended", "stop"];
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
    var sapPlayer = function(playlist, buttons, buttonView) {
        if(buttons === undefined) {
            buttons = ["play", "pause", "stop", "prev", "next"];
        }

        if(buttonView === undefined) {
            buttonView = function(playlist, buttons, events) {
                var root = $($.parseHTML('<div class="sap-controls"></div>')[0]);
                var buttonToIcon = {play:"fa-play", pause:"fa-pause", stop:"fa-stop", 
                    next:"fa-step-forward", prev:"fa-step-backward"};
                $.each(buttons, function(index) {
                    var button = $($.parseHTML('<button type="button" class="sap-control sap-' 
                            + this + '"><i class="fa ' + 
                            buttonToIcon[this] + '"></i></button>'));
                    button.click(buttonEvents[this]);
                    root.append(button);
                });

                playlist.stateWatcher(root, function(evt, stateChange) {
                    console.debug("statechange: " + stateChange);

                    if(stateChange == "play") {
                        $(root).find("button.sap-play").prop("disabled", true);
                        $(root).find("button.sap-pause").prop("disabled", false);
                        $(root).find("button.sap-stop").prop("disabled", false);
                    }
                    else if(stateChange == "pause" || stateChange == "stop" || 
                            stateChange == "ended" || stateChange == "initial") {
                        $(root).find("button.sap-pause").prop("disabled", true);
                        $(root).find("button.sap-play").prop("disabled", false);
                    }
                    if (stateChange == "stop" || stateChange == "initial") {
                        $(root).find("button.sap-stop").prop("disabled", true);
                    }

                    // Move to the next track (if any) when playback ends.
                    if(stateChange == "ended") {
                        if(playlist.nextTrack()) {
                            playlist.play();
                        }
                    }

                    if(!playlist.hasNextTrack()) {
                        $(root).find("button.sap-next").prop("disabled", true);
                    } else {
                        $(root).find("button.sap-next").prop("disabled", false);
                    }

                    if(!playlist.hasPreviousTrack()) {
                        $(root).find("button.sap-prev").prop("disabled", true);
                    } else {
                        $(root).find("button.sap-prev").prop("disabled", false);
                    }
                });
                $(root).trigger("statechange", "initial");
                return root;
            }
        }

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
                var wasPlaying = playlist.isPlaying() || !this.activeTrack;
                playlist.nextTrack();
                if(wasPlaying) {
                    playlist.play();
                }
            },
            prev:function() 
            {
                console.debug("prev");
                var wasPlaying = playlist.isPlaying();
                playlist.previousTrack();
                if(wasPlaying) {
                    playlist.play();
                }
            }
        };

        return buttonView(playlist, buttons, buttonEvents);
    }

    // Create, setup, and return the DOM for the SAP Scrubber controls.
    var sapScrubber = function(playlist, scrubberView) {
        if(scrubberView === undefined) {
            scrubberView = function(playlist) {
                var root = $($.parseHTML('<div class="sap-audio-scrubber-chrome">' + 
                            '<div class="sap-audio-scrubber sap-audio-scrubber-current"></div>' + 
                            '<div class="sap-audio-scrubber sap-audio-scrubber-total"></div>' + 
                            '<div class="sap-audio-scrubber sap-audio-scrubber-hoverbox"></div></div>'));

                // The hoverbox receives all mouse events, this ensures that the mouse 
                // position will not change based on what element is currently hovered.
                // Without this the current bar could receive mouse events and throw things off.
                var hoverbox = root.find(".sap-audio-scrubber-hoverbox");
                hoverbox.css({zIndex:3});

                var mouseOverScrubber = false;
                var mouseOverSeekRatio = 0;

                var updateScrubber = function()
                {
                    var newScale;
                    if(mouseOverScrubber)
                    {
                        newScale = mouseOverSeekRatio;
                    }
                    else
                    {
                        newScale = playlist.currentTime()
                    }
                    root.find(".sap-audio-scrubber-current").css("transform", 
                        "scaleX(" + newScale.toString() + ")");
                }

                var startTimer = function()
                {
                    var timeout = 200;
                    updateScrubber();
                    if(playlist.isPlaying() || mouseOverScrubber)
                    {
                        if(mouseOverScrubber)
                        {
                            timeout = 30;
                        }
                        window.setTimeout(startTimer, timeout);
                    }
                };

                playlist.stateWatcher(root, function(evt, stateChange) {
                    startTimer();
                }, ["play"]);

                hoverbox.click(function(evt) {
                    console.debug("click: " + evt.offsetX + ',' + evt.offsetY);
                    var seekRatio = evt.offsetX / root.width();
                    if(!playlist.isPlaying()) {
                        playlist.play();
                    }
                    var newTime = seekRatio * playlist.trackLength();
                    playlist.seek(newTime);
                });

                hoverbox.mouseenter(function(evt)
                {
                    mouseOverScrubber = true;
                    hoverbox.on("mousemove", function(evt)
                    {
                        console.debug(evt.offsetX);
                        mouseOverSeekRatio = evt.offsetX / root.width();
                    });
                    startTimer();
                });

                hoverbox.mouseleave(function(evt)
                {
                    mouseOverScrubber = false;
                    hoverbox.off("mousemove");
                });

                root.trigger("statechange", "ended");
                return root;
            }
        }
        return scrubberView(playlist);
    }

    // Create, setup, and return the DOM for the SAP track listing controls.
    var sapTrackList = function(playlist, trackListView) {
        if(trackListView === undefined) {
            trackListView = function(playlist) {
                var root = $($.parseHTML('<div></div>'));
                var track_list = $($.parseHTML('<ol class="sap-track-list"></ol>'));
                var side_pane = $($.parseHTML('<div class="sap-track-list-details-pane"></div>'));
                track_list.on("click", "li", function(evt) {
                    console.debug("click");
                    var index = $(evt.target).data("track-index");
                    playlist.changeTrack(index);
                    playlist.play();
                });

                side_pane.append($("<div class='details'>"));
                var details = side_pane.find(".details");

                playlist.stateWatcher(track_list, function(evt, stateChange) {
                    if(stateChange == "ended" || stateChange == "stop" || stateChange == "trackChange") {
                        root.find("li.sap-playing").removeClass("sap-playing");
                    }

                    if(!playlist.activeTrack || !playlist.activeTrack.data.extra) {
                        details.hide();
                    }

                    if(playlist.activeTrack) {
                        var currentTrackIndex = playlist.currentTrackIndex();
                        track_list.find("li").each(function(index) {
                            if($(this).data("track-index") == currentTrackIndex) {
                                $(this).addClass("sap-playing");
                            }
                        });

                        if(playlist.activeTrack.data.extra) {
                            details.html(playlist.activeTrack.data.extra);
                            details.show();
                        }
                    }
                }, ["play", "ended", "stop", "trackChange"]);

                $(playlist.tracks).each(function(index) {
                    var list_item = $("<li>").text(this.data.title); 
                    list_item.data("track-index", index);
                    track_list.append(list_item);
                });

                root.append(track_list);
                root.append(side_pane);
                return root;
            }
        }
        return trackListView(playlist);
    }

	return {
		makePlaylistFromDOM:makePlaylistFromDOM,
        sapPlayer:sapPlayer,
        sapScrubber:sapScrubber,
        sapTrackList:sapTrackList
	};
})();

(function($) {
	$.fn.saplayer = function(playlist_dom, options) {
        var playlist = saplayer.makePlaylistFromDOM(playlist_dom);
        if(options === undefined) {
            options = {};
        }
        if(options["sapView"] === undefined) {
            options["sapView"] = function(playlist) {
                var root = $('<div class="sap-player-container">');
                root.append(saplayer.sapScrubber(playlist), options["scrubberView"]);
                root.append(saplayer.sapPlayer(playlist), options["playerView"]);
                root.append(saplayer.sapTrackList(playlist), options["trackList"]);
                return root;
            }
        }
        this.append(options["sapView"](playlist));
		return this;
	}
})(jQuery);
