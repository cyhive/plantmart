/** Admin seed runs on first API DB access via getUsersCollection(), not here (avoids bundling MongoDB in instrumentation). */
export async function register() {}
