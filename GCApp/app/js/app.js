var app = {
    $app: $('#app'),
    data: {
        baseUrl: 'http://api.golfchallenge.dk',
        init: function () {
            // Get players
            $.ajax({
                url: app.data.baseUrl + '/Player/GetPlayers',
                type: 'GET',
                async: false
            }).done(function(response) {
                console.log('data.init players success', response);
                app.data.players = response;
            }).fail(function (response) {
                console.log('data.init players fail', response);
            });
        },
        players: [],
        matches: []
    },
    dataFormat: {
        formatDate: function (unixdate) {
            if (unixdate) {
                var date = new Date(parseInt(unixdate.replace("/Date(", "").replace(")/", ""), 10));

                return {
                    date: date,
                    prettyDate: date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear()
                };
            }
            else {
                return "Udefineret!";
            }
        }
    },
    init: function () {

    },
    match: {
        addPlayer: function(form) {
            var $form = $(form),
                $view = app.views.$currentView,
                $player = $form.find('#matchAddPlayerId').val(),
                $score = $form.find('#Score').val();

            $.ajax({
                url: '/Scorecard/Create',
                type: 'POST',
                data: {
                    MatchId: $view.attr('data-matchid'),
                    PlayerId: $player,
                    Score: $score
                }
            }).done(function (response) {
                console.log(response);
            }).fail(function () {
                console.log('failed!!');
            })

        },
        create: function () {
            $.ajax({
                url: '/match/Create',
                type: 'POST'
            }).done(function (response) {

                console.log('/match/Create', response);

                app.views.changeView('viewMatchStart', [
                    { name: 'id', value: response }
                ]);

            }).fail(function () {
                alert('Der er sket en 500 fejl!');
            });
        },
        toggleAddPlayer: function () {
            app.views.changeView('viewMatchAddPlayer', [
                {
                    name: 'matchid',
                    value: app.views.$currentView.attr('data-id')
                }
            ], function () {
                // inited after view changes
                var $targetView = app.views.$currentView,
                    $players = $targetView.find('.form-data-players');

                for (var i = 0; i < app.data.players.length; i++) {
                    var player = app.data.players[i];
                    $players.append('<option value="' + player.Id + '">' + player.Name + '</option>');
                    
                }
            });
        }
    },
    views: {
        $activeView: null,
        handleHashChange: function() {
            var e = event;
            e.preventDefault();

            var url = window.location.href,
                targetView = url.substring(url.lastIndexOf('#/') + 2, url.length),
                viewInit = null;

            for (var i = 0; i < app.views.init.length; i++) {
                var v = app.views.init[i];
                if (v.name == targetView) {
                    viewInit == v.init;
                }
            }

            if (!viewInit) {
                app.views.init[0].init();
            }
            else {
                viewInit();
                console.log('Ingen view:', targetView);
            }
        },
        init: [
            // Home skal altid være øverst!
            {
                name: 'home',
                init: function () {
                    var $matchList = $('#viewHome-matchList'),
                        html = '';

                    $.ajax({
                        type: 'GET',
                        url: 'http://api.golfchallenge.dk/Match/GetMatches',
                        contentType: 'text/plain',
                        xhrFields: {
                            withCredentials: false
                        },
                        headers: {
                            
                        },
                        success: function (response) {
                            console.log(response);
                            for (var i = 0; i < response.length; i++) {
                                var match = response[i],
                                    matchDate = app.dataFormat.formatDate(match.CreateDate).prettyDate;
                                // Here's where you handle a successful response.
                                html += '<li class="app-list-item app-text" data-id="' + match.Id + '">';
                                html += '<div class="app-list-item-icon">';
                                html += '<span class="icon-trophy"></span>';
                                html += '</div>';
                                html += '<div class="app-list-item-content">';
                                html += '<h2 class="app-list-item-header">Match spillet ' + match.Id + '</h2>';
                                html += '<span class="app-list-item-text">';
                                html += matchDate;
                                html += '</span>';
                                html += '</div>';
                                html += '</li>';
                            }
                            $matchList.html(html);
                        },
                        error: function () {
                            // Here's where you handle an error response.
                            // Note that if the error was due to a CORS issue,
                            // this function will still fire, but there won't be any additional
                            // information about the error.
                        }
                    });

                    
                    
                }
            }
        ]
        //init: function () {
        //    var $views = $app.find('.view'),
        //        $activeView = null;

        //    if (!app.views.$activeView) {
        //        $views.each(function (i, $view) {
        //            if ($view.hasClass('view-active')) {
        //                $activeView = $view;
        //            }
        //        });
        //    }
        //}
    },
    old_views: {
        $currentView: null,
        config: {
            baseUrl: '/app/js/views/',
            $app: $('#app')
        },
        changeView: function(view, attr, callback) {
            var $app = app.views.config.$app,
                $view = $(app.views.getView(view));

            if (attr) {
                for (var i = 0; i < attr.length; i++) {
                    var obj = attr[i];
                    $view.attr('data-' + obj.name, obj.value);
                }
            }

            // Transition??
            $app.empty().append($view);
            app.views.$currentView = $view;

            if (callback) {
                callback();
            }
        },
        getView: function(name, settings) {
            if (name) {
                var url = app.views.config.baseUrl + name + '.html' + '?' + new Date(),
                    view = null;

                $.ajax({
                    url: url,
                    type: 'GET',
                    async: false
                }).done(function (response) {
                    view = response;
                });

                return view;
            }
        }
    }
}

app.data.init();

$(window).on('hashchange', app.views.handleHashChange);
$(window).on('load', app.views.handleHashChange);

// Event binding
$(document).on('click', '.action-match-create', function (e) {
    e.preventDefault();
    app.match.create();
});

$(document).on('click', '.action-match-addPlayer', function (e) {
    e.preventDefault();
    app.match.toggleAddPlayer();
});

$(document).on('submit', '#matchAddPlayer', function (e) {
    e.preventDefault();
    app.match.addPlayer(this);
})

/*
Create:
$.ajax({
url: 'http://api.golfchallenge.dk/match/Create',
type: 'post'
}).success(function(response) {
console.log(response);
}).fail(function() {
console.log('fail');
})
*/