let timer = 50;
let nombre = document.createTextNode(timer);
let chrono = document.getElementsByClassName('timer')[0].appendChild(nombre);
let form = document.getElementById('form');
let jeu = document.getElementById('jeux');
let btn = document.getElementById('btnSubmit');
let texteQuestion = document.querySelector('.textQuestion');
let propositions = document.querySelectorAll('.reponse');
let propositionsParent = document.querySelectorAll('.proposition');
let reponses = document.querySelectorAll('.proposition');
let cagnoteItems = document.querySelectorAll('.palierItem')
let audio = document.querySelector('.audio');
let audio2 = document.querySelector('.audio2');

let cagnote = 0;
let listeIndex  = 0;
let tabVerification = [];
var fileValue;
var question;
let nombreReponse = 0;


function tirageQuestion() {
    if (nombreReponse <= 5){
        let input = document.getElementById('fichier');
        let numero = Math.floor(Math.random() * 30)
        console.log("numéro tiré : "+numero)
        listeIndex = numero;
        console.log("nombre de question ",++nombreReponse);

        resetStatus()
        chronometre()
        //recup  et lecture du fichier
        let fr = new FileReader();
        fr.readAsText(input.files[0]);
        fr.onload = () => {
            fileValue = JSON.parse(fr.result)
            console.log("taile du tableau "+fileValue)
            question = fileValue[numero]
            console.log(question)


            let found = tabVerification.includes(listeIndex);
            if (!found) {
                tabVerification.push(listeIndex);
                texteQuestion.textContent = question['question'];
                for (let i = 0; i < 4; i++) {
                    propositions[i].textContent = question['autres_choix'][i];
                }
            }
        }
    }
    if(nombreReponse > 5){
        chrono = 0;
    }
}

function propositionIndex(){
    for (let i = 0; i < 4; i++) {
        propositionsParent[i].disabled = true ;
    }
}

function resetStatus(){
    for (let i = 0; i < 4; i++) {
        propositionsParent[i].disabled = false ;
        propositionsParent[i].classList.remove("bg-success","bg-danger")
    }
}

function chronometre(){
        let timerId = setInterval(()=>{
            document.getElementsByClassName('timer')[0].style.backgroundColor = 'white'
            if (timer > 0){
                chrono = --timer;
                document.getElementsByClassName('timer')[0].innerHTML = chrono;
                if (timer < 5){
                    document.getElementsByClassName('timer')[0].style.backgroundColor = 'red';
                }
            }else if (timer === 0){
                propositionIndex();
                texteQuestion.innerHTML = `Merci d'avoir particpé <br />  Vous avez remporté ${cagnote * 10000} Francs cfa`;
                document.querySelector('.nextQuestion').disabled = true;
            }
        }, 2000)

}

function gestionCash(index){
    for(let i = 0;i < 6; i++){
        if(index === i){
            cagnoteItems[i].className = "palierItem my-4 d-flex align-items-center justify-content-around bg bg-success"
        }
    }
}

function drawCash(index){
    for(let i = 0;i < 6; i++){
        if(index === i){
            cagnoteItems[i].className = "palierItem my-4 d-flex align-items-center justify-content-around bg bg-danger"
        }
    }
}


btn.addEventListener("click", chronometre)
btn.addEventListener('click',display)
document.querySelector('.nextQuestion').addEventListener('click',tirageQuestion);


function display(){
    form.style.display = 'none';
    jeu.style.display = 'block';
    tirageQuestion();
}

function begin(){
    form.style.display = 'block';
    jeu.style.display = 'none';
    document.writeln(`Cagonte : <h1>${cagnote * 10000}</h1>`);
}


reponses[0].addEventListener('click',verification);
reponses[1].addEventListener('click',verification);
reponses[2].addEventListener('click',verification);
reponses[3].addEventListener('click',verification);

function verification(event) {
    if (nombreReponse <= 5){
        let val = event.currentTarget.textContent
        let indexReponse;


        for(let i = 0;i< 4; i++ ){
            if(reponses[i].textContent.trim() === question['reponse_correcte']){
                indexReponse = i;
            }
        }

        if (val.trim() === question['reponse_correcte']) {
            //trouver l'indice de la reponse cliqué
            event.currentTarget.className += " bg bg-success"
             ++cagnote;
            audio.play()
            gestionCash(nombreReponse)
            propositionIndex()
        }else if(val.trim() !== question['reponse_correcte']){
            audio2.play()
            console.log(indexReponse)
            reponses[indexReponse].className += " bg bg-success"
            console.log(event.currentTarget.className += " bg bg-danger")
            propositionIndex()
            drawCash(nombreReponse)
        }
    }
}




