import ReduxGenerator from './generator';

export default (function () {
  let instance;

  function createInstance() {
    return new ReduxGenerator();
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();
