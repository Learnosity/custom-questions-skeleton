console.log(`
==============================================================================================
THE SCRIPT BELOW IS BEING USED TO TEST THE SERVER SIDE SCORING FOR YOUR CUSTOM QUESTION
----
Update the questionResponseJson with your question json & response
==============================================================================================
`);

// QuestionResponseJson that will be used to test your Scorer logic
const questionResponseJson = {
    question: {
  "type": "custom",
  "qualified": {
    "embedManagerOptions": {
      "embedClientKey": "g39RsSfAYEkyRG8ZYjxrpT9c/XqnfQpN",
      "language": "javascript"
    },
    "embedEditorOptions": {
      "challengeId": "5f029b271dbad30012978cd5"
    }
  },
  "js": {
    "question": "/dist/question.js",
    "scorer": "/dist/scorer.js"
  },
  "css": "/dist/question.css",
  "instant_feedback": false
        // TODO - requires implementation - add the rest of your question json
    },
    response: {
        // TODO - Requires implementation - the shape of your question response
        // value:
  "type": "attempt",
  "stdout": "",
  "stderr": "",
  "exitCode": 2,
  "wallTime": 828,
  "timedOut": false,
  "message": "",
  "token": "",
  "result": {
    "serverError": false,
    "completed": false,
    "output": [
      {
        "t": "describe",
        "v": "sayHello",
        "p": false,
        "items": [
          {
            "t": "it",
            "v": "should say hello",
            "p": false,
            "items": [
              {
                "t": "failed",
                "v": "expected 'Qualified' to equal 'Hello, Qualified!'"
              },
              {
                "t": "completedin",
                "v": "1"
              }
            ]
          },
          {
            "t": "it",
            "v": "should handle blank input",
            "p": false,
            "items": [
              {
                "t": "failed",
                "v": "expected '' to equal 'Hello there!'"
              },
              {
                "t": "completedin",
                "v": "0"
              }
            ]
          },
          {
            "t": "completedin",
            "v": "1"
          }
        ]
      }
    ],
    "successMode": "specs",
    "passed": 0,
    "failed": 2,
    "errors": 0,
    "error": null,
    "assertions": {
      "passed": 0,
      "failed": 2,
      "hidden": {
        "passed": 0,
        "failed": 0
      }
    },
    "specs": {
      "passed": 0,
      "failed": 2,
      "hidden": {
        "passed": 0,
        "failed": 0
      }
    },
    "unweighted": {
      "passed": 0,
      "failed": 2
    },
    "weighted": {
      "passed": 0,
      "failed": 2
    },
    "timedOut": false,
    "wallTime": 828,
    "testTime": 1,
    "tags": null
  },
  "flags": {
    "success": true,
    "timeout": false,
    "executionFailure": false,
    "empty": false,
    "passed": false
  },
  "fileData": {
    "files": {
      "code": "const sayHello = name => {\n  return name\n};\n",
      "testcases": "const {assert, config} = require(\"chai\");\nconfig.truncateThreshold = 0;\n\n// These example test cases are editable, feel free to add\n// your own tests to debug your code.\n\ndescribe(\"sayHello\", () => {\n  it(\"should say hello\", () => {\n    assert.strictEqual(sayHello(\"Qualified\"), \"Hello, Qualified!\");\n  });\n});\n"
    },
    "cursor": {
      "path": "code",
      "line": 0,
      "ch": 0
    }
  }

    }
};

// Path to the scorer file that you need to debug
const scorerUrl = './dist/scorer.js';

// Mock LearnosityAmd object that will be used to transform the scorer into a class that we can use to debug later on
global.LearnosityAmd = {
    define: ([], resolveCallback) => {
        if (!resolveCallback) {
            throw new Error('No callback to resolve Scorer exists');
        }

        const result = resolveCallback();

        if (!result.Scorer) {
            throw new Error('No Scorer class');
        }

        runTest(result.Scorer, questionResponseJson.question, questionResponseJson.response);
    }
};

// Load the Scorer
require(scorerUrl);

function runTest(Scorer, question, response) {
    const scorer = new Scorer(question, response);

    console.log(`
**************
TEST OUTPUT
**************
    `);

    console.log('isValid:', scorer.isValid());
    console.log('validateIndividualResponses:', scorer.validateIndividualResponses());
    console.log('score:', scorer.score());
    console.log('score:', scorer.maxScore());
}
