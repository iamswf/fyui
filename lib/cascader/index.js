var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RcCascader from 'rc-cascader';
import arrayTreeFilter from 'array-tree-filter';
import classNames from 'classnames';
import omit from 'omit.js';
import KeyCode from 'rc-util/lib/KeyCode';
import Input from '../input';
import Icon from '../icon';

var optionsShape = PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.string,
    children: optionsShape
});

function highlightKeyword(str, keyword, prefixCls) {
    return str.split(keyword).map(function (node, index) {
        return index === 0 ? node : [React.createElement(
            'span',
            { className: prefixCls + '-menu-item-keyword', key: 'seperator' },
            keyword
        ), node];
    });
}

function defaultFilterOption(inputValue, path) {
    return path.some(function (option) {
        return option.label.indexOf(inputValue) > -1;
    });
}

function defaultRenderFilteredOption(inputValue, path, prefixCls) {
    return path.map(function (_ref, index) {
        var label = _ref.label;

        var node = label.indexOf(inputValue) > -1 ? highlightKeyword(label, inputValue, prefixCls) : label;
        return index === 0 ? node : [' / ', node];
    });
}

function defaultSortFilteredOption(a, b, inputValue) {
    function callback(elem) {
        return elem.label.indexOf(inputValue) > -1;
    }

    return a.findIndex(callback) - b.findIndex(callback);
}

var defaultDisplayRender = function defaultDisplayRender(label) {
    return label.join(' / ');
};

var Cascader = function (_Component) {
    _inherits(Cascader, _Component);

    function Cascader(props) {
        _classCallCheck(this, Cascader);

        var _this = _possibleConstructorReturn(this, (Cascader.__proto__ || Object.getPrototypeOf(Cascader)).call(this, props));

        _this.setValue = function (value) {
            var selectedOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            if (!('value' in _this.props)) {
                _this.setState({ value: value });
            }
            var onChange = _this.props.onChange;
            if (onChange) {
                onChange(value, selectedOptions);
            }
        };

        _this.handleChange = function (value, selectedOptions) {
            _this.setState({ inputValue: '' });
            if (selectedOptions[0].__IS_FILTERED_OPTION) {
                var unwrappedValue = value[0];
                var unwrappedSelectedOptions = selectedOptions[0].path;
                _this.setValue(unwrappedValue, unwrappedSelectedOptions);
                return;
            }
            _this.setValue(value, selectedOptions);
        };

        _this.handlePopupVisibleChange = function (popupVisible) {
            if (!('popupVisible' in _this.props)) {
                _this.setState({
                    popupVisible: popupVisible,
                    inputFocused: popupVisible,
                    inputValue: popupVisible ? _this.state.inputValue : ''
                });
            }

            var onPopupVisibleChange = _this.props.onPopupVisibleChange;
            if (onPopupVisibleChange) {
                onPopupVisibleChange(popupVisible);
            }
        };

        _this.handleInputBlur = function () {
            _this.setState({
                inputFocused: false
            });
        };

        _this.handleInputClick = function (e) {
            var _this$state = _this.state,
                inputFocused = _this$state.inputFocused,
                popupVisible = _this$state.popupVisible;
            // Prevent `Trigger` behaviour.

            if (inputFocused || popupVisible) {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
            }
        };

        _this.handleKeyDown = function (e) {
            if (e.keyCode === KeyCode.BACKSPACE) {
                e.stopPropagation();
            }
        };

        _this.handleInputChange = function (e) {
            var inputValue = e.target.value;
            _this.setState({ inputValue: inputValue });
        };

        _this.clearSelection = function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!_this.state.inputValue) {
                _this.setValue([]);
                _this.handlePopupVisibleChange(false);
            } else {
                _this.setState({ inputValue: '' });
            }
        };

        _this.state = {
            value: props.value || props.defaultValue || [],
            inputValue: '',
            inputFocused: false,
            popupVisible: props.popupVisible,
            flattenOptions: props.showSearch && _this.flattenTree(props.options, props.changeOnSelect)
        };
        return _this;
    }

    _createClass(Cascader, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if ('value' in nextProps) {
                this.setState({ value: nextProps.value || [] });
            }
            if ('popupVisible' in nextProps) {
                this.setState({ popupVisible: nextProps.popupVisible });
            }
            if (nextProps.showSearch && this.props.options !== nextProps.options) {
                this.setState({ flattenOptions: this.flattenTree(nextProps.options, nextProps.changeOnSelect) });
            }
        }
    }, {
        key: 'getLabel',
        value: function getLabel() {
            var _props = this.props,
                options = _props.options,
                _props$displayRender = _props.displayRender,
                displayRender = _props$displayRender === undefined ? defaultDisplayRender : _props$displayRender;

            var value = this.state.value;
            var unwrappedValue = Array.isArray(value[0]) ? value[0] : value;
            var selectedOptions = arrayTreeFilter(options, function (o, level) {
                return o.value === unwrappedValue[level];
            });
            var label = selectedOptions.map(function (o) {
                return o.label;
            });
            return displayRender(label, selectedOptions);
        }
    }, {
        key: 'flattenTree',
        value: function flattenTree(options, changeOnSelect) {
            var _this2 = this;

            var ancestor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            var flattenOptions = [];
            options.forEach(function (option) {
                var path = ancestor.concat(option);
                if (changeOnSelect || !option.children) {
                    flattenOptions.push(path);
                }
                if (option.children) {
                    flattenOptions = flattenOptions.concat(_this2.flattenTree(option.children, changeOnSelect, path));
                }
            });
            return flattenOptions;
        }
    }, {
        key: 'generateFilteredOptions',
        value: function generateFilteredOptions(prefixCls) {
            var _this3 = this;

            var _props2 = this.props,
                showSearch = _props2.showSearch,
                notFoundContent = _props2.notFoundContent;
            var _showSearch$filter = showSearch.filter,
                filter = _showSearch$filter === undefined ? defaultFilterOption : _showSearch$filter,
                _showSearch$render = showSearch.render,
                render = _showSearch$render === undefined ? defaultRenderFilteredOption : _showSearch$render,
                _showSearch$sort = showSearch.sort,
                sort = _showSearch$sort === undefined ? defaultSortFilteredOption : _showSearch$sort;
            var _state = this.state,
                flattenOptions = _state.flattenOptions,
                inputValue = _state.inputValue;

            var filtered = flattenOptions.filter(function (path) {
                return filter(_this3.state.inputValue, path);
            }).sort(function (a, b) {
                return sort(a, b, inputValue);
            });

            if (filtered.length > 0) {
                return filtered.map(function (path) {
                    return {
                        __IS_FILTERED_OPTION: true,
                        path: path,
                        label: render(inputValue, path, prefixCls),
                        value: path.map(function (o) {
                            return o.value;
                        }),
                        disabled: path.some(function (o) {
                            return o.disabled;
                        })
                    };
                });
            }
            return [{ label: notFoundContent, value: 'ANT_CASCADER_NOT_FOUND', disabled: true }];
        }
    }, {
        key: 'render',
        value: function render() {
            var _classNames, _classNames2, _classNames3;

            var props = this.props,
                state = this.state;

            var prefixCls = props.prefixCls,
                inputPrefixCls = props.inputPrefixCls,
                children = props.children,
                placeholder = props.placeholder,
                size = props.size,
                disabled = props.disabled,
                className = props.className,
                style = props.style,
                allowClear = props.allowClear,
                _props$showSearch = props.showSearch,
                showSearch = _props$showSearch === undefined ? false : _props$showSearch,
                otherProps = _objectWithoutProperties(props, ['prefixCls', 'inputPrefixCls', 'children', 'placeholder', 'size', 'disabled', 'className', 'style', 'allowClear', 'showSearch']);

            var value = state.value;

            var sizeCls = classNames((_classNames = {}, _defineProperty(_classNames, inputPrefixCls + '-lg', size === 'large'), _defineProperty(_classNames, inputPrefixCls + '-sm', size === 'small'), _classNames));
            var clearIcon = allowClear && !disabled && value.length > 0 || state.inputValue ? React.createElement(Icon, {
                type: 'cross-circle',
                className: prefixCls + '-picker-clear',
                onClick: this.clearSelection
            }) : null;
            var arrowCls = classNames((_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-picker-arrow', true), _defineProperty(_classNames2, prefixCls + '-picker-arrow-expand', state.popupVisible), _classNames2));
            var pickerCls = classNames(className, (_classNames3 = {}, _defineProperty(_classNames3, prefixCls + '-picker', true), _defineProperty(_classNames3, prefixCls + '-picker-with-value', state.inputValue), _defineProperty(_classNames3, prefixCls + '-picker-disabled', disabled), _classNames3));

            // Fix bug of https://github.com/facebook/react/pull/5004
            // and https://fb.me/react-unknown-prop
            var inputProps = omit(otherProps, ['onChange', 'options', 'popupPlacement', 'transitionName', 'displayRender', 'onPopupVisibleChange', 'changeOnSelect', 'expandTrigger', 'popupVisible', 'getPopupContainer', 'loadData', 'popupClassName', 'filterOption', 'renderFilteredOption', 'sortFilteredOption', 'notFoundContent']);

            var options = props.options;
            if (state.inputValue) {
                options = this.generateFilteredOptions(prefixCls);
            }
            // Dropdown menu should keep previous status until it is fully closed.
            if (!state.popupVisible) {
                options = this.cachedOptions;
            } else {
                this.cachedOptions = options;
            }

            var dropdownMenuColumnStyle = {};
            var isNotFound = (options || []).length === 1 && options[0].value === 'ANT_CASCADER_NOT_FOUND';
            if (isNotFound) {
                dropdownMenuColumnStyle.height = 'auto'; // Height of one row.
            }
            // The default value of `matchInputWidth` is `true`
            var resultListMatchInputWidth = showSearch.matchInputWidth === false ? showSearch.matchInputWidth : true;
            if (resultListMatchInputWidth && state.inputValue && this.refs.input) {
                dropdownMenuColumnStyle.width = this.refs.input.refs.input.offsetWidth;
            }

            var input = children || React.createElement(
                'span',
                {
                    style: style,
                    className: pickerCls
                },
                React.createElement(
                    'span',
                    { className: prefixCls + '-picker-label' },
                    this.getLabel()
                ),
                React.createElement(Input, Object.assign({}, inputProps, {
                    ref: 'input',
                    prefixCls: inputPrefixCls,
                    placeholder: value && value.length > 0 ? undefined : placeholder,
                    className: prefixCls + '-input ' + sizeCls,
                    value: state.inputValue,
                    disabled: disabled,
                    readOnly: !showSearch,
                    autoComplete: 'off',
                    onClick: showSearch ? this.handleInputClick : undefined,
                    onBlur: showSearch ? this.handleInputBlur : undefined,
                    onKeyDown: this.handleKeyDown,
                    onChange: showSearch ? this.handleInputChange : undefined
                })),
                clearIcon,
                React.createElement(Icon, { type: 'down', className: arrowCls })
            );

            return React.createElement(
                RcCascader,
                Object.assign({}, props, {
                    options: options,
                    value: value,
                    popupVisible: state.popupVisible,
                    onPopupVisibleChange: this.handlePopupVisibleChange,
                    onChange: this.handleChange,
                    dropdownMenuColumnStyle: dropdownMenuColumnStyle
                }),
                input
            );
        }
    }]);

    return Cascader;
}(Component);

Cascader.defaultProps = {
    prefixCls: 'fy-cascader',
    inputPrefixCls: 'fy-input',
    placeholder: 'Please select',
    transitionName: 'slide-up',
    popupPlacement: 'bottomLeft',
    options: [],
    disabled: false,
    allowClear: true,
    notFoundContent: 'Not Found'
};
Cascader.propTypes = {
    options: PropTypes.arrayOf(optionsShape),
    defaultDisplayRender: PropTypes.arrayOf(optionsShape),
    value: PropTypes.arrayOf(optionsShape),
    defaultValue: PropTypes.arrayOf(optionsShape),
    onChange: PropTypes.func,
    transitionName: PropTypes.string,
    displayRender: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    popupPlacement: PropTypes.string,
    placeholder: PropTypes.oneOf(['bottomLeft', 'bottomRight', 'topLeft', 'topRight']),
    size: PropTypes.oneOf(['large', 'default', 'small']),
    disabled: PropTypes.bool,
    allowClear: PropTypes.bool,
    showSearch: PropTypes.shape({
        filter: PropTypes.func,
        render: PropTypes.func,
        sort: PropTypes.func,
        matchInputWidth: PropTypes.bool
    }),
    notFoundContent: PropTypes.node,
    loadData: PropTypes.func,
    expandTrigger: PropTypes.oneOf(['click', 'hover']),
    changeOnSelect: PropTypes.bool,
    onPopupVisibleChange: PropTypes.func,
    prefixCls: PropTypes.string,
    inputPrefixCls: PropTypes.string,
    getPopupContainer: PropTypes.func,
    popupVisible: PropTypes.bool
};
export default Cascader;