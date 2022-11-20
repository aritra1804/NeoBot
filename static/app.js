// const chatmessage = chatbox.querySelector('.chatbox__messages');

class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.State = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        }
        )
    }

    toggleState(chatbox) {
        this.state = !this.state;

        //show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
            const chatmessage = chatbox.querySelector('.chatbox__messages');
            chatmessage.innerHTML = '<div class="messages__item messages__item--operator"> Try typing this to start <br><br> Is Talaq legal <br><br> What are the reservations in educational instituations </div>'
            var html = ""
        }
        else{
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 == "") {
            return
        }

        let msg1 = {name: "User", message: text1}
        this.messages.push(msg1)

        //http://127.0.0.1:5000/predict
        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST',
            body: JSON.stringify({message: text1}),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            let msg2 = { name: "Ordinance", message: r.answer };
            this.messages.push(msg2)
            this.updateChatText(chatbox)
            textField.value = ''

        })
        // .catch((error) => {
        //     console.error('Error:', error);
        //     this.updateChatText(chatbox)
        //     textField.value = ''
        // });
    }

    updateChatText(chatbox) {
        var html = '';
        var counter = 0;
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name == "Ordinance"){
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }

            if (item.name == "Ordinance" && counter == 0) {

            let speech = new SpeechSynthesisUtterance();

            var msg = item.message;

            var msg_str = msg.split('.')[0]

            console.log(msg_str);

            speech.lang = "en-US";
            speech.text = msg_str;
            speech.volume = 1;
            speech.rate = 1;
            speech.pitch = 1;  

            counter+=1;
            
            var count = 1;

            window.speechSynthesis.speak(speech);
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }  
}

const chatbox = new Chatbox()
chatbox.display()