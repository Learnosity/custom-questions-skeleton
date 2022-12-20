<?php
include_once '../config.php';

$request = '
{
  "config": {
    "dependencies": {
      "question_editor_api": {
        "init_options": {
          "question_type_groups": [
            {
                "name": "Custom Question Types",
                "reference": "custom_q_types"
            }
          ],
          "question_type_templates" : {
            "custom_piano_question" : {
              "name" : "Custom Question - Piano",
              "description" : "A custom question type - Piano",
              "group_reference" : "custom_q_types",
              "defaults" : {
                "stimulus" : "<span>Your question here. Example: </span><br><strong>Identify the notes of a C major chord on the piano. Any inversion is permissible. Click a key to hear the note.</strong>",
                "type" : "custom",
                "js": {
                  "question": "/dist/question.js",
                  "scorer": "/dist/scorer.js"
                },
                "css": "/dist/question.css",
                "valid_response": {
                  "notes" : ["C", "E", "G"],
                  "indecies" : [0,4,7]
                },
                "instant_feedback" : true,
                "score": 1
              }
            }
          },
          "custom_question_types": [
            {
              "custom_type": "custom_piano_question",
              "type": "custom",
              "name": "Custom Piano Question",
              "editor_layout": "/dist/piano_question_authoring.html",
              "js": {
                "question": "/dist/question.js",
                "scorer": "/dist/scorer.js"
              },
              "css": "/dist/question.css",
              "version": "v1.0.0",
              "editor_schema": {
                "hidden_question": false,
                "properties": {
                    "instant_feedback": {
                      "name": "Check answer button",
                      "description": "Enables the Check Answer button underneath the question, which will provide the student with instant feedback on their response(s).",
                      "type": "boolean",
                      "required": false,
                      "default": false
                    },
                    "valid_response" : {
                      "type" : "question",
                      "name" : "Set correct answer(s)",
                      "description" : "Correct answer for the question",
                      "whitelist_attributes" : ["valid_response", "value"]
                    },
                    "score" : {
                      "type" : "number",
                      "name": "Score",
                      "description": "Score for a correct answer.",
                      "required": true,
                      "default": 1
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
    <title>Author API - Piano</title>
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
    document.querySelector('[data-type="htmlLayout"] > textarea').value = `<?php echo (file_get_contents('dist/piano_question_authoring.html')) ?>`;
</script>
</body>
</html>
