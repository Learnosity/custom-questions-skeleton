<?php
require_once '../config.php';

$request = '{
    "questions": [
        {
          "response_id": "ID-001",
          "type": "custom",
          "stimulus": "Draw a <b>box &amp; whisker</b> chart for the following: <b>6, 2, 5, 3, 6, 10, 11, 6</b>",
          "js": {
            "question": "/dist/question.js",
            "scorer": "/dist/scorer.js"
          },
          "width": 600,
          "height": 200,
          "line_min": 1,
          "line_max": 19,
          "step": 0.5,
          "range": [2, 14],
          "quartiles": [4, 6, 10],
          "validation": {
            "valid_response": {
                "score": 1,
                "value": {
                    "range": [2, 11],
                    "quartiles": [4, 6, 8.5]
                }
            }
          }
        }
    ]
}';

$signedRequest = signRequest(json_decode($request, true));

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Client-side Box & Whisker</title>
    <script src="//questions.learnosity.com"></script>
</head>
<body>
<span class="learnosity-response question-ID-001"></span>
<script>
    const activity = <?php echo $signedRequest; ?>;

    window.questionsApp = LearnosityApp.init(activity, {
        readyListener: () => {
            console.log('ready');
        },
        errorListener: (e) => {
            console.error(e);
        }
    });
</script>
</body>
</html>