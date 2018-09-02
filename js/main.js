/* global XMLHttpRequest */
(function (win, doc, $) {
  'use strict'
  const app = (function () {
    const $tableBodyCars = $('[data-js="tableBodyCars"]').get()
    const $form = $('[data-js="formSubmit"]')

    return {
      init: function () {
        this.loadCompany()
        this.initEvents()
        this.loadCars()
      },
      initEvents: function () {
        $form.on('submit', this.handleSubmit)
      },
      loadCars: function () {
        $tableBodyCars.innerHTML = ''
        const ajax = new XMLHttpRequest()
        ajax.open('GET', 'http://localhost:3000/car')
        ajax.send()
        ajax.onreadystatechange = function () {
          if (app.isReady.call(this)) {
            const parsedCars = JSON.parse(this.responseText)
            parsedCars.forEach(function (car) {
              $tableBodyCars.appendChild(app.loadNewCar(car))
            })
          }
        }
      },
      loadNewCar: function (car) {
        const $fragment = doc.createDocumentFragment()
        const $tr = doc.createElement('tr')

        const $tdImg = doc.createElement('td')
        const $tdBrandModel = doc.createElement('td')
        const $tdYear = doc.createElement('td')
        const $tdPlate = doc.createElement('td')
        const $tdColor = doc.createElement('td')
        const $tdBtnDelete = doc.createElement('td')

        $tdImg.classList.add('tdImg')
        $tdImg.appendChild(this.createImage(car.image))
        $tdBrandModel.textContent = car.brandModel
        $tdYear.textContent = car.year
        $tdPlate.textContent = car.plate
        $tdColor.textContent = car.color
        $tdBtnDelete.classList.add('tdBtn')
        $tdBtnDelete.appendChild(this.createBtnDelete())

        $tr.appendChild($tdImg)
        $tr.appendChild($tdBrandModel)
        $tr.appendChild($tdYear)
        $tr.appendChild($tdPlate)
        $tr.appendChild($tdColor)
        $tr.appendChild($tdBtnDelete)

        return $fragment.appendChild($tr)
      },
      createPostString: function () {
        return `image=${this.getInputValue('formUrl')}&brandModel=${this.getInputValue('formBrandModel')}&year=${this.getInputValue('formYear')}&plate=${this.getInputValue('formPlate')}&color=${this.getInputValue('formColor')}`
      },
      getInputValue: function (element) {
        return $(`[data-js="${element}"]`).get().value
      },
      handleSubmit: function (e) {
        e.preventDefault()

        const ajax = new XMLHttpRequest()
        ajax.open('POST', 'http://localhost:3000/car')
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        ajax.send(app.createPostString())
        ajax.addEventListener('readystatechange', app.handleAjax, false)
      },
      createBtnDelete: function () {
        const $btnDelete = doc.createElement('button')
        $btnDelete.type = 'button'
        $btnDelete.textContent = 'Delete'
        $btnDelete.classList.add('btnDelete')
        $btnDelete.addEventListener('click', this.handleBtnDelete, false)
        return $btnDelete
      },
      handleBtnDelete: function () {
        const ajax = new XMLHttpRequest()
        ajax.open('DELETE', 'http://localhost:3000/car')
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        ajax.send(`plate=${this.parentNode.parentNode.children[3].textContent}`)
        ajax.addEventListener('readystatechange', app.handleAjax, false)
      },
      handleAjax: function () {
        if (app.isReady.call(this)) {
          const response = JSON.parse(this.responseText)
          console.log(`Action ${response.action}:`, response.status)
          app.loadCars()
          app.resetFields()
        }
      },
      createImage: function (url) {
        const $image = doc.createElement('img')
        $image.src = url
        return $image
      },
      loadCompany: function () {
        const ajax = new XMLHttpRequest()
        ajax.open('GET', '../data/company.json', true)
        ajax.send()
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false)
      },
      getCompanyInfo: function () {
        if (app.isReady.call(this)) {
          const companyData = JSON.parse(this.responseText)
          const $companyName = $('[data-js="companyName"]').get()
          const $companyPhone = $('[data-js="companyPhone"]').get()
          $companyName.textContent = `${companyData.name} - `
          $companyPhone.textContent = companyData.phone
        }
      },
      isReady: function () {
        return this.status === 200 && this.readyState === 4
      },
      resetFields: function () {
        $form.get().reset()
      }
    }
  })()

  app.init()
})(window, document, window.DOM)
