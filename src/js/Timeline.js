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
var Timeline = /** @class */ (function () {
    function Timeline() {
        Timeline.container = document.getElementById('visualization');
        Timeline.itemList = [];
        Timeline.highlightList = [];
        Timeline.filterActive = false;
        Timeline.zoomingfilterActive = false;
        Timeline.items = new vis.DataSet(Timeline.itemList);
        Timeline.idCounter = 1;
        Timeline.highlightCounter = 1;
        Timeline.multiMatchSetting = new vis.DataSet([
            { id: 1, content: 'Events' }
        ]);
        Timeline.singleMatchSetting = new vis.DataSet([
            { id: 1, content: 'Events' }
            // just in case of detecting some new things like phases, dominance etc.
            //{id: 2, content: 'Phases'},
            //{id: 3, content: 'Dominance'}
        ]);
        // Configuration for the Timeline
        Timeline.options = {
            stack: false,
            height: $('.thirdrow').height(),
            width: $('.thirdrow').width(),
            min: '2000-1-1 00:00:00',
            max: '2000-1-1 01:30:00',
            start: '2000-1-1 00:00:00',
            end: '2000-1-1 01:30:00',
            zoomMax: 5400000,
            zoomMin: 18000,
            format: {
                minorLabels: function (date, scale, step) {
                    var time = date.format("HH:mm");
                    var secs = date.format("ss");
                    return moment.duration(time).asMinutes() + ":" + secs;
                },
                majorLabels: function (date, scale, step) { return ""; }
            },
            orientation: 'top',
            selectable: false
        };
        // Create the Timeline
        Timeline.timeline = new vis.Timeline(Timeline.container, Timeline.items, Timeline.options);
        Timeline.timeline.setGroups(Timeline.multiMatchSetting);
    }
    Timeline.resizeTimeline = function () {
        Timeline.itemList = [];
        // this makes sure that highlights do not get deleted
        // highlights only get resetted/replaced by the switchMatchMode-function
        var itemsCombined = Timeline.itemList.concat(Timeline.highlightList);
        Timeline.items = new vis.DataSet(itemsCombined);
        Timeline.idCounter = 1;
        Timeline.highlightCounter = 1;
        Timeline.options.width = $('.thirdrow').width();
        Timeline.options.height = $('.thirdrow').height();
        $('#visualization').empty();
        $('#timeline_filter_switch').prop("checked", false);
        Timeline.timeline = new vis.Timeline(Timeline.container, Timeline.items, Timeline.options);
        Timeline.timeline.setGroups(Timeline.multiMatchSetting);
        Timeline.timeline.on('rangechanged', function (properties) {
            var seconds = (properties.end.getTime() - properties.start.getTime()) / 1000;
            Timeline.zoomingLevel = seconds / 54;
            if (Timeline.zoomingfilterActive) {
                ResultList.deactivateResultList();
            }
        });
    };
    /**
     * This function adds new items to the itemList
     * Normally the itemList will be resetted, then all the results will be added
     * via this method to the itemList, then the addItemListToTimeline method gets called
     * in order to generate the final vis.js items object and to draw the items on the timeline.
     */
    Timeline.addItem = function (result, highlight) {
        var times = Timeline.convertTime(result.getTime());
        var evType = result.getEventType();
        var title_html = "Exact Time";
        var abovesixtymins = 60;
        // to show up time in minutes above 59
        if (times[0] === "01") {
            abovesixtymins = abovesixtymins + times[1];
            title_html = "Event type: " + evType + "<br>" + "Exact time " + abovesixtymins + "min " + times[2] + "sec";
        }
        else {
            title_html = "Event type: " + evType + "<br>" + "Exact time " + times[1] + "min " + times[2] + "sec";
        }
        var newItem;
        if (highlight) {
            newItem = { id: Timeline.idCounter, group: 1, start: times[3], className: "highlight-item timeline_id" + Timeline.idCounter, content: '<img src="./imgs/' + evType + '.png" height="35px" width="35px">', title: title_html, result_obj: result };
        }
        else {
            newItem = { id: Timeline.idCounter, group: 1, start: times[3], className: "timeline_id" + Timeline.idCounter, type: 'point', title: title_html, result_obj: result };
        }
        Timeline.itemList.push(newItem);
        Timeline.idCounter++;
    };
    Timeline.addHighlight = function (startTs, endTs, text, groupId) {
        var start = Timeline.convertTime(startTs);
        var end = Timeline.convertTime(endTs);
        var newItem = { id: "highlight" + Timeline.highlightCounter, group: groupId, start: start[2], end: end[2], content: text, editable: false };
        Timeline.highlightList.push(newItem);
        Timeline.highlightCounter++;
    };
    Timeline.convertTime = function (time) {
        var times = time.split(":");
        var mins = parseInt(times[0]);
        var secs = parseInt(times[1]);
        // not needed -> football match time is always in minutes
        var hours = "00";
        if (mins > 59) {
            hours = "01";
            mins = mins - 60;
        }
        var formated = "2000-1-1 " + hours + ":" + mins + ":" + secs;
        return [hours, mins, secs, formated];
    };
    /**
     * This function resets the whole timeline and adds all items saved in the itemList.
     */
    Timeline.addItemListToTimeline = function () {
        Timeline.items = new vis.DataSet(Timeline.itemList.concat(Timeline.highlightList));
        Timeline.timeline.setItems(Timeline.items);
        // Listeners that trigger the setActive() and hover() methods.
        Timeline.timeline.on('click', function (properties) {
            if (properties.item != null) {
                if (!(typeof properties.item === 'string')) {
                    Timeline.itemList[parseInt(properties.item) - 1].result_obj.setActive();
                }
            }
        });
        Timeline.timeline.on('itemover', function (properties) {
            if (!(typeof properties.item === 'string')) {
                var id = parseInt(properties.item) - 1;
                Timeline.itemList[id].result_obj.hover();
            }
        });
        Timeline.timeline.on('itemout', function (properties) {
            if (!(typeof properties.item === 'string')) {
                Timeline.itemList[parseInt(properties.item) - 1].result_obj.stopHover();
                Timeline.stopHover(properties.item);
            }
        });
    };
    Timeline.resetTimeline = function () {
        Timeline.itemList = [];
        Timeline.items = new vis.DataSet(Timeline.itemList.concat(Timeline.highlightList));
        Timeline.timeline.setItems(Timeline.items);
        Timeline.idCounter = 1;
        Timeline.highlightCounter = 1;
    };
    Timeline.hover = function (id) {
        var id_num = parseInt(id);
        var elem = $(".timeline_id" + id_num);
        if (elem.length == 2) {
            elem = elem[1];
        }
        else {
            elem = elem[2];
        }
        //console.log(elem);
        if (elem.classList.contains('highlight-item')) {
            elem = elem.children[0].children[0];
            if (!elem.classList.contains('hover-highlight-item')) {
                elem.classList.add("hover-highlight-item");
            }
        }
        else {
            if (!elem.classList.contains("vis-hover")) {
                elem.classList.add("vis-hover");
            }
        }
    };
    Timeline.stopHover = function (id) {
        var id_num = parseInt(id);
        var elem = $(".timeline_id" + id_num);
        if (elem.length != 0) {
            if (elem.length == 2) {
                elem = elem[1];
            }
            else {
                elem = elem[2];
            }
            if (elem.classList.contains('highlight-item')) {
                elem = elem.children[0].children[0];
                if (elem.classList.contains('hover-highlight-item')) {
                    elem.classList.remove("hover-highlight-item");
                }
            }
            else {
                if (elem.classList.contains("vis-hover")) {
                    elem.classList.remove("vis-hover");
                }
            }
        }
    };
    Timeline.deactivate = function (id) {
        var id_num = parseInt(id);
        var elem = $(".timeline_id" + id_num);
        if (elem.length != 0) {
            if (elem.length == 2) {
                elem = elem[1];
            }
            else {
                elem = elem[2];
            }
            if (elem.classList.contains('highlight-item')) {
                elem = elem.children[0].children[0];
                if (!elem.classList.contains('deactivated-highlight-item')) {
                    elem.classList.add("deactivated-highlight-item");
                }
            }
            else {
                if (!elem.classList.contains("vis-deactivated")) {
                    elem.classList.add("vis-deactivated");
                }
            }
        }
    };
    Timeline.activate = function (id) {
        var id_num = parseInt(id);
        var elem = $(".timeline_id" + id_num);
        if (elem.length != 0) {
            if (elem.length == 2) {
                elem = elem[1];
            }
            else {
                elem = elem[2];
            }
            if (elem.classList.contains('highlight-item')) {
                elem = elem.children[0].children[0];
                if (elem.classList.contains('deactivated-highlight-item')) {
                    elem.classList.remove("deactivated-highlight-item");
                }
            }
            else {
                if (elem.classList.contains("vis-deactivated")) {
                    elem.classList.remove("vis-deactivated");
                }
            }
        }
    };
    Timeline.setActive = function (id) {
        Timeline.timeline.setSelection(id);
    };
    Timeline.triggerTimeFilter = function () {
        Timeline.resetTimeline();
        if (Timeline.filterActive) {
            Timeline.timeline.removeCustomTime("slider1");
            Timeline.timeline.removeCustomTime("slider2");
            Timeline.items = new vis.DataSet(Timeline.itemList);
            Timeline.timeline.setItems(Timeline.items);
            Timeline.filterActive = false;
        }
        else {
            // create sliders
            Timeline.timeline.addCustomTime(new Date(946683000000), "slider1");
            Timeline.timeline.addCustomTime(new Date(946684800000), "slider2");
            Timeline.filterActive = true;
            Timeline.timeline.on('timechanged', function (item) {
                if (item.time < Timeline.MIN) {
                    Timeline.timeline.setCustomTime(Timeline.MIN, item.id);
                }
                if (item.time > Timeline.MAX) {
                    item.time = Timeline.MAX;
                }
                DrawingArea.clearSolutions();
                DBConnection.nextQuery();
            });
        }
        DrawingArea.clearSolutions();
        DBConnection.nextQuery();
    };
    Timeline.getTimeFilter = function () {
        if (Timeline.filterActive) {
            var t = new Date(2000, 0, 1, 0, 0, 0, 0).getTime();
            var t1 = Timeline.timeline.getCustomTime("slider1").getTime() - t;
            var t2 = Timeline.timeline.getCustomTime("slider2").getTime() - t;
            if (t1 < t2) {
                return '"min":"' + t1 + '","max":"' + t2 + '"';
            }
            else {
                return '"min":"' + t2 + '","max":"' + t1 + '"';
            }
        }
        else {
            return "";
        }
    };
    Timeline.switchMatchMode = function (single) {
        if (single) {
            DrawingArea.clearCanvas(true);
            Timeline.timeline.setGroups(Timeline.singleMatchSetting);
            DBConnection.getHighlights();
        }
        else {
            DrawingArea.clearCanvas();
            Timeline.timeline.setGroups(Timeline.multiMatchSetting);
        }
    };
    Timeline.triggerZoomingFilter = function () {
        if (!Timeline.zoomingfilterActive) {
            Timeline.zoomingfilterActive = true;
            ResultList.deactivateResultList();
        }
        else {
            Timeline.zoomingfilterActive = false;
            DrawingArea.clearSolutions();
            DBConnection.nextQuery();
        }
    };
    Timeline.MIN = new Date(2000, 0, 1, 0, 0, 0, 0);
    Timeline.MAX = new Date(2000, 0, 1, 1, 30, 0, 0);
    return Timeline;
}());
