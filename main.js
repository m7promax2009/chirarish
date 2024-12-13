const wrapper = document.querySelector('.wrapper');
const nameInput = document.getElementById('name');
const numberInput = document.getElementById('number');
const addButton = document.getElementById('add-contact');

const fetchContacts = async () => {
    wrapper.innerHTML = '';
    try {
        const response = await fetch('http://127.0.0.1:3000/contacts');
        if (!response.ok) throw new Error('Failed to fetch contacts');
        const contacts = await response.json();
        contacts.forEach(contact => createContact(contact.id, contact.name, contact.number));
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
};

const createContact = (id, name, number) => {
    const contactDiv = document.createElement('div');
    contactDiv.classList.add('contact-item');

    const contactInfo = document.createElement('p');
    contactInfo.innerText = `${name} (${number})`;
    contactDiv.appendChild(contactInfo);

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    const editButton = document.createElement('button');
    editButton.innerHTML = 'xato';
    editButton.addEventListener('click', async () => {
        const newName = prompt('Edit Name:', name);
        const newNumber = prompt('Edit Number:', number);
        if (newName && newNumber) {
            try {
                const response = await fetch(`http://127.0.0.1:3000/contacts/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName, number: newNumber }),
                });
                if (!response.ok) throw new Error('Failed to edit contact');
                fetchContacts();
            } catch (error) {
                console.error('Error editing contact:', error);
            }
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'musr';
    deleteButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/contacts/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete contact');
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    });

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);
    contactDiv.appendChild(actionsDiv);

    wrapper.appendChild(contactDiv);
};

addButton.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const number = numberInput.value.trim();

    if (name && number) {
        try {
            const response = await fetch('http://127.0.0.1:3000/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, number }),
            });
            if (!response.ok) throw new Error('Failed to add contact');
            nameInput.value = '';
            numberInput.value = '';
            fetchContacts();
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    } else {
        alert('NImadir yozing');
    }
});

fetchContacts();
