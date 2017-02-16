'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _video = require('video.js');

var _video2 = _interopRequireDefault(_video);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hls = require('hls.js');
var Component = _video2.default.getComponent('Component');
var Tech = _video2.default.getTech('Tech');
var Html5 = _video2.default.getComponent('Html5');

var Hlsjs = function (_Html) {
  _inherits(Hlsjs, _Html);

  function Hlsjs(options, ready) {
    _classCallCheck(this, Hlsjs);

    return _possibleConstructorReturn(this, (Hlsjs.__proto__ || Object.getPrototypeOf(Hlsjs)).call(this, options, ready));
  }

  _createClass(Hlsjs, [{
    key: 'createEl',
    value: function createEl() {
      this.hls_ = new Hls();
      this.el_ = Html5.prototype.createEl.apply(this, arguments);

      this.hls_.on(Hls.Events.MEDIA_ATTACHED, _video2.default.bind(this, this.onMediaAttached));
      this.hls_.on(Hls.Events.MANIFEST_PARSED, _video2.default.bind(this, this.onManifestParsed));
      this.hls_.on(Hls.Events.LEVEL_LOADED, _video2.default.bind(this, this.onLevelLoaded));
      this.hls_.on(Hls.Events.ERROR, _video2.default.bind(this, this.onError));
      this.hls_.attachMedia(this.el_);
      this.src(this.options_.source.src);

      this.el_.tech = this;
      return this.el_;
    }
  }, {
    key: 'onMediaAttached',
    value: function onMediaAttached() {
      this.triggerReady();
    }
  }, {
    key: 'onLevelLoaded',
    value: function onLevelLoaded(event, data) {
      this.duration = data.details.live ? function () {
        return Infinity;
      } : Html5.prototype.duration;
    }
  }, {
    key: 'onManifestParsed',
    value: function onManifestParsed() {
      if (this.player().options().autoplay) {
        this.player().play();
      }
    }
  }, {
    key: 'setSrc',
    value: function setSrc(src) {
      this.hls_.loadSource(src);
    }
  }, {
    key: 'onError',
    value: function onError(event, data) {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            // try to recover network error
            this.log('fatal network error encountered, try to recover');
            this.hls_.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            this.log('fatal media error encountered, try to recover');
            this.hls_.recoverMediaError();
            break;
          default:
            // cannot recover
            this.hls_.destroy();
            this.error(data);
            break;
        }
      }
      switch (data.details) {
        case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
        case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
        case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
        case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
        case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
        case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
        case Hls.ErrorDetails.FRAG_LOAD_ERROR:
        case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
        case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
        case Hls.ErrorDetails.FRAG_PARSING_ERROR:
        case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
        case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:
          console.log(data.type);
          console.log(data.details);
          break;
        default:
          break;
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.hls_.destroy();
      return Html5.prototype.dispose.apply(this);
    }
  }]);

  return Hlsjs;
}(Html5);

Hlsjs.isSupported = function () {

  return Hls.isSupported();
};

Hlsjs.canPlaySource = function (techId, source) {
  if (Html5.canPlaySource(techId, source)) {
    return false;
  } else {
    console.log('Hls.isSupported');
    return Hls.isSupported();
  }
};

// register as Component and Tech;
_video2.default.options.techOrder.push('Hlsjs');
Component.registerComponent('Hlsjs', Hlsjs);
Tech.registerTech('Hlsjs', Hlsjs);

exports.default = Hlsjs;
