'use strict';

var React = require('react');
var Reflux = require('reflux');
var UserCenterActions = require('../../actions/user-center/user-center-actions');
var UserCenterStore = require('../../store/user-center/user-center-store');

var UserCenterGender = React.createClass({
  mixins: [Reflux.connect(UserCenterStore)],

  getInitialState: function(){
    return {
      gender: '',
      genderError: false
    };
  },

  componentWillReceiveProps: function() {
    this.setState({
      genderError: false
    });
  },

  genderChange: function (evt) {
    UserCenterActions.changeGender(evt);
  },

  genderValidate: function (genderError) {
    UserCenterActions.validateGender(genderError);
  },

  render: function () {
    var tags = [
      {mark: 'M', genderName: 'male', label: '男'},
      {mark: 'F', genderName: 'female', label: '女'}
    ];
    return (
        <div>
          <div className="col-sm-4 col-md-4">
            {tags.map((item, index) => {
              return (
                  <div key={index}>
                    <input type="radio" name={item.mark} className="gender" onChange={this.genderChange}
                           checked={this.state.gender === item.mark ? 'checked' : ''} id={item.genderName}
                           onClick={this.genderValidate(this.state.genderError)}/>
                    <label htmlFor={item.genderName}>{item.label}</label>
                  </div>
              );
            })}

          </div>
          <div className={'error alert alert-danger' + (this.state.genderError === true ? '' : ' hide')} role="alert">
            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            请选择性别
          </div>
        </div>
    );
  }
});

module.exports = UserCenterGender;