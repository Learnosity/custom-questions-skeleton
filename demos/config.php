<?php
include_once 'vendor/autoload.php';
use LearnositySdk\Request\Init;

function signRequest($request) {
    $consumer_key = 'yis0TYCu7U9V4o7M';
    $consumer_secret = '74c5fd430cf1242a527f6223aebd42d30464be22';
    $domain = $_SERVER['SERVER_NAME'];
    $timestamp = gmdate('Ymd-Hi');
    $security = array(
        'user_id'      => 'testing_user',
        'consumer_key' => $consumer_key,
        'domain'       => $domain,
        'timestamp'    => $timestamp
    );

    $request = array_merge_recursive([
        'course_id' => 'test-course',
        'id' => 'test-id',
        'state' => 'initial',
        'type' => 'local_practice'
    ], $request);

    $Init = new Init('questions', $security, $consumer_secret, $request);

    return $Init->generate();
}
