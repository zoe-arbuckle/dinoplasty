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
        item.querySelector('.dino-type').textContent = '(' + dino.type + ')'
        item.dataset.id = dino.id
        item.classList.remove('template')
        item.style.border = 'initial'

        item.querySelector('.remove').addEventListener('click', this.deleteItem.bind(this))
        item.querySelector('.fav').addEventListener('click', this.promote)
        item.querySelector('.up').addEventListener('click', this.moveUp)
        item.querySelector('.down').addEventListener('click', this.moveDown)
        item.querySelector('.edit').addEventListener('click', this.edit)

        return item
    }, 

    moveUp (e){
        const li = e.target.closest('.dino');
        if(li.previousSibling){
            li.parentNode.insertBefore(li, li.previousSibling)
        }
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
        if(e.target.closest('.dino').style.border === 'initial'){
             e.target.closest('.dino').style.border = '1px solid darkslateblue'
             e.target.closest('.dino').style.backgroundColor = 'lightyellow'
        }else{
            e.target.closest('.dino').style.border = 'initial'
            e.target.closest('.dino').style.backgroundColor = 'whitesmoke'
        }
    },

    edit(e){
        
    },

}

app.init({
    formSelector: '#dino-form', 
    listSelector: '#dino-list',
    templateSelector: '.dino.template',
})