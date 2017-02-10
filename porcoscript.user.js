// ==UserScript==
// @name         Porcoscript
// @namespace    https://github.com/Porco-Rosso/Porcoscript
// @downloadURL  https://github.com/Porco-Rosso/Porcoscript/blob/master/porcoscript.user.js
// @updateURL  https://github.com/Porco-Rosso/Porcoscript/blob/master/porcoscript.user.js
// @version      0.1
// @author       Porco-Rosso
// @match http://*.soundcloud.com/*
// @match https://*.soundcloud.com/*
// @match http://*.youtube.com/*
// @match https://*.youtube.com/*
// @description  This userscript is meant to provide integration to https://api.datmusic.xyz/ into other websites, such as soundcloud and youtube.
// @icon https://raw.githubusercontent.com/Porco-Rosso/Porcoscript/blob/master/Logo_32x32.png
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function () {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

// Declare global variables
window.LinkBase = "https://api.datmusic.xyz/search?q=";


// the guts of this userscript

// download function
function apifetch(query) {
     queryurl = 'https://test.omnipus.ga/api/search?q=' + query;
    jQ.getJSON(queryurl, function(data) {
        //data is the JSON string
        x = JSON.parse(data.body);
        console.log(x.data[0]);
        //activate download
        jQ('<form></form>').attr('action', x.data[0].download).appendTo('body').submit().remove();
    });

}


// $.get('https://jsonp.afeld.me/?url=https://api.datmusic.xyz/search?q=FKJ', function(data){
//     console.log(data);
//   });


function main() {
    // Note, jQ replaces $ to avoid conflicts.

    // see if we are on youtube
    if (window.location.href.indexOf("youtube") > -1) {

        ////////////////////// youtube code /////////////////////////////////////////////////////////////////
        if (jQ('.yt-Porcoscript').length) {
                // do nothing if we have already loaded the button on song page
                setTimeout(main, 1000);
            } else {
        //get title
        var RawYtSearchTerm = jQ("#eow-title").text();
        RawYtSearchTerm = RawYtSearchTerm.replace(/['"]+/g, '');
        // var LinkBase = "https://api.datmusic.xyz/search?q=";
        var YtSearchTerm = RawYtSearchTerm.trim().split(' ').join(' ');
        var YTLink = window.LinkBase + YtSearchTerm;

        // Generate button
        var YTPorcoscriptButton = jQ('<div class="yt-uix-menu "><a target="_blank" href="' + YTPorcoscriptLink + '"><button class="yt-uix-button yt-Porcoscript yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup click-cancels-autoplay yt-uix-menu-trigger yt-uix-tooltip" type="button" aria-haspopup="true" title="Search on Porcoscript" role="button" id="action-panel-overflow-button" aria-pressed="false" data-tooltip-text="Search on Porcoscript"><span class="yt-uix-button-content">Porcoscript</span></button></a></div>');

        // Insert button
        var YtButtons = jQ("#watch8-secondary-actions");
        jQ(YtButtons).append(YTPorcoscriptButton);
        setTimeout(main, 1000);
            }

    } else {
      if (window.location.href.indexOf("soundcloud") > -1) {

        ////////////////////// soundcloud code /////////////////////////////////////////////////////////////////

        // check what type of page we are on, stream vs. song
        if (jQ('.fullListenHero__title').length) {

            if (jQ('.sc-Porcoscript').length) {
                // do nothing if we have already loaded the button on song page
                setTimeout(main, 1000);
            } else {
                // fetch title and artist on song page
                var RawSongTitle = jQ(".fullListenHero__title").find(".soundTitle__title").children().text();
                RawSongTitle = RawSongTitle.replace(/['"]+/g, '');
                var RawSongArtist = jQ(".fullListenHero__title").find(".soundTitle__username").text();
                RawSongArtist = RawSongArtist.replace(/['"]+/g, '');

                var SongTitle = RawSongTitle.trim().split(' ').join(' ');
                var SongArtist = RawSongArtist.trim().split(' ').join(' ');

                if (RawSongTitle.indexOf("-") >= 0) {
                    var SearchTerm = SongTitle
                } else {
                    var SearchTerm = SongArtist + ' - ' + SongTitle
                }

                // insert button on song page
                jQ('<a onclick="apifetch(\'' + SearchTerm + '\')" "class="sc-button-more sc-Porcoscript sc-button sc-button-medium sc-button-responsive" tabindex="0" title="Search on Porcoscript">Porcoscript</a>').insertAfter(jQ(".sc-button-toolbar").find(".sc-button-toolbar>.sc-button:last-child, .sc-button-group>.sc-button:last-child"));

                setTimeout(main, 1000);
            }

        } else {
            // if on stream page
            jQ(".soundList__item").each(function (i) {

                if (jQ(this).hasClass("has-Porcoscript") == true) {
                    //do nothing if button is already loaded for the song list entry
                } else {

                    jQ(this).addClass("has-Porcoscript");
                    //fetch title and artist on stream
                    var RawSongTitle = jQ(this).find(".soundTitle__title").children().text();
                    var RawSongArtist = jQ(this).find(".soundTitle__usernameText").text();

                    var SongTitle = RawSongTitle.trim().split(' ').join(' ');
                    var SongArtist = RawSongArtist.trim().split(' ').join(' ');

                    if (RawSongTitle.indexOf("-") >= 0) {
                        var SearchTerm = SongTitle
                    } else {
                        var SearchTerm = SongArtist + ' - ' + SongTitle
                    }
                    // insert button for item
                    jQ('<a onclick="apifetch(\'' + SearchTerm + '\')" class="sc-button-more sc-Porcoscript sc-button sc-button-small sc-button-responsive" tabindex="0" title="Search on Porcoscript">Porcoscript</a>').insertAfter(jQ(this).find(".sc-button-toolbar>.sc-button:last-child, .sc-button-group>.sc-button:last-child"));


                    //   Can't manage to get a custom image in place of the sc icons. I even made this one myself :(
                    //        jQ(".sc-button-search").css('background-image','url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPg0KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4yLjIgKDk5ODMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPg0KICAgIDx0aXRsZT5TbGljZSAxPC90aXRsZT4NCiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4NCiAgICA8ZGVmcz48L2RlZnM+DQogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgICAgIDxwYXRoIGQ9Ik04LjkzNzg2NzU0LDguMjkwMjA3MDkgTDEyLjUsMTIuNSBMOC45Mzc4Njc1NCw4LjI5MDIwNzA5IEM5LjU4NzU2OCw3LjczOTkwOTA3IDEwLDYuOTE4MTE4ODYgMTAsNiBDMTAsNC4zNDMxNDU3NSA4LjY1Njg1NDI1LDMgNywzIEM1LjM0MzE0NTc1LDMgNCw0LjM0MzE0NTc1IDQsNiBDNCw3LjY1Njg1NDI1IDUuMzQzMTQ1NzUsOSA3LDkgQzcuNzM4NzM1MzksOSA4LjQxNTEwNjU2LDguNzMyOTg3MDQgOC45Mzc4Njc1NCw4LjI5MDIwNzA5IFoiIGlkPSJTaGFwZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD4NCiAgICA8L2c+DQo8L3N2Zz4=)')
                }
            });
            // keep running the script to make sure we add buttons as content is dynamically loaded, probably not an efficient method :/
            setTimeout(main, 1000);
        }
    }
  }

}

// load jQuery and execute the main function

window.onload = addJQuery(main);
