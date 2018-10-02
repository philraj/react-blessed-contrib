'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createBlessedComponent = createBlessedComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.upperfirst');

var _lodash2 = _interopRequireDefault(_lodash);

var _neoBlessed = require('neo-blessed');

var _neoBlessed2 = _interopRequireDefault(_neoBlessed);

var _blessedContrib = require('blessed-contrib');

var _blessedContrib2 = _interopRequireDefault(_blessedContrib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Patch blessed so that react-blessed picks up our wrapper
_neoBlessed2.default.__BLESSED_WRAPPER__ = function (props) {
  return props.__BLESSED_WIDGET__(props);
};

var blacklist = ['OutputBuffer', 'InputBuffer', 'createScreen', 'serverError', 'grid', 'carousel', 'markdown'];

function setWidgetData() {
  if (this.props.data) {
    this.widget.setData(this.props.data);
  }
}

function createBlessedComponent(blessedElement) {
  return function (_Component) {
    _inherits(_class2, _Component);

    function _class2() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, _class2);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class2.__proto__ || Object.getPrototypeOf(_class2)).call.apply(_ref, [this].concat(args))), _this), _this.componentDidMount = setWidgetData, _this.componentDidUpdate = setWidgetData, _temp), _possibleConstructorReturn(_this, _ret);
    }

    // data for chart widgets must be set after widget was added to screen


    _createClass(_class2, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
            data = _props.data,
            props = _objectWithoutProperties(_props, ['data']);

        return _react2.default.createElement('__BLESSED_WRAPPER__', _extends({}, props, {
          __BLESSED_WIDGET__: blessedElement,
          ref: function ref(el) {
            return _this2.widget = el;
          }
        }));
      }
    }]);

    return _class2;
  }(_react.Component);
}

// Treat Markdown in a special way so that text can be passed as a child content

var Markdown = function (_Component2) {
  _inherits(Markdown, _Component2);

  function Markdown() {
    _classCallCheck(this, Markdown);

    return _possibleConstructorReturn(this, (Markdown.__proto__ || Object.getPrototypeOf(Markdown)).apply(this, arguments));
  }

  _createClass(Markdown, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props2 = this.props,
          children = _props2.children,
          props = _objectWithoutProperties(_props2, ['children']);

      if (typeof children === 'string' && !props.markdown) {
        props.markdown = children;
      }
      return _react2.default.createElement('__BLESSED_WRAPPER__', _extends({}, props, {
        __BLESSED_WIDGET__: _blessedContrib2.default.markdown,
        ref: function ref(el) {
          return _this4.widget = el;
        }
      }));
    }
  }]);

  return Markdown;
}(_react.Component);

;

// We stub methods for contrib.grid to let it compute params for us which we then render in the React way
function Grid(props) {
  var grid = new _blessedContrib2.default.grid(_extends({}, props, { screen: { append: function append() {} } }));
  var children = props.children instanceof Array ? props.children : [props.children];
  return _react2.default.createElement(props.component || 'element', {}, children.map(function (child, key) {
    var props = child.props;
    var options = grid.set(props.row, props.col, props.rowSpan || 1, props.colSpan || 1, function (x) {
      return x;
    }, props.options);
    options.key = key;
    return _react2.default.cloneElement(child, options);
  }));
}

var GridItem = function (_Component3) {
  _inherits(GridItem, _Component3);

  function GridItem() {
    _classCallCheck(this, GridItem);

    return _possibleConstructorReturn(this, (GridItem.__proto__ || Object.getPrototypeOf(GridItem)).apply(this, arguments));
  }

  _createClass(GridItem, [{
    key: 'getItem',
    value: function getItem() {
      return this._reactInternalInstance._instance.refs.item;
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      return _react2.default.createElement(props.component, _extends({}, props, { ref: 'item' }), props.children);
    }
  }]);

  return GridItem;
}(_react.Component);

// We let the contrib.carousel manage state, re-rendering happens via move method that triggers component update


var Carousel = function (_Component4) {
  _inherits(Carousel, _Component4);

  function Carousel(props) {
    _classCallCheck(this, Carousel);

    var _this6 = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, props));

    _this6.state = {
      page: 0
    };
    return _this6;
  }

  _createClass(Carousel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this7 = this;

      this.carousel = new _blessedContrib2.default.carousel(this.props.children, this.props);
      this.carousel.move = function () {
        _this7.setState({
          page: _this7.carousel.currPage
        });
      };
      this.carousel.start();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.props.screen.render();
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children[this.state.page];
    }
  }]);

  return Carousel;
}(_react.Component);

Object.keys(_blessedContrib2.default).forEach(function (key) {
  // todo check prototype
  if (_blessedContrib2.default.hasOwnProperty(key) && blacklist.indexOf(key) === -1) {
    exports[(0, _lodash2.default)(key)] = createBlessedComponent(_blessedContrib2.default[key]);
  }

  exports.Grid = Grid;
  exports.GridItem = GridItem;
  exports.Carousel = Carousel;
  exports.Markdown = Markdown;
});