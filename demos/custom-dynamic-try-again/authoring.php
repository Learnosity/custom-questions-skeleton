<?php
include_once '../config.php';

$init_options = file_get_contents('./question_editor_init_options.json');

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
        "init_options": '.$init_options.'
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

    window.authorApp = LearnosityAuthor.init(activity, {
        readyListener() {
            console.log('ready');
            /**
             * add the same dynamic data
             * to the dybamic data table in the item
             * so that the author can preview it 
             * when authoring the demo custom question
             */
            authorApp.once('render:item', () => {
  const dataTableJson = {
    cols: ['value', 'fromUnit', 'toUnit', 'answer'],
    rows: {
      'f60099f1-b5fa-4bf5-b1d9-b88cd10ab33c': { values: ['100', 'cm', 'm', '1'], index: 0 },
      'e791389f-b2bb-4fc6-894d-4e8ebc2ab071': { values: ['5', 'km', 'm', '5000'], index: 1 },
      '98fe2d62-3e87-470c-a689-1b98a7b2db84': { values: ['0', '°C', '°F', '32'], index: 2 },
      'b08d31c7-8ef3-4c8e-ab92-07881be58940': { values: ['3', 'hours', 'minutes', '180'], index: 3 }
    }
  };
              let itemJson = authorApp.getItem();
              itemJson.item.dynamic_content_data = dataTableJson;
              authorApp.setItemJson(itemJson);
            })
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
