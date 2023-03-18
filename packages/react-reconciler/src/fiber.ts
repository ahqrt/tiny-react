import { Container } from 'hostConfig';
import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes'
import { Flags, NoFlags } from './fiberFlags';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';

export class FiberNode {
    type: any
    tag: WorkTag
    stateNode: any
    key: Key
    pendingProps: Props
    memoizedProps: Props | null
    memorizedState: any
    ref: Ref

    return: FiberNode | null
    sibling: FiberNode | null
    child: FiberNode | null
    index: number
    alterNate: FiberNode | null
    flags: Flags
    updateQueue: unknown

    constructor(tag: WorkTag, pendingProps: Props, key: Key) {
        // instance 
        this.tag = tag
        this.key = key
        // HostComponent <div> div Dom
        this.stateNode = null
        // FunctionComponent function self
        this.type = null
        // to construct a tree map
        this.return = null
        this.sibling = null
        this.child = null
        this.index = 0

        this.ref = null
        // as a working unit
        this.pendingProps = pendingProps
        this.memoizedProps = null
        this.alterNate = null
        this.updateQueue = null
        this.memorizedState = null
        // effect
        this.flags = NoFlags
    }
}


export class FiberRootNode {
    container: Container
    current: FiberNode
    finishedWork: FiberNode | null

    constructor(container: Container, hostRootFiber: FiberNode) {
        this.container = container
        this.current = hostRootFiber
        hostRootFiber.stateNode = this
        this.finishedWork = null
    }
}


export const createWorkInProgress = (current: FiberNode, pendingProps: Props): FiberNode => {
    let wip = current.alterNate

    if (wip === null) {
        // mount
        wip = new FiberNode(current.tag, pendingProps, current.key)
        wip.stateNode = current.stateNode
        wip.alterNate = current
        current.alterNate = wip
    } else {
        // update
        wip.pendingProps = pendingProps
        wip.flags = NoFlags
    }
    wip.type = current.type
    wip.updateQueue = current.updateQueue
    wip.child = current.child
    wip.memoizedProps = current.memoizedProps
    wip.memorizedState = current.memorizedState

    return wip
}


export function createFiberFromElement(element: ReactElementType): FiberNode {
    const { type, key, props } = element
    let fiberTag: WorkTag = FunctionComponent

    if (typeof type === 'string') {
        // <div> type 'div'
        fiberTag = HostComponent
    } else if (typeof type !== 'function' && __DEV__) {
        console.warn('undefined type', element)
    }

    const fiber = new FiberNode(fiberTag, props, key)
    fiber.type = type
    return fiber

}

/**
 * 
 * if a Component like this
 * <Card>
 *  <h3>hello</h3>
 *  <p>world</p>
 * </Card>
 * 
 * 
 * react use DFS to traversal react element
 * so there two steps in recursion
 * the first step is to traversal child: named beginWork
 * then to traversal child's sibling
 * after finished traversal child and child's sibling then came back to parent: named completeWork 
 *  */
