require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
})

const Person = mongoose.model("Person", personSchema)

const createAndSavePerson = (done) => {
  new Person({ name: "J. Doe", age: 25, favoriteFoods: ["Tacos", "Burritos"] })
    .save((err, newPerson) => {
      if (err) return console.error(err)
      done(null, newPerson)
    })
}

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if (err) return console.error(err)
    done(null, people)
  })
}

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, person) => {
    if (err) return console.error(err)
    done(null, person)
  })
}

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, person) => {
    if (err) return console.error(err)
    done(null, person)
  })
}

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) return console.error(err)
    done(null, person)
  })
}

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger"
  Person.findById(personId, (err, person) => {
    if (err) return console.error(err)
    person.favoriteFoods.push(foodToAdd)
    person.save((err, person) => {
      if (err) return console.error(err)
      done(null, person)
    })
  })
}

const findAndUpdate = (personName, done) => {
  const ageToSet = 20
  Person.findOneAndUpdate({ name: personName }, { age: ageToSet }, { new: true }, (err, person) => {
    if (err) return console.error(err)
    done(null, person)
  })
}

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return console.error(err)
    done(null, removedPerson)
  })
}

const removeManyPeople = (done) => {
  const nameToRemove = "Mary"
  Person.remove({ name: nameToRemove }, (err, removedPeople) => {
    if (err) return console.error(err)
    done(null, removedPeople)
  })

}

const queryChain = (done) => {
  const foodToSearch = "burrito"
  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec((err, people) => {
      if (err) return console.error(err)
      done(null, people)
    })
}

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person
exports.createAndSavePerson = createAndSavePerson
exports.findPeopleByName = findPeopleByName
exports.findOneByFood = findOneByFood
exports.findPersonById = findPersonById
exports.findEditThenSave = findEditThenSave
exports.findAndUpdate = findAndUpdate
exports.createManyPeople = createManyPeople
exports.removeById = removeById
exports.removeManyPeople = removeManyPeople
exports.queryChain = queryChain
