const app = {
    init (formSelector){
        this.max = 0
        document.
            querySelector(formSelector).
            addEventListener('submit', this.addDino.bind(this))
    },

    addDino (e){
        e.preventDefault()

        const dino = {
            name: e.target.dinoName.value,
            id: ++this.max,

        }

        console.log(dino.name)
        console.log(dino.id)
    },
}

app.init('#dino-form')