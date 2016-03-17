'use strict';

var Reflux = require('reflux');
var StartActions = require('../../actions/start/start-actions');
var StartStore = require('../../store/start/start-store');

var StartInfo = React.createClass({
  mixins: [Reflux.connect(StartStore)],

  getInitialState: function () {
    return {
      agree: false
    };
  },

  changeAgreeState() {
    var newState = !(this.state.agree);
    this.setState({agree: newState});
  },

  start:function() {
    StartActions.agreeDeal(this.state.agree);
  },

  render() {
    return (
        <div className="container-fluid">
          <section className="title">
            <p>逻辑题</p>
          </section>
          <section className="content">
            <div className="row">
              <div className="col-md-4 col-md-offset-4">一 答题需知</div>
            </div>
            <div className="row">
              <div className="col-md-4 col-md-offset-4">
                <ol>
                  <li>
                    本套逻辑题共有12道小题,前两道为2条参考例题
                  </li>
                  <li>
                    您共有90分钟时间，请认真答题
                  </li>
                  <li>
                    答题前，建议您先阅读例题
                  </li>
                  <li>
                    答题前，请确保网络条件畅通，无异常
                  </li>
                  <li>答题前，请仔细阅读题目要求</li>
                  <li>
                    请独立完成所有题目，禁止相互抄袭
                  </li>

                </ol>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 col-md-offset-4">
                二 答题前,请仔细阅读以下要求
              </div>
            </div>
            <div className="row">
              <div className="checkbox col-md-4 col-md-offset-4">
                <label>
                  <input type="checkbox" onClick={this.changeAgreeState}/> 同意
                </label>
                <a id="agreement" data-toggle="modal" data-target="#agreementModal">保密协议</a>
              </div>
            </div>
          </section>
          <section className="start-button">
            <button type="submit" className="btn btn-info btn-lg btn-block"
               disabled={this.state.agree ? '' : 'disabled'} onClick={this.start}>开始</button>
          </section>
        </div>
    );
  }
});

module.exports = StartInfo;