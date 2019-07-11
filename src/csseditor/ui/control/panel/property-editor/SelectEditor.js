import UIElement from "../../../../../util/UIElement";
import { LOAD, CHANGE, BIND, VDOM } from "../../../../../util/Event";
import icon from "../../../icon/icon";

export default class SelectEditor extends UIElement {

    initState() {
        var splitChar = this.props.split || ',';
        var options = (this.props.options || '').split(splitChar).map(it => it.trim());

        var value = this.props.value;

        return {
            label: this.props.label || '',
            iconView: this.props.icon === 'true', 
            options, value
        }
    }

    template() {
        var { label, iconView } = this.state; 
        var hasLabel = !!label ? 'has-label' : ''
        return `
            <div class='select-editor ${hasLabel}'>
                ${label ? `<label>${label}</label>` : '' }
                <select ref='$options'></select>
                ${iconView ? `<div class='icon'>${icon.expand}</div>` : '' } 
            </div>
        `
    }

    getValue () {
        return this.refs.$options.value; 
    }

    setValue (value) {
        this.state.value = value + ''; 
        this.refs.$options.val(this.state.value);
        // this.refresh()
    }

    refresh(reload = false) {

        if (reload) {
            this.refs.$options.val(this.state.value);
        } else {
            this.load();
        }

    }

    [BIND('$options')] () {
        return {
            // 'disabled': this.state.options.length === 1,
            'data-count': this.state.options.length.toString()
        }
    }

    [LOAD('$options')] () {
        return this.state.options.map(it => {

            var selected = it === this.state.value ? 'selected' : '' 
            var value = it; 
            var label = it; 

            if (label === '') {
                label = this.props['none-value'] ? this.props['none-value'] : '< none-value >'
            } else if (label === '-') {
                label = '----------'
                value = ''; 
            }

            return `<option ${selected} value="${value}">${label}</option>`
        })
    }

    [CHANGE('$options')] () {
        this.updateData({
            value: this.refs.$options.value 
        })
    }


    updateData (data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }
}