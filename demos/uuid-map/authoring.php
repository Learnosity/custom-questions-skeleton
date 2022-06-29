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
                  "custom_type": "uuid-map",
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
              "editor_layout": "/dist/authoring_custom_layout.html",
              "js": {
                "question": "/dist/question.js",
                "scorer": "/dist/scorer.js"
              },
              "css": "/dist/question.css",
              "version": "v1.0.0",
              "editor_schema": {
                "hidden_question": false,
                "properties": {
                    "custom_id": {
                        "type": "string",
                        "required": true
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

    window.authorApp = LearnosityAuthor.init(activity, {
        readyListener() {
            const uuidv4 = () => {
                return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                );
            };

            console.log('ready');

            window.authorApp.on('widgetedit:widget:ready', () => {
                console.log('Editing widget layout is ready, we can start modifying the widget json');

                const currentWidget = window.authorApp.getWidget();

                // check if we are editing the right "custom" question type
                if (
                    currentWidget.type === 'custom' &&
                    //client should make up a unique name for their custom question, we set this through the question template above
                    currentWidget.custom_type === 'uuid-map' &&
                    // unique id the client wants to generate if it's not there
                    !currentWidget.custom_id
                ) {
                    const customIdAttribute = window.authorApp.editorApp().attribute('custom_id');

                    customIdAttribute.setValue(uuidv4());
                }
            });
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
