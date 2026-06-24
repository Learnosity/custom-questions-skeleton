# Custom Question: Dynamic Content Try Again

A reference demo showing how to implement the **dynamic content Try Again** feature in a custom question.

The question presents a unit conversion problem — e.g. `100 cm → ? m`. Each time the student clicks **Try Again**, the platform advances to the next row in `dynamic.rows`, resolving `{{var:value}}`, `{{var:fromUnit}}`, `{{var:toUnit}}`, and `{{var:answer}}` to new values. The widget must listen to the `dynamicContent:changed` facade event and re-render the card with the new data.

---

## The key pattern

```js
const facade = init.getFacade();

facade.on('dynamicContent:changed', ({ question, response, rowId }) => {
    // `question`  — resolved question JSON for this attempt ({{var:x}} already substituted)
    // `response`  — previously stored response value for this attempt, or null
    // `rowId`     — e.g. "id_1"
    this.renderCard(question, response);
});
```

The platform fires this event after `facade.dynamic.nextAttempt()` or `previousAttempt()`.
It does **not** re-render the widget automatically — that is entirely the widget developer's responsibility.

### What breaks if you skip this handler

If the `dynamicContent:changed` listener is not implemented, the card stays frozen showing the first attempt's values (`100 cm → ? m`) even though the platform has internally moved on to a different row. Responses are still stored correctly — the disconnect is purely visual.

### Important: use `event.question`, not `facade.getQuestion()`

`facade.getQuestion()` returns the **original template** with `{{var:x}}` placeholders intact. Always use the `question` field from the `dynamicContent:changed` event payload to get the resolved values for the current attempt.

---

## Dynamic rows

| Row | Problem | Correct answer |
|-----|---------|----------------|
| id_0 | 100 cm → m | 1 |
| id_1 | 5 km → m | 5000 |
| id_2 | 0 °C → °F | 32 |
| id_3 | 3 hours → minutes | 180 |

---

## Getting started

```bash
cd demos/custom-dynamic-try-again
yarn install
yarn dev          # starts webpack watch + PHP server on localhost:12345
```

Open `http://localhost:12345/assessment.php` in a browser.

Run scorer unit tests:
```bash
yarn unit-tests
```

---

## File structure

```
src/
  question/
    index.js        ← Question class — renders card, handles dynamicContent:changed
    constants.js    ← CSS prefix constant
  scorer/
    index.js        ← Scorer class — numeric exact match, no dynamic awareness needed
  question.js       ← AMD entry point
  scorer.js         ← AMD entry point
scss/
  main.scss
  _variables.scss
  _question.scss
tests/
  units/
    scorer/
      index.spec.js
assessment.php      ← Demo page with Try Again button
question.json       ← Question JSON with dynamic.rows and {{var:x}} placeholders
```
