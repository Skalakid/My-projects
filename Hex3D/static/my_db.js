var obj = {
    add: function (element, name) {
        obj.data[`${name}`] = element
        console.log(obj.data);
    },

    data: {},

    load: function (name) {
        return obj.data
    },

}

module.exports = obj