/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
	breakpoints({
		default:   ['1681px',   null       ],
		xlarge:    ['1281px',   '1680px'   ],
		large:     ['981px',    '1280px'   ],
		medium:    ['737px',    '980px'    ],
		small:     ['481px',    '736px'    ],
		xsmall:    ['361px',    '480px'    ],
		xxsmall:   [null,       '360px'    ]
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
			if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
				off();

			// Enable everywhere else.
			else {

				breakpoints.on('>large', on);
				breakpoints.on('<=large', off);

			}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Scrolly.
	$('.scrolly').scrolly();

	// Background.
	$wrapper._parallax(0.925);

	// Nav Panel.

	// Toggle.
	$navPanelToggle = $(
		'<a href="#navPanel" id="navPanelToggle">Menu</a>'
	)
		.appendTo($wrapper);

	// Change toggle styling once we've scrolled past the header.
	$header.scrollex({
		bottom: '5vh',
		enter: function() {
			$navPanelToggle.removeClass('alt');
		},
		leave: function() {
			$navPanelToggle.addClass('alt');
		}
	});

	// Panel.
	$navPanel = $(
		'<div id="navPanel">' +
		'<nav>' +
		'</nav>' +
		'<a href="#navPanel" class="close"></a>' +
		'</div>'
	)
		.appendTo($body)
		.panel({
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			side: 'right',
			target: $body,
			visibleClass: 'is-navPanel-visible'
		});

	// Get inner.
	$navPanelInner = $navPanel.children('nav');

	// Move nav content on breakpoint change.
	var $navContent = $nav.children();

	breakpoints.on('>medium', function() {

		// NavPanel -> Nav.
		$navContent.appendTo($nav);

		// Flip icon classes.
		$nav.find('.icons, .icon')
			.removeClass('alt');

	});

	breakpoints.on('<=medium', function() {

		// Nav -> NavPanel.
		$navContent.appendTo($navPanelInner);

		// Flip icon classes.
		$navPanelInner.find('.icons, .icon')
			.addClass('alt');

	});

	// Hack: Disable transitions on WP.
	if (browser.os == 'wp'
		&&	browser.osVersion < 10)
		$navPanel
			.css('transition', 'none');

	// Intro.
	var $intro = $('#intro');

	if ($intro.length > 0) {

		// Hack: Fix flex min-height on IE.
		if (browser.name == 'ie') {
			$window.on('resize.ie-intro-fix', function() {

				var h = $intro.height();

				if (h > $window.height())
					$intro.css('height', 'auto');
				else
					$intro.css('height', h);

			}).trigger('resize.ie-intro-fix');
		}

		// Hide intro on scroll (> small).
		breakpoints.on('>small', function() {

			$main.unscrollex();

			$main.scrollex({
				mode: 'bottom',
				top: '25vh',
				bottom: '-50vh',
				enter: function() {
					$intro.addClass('hidden');
				},
				leave: function() {
					$intro.removeClass('hidden');
				}
			});

		});

		// Hide intro on scroll (<= small).
		breakpoints.on('<=small', function() {

			$main.unscrollex();

			$main.scrollex({
				mode: 'middle',
				top: '15vh',
				bottom: '-15vh',
				enter: function() {
					$intro.addClass('hidden');
				},
				leave: function() {
					$intro.removeClass('hidden');
				}
			});

		});

	}

	// Project pagination.
	var $projectPosts = $('.posts');
	var $projectPagination = $('#projectPagination');

	if ($projectPosts.length > 0 && $projectPagination.length > 0) {

		var $projectCards = $projectPosts.children('article');
		var perPage = 4;
		var totalPages = Math.ceil($projectCards.length / perPage);
		var currentPage = 1;

		var renderProjectPage = function(page) {

			var start = (page - 1) * perPage;
			var end = start + perPage;

			$projectCards.hide().slice(start, end).show();

			$projectPagination.find('.page').removeClass('active');
			$projectPagination.find('.page').eq(page - 1).addClass('active');

			if (page <= 1)
				$projectPagination.find('.previous').addClass('disabled');
			else
				$projectPagination.find('.previous').removeClass('disabled');

			if (page >= totalPages)
				$projectPagination.find('.next').addClass('disabled');
			else
				$projectPagination.find('.next').removeClass('disabled');

			currentPage = page;

		};

		if (totalPages <= 1) {
			$projectPagination.hide();
		}
		else {

			for (var i = totalPages; i >= 1; i--) {
				$('<a href="#" class="page">' + i + '</a>').insertAfter($projectPagination.find('.previous'));
			}

			$projectPagination.on('click', '.page', function(event) {
				event.preventDefault();
				renderProjectPage(parseInt($(this).text(), 10));
			});

			$projectPagination.on('click', '.previous', function(event) {
				event.preventDefault();

				if (currentPage > 1)
					renderProjectPage(currentPage - 1);
			});

			$projectPagination.on('click', '.next', function(event) {
				event.preventDefault();

				if (currentPage < totalPages)
					renderProjectPage(currentPage + 1);
			});

			renderProjectPage(1);

		}

	}

	// Video modal.
	var $videoModal = $(
		'<div class="video-modal" id="videoModal">' +
			'<div class="video-modal-content">' +
				'<a href="#" class="video-modal-close" aria-label="Close video">&times;</a>' +
				'<video controls playsinline>' +
					'<source src="" type="video/mp4" />' +
					'Your browser does not support the video tag.' +
				'</video>' +
			'</div>' +
		'</div>'
	).appendTo($body);

	var modalVideo = $videoModal.find('video').get(0);
	var modalSource = $videoModal.find('source').get(0);

	var closeVideoModal = function() {
		$videoModal.removeClass('is-visible');
		modalVideo.pause();
		modalSource.src = '';
		modalVideo.load();
	};

	$('[data-video-src]').on('click', function(event) {
		event.preventDefault();

		var src = $(this).attr('data-video-src');

		if (!src)
			return;

		modalSource.src = src;
		modalVideo.load();
		$videoModal.addClass('is-visible');
		modalVideo.play();
	});

	$videoModal.on('click', function(event) {
		if ($(event.target).is('.video-modal, .video-modal-close'))
			closeVideoModal();
	});

	$window.on('keyup', function(event) {
		if (event.key === 'Escape' && $videoModal.hasClass('is-visible'))
			closeVideoModal();
	});

})(jQuery);
