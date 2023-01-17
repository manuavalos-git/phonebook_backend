const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3 ) {
  const password = process.argv[2];
  const url = `mongodb+srv://manuAvalos:${password}@cluster0.y0nvozs.mongodb.net/?retryWrites=true&w=majority`;

  mongoose
      .connect(url)
      .then((result) => {
        console.log('connected');
        Person
            .find({})
            .then((persons) => {
              console.log(`phonebook:`);
              persons.forEach((person) => {
                console.log(`${person.name} ${person.number}`);
              });
              mongoose.connection.close();
            });
      })
      .catch((err) => console.log(err));
} else if ( process.argv.length === 5) {
  const password = process.argv[2];
  const name=process.argv[3];
  const number=process.argv[4];

  const url = `mongodb+srv://manuAvalos:${password}@cluster0.y0nvozs.mongodb.net/?retryWrites=true&w=majority`;

  mongoose
      .connect(url)
      .then((result) => {
        console.log('connected');

        const person = new Person({
          name: `${name}`,
          number: `${number}`,
        });

        return person.save();
      })
      .then((person) => {
        console.log(
            `Added ${person.name} number ${person.number} to phonebook`);
        return mongoose.connection.close();
      })
      .catch((err) => console.log(err));
} else {
  console.log(
      `Please provide the password as an argument: 
      node mongo.js <password> to get the entire directory 
      or 
      Provide the password,name and number as an argument: 
      node mongo.js <password> <name> <number> 
      to add a person to the directory`);
  process.exit(1);
}

