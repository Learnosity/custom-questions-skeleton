<?php
include_once '../config.php';

$request = '
{
  "config": {
    "dependencies": {
      "question_editor_api": {
        "init_options": {
          "question_type_templates": {
            "custom_question_simple_input": [
              {
                "name": "Custom Question - Simple Input",
                "description": "A clean custom question - Simple Input",
                "group_reference": "other",
                "defaults": {
                  "type": "custom",
                  "stimulus": "This is stimulus",
                  "js": {
                    "question": "/dist/question.js",
                    "scorer": "/dist/scorer.js"
                  },
                  "css": "/dist/question.css",
                  "max_length": 25,
                  "valid_response": {
                    "value": "",
                    "score": 1
                  },
                  "instant_feedback":true
                }
              }
            ]
          },
          "custom_question_types": [
            {
              "custom_type": "custom_question_simple_input",
              "type": "custom",
              "name": "Custom Question - Simple Input",
              "editor_layout": "/authoring_custom_layout.html",
              "js": {
                "question": "/dist/question.js",
                "scorer": "/dist/scorer.js"
              },
              "css": "/dist/question.css",
              "version": "v1.0.0",
              "editor_schema": {
                "hidden_question": false,
                "attributes": {
                  "max_length": {
                    "default": 20,
                    "description": "Maximum number of characters that can be entered in the field. Maximum value is 250. For longer questions use longtext type.",
                    "name": "Max text input length",
                    "required": false,
                    "type": "number",
                    "group": "basic",
                    "editorV3": {
                      "description": "Maximum number of characters that can be entered in the text entry area. Maximum 250 characters."
                    }
                  },
                  "valid_response": {
                    "name": "Set correct answer(s)",
                    "description": "In this section, configure the correct answer(s) for the question.",
                    "type": "object",
                    "attributes": {
                      "value": {
                        "name": "Correct Answer",
                        "required": true,
                        "type": "string",
                        "default": "",
                        "editorV3": {
                          "element": "question",
                          "white_list": [
                            "max_length"
                          ],
                          "description": ""
                        }
                      },
                      "score": {
                        "name": "Point(s)",
                        "description": "Score awarded for the correct response(s).",
                        "type": "number",
                        "required": true,
                        "default": 1
                      }
                    }
                  },
                  "instant_feedback": {
                    "name": "Check answer button",
                    "description": "Enables the Check Answer button underneath the question, which will provide the student with instant feedback on their response(s).",
                    "type": "boolean",
                    "required": false,
                    "default": false
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
    <title>Author API - Skeleton</title>
    <script src="//authorapi.staging.learnosity.com"></script>
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
