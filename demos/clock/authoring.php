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
            "custom_clock_question" : {
              "name" : "Custom Question - Clock",
              "description" : "A custom question type - Clock",
              "group_reference" : "custom_q_types",
              "defaults" : {
                "stimulus" : "<span>Your question here. Example: </span><br>Oh no! The hands on the clock have gotten all messed up! Help fix the clock by moving the hands to show what time it is! <br><strong>Drag the hands to show 4:30 on the clock.</strong>",
                "type" : "custom",
                "js": {
                  "question": "/dist/question.js",
                  "scorer": "/dist/scorer.js"
                },
                "css": "/dist/question.css",
               "valid_response" : {
                "hourHandAngle": 45, 
                "minHandAngle": 90
              },
                "score": 1,
                "max_score" : 1
              }
            }
          },
          "custom_question_types": [
            {
              "custom_type": "custom_clock_question",
              "type": "custom",
              "name": "Custom clock Question",
              "editor_layout": "/dist/clock_question_authoring.html",
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
                      "default": true
                    },
                    "valid_response": {
                      "name": "Set correct answer(s)",
                      "description": "In this section, configure the correct answer(s) for the question.",
                      "type": "question",
                      "white_list": ["minHandAngle", "hourHandAngle", "value"]
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
    <title>Author API - Skeleton</title>
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
    document.querySelector('[data-type="htmlLayout"] > textarea').value = `<?php echo (file_get_contents('dist/clock_question_authoring.html')) ?>`;
</script>
</body>
</html>
