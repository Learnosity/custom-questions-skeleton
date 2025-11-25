<?php
include_once '../config.php';

// import the question json file where clients have created their question json
$questionJson = file_get_contents('./question.json');
$responseId = "custom-$sessionId";
// pull the question json into the questions array below.
$request = '{
    "state": "' . $state . '",
    "session_id": "' . $sessionId . '",
    "showCorrectAnswers": true,
    "questions": [
        '.$questionJson.'
    ]
}';

$requestData = json_decode($request, true);
// add the response id to the request data after it has been transformed to a php array.
$requestData['questions'][0]['response_id'] = $responseId;

$signedRequest = signAssessmentRequest($requestData);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Questions API - Skeleton</title>
    <script src="//questions.learnosity.com"></script>
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
