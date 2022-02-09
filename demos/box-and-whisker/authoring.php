<?php
include_once '../config.php';

$request = '
{
  "config": {
    "dependencies": {
      "question_editor_api": {
        "init_options": {
          "question_type_templates": {
            "custom_box_and_whisker": [
              {
                "name": "Custom Question - Box & Whisker",
                "description": "A custom question type - Box & Whisker",
                "group_reference": "other",
                "defaults": {
                  "type": "custom",
                  "stimulus": "Draw a <b>box &amp; whisker</b> chart for the following: <b>6, 2, 5, 3, 6, 10, 11, 6</b>",
                  "js": {
                    "question": "/dist/question.js",
                    "scorer": "/dist/scorer.js"
                  },
                  "css": "/dist/question.css",
                  "line_min": 1,
                  "line_max": 19,
                  "step": 1,
                  "min": 2,
                  "max": 14,
                  "quartile_1": 4,
                  "median": 6,
                  "quartile_3": 10,
                  "score": 1,
                  "valid_response": {
                    "type": "object",
                    "value": {
                      "min": 4,
                      "max": 8,
                      "quartile_1": 5,
                      "median": 6,
                      "quartile_3": 7
                    }
                  },
                  "instant_feedback": true
                }
              }
            ]
          },
          "custom_question_types": [
            {
              "custom_type": "custom_box_and_whisker",
              "type": "custom",
              "name": "Custom Question - Box And Whisker",
              "editor_layout": "/authoring_custom_layout.html",
              "js": {
                "question": "/dist/question.js",
                "scorer": "/dist/scorer.js"
              },
              "css": "/dist/question.css",
              "version": "v1.0.0",
              "editor_schema": {
                "hidden_question": false,
                "properties": {
                  "line_min": {
                    "type": "number",
                    "name": "Minimum range",
                    "description": "Set minimum range.",
                    "required": true,
                    "default": 0
                  },
                  "line_max": {
                    "type": "number",
                    "name": "Maximum range",
                    "description": "Set maximum range.",
                    "required": true,
                    "default": 20
                  },
                  "min": {
                    "type": "number",
                    "name": "Min",
                    "description": "Set default min value.",
                    "required": true
                  },
                  "max": {
                    "type": "number",
                    "name": "Max",
                    "description": "Set default max value.",
                    "required": true
                  },
                  "step": {
                    "type": "number",
                    "name": "Step",
                    "description": "Set snap to range step value.",
                    "required": true,
                    "default": 1
                  },
                  "quartile_1": {
                    "type": "number",
                    "name": "Quartile 1",
                    "description": "Set default first quartile value.",
                    "required": true
                  },
                  "median": {
                    "type": "number",
                    "name": "Median",
                    "description": "Set default median value.",
                    "required": true
                  },
                  "quartile_3": {
                    "type": "number",
                    "name": "Quartile 3",
                    "description": "Set default last quartile value.",
                    "required": true
                  },
                  "valid_response": {
                    "name": "Set correct answer(s)",
                    "description": "In this section, configure the correct answer(s) for the question.",
                    "type": "question",
                    "white_list": ["line_min", "line_max", "min", "max", "step", "quartile_1", "median", "quartile_3"]
                  },
                  "score": {
                    "name": "Point(s)",
                    "description": "Score awarded for the correct response(s).",
                    "type": "number",
                    "required": true,
                    "default": 1
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
    <title>Author API - Box & Whisker</title>
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
    document.querySelector('[data-type="htmlLayout"] > textarea').value = `<?php echo (file_get_contents('authoring_custom_layout.html')) ?>`;
</script>
</body>
</html>
