class App {
    constructor (selectors){
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

    }

    addDinoLocal (dino){
        const listItem = this.renderListItem(dino)
        this.list.appendChild(listItem)
        //listItem.dataset.id = ++this.max //this resets the ids, current use maintains ids
        if(dino.id > this.max){
            this.max = dino.id
        }
        dino.id = listItem.dataset.id
        if(dino.fav){
            listItem.classList.add('fav')
        }
    }

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
        this.list.appendChild(listItem)
        e.target.reset()
        
        this.dinos.push(dino)
        window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
    }

    renderListItem (dino){
        const item = this.template.cloneNode(true)
        item.querySelector('.dino-name').textContent = dino.name
        item.querySelector('.dino-name').setAttribute('title', dino.name)
        item.querySelector('.dino-type').textContent = dino.type
        item.dataset.id = dino.id
        item.classList.remove('template')

        item.querySelector('.dino-name').addEventListener('keypress', this.saveOnEnter.bind(this, dino))
        item.querySelector('.dino-type').addEventListener('keypress', this.saveOnEnter.bind(this, dino))

        item.querySelector('.remove').addEventListener('click', this.deleteItem.bind(this))
        item.querySelector('.fav').addEventListener('click', this.promote.bind(this, dino))
        item.querySelector('.up').addEventListener('click', this.moveUp.bind(this, dino))
        item.querySelector('.down').addEventListener('click', this.moveDown.bind(this, dino))
        item.querySelector('.edit').addEventListener('click', this.edit.bind(this, dino))

        return item
    } 

    moveUp (dino, e){
        const li = e.target.closest('.dino');
        const index = this.dinos.findIndex((currentDino, i)=> {
            return currentDino.id === dino.id
        })
        if(index > 0){
            this.list.insertBefore(li, li.previousSibling)

            const previousDino = this.dinos[index-1]
            this.dinos[index-1] = dino
            this.dinos[index] = previousDino
            window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
        }
    }
    
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
    }

    deleteItem (e){
        e.target.closest('.dino').remove()
        for(let i=0; i < this.dinos.length; i++){
            if(this.dinos[i].id.toString() === e.target.closest('.dino').dataset.id){
                this.dinos.splice(i, 1)
                window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
                break;
            }
        }
    }

    promote (dino, e){
        const item = e.target.closest('.dino')
        const icon = e.currentTarget.querySelector('i.fa')
        if(dino.fav){
            icon.className = 'fa fa-star-o'
            item.classList.remove('fav')
            dino.fav = false
        } else{
            icon.className = 'fa fa-star'
            item.classList.add('fav')
            dino.fav = true
        }

        window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
    }

    edit(dino, e){
        const spanType = e.target.closest('.dino').querySelector('.dino-type')
        const spanName = e.target.closest('.dino').querySelector('.dino-name')
        const btn = e.target.closest('.dino').querySelector('.edit.button')
        const icon = btn.querySelector('i.fa')

        if(spanType.isContentEditable){
            icon.className = 'fa fa-pencil'
            btn.classList.remove('success')
            dino.type = spanType.textContent.toUpperCase()
            dino.name = spanName.textContent.toUpperCase()
            spanType.textContent = dino.type
            spanName.textContent = dino.name
            spanType.contentEditable = false
            spanName.contentEditable = false

            window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
        } else　{
            icon.className = 'fa fa-check'
            btn.classList.add('success')
            spanType.contentEditable = true
            spanName.contentEditable = true
            spanName.focus()
        }
    }

    saveOnEnter(dino, e){
        if(e.key === 'Enter'){
            this.edit(dino, e)
        }
    }

}

const app = new App({
    formSelector: '#dino-form', 
    listSelector: '#dino-list',
    templateSelector: '.dino.template',
})