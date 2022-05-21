import * as THREE from 'three';
import { OrbitControls } from 'orbit-three';

const offset2 = new THREE.Vector3()
const targetDeltaX = new THREE.Vector3()
const targetDeltaY = new THREE.Vector3()
const targetDeltaZ = new THREE.Vector3()
const targetDelta = new THREE.Vector3()
const panOffset2 = new THREE.Vector3()
let scaleOffset = 1
const upVec = new THREE.Vector3(0, 1, 0)

export class OffsetOrbitControls extends OrbitControls {

    constructor(object, domElement) {
        super(object, domElement)
        const sup = this.update
        this.update = ()=>this._update(sup)
    }

    targetOffset = new THREE.Vector3(0, 0, 0)

    _update(sup) {

        this.target.add(this.targetOffset)

        offset2.copy(this.object.position).sub(this.target)

        scaleOffset = offset2.length()

        panOffset2.copy(this.target)

        const ret = sup()

        panOffset2.sub(this.target) // get the panOffset of this frame from OrbitControls

        offset2.copy(this.object.position).sub(this.target)

        scaleOffset /= offset2.length()

        this.target.add(panOffset2)

        this.object.position.copy(this.target).add(offset2)

        offset2.normalize()

        targetDeltaX.crossVectors(upVec, offset2).normalize()
        targetDeltaY.crossVectors(offset2, targetDeltaX).normalize()
        targetDeltaZ.crossVectors(targetDeltaX, targetDeltaY).normalize().negate()

        if (targetDeltaX.length() > 0.1) // check if not 0
            this.object.up.crossVectors(offset2.clone().normalize(), targetDeltaX)

        if (this.enablePan) {

            targetDelta.set(0, 0, 0)
                .addScaledVector(targetDeltaX, panOffset2.x)
                .addScaledVector(targetDeltaY, panOffset2.y)
                .addScaledVector(targetDeltaZ, panOffset2.z)
            this.targetOffset.add(targetDelta)
            this.targetOffset.multiplyScalar(1. / scaleOffset)

        }

        targetDelta.set(0, 0, 0)
            .addScaledVector(targetDeltaX, -this.targetOffset.x)
            .addScaledVector(targetDeltaY, -this.targetOffset.y)
            .addScaledVector(targetDeltaZ, -this.targetOffset.z)

        // console.log(targetDelta)
        this.object.lookAt(targetDelta.add(this.target))

        this.object.updateMatrixWorld()
        if (this.object.isCamera) {
            this.object.updateProjectionMatrix()
        }

        this.target.sub(this.targetOffset)

        return ret
    }
}
