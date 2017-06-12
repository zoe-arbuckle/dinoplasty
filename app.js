const app = {
    init (selectors){
        this.max = 0
        this.list = document.querySelector(selectors.listSelector)
        this.dinos = []
        this.template = document.querySelector(selectors.templateSelector)
        if(window.localStorage.getItem('dinos')){
            this.dinos = JSON.parse(window.localStorage.getItem('dinos'))
            for(let i = 0; i < this.dinos.length; i++){
                this.addDinoLocal(this.dinos[i])
            }
            window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
        }else {
            window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
        }
        document.
            querySelector(selectors.formSelector).
            addEventListener('submit', this.addDino.bind(this))

    },

    addDinoLocal (dino){
        const listItem = this.renderListItem(dino)
        this.list.insertBefore(listItem, this.list.firstChild)
        listItem.dataset.id = ++this.max
        dino.id = listItem.dataset.id
        if(dino.fav){
            listItem.classList.add('fav')
        }
    },

    addDino (e){
        e.preventDefault()
        let check = ''

        const types = document.getElementsByName('dino-type-radio')
        for(let i=0; i < types.length; i++){
            if(types[i].checked){
                check = types[i].value.toUpperCase()
            }
        }

        const dino = {
            name: e.target.dinoName.value.toUpperCase(),
            id: ++this.max,
            type: check,
            fav: false,
        }

        const listItem = this.renderListItem(dino)
        this.list.insertBefore(listItem, this.list.firstChild)
        e.target.reset()
        
        this.dinos.unshift(dino)
        window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
    },

    renderListItem (dino){
        const item = this.template.cloneNode(true)
        item.querySelector('.dino-name').textContent = dino.name
        item.querySelector('.dino-type').textContent = dino.type
        item.dataset.id = dino.id
        item.classList.remove('template')

        item.querySelector('.remove').addEventListener('click', this.deleteItem.bind(this))
        item.querySelector('.fav').addEventListener('click', this.promote.bind(this, dino))
        item.querySelector('.up').addEventListener('click', this.moveUp.bind(this, dino))
        item.querySelector('.down').addEventListener('click', this.moveDown.bind(this, dino))
        item.querySelector('.edit').addEventListener('click', this.edit.bind(this))

        return item
    }, 

    moveUp (dino, e){
        const li = e.target.closest('.dino');
        const index = this.dinos.findIndex((currentDino, i)=> {
            return currentDino.id === dino.id
        })
        if(index > -1){
            this.list.insertBefore(li, li.previousSibling)
            
            const previousDino = this.dinos[index-1]
            this.dinos[index-1] = dino
            this.dinos[index] = previousDino
            window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
        }
    },
    
    moveDown (dino, e){
        const li = e.target.closest('.dino');
        const index = this.dinos.findIndex((currentDino, i)=> {
            return currentDino.id === dino.id
        })
        if(index < this.dinos.length - 1){
            this.list.insertBefore(li.nextSibling, li)
            
            const nextDino = this.dinos[index+1]
            this.dinos[index+1] = dino
            this.dinos[index] = nextDino
            window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
        }
    }, 

    deleteItem (e){
        e.target.closest('.dino').remove()
        for(let i=0; i < this.dinos.length; i++){
            if(this.dinos[i].id.toString() === e.target.closest('.dino').dataset.id){
                this.dinos.splice(i, 1)
                window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
                break;
            }
        }
    },

    promote (dino, e){
        const item = e.target.closest('.dino')
        if(dino.fav){
            item.classList.remove('fav')
            dino.fav = false
        } else{
            item.classList.add('fav')
            dino.fav = true
        }

        window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
    },

    edit(e){
        const spanType = e.target.closest('.dino').querySelector('.dino-type')
        const spanName = e.target.closest('.dino').querySelector('.dino-name')
        if(spanType.isContentEditable){
            this.dinos[e.target.closest('.dino').dataset.id - 1].type = spanType.textContent.toUpperCase()
            this.dinos[e.target.closest('.dino').dataset.id - 1].name = spanName.textContent.toUpperCase()
            spanType.textContent = spanType.textContent.toUpperCase()
            spanName.textContent = spanName.textContent.toUpperCase()
            window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
            e.target.style.color = 'black'
            e.target.classList.remove('warning')
            e.target.classList.add('success')
            spanType.contentEditable = false
            spanName.contentEditable = false
        } else　{
            e.target.style.color = 'white'
            e.target.classList.add('warning')
            e.target.classList.remove('success')
            spanType.contentEditable = true
            spanName.contentEditable = true
            spanName.focus()
        }
    },

}

app.init({
    formSelector: '#dino-form', 
    listSelector: '#dino-list',
    templateSelector: '.dino.template',
})