import { Action } from "shared/ReactTypes";

export interface Update<State> {
    action: Action<State>
}

export interface UpdateQueue<State> {
    shared: {
        pending: Update<State> | null
    }
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
    return {
        action
    }
}

export const createUpdateQueue = <Action>(): UpdateQueue<Action> => {
    return {
        shared: {
            pending: null
        }
    }
}

export const enqueueUpdate = <Action>(updateQueue: UpdateQueue<Action>, update: Update<Action>) => {
    updateQueue.shared.pending = update
}

export const processUpdateQueue = <State>(baseState: State, pendingUpdate: Update<State>): { memoizedState: State } => {
    const result: ReturnType<typeof processUpdateQueue<State>> = { memoizedState: baseState }
    if (pendingUpdate !== null) {
        // baseState 1 update 2 => memoizedState = 2
        // baseState 1 update (x) => 4X -> memoizedState = 4
        const action = pendingUpdate.action
        if (action instanceof Function) {
            result.memoizedState = action(baseState)
        } else {
            result.memoizedState = action
        }
    }
    return result
}