class ApiHandler {
    constructor() {
        this.baseUrl = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata'
        'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda=%27EUR%27&@dataCotacao=%2711-01-2024%27&$top=1&$format=json'
    }

    async getMoedas(url) {
        return fetch(`${this.baseUrl}/Moedas?$top=100&$format=json`).then(resp => resp.json()).then(result => result.value)
    }

    async getCotacaoMoeda(moeda, data) {
        console.log(moeda, data)
        console.log(`${this.baseUrl}/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${moeda}'&@dataCotacao='${data}'&$top=1&$format=json`)
        return fetch(`${this.baseUrl}/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${moeda}'&@dataCotacao='${data}'&$top=1&$format=json`).then(resp => resp.json()).then(result => result.value[0])
    }

}


const apiHandler = new ApiHandler()

export { apiHandler };