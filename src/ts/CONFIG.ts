/*
* SportSense
* Copyright (C) 2019  University of Basel
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
/*!Do only edit the TypeScript but not the Javascript file!*/

class CONFIG{

    /*
        This class contains all changeable configuration variables that are used by the other classes.
    */

    // Server settings
    public static PROXY_ADDRESS: string = "http://localhost:2222";
    public static METHOD: string = "GET";

    // Fabric.js drawing colors
    public static COLOR_STANDARD: string = "rgba(32,91,175,1)";
    public static COLOR_HIGHLIGHTED: string = "rgba(255,112,166,1)";
    public static COLOR_HOVER: string = "rgba(114,161,229,1)";
    public static COLOR_NONE: string = "rgba(0,0,0,0)";
    public static COLOR_SELECTION: string = "rgba(255,200,0,1)";
    public static COLOR_DEACTIVATED: string = "rgba(149, 165, 166, 1)";
    public static COLOR_INVISIBLE: string = "rgba(0,0,0,0)";

    // Fabric.js drawing colors for off-ball activities
    public static COLOR_BALL_STANDARD: string = "rgba(50,50,50,1)";
    public static COLOR_BALL_HIGHLIGHTED: string = "rgba(80,80,80,1)";
    public static COLOR_BALL_HOVER: string = "rgba(120,120,120,1)";
    public static COLOR_TEAM_A_STANDARD: string = "rgba(220,0,0,1)";
    public static COLOR_TEAM_A_HIGHLIGHTED: string = "rgba(255,112,166,1)";
    public static COLOR_TEAM_A_HOVER: string = "rgba(255,50,50,1)";
    public static COLOR_TEAM_B_STANDARD: string = "rgba(0,0,220,1)";
    public static COLOR_TEAM_B_HIGHLIGHTED: string = "rgba(255,112,166,1)";
    public static COLOR_TEAM_B_HOVER: string = "rgba(50,50,255,1)";

    public static COLOR_POLYGON_START: string = "rgba(60,180,255,0.8)";
    public static COLOR_POLYGON_END: string = "rgba(120,255,255,0.8)";

    // Fabric.js sizes
    public static MARKER_SIZE: number = 3;
    public static EC_STROKE_WIDTH: number = 2;
    public static SELECTION_STROKE_WIDTH: number = 3;

    // Database sizes for soccer
    public static DB_X_MAX_soccer: number = 54.0;
    public static DB_X_MIN_soccer: number = -54.0;
    public static DB_Y_MAX_soccer: number = 36.0;
    public static DB_Y_MIN_soccer: number = -36.0;

    // Database sizes for ice hockey
    public static DB_X_MAX_icehockey: number = 30.5;
    public static DB_X_MIN_icehockey: number = -30.5;
    public static DB_Y_MAX_icehockey: number = 15.0;
    public static DB_Y_MIN_icehockey: number = -15.0;

    // Straight motion path
    public static POINTS_PER_HALF_CIRCLE: number = 10;

    // Video
    public static ADDITIONAL_VIDEO_OFFSET: number = -4;

    // Drawing Buttons
    public static EVENT_QUERY: number = 1;
    public static FORWARD_EVENT_CASCADE: number = 2;
    public static REVERSE_EVENT_CASCADE: number = 3;
    public static STRAIGHT_MOTION_PATH: number = 4;
    public static FREEHAND_MOTION_PATH: number = 5;

    // Off ball constants
    public static COMPLEX_SLIDER_MARGIN: number = 1500; // left and right margin of complex slider to min and max values
    public static INITIAL_SLIDER1_POSITION: number = -500; // initial position of slider1 in milliseconds
    public static INITIAL_SLIDER2_POSITION: number = 3000; // initial position of slider2 in milliseconds
    public static COMPLEX_SLIDER_MIN: number = -10000; // minimum value of complex slider
    public static COMPLEX_SLIDER_MAX: number = 10000; // maximum value of complex slider

    // Highlight events
    public static HIGHLIGHT_EVENTS = [
        "cornerkickEvent",
        "freekickEvent",
        "goalEvent"
    ];

    // Zooming filter levels
    public static ZOOMINGFILTER_LEVEL_1 = {
        max_view: 100,
        min_view: 75,
        events: [
            "cornerkickEvent",
            "freekickEvent",
            "goalEvent"
        ]
    }
    public static ZOOMINGFILTER_LEVEL_2 = {
        max_view: 75,
        min_view: 40,
        events: [
            "clearanceEvent",
            "goalkickEvent",
            "interceptionEvent",
            "kickoffEvent",
            "shotOffTargetEvent",
            "shotOnTargetEvent",
            "throwinEvent"
        ]
    }
    public static ZOOMINGFILTER_LEVEL_3 = {
        max_view: 40,
        min_view: 0,
        events: [
            "successfulPassEvent",
            "passSequenceEvent",
            "passEvent",
            "misplacedPassEvent",
            "doublePassEvent"
        ]
    }
}
