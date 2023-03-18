import { ReactElementType } from "shared/ReactTypes";
import { mountChildFibers, reconcilerChildFibers } from "./childFiber";
import { FiberNode } from "./fiber";
import { processUpdateQueue, UpdateQueue } from "./updateQueue";
import { HostComponent, HostRoot, HostText } from "./workTags";

// 
export const beginWork = (wip: FiberNode) => {
    // compare and return child FiberNode
    switch (wip.tag) {
        case HostRoot:
            return updateHostRoot(wip)
        case HostComponent:
            return updateHostComponent(wip)
        case HostText:
            return null

        default:
            if (__DEV__) {
                console.warn('beginwork 未实现的类型')
            }
            return null
    }
}

function updateHostRoot(wip: FiberNode) {
    const baseState = wip.memorizedState
    const updateQueue = wip.updateQueue as UpdateQueue<Element>

    const pending = updateQueue.shared.pending

    updateQueue.shared.pending = null

    const { memoizedState } = processUpdateQueue(baseState, pending)
    const nextChildren = wip.memorizedState
    reconcileChildren(wip, nextChildren)
    return wip.child
}

function updateHostComponent(wip: FiberNode) {
    const nextProps = wip.pendingProps
    const nextChildren = nextProps.children
    reconcileChildren(wip, nextChildren)
    return wip.child
}


function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
    const current = wip.alterNate
    if (current !== null) {
        // update
        wip.child = reconcilerChildFibers(wip, current.child, children)
    } else {
        // mount
        wip.child = mountChildFibers(wip, null, children)

    }
}
