document.body.style = `background: #C4C4C4;
                        margin-top: 62px;
                        margin-left : 77px; 
                        padding: 0;`
const fragment = document.createDocumentFragment()

class View{
    constructor(fragment){
        this.input = this.createElement('input')
        this.input.style = ` width: 500px; 
                        height: 61px; 
                        box-sizing: border-box;
                        background: #FFFFFF;
                        font-family: "Roboto"; 
                        font-style: normal;
                        font-weight: 400; 
                        font-size: 48px; 
                        line-height: 56px; 
                        color: #000000;`        
        this.wrapper = this.createElement('div', 'wrapper')
        this.repositoryList = this.createElement('ul', 'repository-list')
        this.repositoryList.style = `list-style: none;
                                    width: 500px;
                                    margin: 0;
                                    padding: 0;`
        this.wrapper.append(this.repositoryList)

        this.selectedContainer = this.createElement('div', 'select-container')
        this.selectedContainer.style = `margin-top: 45px; width: 500px; box-sizing: border-box;`
        this.selectedList = this.createElement('ul', 'repository-list')
        this.selectedList.style = `list-style: none;
                                    margin: 0;
                                    padding: 0;`
        this.selectedContainer.append(this.selectedList)


        fragment.append(this.input)
        fragment.append(this.wrapper)
        fragment.append(this.selectedContainer)
    }
    createElement (tagName, className, elementData){
        const element = document.createElement(tagName)
        if (className) element.classList.add(className)
        if (elementData) element.data = elementData
        return element
    }
    createCard (data){
        const repositoryCard = this.createElement('li', 'repository-card', data)
        repositoryCard.textContent = data.name
        repositoryCard.style = `box-sizing: border-box;
        cursor: pointer;
        width: 500px;
        height: 44px;
        background: #E3E3E3;
        border: 2px solid #000000;
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 35px;
        color: #000000;`
        this.repositoryList.append(repositoryCard)
    }
    createSelectedCard(element){
        const selectedCard = this.createElement('li', 'selected-card')
        selectedCard.style = `position: relative;
                            height: 101px;
                            box-sizing: border-box;
                            width: 503px;
                            padding: 8px;
                            padding-left: 16px;
                            background: #E27BEB;
                            border: 1px solid #000000;
                            font-family: 'Roboto';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 24px;
                            line-height: 28px;
                            color: #000000;`
        const close = this.createElement('div', 'close')
        close.style = `position: absolute; right: 31px; top: 31px; cursor: pointer; content: ''; width: 42px; height: 38.5px;`
        const vector1 = this.createElement('div')
        const vector2 = this.createElement('div')
        vector1.style = `content: ''; 
                        position: absolute; 
                        width: 4px; 
                        height: 55px; 
                        border-radius: 4px;
                        background: #FF0000; 
                        transform: rotate(-45deg); 
                        transform-origin: top left;`
        vector2.style = `content: ''; 
                        position: absolute; 
                        right: 0;
                        width: 4px; 
                        height: 55px; 
                        border-radius: 4px;
                        background: #FF0000; 
                        transform: rotate(45deg); 
                        transform-origin: top right;`

        close.append(vector1)
        close.prepend(vector2)
        selectedCard.innerHTML = `<span>Name: ${element.data.name}</span><br>
        <span>Owner: ${element.data.owner.login}</span><br>
        <span>Stars: ${element.data.stargazers_count}</span>`
        selectedCard.prepend(close)
        this.selectedList.append(selectedCard)
        close.addEventListener('click', ()=> {
            this.selectedList.removeChild(selectedCard)
        })
    }

}

class Search{
    constructor(view){
        this.view = view
        this.view.input.addEventListener('keyup', this.debounce(this.searchRepositories.bind(this)))
        this.view.repositoryList.addEventListener('mouseover', (e) => {
            if (this.view.repositoryList.contains(e.target)) e.target.style.background = `#65CDF9`
            if (this.view.repositoryList.contains(e.relatedTarget))e.relatedTarget.style.background = `#E3E3E3`
        })
        this.view.repositoryList.addEventListener('mouseout', (e) => {
            if (this.view.repositoryList.contains(e.target)) e.target.style.background = `#E3E3E3`
        })
        this.view.repositoryList.addEventListener('click', (e) => {
            console.log(e.target)
            this.view.input.value= ''
            this.deleteCards()
            this.view.createSelectedCard(e.target)
        })
    }
    
    async searchRepositories(){
        const inputValue = this.view.input.value
        if (inputValue){
            return await fetch(`https://api.github.com/search/repositories?q=${inputValue}&per_page=5`)
            .then((res)=> {
                if(res.ok){
                    res.json().then((res) =>{
                        console.log(res)
                        this.deleteCards()
                        res.items.forEach((item)=> {
                            this.view.createCard(item)
                        })
                    })
                }else{
                }
            })
            .catch((err)=>{
                console.log(err)
            })            
        } else {
            this.deleteCards()
        }
    }

    debounce = (fn) => {
        let timer 
        return function(...args){
            clearTimeout(timer)
            timer = setTimeout(() =>{
                fn.apply(this, args)
            }, 500)
        }
    };
    deleteCards(){
        this.view.repositoryList.innerHTML = ''
    }
    addSelected(){
        const select = e.target 
        console.log(select)
    }
}


new Search(new View(fragment))
document.body.append(fragment)