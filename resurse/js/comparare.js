const STORAGE_KEY = 'zona_echo_comparare';
const EXPIRY_KEY = 'zona_echo_comparare_last';
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 1 zi


function getList() {
    const last = localStorage.getItem(EXPIRY_KEY);
    if (last && Date.now() - parseInt(last) > EXPIRY_MS) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EXPIRY_KEY);
        return [];
    }
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveList(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    if (list.length > 0) {
        localStorage.setItem(EXPIRY_KEY, Date.now().toString());
    } else {
        localStorage.removeItem(EXPIRY_KEY);
        localStorage.removeItem(STORAGE_KEY);
    }
}

function updateButtons() {
    const list = getList();
    const full = list.length >= 2;
    document.querySelectorAll('.btn-comparare').forEach(btn => {
        const id = parseInt(btn.dataset.prodId);
        const inList = list.some(p => p.id === id);
        const wrapper = btn.closest('.wrapper-btn-comparare');
        if (full && !inList) {
            btn.disabled = true;
            if (wrapper) wrapper.title = 'Scoateți un produs din lista de comparare';
        } else {
            btn.disabled = false;
            if (wrapper) wrapper.removeAttribute('title');
        }
    });
}

function renderContainer() {
    const container = document.getElementById('container-comparare');
    const produseDiv = container.querySelector('.comparare-produse');
    const afisBtn = container.querySelector('.comparare-afiseaza');
    const tpl = document.getElementById('tpl-comparare-entry');

    const list = getList();

    if (list.length === 0) {
        container.style.display = 'none';
        document.body.classList.remove('has-comparare');
        updateButtons();
        return;
    }

    produseDiv.innerHTML = '';

    list.forEach(prod => {
        const entry = tpl.content.cloneNode(true);
        entry.querySelector('.comparare-name').textContent = prod.nume;
        entry.querySelector('.comparare-remove').addEventListener('click', () => {
            saveList(getList().filter(p => p.id !== prod.id));
            renderContainer();
        });
        produseDiv.appendChild(entry);
    });

    if (list.length === 2) {
        afisBtn.style.display = '';
        afisBtn.onclick = () => openComparison(list);
    } else {
        afisBtn.style.display = 'none';
    }

    container.style.display = '';
    document.body.classList.add('has-comparare');
    container.classList.remove('comparare-animate');
    //void container.offsetWidth;
    container.classList.add('comparare-animate');

    updateButtons();
}



function addToComparare(prodData) {
    const list = getList();
    if (list.some(p => p.id === prodData.id) || list.length >= 2) return;
    list.push(prodData);
    saveList(list);
    renderContainer();
}

function openComparison(list) {
    const [p1, p2] = list;
    window.open(`/comparare?id1=${p1.id}&id2=${p2.id}`, '_blank');
}



document.addEventListener('DOMContentLoaded', () => {
    const last = localStorage.getItem(EXPIRY_KEY);
    if (last && Date.now() - parseInt(last) > EXPIRY_MS) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EXPIRY_KEY);
    }

    document.querySelectorAll('.btn-comparare').forEach(btn => {
        btn.addEventListener('click', function () {
            addToComparare(JSON.parse(this.dataset.prod));
        });
    });

    renderContainer();
});
