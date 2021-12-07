<?php
include_once '../config.php';

$request = '
{
  "config": {
    "dependencies": {
      "question_editor_api": {
        "init_options": {
          "question_type_templates": {
            "custom_question_skeleton": [
              {
                "name": "Custom Question - Skeleton",
                "description": "A clean custom question - Skeleton",
                "group_reference": "other",
                "defaults": {
                  "type": "custom",
                  "stimulus": "This is stimulus",
                  "js": {
                    "question": "/dist/question.js",
                    "scorer": "/dist/scorer.js"
                  },
                  "css": "/dist/question.css",
                  "instant_feedback": true
                }
              }
            ]
          },
          "custom_question_types": [
            {
              "custom_type": "custom_question_skeleton",
              "type": "custom",
              "name": "Custom Question - Skeleton",
              "editor_layout": "/authoring_custom_layout.html",
              "js": {
                "question": "/dist/question.js",
                "scorer": "/dist/scorer.js"
              },
              "css": "/dist/question.css",
              "version": "v1.0.0",
              "editor_schema": {
                "hidden_question": false,
                "instant_feedback": {
                  "name": "Check answer button",
                  "description": "Enables the Check Answer button underneath the question, which will provide the student with instant feedback on their response(s).",
                  "type": "boolean",
                  "required": false,
                  "default": false
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
    document.querySelector('[data-type="htmlLayout"] > textarea').value = `<?php echo (file_get_contents('authoring_custom_layout.html')) ?>`;
</script>
</body>
</html>
