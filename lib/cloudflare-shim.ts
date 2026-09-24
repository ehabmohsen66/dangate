export const env: Record<string, any> = typeof process !== 'undefined' ? process.env : {};
export class WorkerEntrypoint {}
export class DurableObject {}
export class WorkflowEntrypoint {}
export default { env, WorkerEntrypoint, DurableObject, WorkflowEntrypoint };
