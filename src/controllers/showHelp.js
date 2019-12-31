module.exports = async ({
    ack,
    say
  }) => {
    try {
      ack();
      say(`:face_with_monocle: hmm I don't yet know how to help`)
    } catch (error) {
      console.log(error);
    }
  };
  
  