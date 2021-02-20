
// Function to Toggle Dark Mode -------------------------
const DarkMode = {
    darkMode() {
        if ( document.querySelector('#toggle').getAttribute('class') == 'activated') {
            document.querySelector('#toggle').setAttribute('src', '../assets/toggle-off.svg')
            document.querySelector('#toggle').removeAttribute('class')            
            document.querySelector('#toggle').setAttribute('class', 'disabled')

            document
                .querySelector('body')
                .setAttribute('style', 'background: #e5e6e9')

            const cards = document.querySelectorAll('.change-dark')
            cards.forEach( card => {card.setAttribute('style', 'background: #fff')})

            const title = document.querySelectorAll('.title')
            title.forEach( title => {title.setAttribute('style', 'background: #fff')})    
            
            document
                .querySelector('.modal')
                .setAttribute('style', 'background: #f0f2f5;')

            document
                .querySelector('.form h2')
                .setAttribute('style', 'color: #363f5f;')

            const inputs = document.querySelectorAll('form input')
            inputs.forEach( style => {style.setAttribute('style', 'background-color: #fff; color: #363f5f;')})


        } else {
            document.querySelector('#toggle').setAttribute('src', '../assets/toggle-on.svg')
            document.querySelector('#toggle').removeAttribute('class')
            document.querySelector('#toggle').setAttribute('class', 'activated')
        
            document
                .querySelector('body')
                .setAttribute('style', 'background: #3b3b3b')

            const cards = document.querySelectorAll('.change-dark')
            cards.forEach( card => {card.setAttribute('style', 'background: #505050; color: #fff')})

            const titles = document.querySelectorAll('.title')
            titles.forEach( title => {title.setAttribute('style', 'background: #505050 ; color: #fff')})    
            
                    
            document
                .querySelector('.modal')
                .setAttribute('style', 'background: #505050; color: #ffffff;')

            document
                .querySelector('.form h2')
                .setAttribute('style', 'color: #ffffff;')

            const inputs = document.querySelectorAll('form input')
            inputs.forEach( style => {style.setAttribute('style', 'background-color: #6b6b6b; color: #fff;')})

        }
    },

}

// Modal Form -------------------------------------------
const Modal = {
    open() {
        // Abrir modal
        // Add a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        // Fechar o botao
        // Remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')

        document.querySelector('.alert').setAttribute('style', 'margin-top: -85px; visibility: hidden;')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('mywallet:transactions')) || []
    },

    set(transactions) {
        localStorage.setItem('mywallet:transactions', JSON.stringify(transactions))
    }
}

// Transactions -----------------------------------------
const Transaction = {
    all: Storage.get(),
    
    add(transaction) {
        Transaction.all.push(transaction)

        // console.log(Transaction.all)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },
    incomes() {
        // Somar as entradas
        let income = 0
        Transaction.all.forEach(( transaction ) => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })


        return income 
    },

    expenses() {
        // Somar as saídas
        let expense = 0
        Transaction.all.forEach(( transaction ) => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        })


        return expense 
    },
    
    total() {
        // Subtrair as saídas das entradas
        let total = Transaction.incomes() + Transaction.expenses() 

        return total
    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction( transaction, index ) {
        // console.log(transaction[index])
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.setAttribute('class', 'data-table--data')
        tr.dataset.index = index

        // console.log(tr.innerHTML)

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction( transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="../assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        
            document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    
        if (Transaction.total() < 0) {
            // console.log(Transaction.total())
            document.querySelector('.total').setAttribute('style', 'background-color: #e92929')
        } else {
            document.querySelector('.total').setAttribute('style', 'background-color: #02D15F')
        }
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ''
    }

}

const Utils = {
    formatCurrency( value ) {
        const signal = Number(value) < 0 ? '-' : ''
        value = String(value).replace(/\D/g, '')
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        
        return signal + value
    },

    formatAmount( value ) {
      value = Number(value) * 100
      return Math.round(value)
    },

    formatDate( date ) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    formatValues() {
        // Formatar os valores recebidos
        let { description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },
    
    validateFields() {
        // Verificar informações preenchidas
        const { description, amount, date } = Form.getValues()
        
        if (description.trim() === "" || amount.trim() === "" || date.trim() === "" ) {
            throw new Error('Please, preencha todos os campos')
        }
        
        return { description, amount, date}
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    clearFields() {
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
        } catch (err) {
            document.querySelector('.alert').setAttribute('style', 'margin-top: 0; visibility: visible; transition: .4s;')
            document.querySelector('.alert p').innerHTML = err.message
            console.log('Error')
        }

    }
}

const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction( transaction, index )
        })
        
        DOM.updateBalance()
        
        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()
