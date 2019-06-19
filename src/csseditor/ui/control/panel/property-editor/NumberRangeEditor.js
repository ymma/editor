import UIElement, { EVENT } from "../../../../../util/UIElement";
import { Length } from "../../../../../editor/unit/Length";
import { LOAD, INPUT, CLICK } from "../../../../../util/Event";
import { EMPTY_STRING } from "../../../../../util/css/types";
import icon from "../../../icon/icon";
import { html } from "../../../../../util/functions/func";

export default class NumberRangeEditor extends UIElement {

    initState() {
        var value = Length.parse(this.props.value || Length.number(0));

        value = value.toUnit('number');
        return {
            removable: this.props.removable === 'true',
            label: this.props.label || '',
            min: +this.props.min || 0,
            max: +this.props.max || 100,
            step: +this.props.step || 1,
            key: this.props.key,
            params: this.props.params || '',
            layout: this.props.layout || '',
            value
        }
    }

    template () {
        return `<div class='small-editor' ref='$body'></div>`
    }

    [LOAD('$body')] () {

        var { min, max, step, label, type, removable, layout } = this.state

        var value = +this.state.value.value.toString()

        if (isNaN(value)) {
            value = 0
        }

        var hasLabel = !!label ? 'has-label' : EMPTY_STRING
        var isRemovable = removable ? 'is-removable' : EMPTY_STRING;
        var layoutClass = layout;

        var realValue = (+value).toString();
        
        return html`
        <div class='number-range-editor ${hasLabel} ${isRemovable} ${layoutClass}' data-selected-type='${type}' ref='$range'>
            ${label ? `<label>${label}</label>` : EMPTY_STRING }
            <div class='range-editor-type' data-type='range'>
                <div class='area'>
                    <input type='range' ref='$property' value="${realValue}" min="${min}" max="${max}" step="${step}" />
                    <input type='number' ref='$propertyNumber' value="${realValue}" min="${min}" max="${max}" step="${step}" />
                </div>
            </div>
            <button type='button' class='remove' ref='$remove'>${icon.close}</button>
        </div>
    `
    }

    getValue() {
        return this.state.value; 
    }

    setValue (value) {
        this.setState({
            value: Length.parse(value)
        })
    }

    [CLICK('$remove')] (e) {
        this.updateData({
            value: ''
        })
    }

    updateData (data) {
        this.setState(data, false)
        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }

    [INPUT('$propertyNumber')] (e) {

        var value = +this.getRef('$propertyNumber').value; 
        this.getRef('$property').val(value);

        this.updateData({ 
            value: this.state.value.set(value)
        });

    }


    [INPUT('$property')] (e) {
        var value = +this.getRef('$property').value; 
        this.getRef('$propertyNumber').val(value);

        if (this.state.value === '') {
            this.state.value = Length.number(0)
        }

        this.updateData({ 
            value: this.state.value.set(value)
        });
    }
}