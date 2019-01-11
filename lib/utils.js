exports.toPlugin = id => ({ id, apply: require(id) })
