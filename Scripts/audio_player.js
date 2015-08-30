﻿var Audio = React.createClass({
    displayName: "Audio",
    render: function () {
        return (
            React.createElement("audio", { id: "audio" },
                React.createElement("source", { src: "../Music/sound.mp3", type: "audio/mpeg" })
            )
        );
    }
});

var Player = React.createClass({
    displayName: "Player",
    getInitialState: function () {
        return {
            duration: 0,
            btnClassName: "play",
            timelineWidth: 0,
            onplayhead: false
        };
    },
    onButtonClick: function () {
        var pAudio = React.findDOMNode(this.refs.pAudio);
        if (pAudio.paused) {
            pAudio.play();
            this.setState({ btnClassName: "pause" });
        } else {
            pAudio.pause();
            this.setState({ btnClassName: "play" });
        }
    },
    onTimelineClick: function (event) {
        var pAudio = React.findDOMNode(this.refs.pAudio);

        this.moveplayhead(event);
        pAudio.currentTime = this.state.duration * this.clickPercent(event);
    },
    moveplayhead: function (e) {
        var pHead = React.findDOMNode(this.refs.pHead);
        var timeline = React.findDOMNode(this.refs.timeline);

        var newMargLeft = e.pageX - timeline.offsetLeft;
        if (newMargLeft >= 0 && newMargLeft <= this.state.timelineWidth) {
            pHead.style.marginLeft = newMargLeft + "px";
        }
        if (newMargLeft < 0) {
            pHead.style.marginLeft = "0px";
        }
        if (newMargLeft > this.state.timelineWidth) {
            pHead.style.marginLeft = this.state.timelineWidth + "px";
        }
    },
    clickPercent: function (e) {
        var timeline = React.findDOMNode(this.refs.timeline);

        return (e.pageX - timeline.offsetLeft) / this.state.timelineWidth;
    },
    setDuration: function () {
        var pAudio = React.findDOMNode(this.refs.pAudio);
        this.setState({ duration: pAudio.duration });
    },
    componentDidMount: function () {
        var pAudio = React.findDOMNode(this.refs.pAudio);
        var pButton = React.findDOMNode(this.refs.pButton);
        var pHead = React.findDOMNode(this.refs.pHead);
        var timeline = React.findDOMNode(this.refs.timeline);

        pAudio.addEventListener("timeupdate", this.timeUpdate, false);
        pAudio.addEventListener("canplaythrough", this.setDuration, false);

        pHead.addEventListener('mousedown', this.mouseDown, false);
        window.addEventListener('mouseup', this.mouseUp, false);

        this.setState({ timelineWidth: timeline.offsetWidth - pHead.offsetWidth });
    },
    timeUpdate: function () {
        var pAudio = React.findDOMNode(this.refs.pAudio);
        var pHead = React.findDOMNode(this.refs.pHead);
        var playPercent = this.state.timelineWidth * (pAudio.currentTime / this.state.duration);

        pHead.style.marginLeft = playPercent + "px";

        showVacabulary(pAudio.currentTime);

        if (pAudio.currentTime === this.state.duration) {
            this.setState({ btnClassName: "play" });
            pAudio.pause();
            pAudio.currentTime = 0;
        }
    },
    mouseDown: function () {
        var pAudio = React.findDOMNode(this.refs.pAudio);

        this.setState({ onplayhead: true });
        window.addEventListener('mousemove', this.moveplayhead, true);
        pAudio.removeEventListener('timeupdate', this.timeUpdate, false);
    },
    mouseUp: function (e) {
        var pAudio = React.findDOMNode(this.refs.pAudio);

        if (this.state.onplayhead === true) {
            this.moveplayhead(e);
            window.removeEventListener('mousemove', this.moveplayhead, true);
            // change current time
            pAudio.currentTime = this.state.duration * this.clickPercent(e);
            pAudio.addEventListener('timeupdate', this.timeUpdate, false);
        }
        this.setState({ onplayhead: false });
    },
    render: function () {
        return (
            React.createElement("div", { id: "audioplayer" },
				React.createElement(Audio, { ref: "pAudio" }),
                React.createElement("button", { id: "pButton", ref: "pButton", className: this.state.btnClassName, onClick: this.onButtonClick }),
                React.createElement("div", { id: "timeline", ref: "timeline", onClick: this.onTimelineClick },
					React.createElement("div", { id: "playhead", ref: "pHead" })
				)
            )
        );
    }
});

var Comp = React.createClass({
    displayName: "Comp",
    render: function () {
        return (
            React.createElement("div", null,
				React.createElement("div", { id: "text" }, React.createElement("canvas", { id: "vocabulary" })),
                React.createElement(Player, null)
            )
        );
    }
});

React.render(
React.createElement(Comp, null),
document.getElementById('content')
);