import { beginWork } from "./beginwork";
import { completeWork } from "./completeWork";
import { createWorkInProgress, FiberNode, FiberRootNode } from "./fiber";
import { HostRoot } from "./workTags";

let workInProgress: FiberNode | null = null

function prepareFreshStack(root: FiberRootNode) {
    workInProgress = createWorkInProgress(root.current, {})
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
    //TODO schedule
    const root = markUpdateFromFiberToRoot(fiber)
    renderRoot(root)
}


function markUpdateFromFiberToRoot(fiber: FiberNode) {
    let node = fiber
    let parent = node.return
    while (parent !== null) {
        node = parent
        parent = node.return
    }

    if (node.tag === HostRoot) {
        return node.stateNode
    }
    return null
}

function renderRoot(root: FiberRootNode) {
    // init
    prepareFreshStack(root)

    do {
        try {
            workLoop()
        } catch (error) {
            if (__DEV__) {
                console.warn('workLoop error', error)
            }
            workInProgress = null
        }
    } while (true)

    const finishedwork = root.current.alterNate
    root.finishedWork = finishedwork


    commitRoot(root)
}


function workLoop() {
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress)
    }
}

function performUnitOfWork(fiber: FiberNode) {
    const next = beginWork(fiber)
    fiber.memoizedProps = fiber.pendingProps

    if (next === null) {
        completeUnitOfWork(fiber)
    } else {
        workInProgress = next
    }
}

function completeUnitOfWork(fiber: FiberNode) {
    let node: FiberNode | null = fiber
    do {
        completeWork(node)
        const sibling = node.sibling
        if (sibling !== null) {
            workInProgress = sibling
            return
        }
        node = node.return
    } while (node !== null)
}