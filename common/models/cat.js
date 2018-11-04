'use strict';

module.exports = function(Cat) {
  Cat.observe('before save', (context, next) => {
    if (context.instance) context.instance.updated = new Date();
    next();
  });

  Cat.afterRemote('findById', (context, cat, next) => {
    cat.description = `${cat.name} is a cool, ${cat.age}-year-old, with a ${
      cat.breed
    } attitude!`;
    next();
  });

  Cat.adoptable = function(id, cb) {
    Cat.findById(id, (err, cat) => {
      if (err) return cb('Error', null);
      if (!cat) return cb(err, null);
      if (cat.breed === 'tiger' && cat.age < 10) return cb(null, false);
      return cb(null, true);
    });
  };

  Cat.remoteMethod('adoptable', {
    accepts: { arg: 'id', type: 'any' },
    returns: { arg: 'adoptable', type: 'boolean' }
  });

  Cat.validatesInclusionOf('gender', { in: ['male', 'female'] });

  Cat.validatesNumericalityOf('age', { int: true });
};
