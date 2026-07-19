%% Agregasi metrik baca real-time (actor model). Bahasa: Erlang.
-module(analytics).
-export([start/0, record/2]).

start() -> spawn(fun() -> loop(#{}) end).

record(Pid, BookId) -> Pid ! {incr, BookId}.

loop(State) ->
    receive
        {incr, BookId} ->
            loop(maps:update_with(BookId, fun(N) -> N + 1 end, 1, State))
    end.
