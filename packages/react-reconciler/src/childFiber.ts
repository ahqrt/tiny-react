import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { ReactElementType } from "shared/ReactTypes";
import { createFiberFromElement, FiberNode } from "./fiber";
import { Placement } from "./fiberFlags";
import { HostText } from "./workTags";

function ChildReconciler(shouldTrackEffect: boolean) {

    function reconcileSingleElement(returnFiber: FiberNode, currentFiber: FiberNode | null, element: ReactElementType) {
        // 
        const fiber = createFiberFromElement(element)
        fiber.return = returnFiber
        return fiber
    }

    function reconcileSingleTextNode(returnFiber: FiberNode, currentFiber: FiberNode | null, content: string | number) {
        const fiber = new FiberNode(HostText, { content }, null)
        fiber.return = returnFiber
        return fiber
    }

    function placeSingleChild(fiber: FiberNode) {
        if (shouldTrackEffect && fiber.alterNate === null) {
            fiber.flags |= Placement
        }
        return fiber
    }

    return function reconcilerChildFibers(returnFiber: FiberNode, currentFiber: FiberNode | null, newChild?: ReactElementType) {
        // current fiber type
        if (typeof newChild === 'object' && newChild !== null) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    const fiber = reconcileSingleElement(returnFiber, currentFiber, newChild)
                    return placeSingleChild(fiber)
                default:
                    if (__DEV__) {
                        console.warn('did not complete this reconcile type', newChild)
                    }
            }
        }


        // multiple node

        // HostText
        if (typeof newChild === 'string' || typeof newChild === 'number') {
            const fiber = reconcileSingleTextNode(returnFiber, currentFiber, newChild)
            return placeSingleChild(fiber)
        }

        if (__DEV__) {
            console.warn('did not complete this reconcile type', newChild)
        }
        return null
    }
}

export const reconcilerChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)