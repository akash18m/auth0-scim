var express     = require('express');
var bodyParser  = require('body-parser');
var app         = express();
var morgan      = require('morgan');
var async       = require('async');
var Translate   = require('./lib/translate');

var Auth0ManagementClient = require('auth0').ManagementClient;
var auth0Client = new Auth0ManagementClient({
  domain: 'akash18modi.auth0.com',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik16a3lORUV6TmtGQ01qQTRPVFl4TTBZNU1FTTJRelJETWtOQ09UTTJRVFJGTURrMFFrTTJSZyJ9.eyJpc3MiOiJodHRwczovL2FrYXNoMThtb2RpLmF1dGgwLmNvbS8iLCJzdWIiOiJKOTRSUndOVUdWYVlwdmxsdENIWWUxUTE1VzdvZmFMbEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9ha2FzaDE4bW9kaS5hdXRoMC5jb20vYXBpL3YyLyIsImV4cCI6MTQ5NjQ5MDQ0NCwiaWF0IjoxNDk2NDA0MDQ0LCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyJ9.Qt6bi5T-nG7xyuB_5zmr4l8q5r2Ab6RzbilzUzaFXAgihE_zfI8-iG-CyFyrOWRnURx4ZiGX6MSBeBLipRBK1dDEGd9UANGoYsV9-u9Ip2fRdxIum2EYXqyqFfK5sFoFBUwD8a1FpRv7y1Hu1sYsVA5a17rzQq7itOUKnOtpS5QHMVJJifl5bPQ72D5cFV2rQLu7YB04fMqJZPnjv8HGmlkqhYk_XBR7_bz-cjFgcQrRp_7y4J7dO11YZUHDcczjo7eWEILJCkhV3AJTBfVOHkdA1VjOzOWB29n-WWUIuZdr27AiQJAqBWeuPQwomiwmtoZ5JrxX_H6Ww1StfVIZJQ'
});

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

// endpoints
router.route('/users')
  .post(function (req, res, next) {
    var scimUser = req.body;
    console.log(scimUser.emails[0].value);
    return Translate.toAuth0(scimUser, (err, auth0_user) => {
      if (err) return next(err);
      
      auth0Client.users.create(auth0_user, (err, newAuth0User) => {
        if (err) return next(err);
        
        Translate.fromAuth0(newAuth0User, (err, newScimUser) => {
          if (err) return next(err);
          
          res.status(201).json(newScimUser);
        });
      });
    });
  })

  .get(function (req, res, next) {
    // TODO: support paging/search/etc
    auth0Client.users.getAll(function (err, auth0Users) {
      if (err) return next(err);

      async.map(auth0Users || [], Translate.fromAuth0, (err, scimUsers) => {
        if (err) return next(err);
        res.json(scimUsers);
      });
    });
  });

router.route('/users/:user_id')
  .get(function (req, res, next) {
    auth0Client.users.get({ id: req.params.user_id }, function (err, auth0User) {
      if (err) return next(err);
      if (!auth0User) return res.send(404);

      Translate.fromAuth0(auth0User, (err, scimUser) => {
        if (err) return next(err);
        
        res.json(scimUser);
      });
    });
  });

// TODO: authenticate requests
//app.all('*', requireAuthentication);
app.use('/scim', router);

app.use(function (err, req, res, next) {
  var status = err.statusCode || 500;
  res.status(status).send(err.message);
});

app.listen(port);
console.log('Listening on port ' + port);
