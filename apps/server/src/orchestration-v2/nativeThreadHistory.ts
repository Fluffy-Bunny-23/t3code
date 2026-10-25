import type {
  OrchestrationV2HistoricalMessage,
  OrchestrationV2TurnItem,
  ProviderThreadId,
  RunId,
  ThreadId,
} from "@t3tools/contracts";

type NativeHistoryItem = {
  readonly threadId: OrchestrationV2HistoricalMessage["threadId"];
  readonly providerThreadId?: OrchestrationV2TurnItem["providerThreadId"];
  readonly runId?: OrchestrationV2TurnItem["runId"];
  readonly type?: OrchestrationV2TurnItem["type"];
  readonly kind?: OrchestrationV2HistoricalMessage["kind"];
};

export const itemIsInNativeThread = (input: {
  readonly item: NativeHistoryItem;
  readonly threadId: ThreadId;
  readonly providerThreadId: ProviderThreadId;
  readonly acceptedRunIds: ReadonlySet<RunId>;
  readonly runOrdinals: ReadonlyMap<RunId, number>;
  readonly latestCompactionRunOrdinal: number | undefined;
}) => {
  const { item } = input;
  if (
    item.type === "run_interrupt_result" ||
    item.kind === "run_interrupt_result" ||
    item.threadId !== input.threadId ||
    item.providerThreadId !== input.providerThreadId ||
    item.runId == null ||
    !input.acceptedRunIds.has(item.runId)
  )
    return false;

  const runOrdinal = input.runOrdinals.get(item.runId);
  return (
    runOrdinal !== undefined &&
    (input.latestCompactionRunOrdinal === undefined ||
      runOrdinal > input.latestCompactionRunOrdinal)
  );
};
