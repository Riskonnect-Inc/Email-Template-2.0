/**
 * BSD 3-Clause License
 *
 * Copyright (c) 2021, Avonni Labs, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * - Neither the name of the copyright holder nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { LightningElement, api } from 'lwc';
import { assert } from 'c/utilsPrivate';

import ComboboxTpl from './avonniCombobox.html';
import DefaultTpl from './avonniDefault.html';

const CUSTOM_TYPES_TPL = {
    combobox: ComboboxTpl
};

const INVALID_TYPE_FOR_EDIT =
    'column custom type not supported for inline edit';

export default class AvonniPrimitiveDatatableIeditTypeFactory extends LightningElement {
    @api editedValue;
    @api required;
    @api disabled;

    // combobox attributes
    @api dropdownLength;
    @api isMultiSelect;
    @api options;
    @api placeholder;

    @api
    get columnDef() {
        return this._columnDef;
    }

    set columnDef(value) {
        assert(
            // eslint-disable-next-line no-prototype-builtins
            CUSTOM_TYPES_TPL.hasOwnProperty(value.type),
            INVALID_TYPE_FOR_EDIT
        );
        this._columnDef = value;
        this.columnLabel = value.label;
    }

    get columnType() {
        return this._columnDef.type;
    }

    render() {
        return CUSTOM_TYPES_TPL[this.columnType] || DefaultTpl;
    }

    connectedCallback() {
        this._blurHandler = this.handleComponentBlur.bind(this);
        this._focusHandler = this.handleComponentFocus.bind(this);
        this._changeHandler = this.handleComponentChange.bind(this);
    }

    renderedCallback() {
        this.concreteComponent.addEventListener('blur', this._blurHandler);
        this.concreteComponent.addEventListener('focus', this._focusHandler);
        this.concreteComponent.addEventListener('change', this._changeHandler);
        if (this.concreteComponent) {
            this.concreteComponent.focus();
        }
    }

    /**
     * Gets the data inputable element.
     *
     * @type {Element}
     */
    get concreteComponent() {
        return this.template.querySelector('[data-inputable="true"]');
    }

    @api
    focus() {
        if (this.concreteComponent) {
            this.concreteComponent.focus();
        }
    }

    @api
    get value() {
        return this.concreteComponent.value;
    }

    @api
    get validity() {
        return this.concreteComponent.validity;
    }

    @api
    showHelpMessageIfInvalid() {
        this.concreteComponent.showHelpMessageIfInvalid();
    }

    handleComponentFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleComponentBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleComponentChange() {
        this.showHelpMessageIfInvalid();
    }

    handleOnChange(event) {
        this.dispatchEvent(
            new CustomEvent('inlineeditchange', {
                detail: {
                    value: event.detail.value,
                    validity: this.validity.valid
                },
                bubbles: true,
                composed: true
            })
        );
    }
}