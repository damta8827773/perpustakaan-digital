# Pipeline agregasi metrik dengan supervision tree. Bahasa: Elixir.
defmodule Perpus.Analytics do
  use Agent

  def start_link(_opts), do: Agent.start_link(fn -> %{} end, name: __MODULE__)

  def incr(book_id) do
    Agent.update(__MODULE__, &Map.update(&1, book_id, 1, fn n -> n + 1 end))
  end

  def top(n) do
    Agent.get(__MODULE__, fn state ->
      state |> Enum.sort_by(fn {_id, count} -> -count end) |> Enum.take(n)
    end)
  end
end
