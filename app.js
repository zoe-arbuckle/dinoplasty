class App {

    save (){
        window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
        window.localStorage.setItem('carniDinos', JSON.stringify(this.carniDinos))
        window.localStorage.setItem('herbiDinos', JSON.stringify(this.herbiDinos))
        window.localStorage.setItem('omniDinos', JSON.stringify(this.omniDinos))
    }

    getDinoArr(dino){
        if(dino.type === 'CARNIVORE'){
            return this.carniDinos
        } else if(dino.type === 'HERBIVORE'){
            return this.herbiDinos
        } else {
            return this.omniDinos
        }
    }

    constructor (selectors){
        this.max = 0
        this.list = document.querySelector(selectors.listSelector)
        this.notes = document.querySelector(selectors.noteListSeletor)
        this.dinos = []
        this.carniDinos = []
        this.herbiDinos = []
        this.omniDinos = []

        this.template = document.querySelector(selectors.templateSelector)
        this.noteTemplate = document.querySelector(selectors.noteTempSelector)

        if(window.localStorage.getItem('dinos')){
            this.dinos = JSON.parse(window.localStorage.getItem('dinos'))
            for(let i = 0; i < this.dinos.length; i++){
                this.addDinoLocal(this.dinos[i])
                this.getDinoArr(this.dinos[i]).push(this.dinos[i])
            }
            this.save()
        }else {
            this.save()
        }
        document.
            querySelector(selectors.formSelector).
            addEventListener('submit', this.addDino.bind(this))

        document.querySelector('#listSelect').addEventListener('change', this.displayList.bind(this))

    }

    displayList(e){
        let arr = []
        switch(e.target.value){
            case 'Carnivores': arr = this.carniDinos;
                                break;
            case 'Herbivores': arr = this.herbiDinos;
                                break;
            case 'Omnivores': arr = this.omniDinos;
                                break;
            case 'All Dinos': arr = this.dinos;
                                break;
        }

        //remove all elements from current list
        const listChildren = this.list.childNodes;
        for(let i = listChildren.length - 1; i > 0; i--){
            this.list.removeChild(this.list.childNodes[i])
        }
        //add in the new ones

        for(let i = 0; i < arr.length; i++){
                this.addDinoLocal(arr[i])
        }
    }

    addDinoLocal (dino){
        const listItem = this.renderListItem(dino)
        this.list.appendChild(listItem)
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
        this.getDinoArr(dino).push(dino)
        
        this.save()
    }

    addNote(e){
        console.log('adding note')
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

    renderNote(){
        const item = this.noteTemplate.cloneNode(true)
        item.classList.remove('template')

        return item;
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
            this.save()
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
            this.save()
        }
    }

    deleteItem (e){
        e.target.closest('.dino').remove()
        for(let i=0; i < this.dinos.length; i++){
            if(this.dinos[i].id.toString() === e.target.closest('.dino').dataset.id){
                this.dinos.splice(i, 1)
                this.save()
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

        this.save()
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

            this.save()
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
    noteListSeletor: '#note-list',
    templateSelector: '.dino.template',
    noteTempSelector: '.note.template',
})