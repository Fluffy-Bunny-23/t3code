import { expect, it } from "vite-plus/test";
import { ProviderThreadId, RunId, ThreadId } from "@t3tools/contracts";

import { itemIsInNativeThread } from "./nativeThreadHistory.ts";

it("only treats retained provider input as native transcript history", () => {
  const threadId = ThreadId.make("thread:native-history");
  const providerThreadId = ProviderThreadId.make("provider-thread:native-history");
  const beforeCompaction = RunId.make("run:before-compaction");
  const afterCompaction = RunId.make("run:after-compaction");
  const shared = {
    threadId,
    providerThreadId,
    acceptedRunIds: new Set([beforeCompaction, afterCompaction]),
    runOrdinals: new Map([
      [beforeCompaction, 1],
      [afterCompaction, 3],
    ]),
    latestCompactionRunOrdinal: 2,
  };

  expect(
    itemIsInNativeThread({
      ...shared,
      item: {
        type: "user_message",
        threadId,
        providerThreadId,
        runId: beforeCompaction,
      },
    }),
  ).toBe(false);
  expect(
    itemIsInNativeThread({
      ...shared,
      item: {
        type: "user_message",
        threadId,
        providerThreadId,
        runId: afterCompaction,
      },
    }),
  ).toBe(true);
  expect(
    itemIsInNativeThread({
      ...shared,
      item: {
        type: "run_interrupt_result",
        threadId,
        providerThreadId,
        runId: afterCompaction,
      },
    }),
  ).toBe(false);
  expect(
    itemIsInNativeThread({
      ...shared,
      item: {
        kind: "run_interrupt_result",
        threadId,
        providerThreadId,
        runId: afterCompaction,
      },
    }),
  ).toBe(false);
});
