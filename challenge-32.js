(function(win, doc, $) {
  'use strict';
  var app = (function() {
    var $tableCarrosBody = $('[data-js="tableCarrosBody"]').get();

    return {
      init: function() {
        //O this aqui representa o objeto que está sendo retornado, por isso é possível acessar o método loadCompany a partir dele
        this.loadCompany();
        this.initEvents();
        this.loadCars();
      },
      initEvents: function() {
        $('[data-js="formSubmit"]').on('submit', this.handleSubmit);
      },
      loadCars: function() {
        $tableCarrosBody.innerHTML = '';

        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'http://localhost:3000/car');
        ajax.send();

        ajax.onreadystatechange = function() {
          if (app.isReady.call(this)) {
            var parsedCars = JSON.parse(this.responseText);
            parsedCars.forEach(function(car) {
              $tableCarrosBody.appendChild(app.loadNewCar(car));
            });
          }
        }
      },
      loadNewCar: function(car) {
        var $fragment = doc.createDocumentFragment();
        var $tr = doc.createElement('tr');

        var $tdImg = doc.createElement('td');
        var $tdMarcaModelo = doc.createElement('td');
        var $tdAno = doc.createElement('td');
        var $tdPlaca = doc.createElement('td');
        var $tdCor = doc.createElement('td');
        var $tdBtnRemover = doc.createElement('td');

        $tdImg.appendChild(this.createImage(car.image));
        $tdMarcaModelo.textContent = car.brandModel;
        $tdAno.textContent = car.year;
        $tdPlaca.textContent = car.plate;
        $tdCor.textContent = car.color;
        $tdBtnRemover.appendChild(this.createBtnRemove());
        
        $tr.appendChild($tdImg);
        $tr.appendChild($tdMarcaModelo);
        $tr.appendChild($tdAno);
        $tr.appendChild($tdPlaca);
        $tr.appendChild($tdCor);
        $tr.appendChild($tdBtnRemover);

        return $fragment.appendChild($tr);
      },
      createPostString: function() {
        return `image=${this.getInputValue('formUrl')}&brandModel=${this.getInputValue('formMarcaModelo')}&year=${this.getInputValue('formAno')}&plate=${this.getInputValue('formPlaca')}&color=${this.getInputValue('formCor')}`;
      },
      handleSubmit: function(e) {
        e.preventDefault();

        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/car');
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajax.send(app.createPostString());
        ajax.addEventListener('readystatechange', app.handleAjaxPost, false);
      },
      handleAjaxPost: function() {
        if (app.isReady.call(this)) {
          console.log('Status POST:', this.responseText);
          app.loadCars();
        }
      },
      createBtnRemove: function() {
        var $btnRemove = doc.createElement('button');
        $btnRemove.type = 'button';
        $btnRemove.textContent = 'Remover';
        $btnRemove.addEventListener('click', this.handleBtnRemove, false);
        return $btnRemove;
      },
      handleBtnRemove: function() {
        var $trBtnNode = this.parentNode.parentNode;
        $tableCarrosBody.removeChild($trBtnNode);
      },
      getInputValue: function(element) {
        return $(`[data-js="${element}"]`).get().value;
      },
      createImage: function(url) {
        var $image = doc.createElement('img');
        $image.src = url;
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
