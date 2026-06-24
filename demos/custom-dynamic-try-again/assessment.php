<?php
include_once '../config.php';

$questionJson = file_get_contents('./question.json');
$responseId = "custom-dynamic-try-again-$sessionId";

$request = '{
    "state": "' . $state . '",
    "session_id": "' . $sessionId . '",
    "showCorrectAnswers": true,
    "questions": [
        '.$questionJson.'
    ]
}';

$requestData = json_decode($request, true);
$requestData['questions'][0]['response_id'] = $responseId;

$signedRequest = signAssessmentRequest($requestData);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Custom Question — Dynamic Content Try Again</title>
    <script src="//questions.dev.learnosity.com"></script>
    <style>
        <?php echo(file_get_contents('../sharedStyle.css')); ?>

        .demo-controls {
            margin: 16px 0;
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
        }
        .btn-try-again {
            padding: 10px 24px;
            background: #4a90e2;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s;
        }
        .btn-try-again:hover  { background: #357abd; }
        .btn-try-again:disabled { background: #b0c8e8; cursor: not-allowed; }
        .attempt-counter {
            font-size: 0.9rem;
            color: #666;
        }
        .demo-note {
            margin: 12px 0;
            padding: 12px 16px;
            background: #fff8e1;
            border-left: 4px solid #ffc107;
            border-radius: 4px;
            font-size: 0.875rem;
            color: #555;
        }
        .demo-note code { background: #f0f0f0; padding: 1px 5px; border-radius: 3px; }
    </style>
</head>
<body>
<div class="client-question-info">
    Response ID: <code><?php echo $responseId; ?></code>
</div>

<div class="demo-note">
    <strong>Demo: Dynamic Content Try Again for Custom Questions.</strong><br>
    The <em>Try Again</em> button calls <code>facade.dynamic.nextAttempt()</code>.
    The platform updates the question data and fires <code>dynamicContent:changed</code> on the facade.
    The custom widget listens for this event and re-renders the card with the new values.
    If the widget did <em>not</em> implement this handler, the card would stay frozen on the first attempt's data.
</div>

<span class="learnosity-response question-<?php echo $responseId; ?>"></span>

<div class="demo-controls">
    <button id="btn-try-again" class="btn-try-again" style="display:none">
        Try Again
    </button>
    <span id="attempt-counter" class="attempt-counter"></span>
</div>

<div class="client-save-wrapper">
    <span class="learnosity-save-button"></span>
</div>

<div id="redirect_response" class="client-hidden">
    Save successful! Go to
    <button type="button" class="client-btn" data-action="resume">Resume</button> or
    <button type="button" class="client-btn" data-action="review">Review</button>?
</div>

<div class="client-request-json">
    <div><b>Request init options</b></div>
    <textarea readonly></textarea>
</div>

<script>
    const responseId = '<?php echo $responseId; ?>';

    window.activity = <?php echo $signedRequest; ?>;

    window.questionsApp = LearnosityApp.init(activity, {
        readyListener() {
            console.log('ready');

            window.question = questionsApp.question(responseId);

            // Only show the Try Again button when dynamic content is active.
            if (question.dynamic) {
                const btn = document.getElementById('btn-try-again');
                btn.style.display = 'inline-block';

                updateAttemptCounter(window.question);

                btn.addEventListener('click', () => {
                    // Move to the next attempt row.
                    // The platform will update model state, persist the current response,
                    // and fire 'dynamicContent:changed' on the facade so the widget can re-render.
                    window.question.dynamic.nextAttempt();
                    updateAttemptCounter(window.question);
                });
            }
        },
        errorListener(e) {
            console.error(e);
        },
        saveSuccess(responseIds) {
            console.log('save success', responseIds);
            if (window.__onSaveSuccess) {
                window.__onSaveSuccess(responseIds);
            }
        }
    });

    function updateAttemptCounter(question) {
        const current = question.dynamic.currentAttemptIndex() + 1;
        const total   = question.dynamic.totalAttempts();
        document.getElementById('attempt-counter').textContent =
            'Attempt ' + current + ' of ' + total;
    }

    <?php echo file_get_contents('../sharedAssessmentScript.js'); ?>
</script>
</body>
</html>
