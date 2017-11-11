import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RcCheckbox from 'rc-checkbox';
import shallowEqual from 'shallowequal';
import CheckboxGroup from './Group';

export default class Checkbox extends Component {
    static Group: typeof CheckboxGroup;
    static defaultProps = {
        prefixCls: 'fy-checkbox',
        indeterminate: false
    };

    static propTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        defaultChecked: PropTypes.bool,
        checked: PropTypes.bool,
        style: PropTypes.object,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        value: PropTypes.any,
        name: PropTypes.string,
        children: PropTypes.node,
        indeterminate: PropTypes.bool
    };

    static contextTypes = {
        checkboxGroup: PropTypes.any
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !shallowEqual(this.props, nextProps) ||
            !shallowEqual(this.state, nextState) ||
            !shallowEqual(this.context.checkboxGroup, nextContext.checkboxGroup);
    }

    render() {
        const {props, context} = this;
        const {
            prefixCls,
            className,
            children,
            indeterminate,
            style,
            onMouseEnter,
            onMouseLeave,
            ...restProps
        } = props;
        const {checkboxGroup} = context;
        const checkboxProps = {...restProps};
        if (checkboxGroup) {
            checkboxProps.onChange = () => checkboxGroup.toggleOption({label: children, value: props.value});
            checkboxProps.checked = checkboxGroup.value.indexOf(props.value) !== -1;
            checkboxProps.disabled = props.disabled || checkboxGroup.disabled;
        }
        const classString = classNames(className, {
            [`${prefixCls}-wrapper`]: true
        });
        const checkboxClass = classNames({
            [`${prefixCls}-indeterminate`]: indeterminate
        });
        return (
            <label
                className={classString}
                style={style}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <RcCheckbox
                    {...checkboxProps}
                    prefixCls={prefixCls}
                    className={checkboxClass}
                />
                {children !== undefined ? <span>{children}</span> : null}
            </label>
        );
    }
}