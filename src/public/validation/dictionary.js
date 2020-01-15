export const validationDictionary = {
  name: {
    presence: {
      allowEmpty: false,
      message: '^Name required',
    },
  },

  description: {
    presence: {
      allowEmpty: false,
      message: '^Description is required',
    },
  },

  email: {
    presence: {
      allowEmpty: false,
      message: '^Email field is required',
    },
    email: {
      message: '^Email address must be valid',
    },
  },

  location: {
    presence: {
      allowEmpty: false,
      message: '^Location is required',
    },
  },

  phone: {
    presence: {
      allowEmpty: false,
      message: '^Phone number is required',
    },
    format: {
      pattern: /^[0-9]{10,12}$/,
      message: '^Phone number must be valid',
    },
  },

  password: {
    presence: {
      allowEmpty: false,
      message: '^Password is required',
    },
    length: {
      minimum: 6,
      message: '^Password must be at least 6 characters long',
    },
  },
  password2: {
    presence: {
      allowEmpty: false,
      message: '^Password is required',
    },
  },
  password3: {
    presence: {
      allowEmpty: false,
      message: '^Password confirm is required',
    },
  },
  passwordConfirm: {
    presence: {
      allowEmpty: false,
      message: '^Password confirmation is required',
    },
    equality: {
      attribute: 'password',
      message: '^Passwords do not match',
      comparator: function(v1, v2) {
        return v1 === v2;
      },
    },
  },
};
