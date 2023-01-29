const fragment = document.createDocumentFragment()
class View{
    constructor(fragment){
        this.main = this.createElement('div', 'main')
        this.mainSearch = this.createElement('div', 'main-search search')
        this.mainSelect = this.createElement('div', 'main-select select')

        this.input = this.createElement('input', 'search-input')
        this.searchList = this.createElement('ul', 'search-list')
        this.mainSearch.append(this.input, this.searchList)

        this.selectList = this.createElement('ul', 'select-list')
        this.mainSelect.append(this.selectList)

        this.main.append(this.mainSearch, this.mainSelect)
        fragment.append(this.main)
    }
    createElement (tagName, className, elementData){
        const element = document.createElement(tagName)
        if (className) className.split(' ').forEach(i=>element.classList.add(i))
        if (elementData) element.data = elementData
        return element
    }
    createSearchItem (data){
        const searchItem = this.createElement('li', 'search-item', data)
        searchItem.textContent = data.name
        this.searchList.append(searchItem)
    }
    createSelectItem(element){
        const selectItem = this.createElement('li', 'select-item')
        selectItem.insertAdjacentHTML('afterbegin', 
        `<span>Name: ${element.data.name}</span><br>
        <span>Owner: ${element.data.owner.login}</span><br>
        <span>Stars: ${element.data.stargazers_count}</span>`)
        const closeBtn = this.createElement('div', 'select-close')
        selectItem.append(closeBtn)
        closeBtn.addEventListener('click', () => {
            this.selectList.removeChild(selectItem)
        })
        this.selectList.append(selectItem)
    }

}

class Search{
    constructor(view){
        this.view = view
        this.view.input.addEventListener('keyup', this.debounce(this.searchRepositories.bind(this)))
        this.view.searchList.addEventListener('click', this.addSelectItem)
    }
    
    searchRepositories(){
        const inputValue = this.view.input.value
        if (inputValue){
            this.api(inputValue)            
        } else {
            this.deleteSearchList()
        }
    }
    async api(inputValue){
        const api = `https://api.github.com/search/repositories?q=${inputValue}&per_page=5`
        return await fetch(api)
        .then(res => this.apiResult(res))
        .catch((err)=>{
            throw console.log(err)
        })
    }
    async apiResult(res){
        const res_1 = await Promise.resolve(res)
        if (res_1.ok) {
            res_1.json().then((res_2) => {
                this.deleteSearchList()
                res_2.items.forEach((item) => {
                    this.view.createSearchItem(item)
                })
            })
        } else {
            throw console.log(res_1.status)

        }
    }
    debounce = (fn) => {
        let timer 
        return function(...args){
            clearTimeout(timer)
            timer = setTimeout(() =>{
                fn.apply(this, args)
            }, 400)
        }
    };
    deleteSearchList(){
        this.view.searchList.innerHTML = ''
    }
    addSelectItem = (e) => {
        this.view.input.value= ''
        this.deleteSearchList()
        this.view.createSelectItem(e.target)
    }
}


new Search(new View(fragment))
document.body.append(fragment)