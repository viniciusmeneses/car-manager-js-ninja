(function(win, doc, $) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */

  var app = (function() {
    return {
      init: function() {
        //O this aqui representa o objeto que está sendo retornado, por isso é possível acessar o método loadCompany a partir dele
        this.loadCompany();
        this.initEvents();
      },
      initEvents: function() {
        $('[data-js="formSubmit"]').on('submit', this.handleSubmit);
      },
      handleSubmit: function(e) {
        e.preventDefault();
        //this aqui vai referenciar o form
        var $tableCarros = $('[data-js="tableCarros"]').get();
        $tableCarros.appendChild(app.createNewCar());
      },
      createNewCar: function() {
        var $fragment = doc.createDocumentFragment();
        var $tr = doc.createElement('tr');

        var $tdImg = doc.createElement('td');
        var $tdMarcaModelo = doc.createElement('td');
        var $tdAno = doc.createElement('td');
        var $tdPlaca = doc.createElement('td');
        var $tdCor = doc.createElement('td');

        $tdImg.appendChild(this.createImage());
        $tdMarcaModelo.textContent = this.getInputValue('formMarcaModelo');
        $tdAno.textContent = this.getInputValue('formAno');
        $tdPlaca.textContent = this.getInputValue('formPlaca');
        $tdCor.textContent = this.getInputValue('formCor');
        
        $tr.appendChild($tdImg);
        $tr.appendChild($tdMarcaModelo);
        $tr.appendChild($tdAno);
        $tr.appendChild($tdPlaca);
        $tr.appendChild($tdCor);

        return $fragment.appendChild($tr);
      },
      getInputValue: function(element) {
        return $(`[data-js="${element}"]`).get().value;
      },
      createImage: function() {
        var $image = doc.createElement('img');
        $image.src = this.getInputValue('formUrl');
        return $image;
      },
      loadCompany: function() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', './company.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false)
      },
      getCompanyInfo: function() {
        //Quando um método é chamado a partir de um LISTENER, o this dentro dele vai referenciar o objeto que foi colocado o listener, neste caso, referencia o objeto "ajax"
        if (app.isReady.call(this)) {
          var companyData = JSON.parse(this.responseText);
          var $companyNome = $('[data-js="companyNome"]').get();
          var $companyTelefone = $('[data-js="companyTelefone"]').get();
          $companyNome.textContent = companyData.name;
          $companyTelefone.textContent = companyData.phone;
        }
      },
      isReady: function() {
        return this.status === 200 && this.readyState === 4;
      }
    }
  })();

  app.init();
})(window, document, window.DOM);
