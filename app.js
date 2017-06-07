const app = {
    init (formSelector){
        document.
            querySelector(formSelector).
            addEventListener('submit', this.addDino.bind(this))
    },

    addDino (e){
        e.preventDefault()
        const dinoName = e.target.dinoName.value
        console.log(dinoName)
    },
}

app.init('#dino-form')