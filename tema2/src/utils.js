const { contentTypes } = require("./constants");

const genericRespStructureGen = (code) => (message) => ({
  headers: { "Content-Type": contentTypes.json },
  code,
  data: {
    message,
  },
});

module.exports = {
  badRequest: genericRespStructureGen(400),
  notFound: genericRespStructureGen(404),
  conflict: genericRespStructureGen(409),
  internalError: () => genericRespStructureGen(500)("INTERNAL ERROR")
};
