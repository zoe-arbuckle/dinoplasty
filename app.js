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
        item.style.border = 'initial'

        item.querySelector('.remove').addEventListener('click', this.deleteItem.bind(this))
        item.querySelector('.fav').addEventListener('click', this.promote.bind(this))
        item.querySelector('.up').addEventListener('click', this.moveUp.bind(this))
        item.querySelector('.down').addEventListener('click', this.moveDown.bind(this))
        item.querySelector('.edit').addEventListener('click', this.edit.bind(this))

        return item
    }, 

    moveUp (e){
        const li = e.target.closest('.dino');
        if(li.previousSibling){
            li.parentNode.insertBefore(li, li.previousSibling)
        }
        //TODO: try to persist by changing the order of the array as well
    },
    
    moveDown (e){
        const li = e.target.closest('.dino');
        if(li.nextSibling){
            li.parentNode.insertBefore(li.nextSibling, li)
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

    promote (e){
        //TODO: try to find a way to get favorites to persist as well
        if(e.target.closest('.dino').style.border === 'initial'){
             e.target.closest('.dino').style.border = '1px solid darkslateblue'
             e.target.closest('.dino').style.backgroundColor = 'lightyellow'
        }else{
            e.target.closest('.dino').style.border = 'initial'
            e.target.closest('.dino').style.backgroundColor = 'white'
        }
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
        }
    },

}

app.init({
    formSelector: '#dino-form', 
    listSelector: '#dino-list',
    templateSelector: '.dino.template',
})