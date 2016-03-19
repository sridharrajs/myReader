'use strict';

angular
	.module('readLater')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl(Auth, $state, Me, $rootScope, Article, growl) {
	let self = this;

	self.articles = [];

	self.activeTab = $state.current.url;
	self.searchKeyword = '';

	self.articlesCount = Me.articlesCount;
	self.emailId = Me.emailId;
	self.profile_url = Me.profile_url;
	self.username = Me.username;

	self.addUrl = addUrl;
	self.logout = logout;

	function logout() {
		Auth.removeToken();
		$state.go('login');
	}

	$rootScope.$on('fetch-user', (event, body)=> {
		self.username = body.username;
	});

	$rootScope.$on('logout', (event)=> {
		logout();
	});

	$rootScope.$on('addArticle', ()=> {
		self.articlesCount++;
	});

	$rootScope.$on('lessArticle', ()=> {
		self.articlesCount--;
	});

	$('#articleId').focus();

	self.isActiveTab = function (activeTab) {
		return activeTab === self.activeTab;
	};

	self.selectTab = function (tab) {
		self.activeTab = tab;
	};

	angular.element(document).on('paste', (e) => {
		if (e.target.id === 'articleId' || e.target.id === 'Search-box') {
			return;
		}
		let state = $state.current.url;

		let urlStates = [
			'dashboard',
			'favourites',
			'archive',
			'videos',
			'add'
		];

		if (!_.includes(urlStates, state)) {
			return;
		}

		let clipBoard = e.originalEvent.clipboardData.getData('text/plain');
		$state.go('home.add').then(()=> {
			self.activeTab = 'add';
			self.newUrl = clipBoard;
			angular.element('#articleId').focus().val(clipBoard);
			e.preventDefault();
		});

	});

	function addUrl() {
		if (!self.newUrl) {
			return;
		}
		self.loading = true;
		Article.addArticle({
			url: self.newUrl
		}).then((response) => {
			growl.success('Success!');
			self.newUrl = '';
			$rootScope.$broadcast('addArticle');
			self.loading = false;
		}).catch((response) => {
			self.alertMsg = response.data.msg;
			growl.error(`Failed! - ${self.alertMsg}`);
			self.loading = false;
		});
	}

}