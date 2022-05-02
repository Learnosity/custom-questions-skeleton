import React, { useState } from 'react';
import classnames from 'classnames';

export default function SimpleInput(props){
    const {
        state,
        maxLength,
        disabled,
        responseValue,
        validationUIState,
        requestToResetValidationUIState,
        onChange
    } = props;
    const isReviewState = state === 'review';
    const [inputValue, setInputValue] = useState(responseValue);

    const onInputChange = (e) => {
        if (!isReviewState) {
            const newValue = e.currentTarget.value;

            setInputValue(newValue);
            onChange(newValue);
        }
    };
    const onInputFocus = () => {
        if (!isReviewState) {
            requestToResetValidationUIState();
        }
    };
    const resValidatedClassNames = classnames({
        lrn_correct: validationUIState === 'correct',
        lrn_incorrect: validationUIState === 'incorrect'
    }, 'lrn_textinput');

    return (
        <div className="lrn_widget lrn_shorttext">
            <div className="lrn_response_wrapper">
                <div className="lrn_response lrn_clearfix">
                    <div className={resValidatedClassNames}>
                        <input
                            type="text"
                            value={inputValue}
                            maxLength={maxLength}
                            onChange={onInputChange}
                            onFocus={onInputFocus}
                            disabled={isReviewState || disabled}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
