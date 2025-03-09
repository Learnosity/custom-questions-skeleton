<?php
include_once '../config.php';
$featureJson = file_get_contents('./feature.json');
$featureId = "custom-$sessionId";
$request = '{
    "state": "' . $state . '",
    "session_id": "' . $sessionId . '",
    "features": [
        '.$featureJson.'
    ]
}';
$requestData = json_decode($request, true);
// add the feature id to the request data after it has been transformed to a php array.
$requestData['features'][0]['feature_id'] = $featureId;

$signedRequest = signAssessmentRequest($requestData);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Custom Feature Skeleton</title>
    <script src="//questions.learnosity.com"></script>
    <style>
        <?php echo(file_get_contents('../sharedStyle.css')); ?>
    </style>
</head>
<body>
<div class="client-question-info">
    Feature ID: <code><?php echo $featureId; ?></code>
</div>
<span class="learnosity-feature feature-<?php echo $featureId; ?>"></span>
<div class="client-save-wrapper client-hidden">
    <span class="learnosity-save-button"></span>
</div>
<div id="redirect_response">
    Click here to view your custom feature in 
    <button type="button" class="client-btn client-hidden" data-action="resume">Resume</button>
    <button type="button" class="client-btn" data-action="review">Review</button> mode.
</div>
<div class="client-request-json">
    <div><b>Request init options</b></div>
    <textarea readonly></textarea>
</div>

<script>
    window.activity = <?php echo $signedRequest; ?>;

    window.questionsApp = LearnosityApp.init(activity, {
        readyListener() {
            console.log('questionApp.ready');
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
