<?php
include_once '../config.php';

$responseId = "custom-$sessionId";
$request = '{
    "state": "' . $state . '",
    "session_id": "' . $sessionId . '",
    "showCorrectAnswers": true,
    "questions": [
        {
          "response_id": "' . $responseId . '",
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
    ]
}';
$requestData = json_decode($request, true);

$signedRequest = signAssessmentRequest($requestData);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Questions API - Box & Whisker</title>
    <script src="//questions.staging.learnosity.com"></script>
    <style>
        <?php echo(file_get_contents('../sharedStyle.css')); ?>
    </style>
</head>
<body>
<div class="client-question-info">
    Response ID: <code><?php echo $responseId; ?></code>
</div>
<span class="learnosity-response question-<?php echo $responseId; ?>"></span>
<div class="client-save-wrapper">
    <span class="learnosity-save-button"></span>
</div>
<div id="redirect_response" class="client-hidden">
    Save Successful! Do you want to go to
    <button type="button" class="client-btn" data-action="resume">Resume</button> or
    <button type="button" class="client-btn" data-action="review">Review</button> mode ?
</div>
<div class="client-request-json">
    <div><b>Request init options</b></div>
    <textarea readonly></textarea>
</div>

<script>
    window.activity = <?php echo $signedRequest; ?>;

    window.questionsApp = LearnosityApp.init(activity, {
        readyListener() {
            console.log('ready');
        },
        errorListener(e) {
            console.error(e);
        },
        saveSuccess(responseIds) {
            console.log('save success', responseIds);

            // for sharedScript.js to display resume/review options
            if (window.__onSaveSuccess) {
                window.__onSaveSuccess(responseIds);
            }
        },
    });

    <?php echo file_get_contents('../sharedAssessmentScript.js'); ?>
</script>
</body>
</html>
