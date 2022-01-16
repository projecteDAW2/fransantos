//** VARIABLES **//

// ---- FÍSICAS DEL JUEGO
let sueloY = 22;
let velY = 0;
let impulso = 900; //hasta dónde llega
let gravedad = 2500; //cuánto tiempo está en el aire
let playerPosX = 0;
let playerPosY = sueloY; //sprite del player sobre el suelo
let fondoX = 0;
let sueloX = 0;
let rotuloX = 0;
let velEscenario = 1280 / 3;
let gameVel = 1.1;
let score = 0;
let saltando = false;
let evento = false;

// ---- OBSTÁCULOS
let tiempoHastaObstaculo = 2;
let minTiempoObstaculo = 0.7;
let maxTiempoObstaclo = 1.8;
let obstaculoPosY = 16;
let obstaculos = [];

// ---- LETRAS
let letra;
let tiempoHastaLetra = 9;
let tiempoLetraMin = 9;
let tiempoLetraMax = 12;
let maxLetraY = 240;
let minLetraY = 100;
let letras = [];
let velLetra = 0.5;
let flex = document.getElementById("letraF");
let respo = document.getElementById("letraR");
let autonomy = document.getElementById("letraA");
let sociabilitat = document.getElementById("letraS");
let evolucio = document.getElementById("letraE");


// ---- ELEMENTOS ESCENARIO
let contenedor;
let player;
let textoScore;
let suelo;
let gameOver;
let contadorLetras = 0;
let fondo;
let rotulo;
let obstaculo;
let metro = document.querySelector(".metro")
let metroX = -2085;

// ---- RELOJ 
let parpadeoContador;
let min = 1;
let sec = 5;
let ejectuarCronometro = setInterval(iniciarCrono, 1000);
let perder = false; //Si se activa aparece GAME OVER

// ---- VIDAS
let vida1
let vida2
let vida3
let vidas = 3 //Contador de Vidas

// ---- DISTANCIA 2000000
let distancia = 0; // Distancia recorrida
const limite = 2000000; //Límite que hay que superar para ganar
let ganar = false; //Boolean que activa el final del juego
let result; //Puntuación Final


//---- AUDIO
let audioLetra;
let audioJump;
let audioWin;
let audioHit;
let audioLose;
let audioBack;
let audioBocina;
let audioMetro;
let audioTheme;
let dentro = false;

//--------------------------------------------------------------------------------------------

//*************
//*   LOOP    *
//* DEL JUEGO *
//*************

let time = new Date();
let deltaTime = 0;


/**
Una vez que el navegador carga todos los elementos del HTML inicia el INIT.
 */
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(init, 1);
} else {
    document.addEventListener("DOMContentLoaded", init);
}

//-------------------------------------------------------------------------------------

/**
 *Función que inicializa el juego y llama al Loop del juego
 */
function init() {
    // time = new Date();
    start();
    loop();
}

/**
 * Función que sitúa todos los elementos del DOM
 */
function start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    player = document.querySelector(".player");
    document.addEventListener("keydown", HandleKeyDown); //Función que comprueba que se ha pulsado una tecla
    rotulo = document.querySelector(".rotulo");
    fondo = document.querySelector(".fondo")
    vida1 = document.getElementById("vida1");
    vida2 = document.getElementById("vida2");
    vida3 = document.getElementById("vida3");
    result = document.getElementById("result");

    //AUDIOS
    audioTheme = document.querySelector('.game-theme')
    audioBack = document.querySelector(".audio-back");
    audioBocina = document.querySelector(".audio-bocina");
    audioHit = document.querySelector(".audio-hit");
    audioJump = document.querySelector(".audio-salto");
    audioLetra = document.querySelector(".audio-moneda");
    audioLose = document.querySelector(".audio-over");
    audioMetro = document.querySelector(".audio-metro");
    audioWin = document.querySelector(".audio-win");
    audioTheme.volume = 0.2;
    audioTheme.play();
}

/**
 * Función que va printando todo el rato el juego.
 * Esta función se encarga de ir llamando todo el rato a la función Update cada 30s
 */
function loop() {
    deltaTime = (new Date() - time) / 1000; //Esto calcula cuanto tiempo ha pasado entre el fotograma anterior y el actual
    time = new Date();
    update();
    requestAnimationFrame(loop) // Esto prepara y avisa al navegador de que van a haber animaciones
}

/**
 * 
 * Función que va actualizando todo el rato el juego y lo va moviendo.
 * Todo transcurre aquí.
 * 
 */
function update() {

    if (perder == true) {
        GameOver();
    } else if (ganar == true) {
        eventoFinal()
        return
    } else {
        moverSuelo();
        moverPlayer();
        moverRotulo();
        moverFondo();
        moverMetro();

        if (evento == false) {
            decidirCrearObstaculos();
            moverObstaculos();
            detectarColision();
            //CREANDO LETRAS FRASE
            if (contadorLetras < 5) {   
                decidirCrearLetra();
            }
            detectarColisionLetra();
            moverLetra();
            comprobarVidas()
        }

        //Variable que va guardando la distancia que recorremos a partir de la velocidad del Escenario.
        distancia += velEscenario

        //Esto se hace para que haya gravedad y el jugador vuelva al suelo, si no, subiría eternamente.
        velY -= gravedad * deltaTime;

        //Función que comprueba si se ha llegado al final
        victoria()
    }

}

/**
 * Esta función se activa cuando superamos el límite.
 * Se encarga de crear el efecto de transición hacia la meta.
 */
function victoria() {
    if (distancia >= limite) {
        evento = true;
        setTimeout(meta(), 3000)
        contenedor.style.animation = "fadeOut ease 4s"
        setTimeout(function () {
            ganar = true;
        }, 4000)
    }
}

/**
 * Esta función borra todos los elementos en pantalla y detiene el reloj.
 */
function meta() {
    tiempoHastaObstaculo = 500
    removeElementsByClass("obstaculoYaya")
    removeElementsByClass("obstaculoProsegur")
    removeElementsByClass("obstaculoCaco")
    removeElementsByClass("obstaculoCable")
    clearInterval(ejectuarCronometro);
}

function resultado() {
    let puntos = calcularPuntos();
    let box = document.getElementById("box");
    box.style.opacity = 0.7;
    result.style.opacity = 1;
    result.innerHTML = "<p>&nbsp;&nbsp;🏆VICTORY🏆</p>" +
        "<p>&#128336;&nbsp;" + min + ":" + sec + " x 2</p>" +
        "<p>❤️&nbsp;&nbsp;" + vidas + " x 1000</p>" +
        "<p>🦘&nbsp;" + score + "</p>" +
        "<p>🎯&nbspTOTAL &nbsp;<span style='color: gold;'>" + puntos + "</span></p>"

        document.cookie="puntuacion="+puntos;
}

function calcularPuntos() {
    let puntos = (sec * 2) + score + (vidas * 1000)
    return puntos;
}

//***********
//* SALTAR *
//***********

function HandleKeyDown(ev) {
    if (ev.keyCode == 32) {
        saltar();
    }
}

function saltar() {
    if (playerPosY === sueloY) {
        saltando = true;
        velY = impulso;
        player.classList.remove("player-run");
        audioJump.currentTime = 0;
        audioJump.volume = 1;
        audioJump.play();
    }
}

function ganarPuntos() {
    score++;
    textoScore.innerText = score;
}

//*************
//*  EVENTOS  *
//* DEL JUEGO *
//*************

function sonidoVictoria(){
audioTheme.pause()
audioWin.play();
}

function eventoFinal() {
    sonidoVictoria();
    removeElementsByClass("metro")
    removeElementsByClass("rotulo")
    removeElementsByClass("suelo")
    removeElementsByClass("letra")
    dentro = true;
    fondo.style.background = "url(../img/fondoCEP.png)"
    fondo.style.bottom = "-180px"
    fondo.style.left = "-78.721px"
    player.classList = "player player-run"
    player.style.animation = "none"
    player.style.bottom = "22px"
    resultado()
    fiesta()
    setTimeout(function () {
        audioWin.pause()
        window.location.href = "../pages/ranking.html";
    }, 5000);
}

function fiesta() {
    for (i = 0; i < 100; i++) {
        // Random rotation
        let randomRotation = Math.floor(Math.random() * 360);
        // Random Scale
        let randomScale = Math.random() * 1;
        // Random width & height between 0 and viewport
        let randomWidth = Math.floor(Math.random() * Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
        let randomHeight = Math.floor(Math.random() * Math.max(document.documentElement.clientHeight, window.innerHeight || 500));

        // Random animation-delay
        let randomAnimationDelay = Math.floor(Math.random() * 3);


        // Random colors
        let colors = ['#0CD977', '#FF1C1C', '#FF93DE', '#5767ED', '#FFC61C', '#8497B0']
        let randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Create confetti piece
        let confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.top = randomHeight + 'px';
        confetti.style.right = randomWidth + 'px';
        confetti.style.backgroundColor = randomColor;
        // confetti.style.transform='scale(' + randomScale + ')';
        confetti.style.obacity = randomScale;
        confetti.style.transform = 'skew(15deg) rotate(' + randomRotation + 'deg)';
        confetti.style.animationDelay = randomAnimationDelay + 's';
        document.getElementById("confetti-wrapper").appendChild(confetti);
    }
}

function removeElementsByClass(className) {
    let elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

//***************
//* ANIMACIONES *
//*  DEL JUEGO  *
//***************

//* SUELO
function moverSuelo() {
    sueloX += calcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
    //cada vez que la mitad del suelo haya salido del escenario, lo reiniciamos para dar sensación de infinito.
}

function moverRotulo() {
    rotuloX += calcularDesplazamiento();
    rotulo.style.left = -(rotuloX % contenedor.clientWidth) + "px";
}

function moverFondo() {
    fondoX += calcularDesplazamiento();
    fondo.style.left = -(fondoX % contenedor.clientWidth) + "px";
}

function calcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function moverPlayer() {
    playerPosY += velY * deltaTime;
    if (playerPosY < sueloY) {
        tocarSuelo();
    }
    player.style.bottom = playerPosY + "px";
}

function tocarSuelo() {
    playerPosY = sueloY;
    velY = 0;
    if (saltando) {
        player.classList.add("player-run");
    }
    saltando = false;
}


//* OBSTÁCULOS
function decidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if (tiempoHastaObstaculo <= 0) {
        crearObstaculo();
    }
}

function crearObstaculo() {
    let randomNum = Math.floor(Math.random() * 10) + 1;
    obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);

    if (randomNum == 4) {
        obstaculo.classList.add("obstaculoYaya");
        obstaculo.posX = contenedor.clientWidth;
    } else if (randomNum == 3) {
        obstaculo.classList.add("obstaculoProsegur");
        obstaculo.posX = contenedor.clientWidth;
    } else if (randomNum == 2) {
        obstaculo.classList.add("obstaculoCable");
        obstaculo.posX = contenedor.clientWidth;
    } else if (randomNum == 5) {
        obstaculo.classList.add("obstaculoCaco");
        obstaculo.posX = contenedor.clientWidth;
    } else {
        obstaculo.classList.add("obstaculoYaya");
        obstaculo.posX = contenedor.clientWidth;
    }

    obstaculo.style.left = contenedor.clientWidth + "px";
    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = minTiempoObstaculo + Math.random() * (maxTiempoObstaclo - minTiempoObstaculo) / gameVel;
}

function moverObstaculos() {
    for (let i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            velEscenario += 7;
            ganarPuntos();

        } else {
            obstaculos[i].posX -= calcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX + "px";
        }
    }
}

//* LETRAS
function decidirCrearLetra() {
    tiempoHastaLetra -= deltaTime;
    if (tiempoHastaLetra <= 0) {
        crearLetra();
    }
}

function crearLetra() {
    letra = document.createElement("div");
    contenedor.appendChild(letra);
    letra.classList.add("letra");

    if (contadorLetras == 1) {
        letra.style.background = "url(../img/letraR.png)"
    } else if (contadorLetras == 2) {
        letra.style.background = "url(../img/letraA.png)"
    } else if (contadorLetras == 3) {
        letra.style.background = "url(../img/letraS.png)"
    } else if (contadorLetras == 4) {
        letra.style.background = "url(../img/letraE.png)"
    }

    letra.posX = contenedor.clientWidth;
    letra.style.left = contenedor.clientWidth + "px";
    letra.style.bottom = minLetraY + Math.random() * (maxLetraY - minLetraY) + "px";
    letras.push(letra)
    contadorLetras++;
    tiempoHastaLetra = tiempoLetraMin + Math.random() * (tiempoLetraMax - tiempoLetraMin) / gameVel;
}

function moverLetra() {
    for (let i = letras.length - 1; i >= 0; i--) {
        if (letras[i].posX < -letras[i].clientWidth) {
            letras[i].parentNode.removeChild(letras[i]);
            letras.splice(i, 1);
        } else {
            letras[i].posX -= calcularDesplazamiento();
            letras[i].style.left = letras[i].posX + "px";
        }
    }
}

function imprimirLetra() {
    if (contadorLetras == 1) {
        flex.style.background = "url(../img/flexibilitat.png)"
        //flex.style.display = 'block';
    } else if (contadorLetras == 2) {
        respo.style.background = "url(../img/responsabilitat.png)"
        respo.style.left = '500px';
    } else if (contadorLetras == 3) {
        autonomy.style.background = "url(../img/autonomia.png)"
        autonomy.style.left = '650px';
    } else if (contadorLetras == 4) {
        sociabilitat.style.background = "url(../img/sociabilitat.png)"
        sociabilitat.style.left = '800px';
    } else if (contadorLetras == 5) {
        evolucio.style.background = "url(../img/evolucio.png)"
        evolucio.style.left = '950px';
    }
}

//METRO
function moverMetro() {
    if (metroX > -2950 && metroX < contenedor.clientWidth) {
        sonidoBocina();
    }
    if (metroX > -2500 && metroX < 1300) {
        audioMetro.volume = 1;
        sonidoMetro();
    }
    if (metroX > 1300) {
        audioMetro.volume = 0.2;
        setTimeout(function () {
            metroX = -3000;
            audioMetro.volume = 0;
        }, 10000)
    }
    metroX += calcularDesplazamiento();
    metro.style.left = metroX + "px";
}

function sonidoMetro() {
    audioMetro.volume = 1;
    audioMetro.play()
}

function sonidoBocina() {
    audioBocina.volume = 0.6;
    audioBocina.play()
}

//***************
//* COLISIONES  *
//***************

function detectarColisionLetra() {
    for (let i = 0; i < letras.length; i++) {
        if (colision(player, letras[i], 10, 25, 10, 20)) {
            if (letras[i].classList.contains("letra")) {
                score += 1000;
                velEscenario += 30;
                audioLetra.volume = 0.2;
                audioLetra.currentTime = 0;
                audioLetra.play();
                imprimirLetra()
                textoScore.innerText = score;
                letras[i].parentNode.removeChild(letras[i]);
                letras.splice(i, 1);
            }
        }
    }
}

function detectarColision() {
    for (let i = 0; i < obstaculos.length; i++) {
        if (colision(player, obstaculos[i], 10, 30, 15, 20)) {
            estrellarse();
        }
    }
}

function estrellarse() {
    audioHit.volume = 0.2;
    audioHit.currentTime = 0;
    audioHit.play();
    player.classList.remove("player-run");
    player.classList.add("player-hit");
    velEscenario -= 100;
    // rebote();
    // normalidad();
    setTimeout(rebote, 1000);
    setTimeout(normalidad, 1000);
    tiempoHastaObstaculo = 3
}


function rebote() {
    velEscenario += 100;
}

function normalidad() {
    
    if (player.classList == "player player-hit" || player.classList == "player player-hit player-run") {
        vidas--
    }
    player.classList.remove("player-hit");
    player.classList.add("player-run")
}

function comprobarVidas() {
    if (vidas === 2) {
        vida3.style.display = "none";

    } else if (vidas === 1) {
        vida2.style.display = "none";

    } else if (vidas === 0) {
        vida1.style.display = "none";
        perder = true;
    }
}


function colision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}

function GameOver() {
    audioTheme.pause();
    audioLose.volume = 0.1;
    audioLose.play();
    clearInterval(ejectuarCronometro);
    player.classList.remove("player-run");
    player.classList.add("player-hit");
    player.style.animation = "none";
    gameOver.style.display = "block";
    audioJump.volume = 0;
    setTimeout(function () {
        window.location.href = "../index.html";
    }, 4000);
}

//MENÚ
let btnPlay = document.getElementById("btn-play");
let btnRanking = document.getElementById("btn-ranking");
let btnCredits = document.getElementById("btn-credits");



//CRONO

function iniciarCrono() { // creo una cuenta atras, cuando llega a 0 el jugador pierde 

    if (min != 0 || sec != 0) {
        sec = sec - 1;
        if (sec == -1) {
            sec = 59;
            min = min - 1;
            if (min <= 9) {
                document.getElementById('mostrarContador').innerHTML = '0' + min + ':' + sec;
            } else {
                document.getElementById('mostrarContador').innerHTML = min + ':' + sec;
            }
        } else if (sec <= 9 && min <= 9) {
            document.getElementById('mostrarContador').innerHTML = '0' + min + ':0' + sec;
        } else if (sec <= 9) {
            document.getElementById('mostrarContador').innerHTML = min + ':0' + sec;
        } else if (min <= 9) {
            document.getElementById('mostrarContador').innerHTML = '0' + min + ':' + sec;
        } else {
            document.getElementById('mostrarContador').innerHTML = min + ':' + sec;
        }
    } else if (min == 0 && sec <= 0) {
        if (parpadeoContador == true) {
            document.getElementById('mostrarContador').innerHTML = '0' + min + ':0' + sec;
            parpadeoContador = false;
        } else {
            document.getElementById('mostrarContador').innerHTML = '';
            parpadeoContador = true;
        }
        perder = true;
    }
}