import { Props, Key, Ref } from 'shared/ReactTypes'
import { Flags, NoFlags } from './fiberFlags';
import { WorkTag } from './workTags';

export class FiberNode {
    type: any
    tag: WorkTag
    stateNode: any
    key: Key
    pendingProps: Props
    memoizedProps: Props | null
    ref: Ref

    return: FiberNode | null
    sibling: FiberNode | null
    child: FiberNode | null
    index: number
    alterNate: FiberNode | null
    flags: Flags

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
        // effect
        this.flags = NoFlags
    }
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
