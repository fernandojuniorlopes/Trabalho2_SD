var index, listaLivros;
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
function tabelaLivros() {
    var obj, dbParam, xmlhttp, x, txt = "";
    obj = { table: "livros" };
    dbParam = JSON.stringify(obj);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            listaLivros = JSON.parse(this.responseText).livros;
            txt += "<table><thead><tr><td>Nome</td><td>Data de lançamento</td></tr></thead>"
            for (x in listaLivros) {
                txt += "<tr><td onClick=\"details(" + x + ")\">" + listaLivros[x].nome + "</td><td>" + listaLivros[x].dataLancamento + "</td></tr>";
            }
            txt += "</table>"
            document.getElementById("tab").innerHTML = txt;
        }
    };
    xmlhttp.open("GET", window.location.href + '/all', true);
    xmlhttp.setRequestHeader("x-access-token", getCookie('token'));
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("x=" + dbParam);
}
function details(i) {
    document.cookie = "nome=" + listaLivros[i].nome;
    document.cookie = "data=" + listaLivros[i].dataLancamento;
    document.cookie = "id=" + listaLivros[i].id;
    var url = window.location.href + '/livro';
    window.location.href = url;
    index = i;
}
function preenche() {
    document.getElementById("nome").innerHTML = getCookie('nome');
    document.getElementById("data").innerHTML = getCookie('data');
    console.log('id - ' + getCookie('id'));
}
function apagar() {
    var url = 'http://' + window.location.host + '/livros/' + getCookie('id');
    console.log('URL - ' + url);
    var obj, dbParam, xmlhttp;
    obj = { table: "livros" };
    dbParam = JSON.stringify(obj);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
    }
    xmlhttp.open("DELETE", url, true);
    xmlhttp.setRequestHeader("x-access-token", getCookie('token'));
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("x=" + dbParam);
    window.location.href = 'http://' + window.location.host + '/';
}