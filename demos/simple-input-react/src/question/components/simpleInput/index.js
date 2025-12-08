import React, { useState, useEffect } from "react";
import classnames from "classnames";
import Editor from "@monaco-editor/react";
export default function SimpleInput(props) {
  const {
    state,
    maxLength,
    disabled,
    responseValue,
    validationUIState,
    requestToResetValidationUIState,
    onChange,
    resetState,
    testCases,
  } = props;
  const isReviewState = state === "review";
  const [inputValue, setInputValue] = useState(responseValue);

  useEffect(() => {
    // reset input value when resetState is 'reset'
    if (resetState === "reset") {
      setInputValue("");
    }
  }, [resetState]);

  const onInputChange = (e) => {
    if (!isReviewState) {
      const newValue = e;

      setInputValue(newValue);
      onChange(newValue);
    }
  };
  const onInputFocus = () => {
    if (!isReviewState) {
      requestToResetValidationUIState();
    }
  };
  const resValidatedClassNames = classnames(
    {
      lrn_correct: validationUIState === "correct",
      lrn_incorrect: validationUIState === "incorrect",
    },
    "lrn_textinput"
  );

  const getDefaultValue = () => {
    // The default value for the editor is a single function called "solution"
    // that takes params based on the first test cases args
    return `function solution(${Object.keys(testCases[0].input).join(", ")}) {
  // enter your solution here
}`;
  };

  // useEffect(() => {
  //   setInputValue(getDefaultValue());
  // }, []);

  return (
    <div className="lrn_widget lrn_shorttext">
      <div className="lrn_response_wrapper">
        <div className="lrn_response lrn_clearfix">
          <div className={resValidatedClassNames}>
            <Editor
              height="40vh"
              defaultLanguage="javascript"
              defaultValue={getDefaultValue()}
              // // value={inputValue}
              onChange={onInputChange}
              onFocus={onInputFocus}
              disabled={isReviewState || disabled}
            />
            {/* <input
              type="text"
              value={inputValue}
              maxLength={maxLength}
              onChange={onInputChange}
              onFocus={onInputFocus}
              disabled={isReviewState || disabled}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
