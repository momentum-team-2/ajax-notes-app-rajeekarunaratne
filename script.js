/* globals fetch, moment */
const apiUrl = 'http://localhost:3000/notes'

let form = document.querySelector('#notes-form')
let noteInput = document.querySelector('#notes-input')
let noteList = document.querySelector('.notes')

renderNotes()

form.addEventListener('submit', function (event) {
    event.preventDefault()
    createNoteItem(noteInput.value)
})

function createNoteItem (inputText) {
    fetch (apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ item: inputText, created: moment().format() })
    })
    .then(() => {
        noteInput.value = ''
        renderNotes()
    })
}

function renderNotes() {
    noteList.innerHTML = ''
    fetch (apiUrl, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(function (data) {
        let list = document.createElement('ul')
        list.id = 'note-list'
        for (let item of data) {

            let noteCard = document.createElement('div')            
            noteCard.dataset.id = item.id

            let noteItem = document.createElement('input')
            noteItem.setAttribute("type","text")
            noteItem.setAttribute("value",item.item)
            noteCard.appendChild(noteItem)

            let editIcon = document.createElement('span')
            editIcon.id = 'edit'
            editIcon.classList.add ('fas', 'fa-save', 'mar-l-xs')
            noteCard.append(editIcon)

            let deleteIcon = document.createElement('span')
            deleteIcon.id = 'delete'
            deleteIcon.classList.add('fas', 'fa-times', 'mar-l-xs')
            noteCard.append(deleteIcon)
            list.appendChild(noteCard)
        }
        noteList.appendChild(list)
    })
}

noteList.addEventListener('click', editNoteItem)
function editNoteItem (event) {
    let targetEl = event.target
    if (targetEl.matches ('#edit')) {
        console.log('EDIT')
        let itemId = targetEl.parentElement.dataset.id
        let itemToEdit = document.querySelector(`div[data-id='${itemId}'] > input`)
        console.log(itemToEdit.value)
        fetch (`${apiUrl}/${itemId}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ item: itemToEdit.value, created: moment().format() })
        })
        .then(() => {
            noteInput.value = ''
            renderNotes()
        })
    }

}

noteList.addEventListener('click', deleteNoteItem)

function deleteNoteItem (event) {
    let targetEl = event.target
    if (targetEl.matches ('#delete')) {
        console.log('DELETE')
        let itemId = targetEl.parentElement.dataset.id
        fetch(`${apiUrl}/${itemId}`, {
            method: 'DELETE'
        })
        .then(function () {
            renderNotes()
    
        })
    }
}