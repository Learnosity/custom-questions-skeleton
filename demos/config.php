<?php
include_once 'vendor/autoload.php';
use LearnositySdk\Request\Init;
use LearnositySdk\Utils\Uuid;

$sessionId = $_REQUEST['session_id'] ?? Uuid::generate();
$state = $_REQUEST['state'] ?? 'initial';

function getCredentials()
{
    return [
        'consumer_key' => 'yis0TYCu7U9V4o7M',
        'consumer_secret' => '74c5fd430cf1242a527f6223aebd42d30464be22'
    ];
}

function signAssessmentRequest($request)
{
    $credentials = getCredentials();
    $domain = $_SERVER['SERVER_NAME'];
    $timestamp = gmdate('Ymd-Hi');
    $security = array(
        'user_id'      => 'testing_user',
        'consumer_key' => $credentials['consumer_key'],
        'domain'       => $domain,
        'timestamp'    => $timestamp
    );

    $request = array_merge_recursive([
        'name' => 'test-name',
        'course_id' => 'test-course',
        'id' => 'test-id',
        'type' => 'submit_practice',
        'renderSaveButton' => true
    ], $request);

    $Init = new Init('questions', $security, $credentials['consumer_secret'], $request);

    return $Init->generate();
}

function signAuthoringRequest($request)
{
    $credentials = getCredentials();
    $domain = $_SERVER['SERVER_NAME'];
    $timestamp = gmdate('Ymd-Hi');
    $security = array(
        'user_id'      => 'testing_user',
        'consumer_key' => $credentials['consumer_key'],
        'domain'       => $domain,
        'timestamp'    => $timestamp
    );

    $request = array_merge_recursive([
        'mode' => 'item_edit',
        'reference' => Uuid::generate(),
        'user' => [
            'id' => 'demos@learnosity.com',
            'firstname' =>  'Demo',
            'lastname' =>  'User'
        ],
        'config' => [
            'global' => [
                'item_edit' => [
                    'item' => [
                        'back' => true,
                        'columns' => true,
                        'answers' => true,
                        'scoring' => true,
                        'reference' => [
                            'edit' => false,
                            'show' => false
                        ],
                        'save' => true,
                        'status' => false,
                        'dynamic_content' => true,
                        'shared_passage' => true
                    ],
                    'widget' => [
                        'delete' => false,
                        'edit' => false
                    ]
                ],
            ],
            'dependencies' => [
                'question_editor_api' => [
                    'init_options' => [
                        'ui' => [
                            'search_field' => true,
                            'layout' => [
                                'global_template' => 'edit_preview',
                                'mode' => 'advanced'
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ], $request);

    $Init = new Init('author', $security, $credentials['consumer_secret'], $request);

    return $Init->generate();
}
