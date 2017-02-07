#hof-behaviour-session

HOF Behaviour for reading and writing to the session

##Usage

###With [mixwith.js](https://github.com/justinfagnani/mixwith.js)

```js
const mix = require('mixwith').mix;
const Session = require('hof-behaviour-session');
const BaseController = require('hof-form-controller');

class MyController extends mix(BaseController).with(Session) {
  ...
}
```
`MyController` now extends `hof-form-controller` and has `hof-behaviour-session` functionality mixed in.

##Functionality

This mixin extends `hof-form-controller` by persisting the form data to the `sessionModel` - assuming the [session-model](https://github.com/UKHomeOfficeForms/hof-form-wizard/blob/master/lib/middleware/session-model.js) middleware has been applied.

The following form controller methods are used:

* `getValues(req, res, cb)` - calls callback with `null` and a map of all items in the `sessionModel`, extended with `errorValues` - to persist entered values on current step if validation fails
* `saveValues(req, res, cb)` - Called on success. Sets all step fields in `req.form.values` to the sessionModel, unsets `errorValues`.
* `getErrors(req)` - returns all errors for fields on the current step (`req.form.options.fields`), excluding redirects. Set to `req.form.errors` in `hof-form-controller`.
* `setErrors(err, req)` - called on validation error(s). Sets the current step field values as `errorValues` in sessionModel to be used in `getValues`. Sets `errors` to sessionModel - a map of `field-name: error` to be used in `getErrors`.
* `locals(req, res)` - Extends the result of `super.locals` with `baseUrl` (`req.baseUrl`) and `nextPage` (the result of `this.getNextStep(req, res)`).
* `missingPrereqHandler(req, res)` - Error handler called when a `MISSING_PREREQ` error is thrown from the [check-progress](https://github.com/UKHomeOfficeForms/hof-form-wizard/blob/master/lib/middleware/check-progress.js) middleware. This occurs if a step is visited out of sequence. This error handler causes the user to be redirected to the last completed step, or the first step if none have been completed.
* `errorHandler(err, req, res, next)` - checks if `err.code` is `MISSING_PREREQ`, if so calls `missingPrereqHandler`, if not calls `super` to hand over to parent error handler.
