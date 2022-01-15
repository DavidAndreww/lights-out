export function Light(id, isActive) {
  // used to access game squares from array
  this.id = id
  // state of the light
  this.isActive = isActive
}

Light.prototype.toggleState = function() {
    console.log('pre: ', this.isActive)
    this.isActive = !this.isActive
    console.log('post: ', this.isActive)
}

//modifies global variable 'activeLightCount', to track total active buttons
Light.prototype.changeVal = function(integer) {
    return this.isActive ? integer += 1 : integer -=1
}