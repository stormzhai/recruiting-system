'use strict';

var Reflux = require('reflux');
var Calendar = require('react-input-calendar');
var UserCenterActions = require('../../actions/user-center/user-center-actions');
var UserCenterStore = require('../../store/user-center/user-center-store');
var validate = require('validate.js');
var constraint = require('../../../../mixin/user-detail-constraint');
var getError = require('../../../../mixin/get-error');
var moment = require('moment');
var lang = require('../../../../mixin/lang-message/chinese');

var UserCenterBirthday = React.createClass({
  mixins: [Reflux.connect(UserCenterStore)],

  getInitialState: function () {
    return {
      birthday: '',
      birthdayError: ''
    };
  },

  componentDidUpdate: function (prevPorps, prevState) {

    if (prevState.currentState !== this.state.currentState) {
      this.setState({
        birthday: '',
        birthdayError: ''
      });
    }
  },

  changeBirthday: function (time) {
    if (time !== null) {
      this.setState({birthdayError: ''});
    }
    UserCenterActions.changeBirthday(time);
  },

  validate: function (evt) {
    var value = evt.target.value;
    var valObj = {birthday: value};
    var result = validate(valObj, constraint);
    var error = getError(result, 'birthday');

    this.setState({birthdayError: error});
  },

  render: function () {

    return (
        <div>
          <div className='col-sm-4 col-md-4'>

            <Calendar
                inputFieldClass={this.state.birthdayError === '' ? '' : 'calendar'}
                onChange={this.changeBirthday}
                format="YYYY年MM月DD日"
                date={this.state.birthday}
                minDate={lang.MIN_DATE}
                maxDate={moment().format('L')}
                onBlur={this.validate}
                closeOnSelect={true}
            />
          </div>
          <div className={'error alert alert-danger' + (this.state.birthdayError === '' ? ' hide' : '')}
               role='alert'>
            <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>
            {this.state.birthdayError}
          </div>
        </div>

    );
  }
});

module.exports = UserCenterBirthday;