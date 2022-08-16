const $card = document.querySelector('#card')
if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('remove')){
            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf
            fetch('card/' + id, {
                method: 'delete',
                headers: {'X-XSRF-TOKEN': csrf}
            }).then(res => res.json())
                .then(card => {
                    if (card.courses.length){
                        const html = card.courses.map(e =>{
                            return ` <tr>
                                        <td>${e.title}</td>
                                        <td>${e.count}</td>
                                        <td>
                                            <button class="btn btn-small remove" data-id="${e.id}">delete</button></td>
                                    </tr>`
                            }).join('')
                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.price').textContent = card.price;
                    } else {
                        $card.innerHTML = '<p>epmty</p>'
                    }
                })
        }
    })
}

var instance = M.Tabs.init(document.querySelectorAll('.tabs'));