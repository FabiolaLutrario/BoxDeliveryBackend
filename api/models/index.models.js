const User = require("./User.models");
const Package = require("./Package.models");

Package.belongsTo(User, { as: "deliveryman", foreignKey: "deliveredBy" });

module.exports = { User, Package };
