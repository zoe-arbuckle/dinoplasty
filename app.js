const app = {
    init (selectors){
        this.max = 0
        this.list = document.querySelector(selectors.listSelector)
        this.dinos = []
        this.template = document.querySelector(selectors.templateSelector)
        if(window.localStorage.getItem('dinos')){
            this.dinos = JSON.parse(window.localStorage.getItem('dinos'))
            for(let i = 0; i < this.dinos.length; i++){
                const item = this.renderListItem(this.dinos[i])
                this.list.insertBefore(item, this.list.firstChild)
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
        this.list.insertBefore(listItem, this.list.firstChild)
        e.target.reset()
        
        this.dinos.unshift(dino)
        window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
    },

    renderListItem (dino){
        const item = this.template.cloneNode(true)
        item.querySelector('.dino-name').textContent = dino.name
        item.classList.remove('template')

        //this.template.cloneNode(true) to copy the template - much shorter

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
        for(let i=0; i < this.dinos.length; i++){
            if(this.dinos[i].id === e.target.parentNode.id){
                this.dinos.splice(i, 1)
                window.localStorage.setItem('dinos', JSON.stringify(this.dinos))
                //will not work becuase li not made from form does not have id
                break;
            }
            console.log(this.dinos[i].id)
            console.log(e.target.parentNode.id)
        }
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
    templateSelector: '.dino.template',
})