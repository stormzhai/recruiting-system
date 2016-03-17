'use strict';

require('../less/password-retrieve.less');

var PasswordRetrieveForm = require('./component/password-retrieve/password-retrieve-form.component');

ReactDom.render(
    <PasswordRetrieveForm/>,
    document.getElementById('password-retrieve-container')
);