'use strict';

const Joi = require('joi');

module.exports = {
    toAuth0,
    fromAuth0,
    validateScim,
};

const usersExtensionPath = 'urn:ietf:params:scim:schemas:extension:auth0:2.0:User';
const default_conn_name = 'test';

function toAuth0(scimUser, cb) {
    const auth0User = {
      "connection": (scimUser[usersExtensionPath] && scimUser[usersExtensionPath].connectionName) || default_conn_name,//extension
      //"username": scimUser.userName,
      "email": scimUser.emails[0].value,
      "password": scimUser.password,
      //"picture": scimUser.photos[0].value,
      "given_name": scimUser.name ? scimUser.name.givenName : undefined,
      "family_name": scimUser.name ? scimUser.name.familyName : undefined,
      "name": scimUser.name ? scimUser.name.formatted : undefined,
    };
    
    cb(null, auth0User);
}

function fromAuth0(auth0User, cb) {
    const scimUser = {
        "schemas": [
            "urn:scim:schemas:core:1.0",
            "urn:ietf:params:scim:schemas:extension:auth0:2.0:User"
        ],
        "id" : auth0User.user_id,
        "externalId" : auth0User.userName || auth0User.email, 
        "userName": auth0User.userName || auth0User.email,
        "name": {
            "formatted" : auth0User.name,
            "givenName": auth0User.given_name,
            "familyName": auth0User.family_name
        },

        "emails": [{
            "value": auth0User.email,
            "primary": true
        }],
        "photos": [{
            "value": auth0User.picture,
            "type": "photo"
        }],
        "meta" : {
            "resourceType" : "user",
            "created" : auth0User.created_at,
            "lastModified" : auth0User.updated_at,
            "version" : auth0User.updated_at // ?
        },
        "urn:ietf:params:scim:schemas:extension:auth0:2.0:User": {
            "connectionName": auth0User.identities[0].connection
        }
    };

    process.nextTick(() => cb(null, scimUser));
}

function validateScim(payload, cb) {
    const schema = Joi.object({
        
    });
    
    return Joi.validate(payload, schema, cb);
}