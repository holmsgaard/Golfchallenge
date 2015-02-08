var app = {
    data: {
        init: function () {
            // Get players
            $.ajax({
                url: '/Player/GetPlayers',
                type: 'GET',
                async: false
            }).done(function(response) {
                console.log('data.init players success', response);
                app.data.players = response;
            }).fail(function (response) {
                console.log('data.init players fail', response);
            });
        },
        players: []
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

