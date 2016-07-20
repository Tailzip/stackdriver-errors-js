/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var expect = chai.expect;

var errorHandler;
var xhr, requests;

beforeEach(function() {
  errorHandler = new StackdriverErrorReporting();
});

describe('Initialization', function () {
 it('should have default service', function () {
   errorHandler.init({key:'key', projectId:'projectId'});
   expect(errorHandler.serviceContext.service).to.equal('web');
 });

 it('should fail if no API key', function () {
   expect(function() {errorHandler.init({projectId:'projectId'});}).to.throw(Error, /API/);
 });

 it('should fail if no project ID', function () {
   expect(function() {errorHandler.init({key:'key'});}).to.throw(Error, /project/);
 });

});

describe('Reporting errors', function () {
  beforeEach(function() {
    errorHandler.init({key:'key', projectId:'projectId'});
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function (req) { requests.push(req); };
  });

  it('should report error messages with location', function () {
    var message = 'Something broke!';
    errorHandler.report(message);
    expect(requests.length).to.equal(1);

    var sentBody = JSON.parse(requests[0].requestBody);
    expect(sentBody.message).to.equal(message);
    expect(sentBody.context.reportLocation.filePath).to.equal('stackdriver-errors.js');
  });

  afterEach(function() {
    xhr.restore();
  });

});
