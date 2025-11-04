const mongoose = require('mongoose')

// early check
if (process.argv.length < 3) {
    console.log('Please provide a password')
    process.exit(1)
}

// password
const password = process.argv[2]
const url = `mongodb+srv://harshilshrma:${password}@fullstackopen.6c8kv3o.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// creating the person schema and model
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)

// adding a person if 5 arguments
if (process.argv.length === 5) {
    const givenName = process.argv[3]
    const givenNumber = process.argv[4]

    const person = new Person({
        name: givenName,
        number: givenNumber
    })

    person.save().then(() => {
        console.log(`Added ${givenName} with number: ${givenNumber} to phonebook!`)
        mongoose.connection.close()
    })
} else if (process.argv.length === 3) { // for listing all phonebook entries
    console.log('Phonebook:')
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
} else {
    console.log('Invalid number of arguments!')
    process.exit(1)
}

