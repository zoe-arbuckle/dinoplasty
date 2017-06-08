const app = {
    init (selectors){
        this.max = 0
        this.list = document.querySelector(selectors.listSelector)
        this.dinos = []
        if(window.localStorage.getItem('dinos')){
            this.dinos = Object.keys(window.localStorage.getItem('dinos')).map(function (key){
                    return window.localStorage.getItem('dinos')[key];
                })
            for(let i = 0; i < this.dinos.length; i++){
                this.renderListItem(this.dinos[i])
            }
        }else {
            window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
        }
        document.
            querySelector(selectors.formSelector).
            addEventListener('submit', this.addDino.bind(this))

    },

    addDino (e){
        e.preventDefault()

        const dino = {
            name: e.target.dinoName.value.toUpperCase(),
            id: ++this.max,

        }

        const listItem = this.renderListItem(dino)
        this.list.appendChild(listItem)
        e.target.reset()
        
        //TODO: Add dino to this.dinos array
        this.dinos.push(dino)
        window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
    },

    renderListItem (dino){
        const item = document.createElement('li')
        item.textContent = dino.name

        const del = document.createElement('button')
        del.type = 'button'
        del.textContent = 'delete'
        del.className = 'button'
        del.style.border = '1px solid darkgray'
        del.addEventListener('click', this.deleteItem.bind(this))
        const pro = document.createElement('button')
        pro.type = 'button'
        pro.className = 'button'
        pro.textContent = 'promote'
        pro.style.border = '1px solid darkgray'
        pro.addEventListener('click', this.promote)
        item.style.border='initial'
        item.style.boxShadow = 'initial'

        const up = document.createElement('button')
        const down = document.createElement('button')
        up.textContent = '⬆︎'
        down.textContent = '⬇︎'
        up.className = 'button'
        down.className = 'button'

        up.addEventListener('click', this.moveUp)
        down.addEventListener('click', this.moveDown)
        

        item.appendChild(pro)
        item.appendChild(del)
        item.appendChild(up)
        item.appendChild(down)

        return item
    }, 

    moveUp (e){
        const li = e.target.parentNode;
        if(li.previousSibling){
            li.parentNode.insertBefore(li, li.previousSibling)
        }
    },
    
    moveDown (e){
        const li = e.target.parentNode;
        if(li.nextSibling){
            li.parentNode.insertBefore(li.nextSibling, li)
        }
    }, 

    deleteItem (e){
        e.target.parentNode.remove()
    },

    promote (e){
        if(e.target.parentNode.style.border == 'initial'){
             e.target.parentNode.style.border = '1px solid darkslateblue'
             e.target.parentNode.style.boxShadow = '5px 5px 5px gray'
        }else{
            e.target.parentNode.style.border = 'initial'
            e.target.parentNode.style.boxShadow = 'initial'
        }
       
    },

}

app.init({
    formSelector: '#dino-form', 
    listSelector: '#dino-list',
})