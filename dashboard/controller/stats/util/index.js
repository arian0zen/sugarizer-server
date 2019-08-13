// include libraries
var request = require('request'),
	moment = require('moment'),
	common = require('../../../helper/common'),
	graph = require('../../../controller/graph');

exports.getHowUserLaunchActivity = function(req, res) {

	//data var
	var data = [];

	// get data
	getLogsData(req, res, {
		event_action: 'launch_activity'
	}, function(body) {
		data = data.concat(body);
		getLogsData(req, res, {
			event_action: 'relaunch_activity'
		}, function(body) {
			data = data.concat(body);

			var d = {};
			for (var i = 0; i < data.length; i++) {
				if (!d.hasOwnProperty(data[i].event_object)) {
					d[data[i].event_object] = 1;
				} else {
					d[data[i].event_object]++;
				}
			}

			var labels = [];
			var ddata = [];
			for (var v in d) {
				labels.push(common.l10n.get(v));
				ddata.push(d[v]);
			}

			//return
			return res.json({
				data: {
					labels: labels,
					datasets: [{
						data: ddata,
						backgroundColor: [
							'rgba(155, 99, 132, 0.8)',
							'rgba(54, 162, 235, 0.8)',
							'rgba(255, 206, 86, 0.8)',
							'rgba(75, 192, 192, 0.8)',
							'rgba(153, 102, 255, 0.8)'
						]
					}]
				},
				element: req.query.element,
				graph: 'pie'
			});
		});
	});
};

exports.getHowOftenUserChangeSettings = function(req, res) {

	//data
	var data = {
		labels: [],
		data: []
	};

	// get data
	getLogsData(req, res, {
		event_object: 'my_settings',
		event_action: 'click',
		event_label: 'about_me'
	}, function(body) {
		data.labels.push(common.l10n.get('NameColorSettings'));
		data.data.push(body.length);
		getLogsData(req, res, {
			event_object: 'my_settings',
			event_action: 'click',
			event_label: 'language'
		}, function(body) {
			data.labels.push(common.l10n.get('LanguageSettings'));
			data.data.push(body.length);
			getLogsData(req, res, {
				event_object: 'my_settings',
				event_action: 'click',
				event_label: 'security'
			}, function(body) {
				data.labels.push(common.l10n.get('SecuritySettings'));
				data.data.push(body.length);
				getLogsData(req, res, {
					event_object: 'my_settings',
					event_action: 'click',
					event_label: 'privacy'
				}, function(body) {
					data.labels.push(common.l10n.get('PrivacySettings'));
					data.data.push(body.length);

					// node data
					if(JSON.stringify(data.data) == JSON.stringify([0, 0]))data.data = [];

					//return
					return res.json({
						data: {
							labels: data.labels,
							datasets: [{
								label: common.l10n.get('CountSettingsChanged'),
								data: data.data,
								backgroundColor: [
									'rgba(54, 162, 235, 0.8)',
									'rgba(255, 206, 86, 0.8)',
									'rgba(75, 192, 192, 0.8)',
									'rgba(153, 102, 255, 0.8)'
								]
							}]
						},
						element: req.query.element,
						graph: 'bar',
						options: {
							scales: {
								yAxes: [{
									ticks: {
										min: 0
									}
								}]
							}
						}
					});
				});
			});
		});
	});
};

exports.getHowUsersAreActive = function(req, res) {

	//data
	var data = {
		labels: [],
		data: []
	};
	var total = 0;

	// get data
	getUsers(req, res, { role: 'student' }, function(body) {
		total = body.total;
		data.labels.push(common.l10n.get('UserActive'));

		getUsers(req, res, { role: 'student', stime: moment().subtract(1, 'months').valueOf() }, function(body) {
			data.labels.push(common.l10n.get('UserNotActive'));

			data.data.push(body.total);
			data.data.push(total - data.data[0]);

			//return
			return res.json({
				data: {
					labels: data.labels,
					datasets: [{
						data: data.data,
						backgroundColor: [
							'rgba(54, 162, 235, 0.8)',
							'rgba(155, 99, 132, 0.8)'
						]
					}]
				},
				element: req.query.element,
				graph: 'pie'
			});
		});
	});
};

exports.getWhatTypeOfClientConnected = function(req, res) {

	//data
	var data = {
		labels: [],
		data: []
	};

	// get data
	getLogsData(req, res, {
		client_type: 'Web App'
	}, function(body) {
		data.labels.push(common.l10n.get('WebApp'));
		data.data.push(body.length);
		getLogsData(req, res, {
			client_type: 'App'
		}, function(body) {
			data.labels.push(common.l10n.get('App'));
			data.data.push(body.length);

			//return
			return res.json({
				data: {
					labels: data.labels,
					datasets: [{
						data: data.data,
						backgroundColor: [
							'rgba(54, 162, 235, 0.8)',
							'rgba(155, 99, 132, 0.8)'
						]
					}]
				},
				element: req.query.element,
				graph: 'pie'
			});
		});
	});
};

exports.getHowManyEntriesByJournal = function(req, res) {

	//data
	var data = {
		labels: [],
		data: []
	};

	data.labels.push(common.l10n.get('AverageEntries'));
	data.data.push(graph.getAverageEntries());

	// node data
	if(JSON.stringify(data.data) == JSON.stringify([0, 0]))data.data = [];

	//return
	return res.json({
		data: {
			labels: data.labels,
			datasets: [{
				label: common.l10n.get('CountEntries'),
				data: data.data,
				backgroundColor: [
					'rgba(255, 206, 86, 0.8)'
				]
			}]
		},
		element: req.query.element,
		graph: 'bar',
		options: {
			scales: {
				yAxes: [{
					ticks: {
						min: 0
					}
				}]
			}
		}
	});
};

exports.getLastWeekActiveUsers = function(req, res) {
	req.timeLimit = "week";
	getActiveUsersByTime(req, res);
};

exports.getLastMonthActiveUsers = function(req, res) {
	req.timeLimit = "month";
	getActiveUsersByTime(req, res);
};

exports.getLastYearActiveUsers = function(req, res) {
	req.timeLimit = "year";
	getActiveUsersByTime(req, res);
};

function getActiveUsersByTime(req, res) {
	var stime = "";
	if (req.timeLimit == "week") {
		stime = (+new Date(new Date() - 7 * 60 * 60 * 24 * 1000)).toString();
	} else if (req.timeLimit == "month") {
		stime = (+new Date(new Date() - 30 * 60 * 60 * 24 * 1000)).toString();
	} else if (req.timeLimit == "year") {
		stime = (+new Date(new Date() - 365 * 60 * 60 * 24 * 1000)).toString();
	}

	var query = {
		role: 'student',
		sort: '-timestamp',
		limit: 100000000
	};

	query['stime'] = stime;

	request({
		headers: common.getHeaders(req),
		json: true,
		method: 'GET',
		qs: query,
		uri: common.getAPIUrl(req) + 'api/v1/users'
	}, function(error, response, body) {
		if (response.statusCode == 200) {
			//callback
			var users = body.users;
			var dataObjectByTime = {};
			var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			if (req.timeLimit == "week") {
				for (var i=7; i > 0; i--) {
					var date  = new Date(new Date() - i * 60 * 60 * 24 * 1000);
					var month = monthNames[date.getMonth()];
					var dateNum  = date.getDate();
					var year  = ('' + date.getFullYear()).slice(-2);
					var group = month + ' ' + ((dateNum<10?'0':'') + dateNum);  + '\'' + year;
					dataObjectByTime[group] = 0;
				}

				for (var i=0; i<users.length; i++) {
					var date  = new Date(users[i].timestamp);
					var value = 1;
					var month = monthNames[date.getMonth()];
					var dateNum  = date.getDate();
					var year  = ('' + date.getFullYear()).slice(-2);
					var group = month + ' ' + ((dateNum<10?'0':'') + dateNum);  + '\'' + year;

					dataObjectByTime[group] = (dataObjectByTime[group] || 0) + value;
				}
			} else if (req.timeLimit == "month")  {
				for (var i=30; i > 0; i--) {
					var date  = new Date(new Date() - i * 60 * 60 * 24 * 1000);
					var month = monthNames[date.getMonth()];
					var dateNum  = date.getDate();
					var year  = ('' + date.getFullYear()).slice(-2);
					var group = month + ' ' + ((dateNum<10?'0':'') + dateNum);  + '\'' + year;
					dataObjectByTime[group] = 0;
				}

				for (var i=0; i<users.length; i++) {
					var date  = new Date(users[i].timestamp);
					var value = 1;
					var month = monthNames[date.getMonth()];
					var dateNum  = date.getDate();
					var year  = ('' + date.getFullYear()).slice(-2);
					var group = month + ' ' + ((dateNum<10?'0':'') + dateNum);  + '\'' + year;

					dataObjectByTime[group] = (dataObjectByTime[group] || 0) + value;
				}
			} else if (req.timeLimit == "year") {
				for (var i=24; i > 0; i--) {
					var date  = new Date(new Date() - 15 * i * 60 * 60 * 24 * 1000);
					var month = monthNames[date.getMonth()];
					var year  = ('' + date.getFullYear()).slice(-2);
					var group = month + '\'' + year;
					dataObjectByTime[group] = 0;
				}

				for (var i=0; i<users.length; i++) {
					var date  = new Date(users[i].timestamp);
					var value = 1;
					var month = monthNames[date.getMonth()];
					var year  = ('' + date.getFullYear()).slice(-2);
					var group = month + '\'' + year;

					dataObjectByTime[group] = (dataObjectByTime[group] || 0) + value;
				}
			}

			var dataset = [];
			var labels = [];
			Object.keys(dataObjectByTime).map(function(group){
				dataset.push(dataObjectByTime[group]);
				labels.push(group);
			});

			return res.json({
				data: {
					labels: labels,
					datasets: [{
						label: common.l10n.get('CountStudents'),
						data: dataset
					}]
				},
				element: req.query.element,
				graph: 'line',
				options: {
					scales: {
						yAxes: [{
							ticks: {
								min: 0
							}
						}]
					}
				}
			});
		} else {
			req.flash('errors', {
				msg: common.l10n.get('ErrorCode'+body.code)
			});
		}
	});
}

function getLogsData(req, res, query, callback) {
	request({
		headers: common.getHeaders(req),
		json: true,
		method: 'GET',
		qs: query,
		uri: common.getAPIUrl(req) + 'api/v1/stats'
	}, function(error, response, body) {
		if (response.statusCode == 200) {
			callback(body);
		}else{
			callback([]);
		}
	});
}

function getUsers(req, res, query, callback) {
	request({
		headers: common.getHeaders(req),
		json: true,
		method: 'GET',
		qs: query,
		uri: common.getAPIUrl(req) + 'api/v1/users'
	}, function(error, response, body) {
		if (response.statusCode == 200) {
			//callback
			callback(body);

		} else {
			req.flash('errors', {
				msg: common.l10n.get('ErrorCode'+body.code)
			});
		}
	});
}
