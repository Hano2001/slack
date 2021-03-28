function resetPassword(password) {
  bcrypt.hash(password, 10, (error, hash) => {
    if (err) {
      console.log(er);
    } else {
      password = hash;

      return hash;
    }
  });
}

module.export = { resetPassword };
