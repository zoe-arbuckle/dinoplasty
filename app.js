const app = {
    init (selectors){
        this.max = 0
        this.list = document.querySelector(selectors.listSelector)
        this.dinos = []
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
        
        //TODO: Add dino to this.dinos array
        this.dinos.push(dino)
    },

    renderListItem (dino){
        const item = document.createElement('li')
        item.textContent = dino.name

        const del = document.createElement('button');
        del.type = 'button'
        del.textContent = 'delete'
        del.className = 'hollow button'
        del.addEventListener('click', this.deleteItem.bind(this))
        const pro = document.createElement('button')
        pro.type = 'button'
        pro.className = 'hollow button'
        pro.textContent = 'promote'
        pro.addEventListener('click', this.promote)

        item.appendChild(pro)
        item.appendChild(del)

        return item
    }, 

    deleteItem (e){
        e.target.parentNode.remove()
    },

    promote (){

    },

}

app.init({
    formSelector: '#dino-form', 
    listSelector: '#dino-list',
})