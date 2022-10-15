
const fetchData = {
    baseUrl: 'https://auth.nomoreparties.co',
    headers: {
      authorization: 'fe173521-ce0e-462c-827f-202e1a843a6d',
      'Content-Type': 'application/json'
    }
  }

function  getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`); 
    }
    return res.json();
  }  

export function auth(email, password) {
    
    return fetch(`${fetchData.baseUrl}/signup`, {
        method: 'POST',    
        headers: fetchData.headers,
        body: JSON.stringify({
            password: password,
            email: email
        })
        })
        .then(res => {
          return getResponseData(res);
        })
}

export function login(email, password) {

    return fetch(`${fetchData.baseUrl}/signin`, {
        method: 'POST',    
        headers: fetchData.headers,
        body: JSON.stringify({
            password: password,
            email: email
        })
        })
        .then(res => {
          return getResponseData(res);
        })
}

export function tokenCheck() {

    return fetch(`${fetchData.baseUrl}/users/me`, {
        method: 'GET',    
        headers: {
          authorization:  `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }})
        .then(res => {
          return getResponseData(res);
        })
}