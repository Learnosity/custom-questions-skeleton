<?php
include_once '../config.php';

$request = '
{
  "config": {
    "item_edit": {
      "item": {
        "dynamic_content": true
      }
    },
    "dependencies": {
      "question_editor_api": {
        "init_options": {
          "question_type_templates": {
            "custom_dynamic_try_again": [
              {
                "name": "Custom Dynamic Try Again",
                "description": "A custom question demonstrating dynamic content with try again functionality",
                "group_reference": "other",
                "defaults": {
                  "type": "custom",
                  "stimulus": "Unit Conversion. You will be given a value and two units. Convert the value from <b>{{var:fromUnit}}</b> to <b>{{var:toUnit}}</b>.",
                  "fromValue": "{{var:value}}",
                  "fromUnit": "{{var:fromUnit}}",
                  "toUnit": "{{var:toUnit}}",
                  "js": {
                    "question": "/dist/question.js",
                    "scorer": "/dist/scorer.js"
                  },
                  "css": "/dist/question.css",
                  "instant_feedback": true,
                  "validation": {
                    "valid_response": {
                      "score": 1,
                      "value": "{{var:answer}}"
                    }
                  },
                  "dynamic": {
                    "cols": ["value", "fromUnit", "toUnit", "answer"],
                    "rows": [
                      { "id": "id_0", "values": ["100", "cm", "m", "1"] },
                      { "id": "id_1", "values": ["5", "km", "m", "5000"] },
                      { "id": "id_2", "values": ["0", "°C", "°F", "32"] },
                      {
                        "id": "id_3",
                        "values": ["3", "hours", "minutes", "180"]
                      }
                    ]
                  },
                  "metadata": {
                    "dynamic_content": {
                      "try_again": {
                        "record_attempt_scores": true
                      }
                    }
                  }
                }
              }
            ]
          },
          "custom_question_types": [
            {
              "custom_type": "custom_dynamic_try_again",
              "type": "custom",
              "name": "Custom Dynamic Try Again",
              "editor_layout": "/dist/authoring_custom_layout.html",
              "js": {
                "question": "/dist/question.js",
                "scorer": "/dist/scorer.js"
              },
              "css": "/dist/question.css",
              "version": "v1.0.0",
              "editor_schema": {
                "hidden_question": false,
                "attributes": {
                  "stimulus": {
                    "name": "Stimulus",
                    "description": "The question stimulus",
                    "type": "string",
                    "required": true,
                    "default": "Unit Conversion. You will be given a value and two units. Convert the value from <b>{{var:fromUnit}}</b> to <b>{{var:toUnit}}</b>."
                  },
                  "fromValue": {
                    "name": "From Value",
                    "description": "The value to convert from",
                    "type": "string",
                    "required": false,
                    "default": "{{var:value}}",
                    "element": "editor"
                  },
                  "fromUnit": {
                    "name": "From Unit",
                    "description": "The unit to convert from",
                    "type": "string",
                    "required": false,
                    "element": "editor",
                    "default": "{{var:fromUnit}}"
                  },
                  "toUnit": {
                    "name": "To Unit",
                    "description": "The unit to convert to",
                    "type": "string",
                    "required": false,
                    "element": "editor",
                    "default": "{{var:toUnit}}"
                  },
                  "validation": {
                    "name": "Validation",
                    "description": "The validation settings for the question",
                    "type": "object",
                    "required": true,
                    "attributes": {
                      "valid_response": {
                        "name": "Valid response",
                        "description": "In this section, configure the correct answer(s) for the question.",
                        "type": "object",
                        "attributes": {
                          "value": {
                            "name": "Correct Answer",
                            "required": true,
                            "type": "string",
                            "default": "",
                            "element": "editor"
                          },
                          "score": {
                            "name": "Point(s)",
                            "description": "Score awarded for the correct response(s).",
                            "type": "number",
                            "required": true,
                            "default": 1
                          }
                        }
                      }
                    }
                  },
                  "instant_feedback": {
                    "name": "Check answer button",
                    "description": "Enables the Check Answer button underneath the question, which will provide the student with instant feedback on their response(s).",
                    "type": "boolean",
                    "required": false,
                    "default": true
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
}
';
$signedRequest = signAuthoringRequest(json_decode($request, true));

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Author API - Custom Dynamic Try Again</title>
    <script src="//authorapi.learnosity.com"></script>
    <style>
        <?php echo(file_get_contents('../sharedStyle.css')); ?>
    </style>
</head>
<body>
<div id="learnosity-author"></div>
<div>
    <div class="client-request-json" data-type="initOptions">
        <div><b>Request init options</b></div>
        <textarea readonly></textarea>
    </div>
    <div class="client-request-json" data-type="htmlLayout">
        <div><b>Custom Question HTML Layout</b></div>
        <textarea readonly></textarea>
    </div>
</div>

<script>
    window.activity = <?php echo $signedRequest; ?>;

    window.questionEditorApp = LearnosityAuthor.init(activity, {
        readyListener() {
            console.log('ready');
        },
        errorListener(e) {
            console.error(e);
        },
    });

    // Display the current request init options & html layout
    document.querySelector('[data-type="initOptions"] > textarea').value = `${JSON.stringify(window.activity, null, 2)}`;
    document.querySelector('[data-type="htmlLayout"] > textarea').value = `<?php echo (file_get_contents('dist/authoring_custom_layout.html')) ?>`;
</script>
</body>
</html>
