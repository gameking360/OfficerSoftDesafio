import { linkBase } from "./main.js"


//Base para realizar todas as requisições
//method padrão é GET e body null
export async function apiRequest(endpoint, method = "GET", body = null){

    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
    }

    const options = {method, headers}
    if(body) options.body = JSON.stringify(body)

    let response = await fetch(`${linkBase}${endpoint}`,options)
    

   if(response.status == 403){
        alert("Não autorizado")
        return
      }


    else if(!response.ok){
        alert(await response.text())
        return 
    }

    if(method == "DELETE") return await response.text()
    if(method == "PUT") return await response.text()

    return await response.json()


}