const app = {
    init (selectors){
        this.max = 0
        this.list = document.querySelector(selectors.listSelector)
        document.
            querySelector(selectors.formSelector).
            addEventListener('submit', this.addDino.bind(this))
    },

    addDino (e){
        e.preventDefault()

        const dino = {
            name: e.target.dinoName.value,
            id: ++this.max,

        }

        const listItem = this.renderListItem(dino)
        this.list.appendChild(listItem)
    },

    renderListItem (dino){
        const item = document.createElement('li')
        item.textContent = dino.name

        return item
    }, 
}

app.init({
    formSelector: '#dino-form', 
    listSelector: '#dino-list',
})