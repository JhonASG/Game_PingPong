//Movimiento del paddle humano a tráves del teclado (w-> arriba, s-> abajo, x-> stop game)
let teclado = () => {
    document.addEventListener("keydown", function(e){
        if(e.key == "w" || e.key == "ArrowUp"){
            move_top();
        }else if(e.key == "s" || e.key == "ArrowDown"){
            move_bottom();
        }else if(e.key == "x"){
            stop();
        }
    })
};
//Función para mover el paddle del humano hacia arriba cuando se presiona w.
//Para lo anterior se cambia la posición en el eje "y", a través del parametro de css [top]
let move_top = () =>{
    if (Mtop.y > 0 && Mtop.y <= 490){
        Mtop.y -= vel_human;
    }else{
        Mtop.y = Mtop.y;
    }
    p_human.style.top = Mtop.y +"px";
};
//Función para mover el paddle del humano hacia abajo cuando se presiona s.
//Para lo anterior se cambia la posición en el eje "y", a través del parametro de css [top]
let move_bottom = () =>{
    if(Mtop.y >= 0 && Mtop.y < 490){
        Mtop.y += vel_human;
    }else{
        Mtop.y = Mtop.y;
    }
    p_human.style.top = Mtop.y +"px";
};
//Función para el movimiento del paddle para el computador
let paddle_pc = () => {
    //Si me encuentro en la zona de juego y state_pc es false, el paddle debe bajar
    //Si sobrepasa la parte baja del campo state_pc es true y se empieza avanzar hacia arriba
    //Si estoy en la zona de juego y state_pc es true, el paddle va hacia arriba
    //Si sobrepasa la parte arriba del campo state_pc es false y se empieza avanzar hacia abajo
    if(Mtop_pc.y > 0 && Mtop_pc.y < 490 && state_pc == false){
        Mtop_pc.y += vel_human;
    }else if(Mtop_pc.y >= 490){
        state_pc = true;
        Mtop_pc.y -= vel_human;
    }else if(Mtop_pc.y > 0 && Mtop_pc.y < 490 && state_pc == true){
        Mtop_pc.y -= vel_human;
    }else if(Mtop_pc.y <= 0){
        state_pc = false;
        Mtop_pc.y += vel_human;
    }
    //Le decimos mediante estilos css que el paddle se debe mover de posición
    p_pc.style.top = Mtop_pc.y + "px";
}
//Función encargada de mover la pelota de acuerdo al estado en que se encuentre
//Estado 1: va a la derecha hacia abajo
//Estado 2: va a la izquierda hacia arriba
//Estado 3: va a la derecha hacia arriba
//Estado 4: va a la izquierda hacia abajo
let move_ball = () => {
    //checkStateBall() me permite actualizar y verficar el estado del balon
    checkStateBall();
    switch (state_ball) {
        case 1:
            Mball.x += vel_ball;
            Mball.y += vel_ball;
            break;
        case 2:
            Mball.x -= vel_ball;
            Mball.y -= vel_ball;
            break;
        case 3:
            Mball.x += vel_ball;
            Mball.y -= vel_ball;
            break;
        case 4:
            Mball.x -= vel_ball;
            Mball.y += vel_ball;
            break;
        default:
            break;
    }
    //Le decimos mediante estilos css que el balon se debe mover de posición tanto en "x" como en "y"
    ball.style.left = Mball.x +"px";
    ball.style.top = Mball.y +"px";
};
//Función para verificar y actualizar el estado del balon
let checkStateBall = () => {
    /*Cuando choca con el paddle del computador se cambia la direction_ball y el estado del balon
    Lo mismo pasa cuando choca con el paddle del humano*/
    if(collision_paddlePc()){
        direction_ball = 2;
        if(state_ball==1) state_ball = 3;
        if(state_ball==2) state_ball = 4;
        if(state_ball==3) state_ball = 2;
        if(state_ball==4) state_ball = 1;
    }else if(collision_paddleHuman()){
        direction_ball = 1;
        if(state_ball==1) state_ball = 3;
        if(state_ball==2) state_ball = 4;
        if(state_ball==3) state_ball = 2;
        if(state_ball==4) state_ball = 1;
    }
    /*Si la direction_ball es 1 entonces el balon va hacia la derecha (estados 1 y 3)
    Si la direction_ball es 2 entonces el balon va hacia la izquierda (estados 2 y 4)*/
    if(direction_ball == 1){
        if(Mball.y >= height) state_ball = 3;
        if(Mball.y <= 0) state_ball = 1;
    }else{
        if(Mball.y >= height) state_ball = 2;
        if(Mball.y <= 0) state_ball = 4;
    }
    //Esta función nos permite verificar si algunos de los jugadores ha perdido el juego
    collision_Lost();
};
//Función para indicarnos cuando la pelota a colisionado con el paddle del humano
//Retorna true si hay colisión, de lo contrario retorna false
let collision_paddleHuman = () => {
    if(Mball.x <= Mtop.x-60 && (Mball.y >= Mtop.y && Mball.y <= Mtop.y+150)){
        return true;
    }
    return false;
};
//Función para indicarnos cuando la pelota a colisionado con el paddle del computador
//Retorna true si hay colisión, de lo contrario retorna false
let collision_paddlePc = () => {
    if(Mball.x >= Mtop_pc.x-125 && (Mball.y >= Mtop_pc.y &&  Mball.y <= Mtop_pc.y+150)){
        return true;
    }
    return false;
};
//Función para verificar si alguno de los jugadores ha perdido el juego
//Aca simplemente indicamos quien gano y finalizamos el juego con la función stop
//En el momento queda pendiente la acumulación de los puntos y reiniciar el juego
let collision_Lost = () => {
    if(Mball.x >= width-10){
        alert("Punto obtenido por el humano");
        stop();
    }else if(Mball.x <= 1){
        alert("Punto obtenido por el computador");
        stop();
    }
    ball.style.left = 50 + "%";
    ball.style.top = 50 +"%";
};
/*Función encargada de detener o finalizar el juego, este se finaliza porque un 
jugador gano o porque se presiono la tecla "x"*/
let stop = () => {
    clearInterval(ctrl_paddle_pc);
    clearInterval(ctrl_ball);
    alert("Fin del juego");
};

//Obtenemos elementos del DOM como lo son el campo, el paddle de la persona y del computador, y el balon
let campo = document.getElementById("screen_game");
let p_human = document.getElementById("paddle_human");
let p_pc = document.getElementById("paddle_pc");
let ball = document.getElementById("ball");
//Indicamos la velocidad a la que se va a mover cada uno de los paddle
let vel_human = 10;
//Movimiento de la pelota (velocidad)
let vel_ball = 10;
//Obtenemos la posición (x,y) del paddle de la persona, del paddle del computador y del balon
let Mtop = p_human.getBoundingClientRect();
let Mtop_pc = p_pc.getBoundingClientRect();
let Mball = ball.getBoundingClientRect();
//Tiempo de ejecución la función encargada del movimiento del balón y del paddle
let time_paddlePc = 65;
let time_ball = 60;
//Se guarda el ancho y alto de la zona de juego
let width = document.getElementById("screen_game").clientWidth;
let height = document.getElementById("screen_game").clientHeight-40;
//Dirección movimiento de paddle_pc (false-> hacia abajo, true->hacia arriba) (automatico)
let state_pc = false;
//Estado del balon para saber en que dirección debe moverse - se declararon 4 estados.
let state_ball = 1;
//La dirección en que se mueve el balon (1-> hacia derecha, 2-> hacia la izquierda)
let direction_ball = 1;
//Controlador de movimiento de paddel_pc y del balon.
let ctrl_paddle_pc = setInterval(paddle_pc, time_paddlePc);
let ctrl_ball = setInterval(move_ball, time_ball);
//Llamamos a la función encargada de recibir los eventos generados a través del teclado.
teclado();