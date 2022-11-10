// rounds an angle to the nearest whole integer out of 360 deg
// to simplify validation and make it more consistent
export const roundAngle = (angleInDegrees) => {
    return Number(Math.round(angleInDegrees))
}