# Qualified Learnosity Custom Question

## Overview

This branch contains Qualified's _custom question_ integration code for Learnosity, a skills assessment platform that offers many types of questions (math, history, etc). You can think of Learnosity as a more general version of Qualified, with a primary focus on education rather than hiring (students rather than candidates). Learnosity's customers are generally schools and educators who want to deliver online skills assessments to their students.

A custom question allows Learnosity's integration partners to offer Learnosity customers a distinct question experience to supplement their off-the-shelf questions. In this case, Qualified's custom question is a coding challenge, injected in an iframe into a Learnosity assessment using Qualified's [Embed](https://www.qualified.io/embedded) feature. Qualified brings interactive, robust coding skill tests to Learnosity, in a bite-sized, challenge-based Embed format.

## Team Set-up and Question Authoring Configuration

The first step for setting up a customer of Learnosity to use Embed is generating an `embedClientKey` for their team, then providing it to Qualified's contact at Learnosity to configure the customer with in their settings for the custom question integration.

With an `embedClientKey` set by a Learnosity employee, the rest of the information required for a Qualified custom question is configured by the author on a per-question basis.

The `challengeId` is taken from the URL of a challenge in the Qualified library. The challenge must have Embed enabled on the team matching the client key for it to be usable in a custom question. The team can import an off-the-shelf challenge or develop their own.

The Qualified custom question author will also choose a language for the challenge to be delivered in. This could be selectable by the student in the future.

Qualified may expose more Embed configuration details to the Learnosity author, but since Embed is easy to misconfigure, safe presets would be created after understanding a team's use case.

## Integration Details

No Embed or coding challenge logic is present in this integration application, which is essentially a wrapper on the Embed API. Embed, in turn, is a wrapper on the main Qualified challenge experience.

Although Embed supports both assessment and challenge modes, this integration is challenge-only at the present time. This means that no results or data are kept on Qualified's servers, as would be the case in a typical assessment. The only thing stored in Qualified are the challenges themselves (Learnosity and their customers have teams in the Qualified app which can be used to import and modify challenges from the Qualified library and develop team-specific content).

## Integration Files

The integration consists of two logic files: [question/index.js](src/question/index.js) and [scorer/index.js](src/scorer/index.js), plus two view files, [authoring_custom_layout.html](authoring_custom_layout.html) and question.css, which is built from the [scss](scss) directory. There's also a [logo](dist/qualified-logo.svg) which is shown as a thumbnail in the authoring question search view.

See Learnosity's docs and the rest of this repo for a detailed explanation of what these files are expected to do in general. You can see what's changed in these files from the provided sample by diffing against the master branch.

For Qualified's use case, question.js is the bulk of the integration. It contains a single class, `Question`. Its main job is to add the Qualified Embed script to the page and instantiate an iframe containing the Embed instance, then initialize the Embed manager and editor. It must emit a Learnosity "ready" event within about 8 seconds after load regardless of an Embed error occurring or not.

## Modes

Learnosity has a few modes: "initial", "resume" and "review". `Question` is instantiated once per mode. In all cases, `Question` initializes an Embed instance.

In "initial" mode, nothing extra happens. In "resume" mode, modified solution files are injected into Embed to restore it to its last-saved state. In "review" mode, final solution files and a run result (if it exists) are injected into the editor.

Note that Learnosity doesn't save the score when a "changed" event is emitted in review mode, only when the question is live in front of the student. This means that, at present, the only way to save a submission attempt is for the student to click the Embed Submit button before leaving the question page.

## Data Flow

When a student submits their code, Embed makes a call to the Qualified Code Runner (CR) to evaluate the student's code against the challenge's sample or submission test cases. For sample test cases, the result is not saved to Learnosity. For submission tests, once the CR returns the result to Embed, the integration code captures the event and sends the CR score results to Learnosity via the `"changed"` event.

When it's time to score the solution, Learnosity invokes the [scorer.js](src/question/index.js) file and passes the latest CR result to it, which the scorer analyzes to determine the student's score for the submission. [debugServerScorer.js](debugServerScorer.js) has a sample CR response structure and can be used to run the scorer for testing.

Later, when one of Learnosity's customers wishes to review their student's scores, the results saved to Learnosity from the student's latest submission are used.

Whenever the student modifies their code, `Question` also triggers a "changed" event to store the latest code in Learnosity.

## Isolation

Note that multiple instances of Embed will be injected into the page, so `Question` needs to keep its logic isolated to its own DOM tree and avoid global state (other than the embed.js library script, which can be included once). This isn't entirely apparent from the development mode, which always shows only a single question instance on the page.

## Asynchrony

Most functions in Embed are asynchronous, including the CR submission. It can take as long as 16 seconds for the CR to return a response, for infinite loops in certain language. However, `Scorer`, and much of the `Question`, is synchronous at the time of writing, and events to trigger validations and listen to state changes are limited. This means the workflow requires the student to submit and wait for a result in order to be scored.

In the future, this will be made more robust once asynchronous scoring support is available, which should also make server-side scoring more feasible. For example, it may be possible for the `Scorer` code to call the CR whenever necessary, [even server-side](https://qualified.github.io/embed-demos/server-validation/), which makes it easier to ensure students who don't submit are scored and the score hasn't been tampered with by the client.

## Deployment and Hosting

Learnosity expects its partners to host the bundled question and scorer files. Qualified provides the bundle URLs to Learnosity via its [console](https://console.learnosity.com). When one of Learnosity's customers uses a Qualified custom question, Learnosity pulls down and executes the hosted scripts.

Since these are purely static files, Qualified hosts them here on GitHub in the `dist` directory, served by JSDelivr. See [JSDelivr's docs](https://www.jsdelivr.com/?docs=gh) for URL format details. The most relevant part is the `@` symbol, which enables a particular commit or branch to be served:

- To serve the current scorer JS dist on the `qualified-custom-question` branch: <https://cdn.jsdelivr.net/gh/andela-technology/custom-questions-skeleton@qualified-custom-question/demos/custom-question-skeleton/dist/scorer.js>
- To serve the current question JS dist on the `qualified-custom-question` branch: <https://cdn.jsdelivr.net/gh/andela-technology/custom-questions-skeleton@qualified-custom-question/demos/custom-question-skeleton/dist/question.js>
- To serve the current question CSS dist on the `qualified-custom-question` branch: <https://cdn.jsdelivr.net/gh/andela-technology/custom-questions-skeleton@qualified-custom-question/demos/custom-question-skeleton/dist/question.css>
- To serve the question JS dist from a particular commit: <https://cdn.jsdelivr.net/gh/andela-technology/custom-questions-skeleton@c638fa3/demos/custom-question-skeleton/dist/question.js>

It's best to use a specific commit so that breaking or inadvertent changes won't mess up clients. When a specific commit is used, it's important to remember to update it on Learnosity's end (via the [console](https://console.learnosity.com)) after each deploy.

This setup isn't entirely ideal, since the dist files are committed to source control, but it's simple and keeps the integration code isolated from Qualified's server and codebase.

JSDelivr caches for a week, but you can use their [cache purge tool](https://www.jsdelivr.com/tools/purge) to flush after a deploy. Learnosity may also cache scripts on their end, so they may need to flush on their end as well.

## Embed Versioning

Right now, Embed doesn't have any versioning, so breaking changes to it are basically impossible as a result. If Qualified implements Embed versioning in the future, this integration should be updated to pin to a specific Embed version, to avoid accidental breaking changes.

Certain Learnosity requirements in the future may require Embed to be modified in a way that breaks for customers. In this case, Embed would need to be forked specifically for Learnosity.

## Development

See the main Learnosity readmes elsewhere in this repo and their online docs for details on development.

There are two main screens to consider: assessment and authoring, of which has a PHP file that injects sample configuration into the custom question. Within the assessment screen, there are 3 modes, or states, that the custom question can be put into, described in the [modes](#modes) section.

Specific to Qualified's custom question, `assessment.php` was modified to allow the `embedClientKey` to be read as Learnosity prefers, using the structure in [question_editor_init_options.json](question_editor_init_options.json).

`authoring.php` simulates what a Learnosity customer will see when they create a new coding question using Qualified. The view is [authoring_custom_layout.html](authoring_custom_layout.html), and it uses [question.json](question.json) for configuration.

Given that the integration was an experiment by a single developer, most commits were made straight to the `qualified-custom-question` branch. Now that the alpha version is being used, development can switch to branch PRs and a less scrappy workflow. The other demos could be removed and the repo could be renamed to clean things up.

## Learnosity Portals

These links are useful for managing the integration. Speak with Qualified's Learnosity representative to get access to these portals, and to manage settings that aren't adjustable through the portals.

- <https://console.learnosity.com> is where hosted bundle links and general Learnosity configuration can be set.
- <https://author.learnosity.com> is where a Learnosity client can create a quiz that can include a Qualified custom question.

## Learnosity's Integration POC

Before work began on the integration, Learnosity developed a proof of concept which doesn't use the recommended custom question format, but nonetheless is a good starting point and reference for how the integration works.

- [Authoring demo](https://labs.staging.learnosity.com/partners/qualified/author.php?env=prod)
- [Assessment demo](https://labs.staging.learnosity.com/partners/qualified/assessment.php?env=prod)

The POC question.js source is [POC.js](POC.js) here in the repo. While there's no obvious way to build or run it without more context from Learnosity, it served as a guideline for developing the custom question and may be nice to reference in the future.
