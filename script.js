let currentTargetSide = 'your';

function openPopup(side, type) {
    currentTargetSide = side;
    const containerId = currentTargetSide === 'your' ? 'yourItems' : 'theirItems';
    const container = document.getElementById(containerId);
    
    if (container && container.children.length >= 5) {
        alert("Maximum limit reached! You can only put up to 5 items on the table.");
        return;
    }

    const modalId = (type === 'weapon') ? 'weaponModal' : 'sharkModal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closePopup() {
    const sharkModal = document.getElementById('sharkModal');
    const weaponModal = document.getElementById('weaponModal');
    if (sharkModal) sharkModal.style.display = 'none';
    if (weaponModal) weaponModal.style.display = 'none';
}

function confirmAddItem(baseValue, name, emoji, color, variantsAllowedStr = 'none', itemType = 'shark') {
    const containerId = currentTargetSide === 'your' ? 'yourItems' : 'theirItems';
    const container = document.getElementById(containerId);

    if (container && container.children.length >= 5) {
        alert("Maximum limit reached! You can only put up to 5 items on the table.");
        closePopup();
        return;
    }

    let variantOptions = '<option value="0">Normal</option>';
    if (variantsAllowedStr.includes('nightmare')) {
        variantOptions += '<option value="15">Nightmare</option>';
    }
    if (variantsAllowedStr.includes('crystal')) {
        variantOptions += '<option value="35">Crystal</option>';
    }

    let levelHtml = '';
    if (itemType === 'shark') {
        let levelOptions = '';
        for (let i = 1; i <= 30; i++) {
            levelOptions += `<option value="${i}">Level ${i}</option>`;
        }
        levelHtml = `<select class="level-select">${levelOptions}</select>`;
    }

    const newItem = document.createElement('div');
    newItem.className = 'item-group';
    newItem.setAttribute('data-base-value', baseValue);

    newItem.innerHTML = `
        <div class="item-info">
            <div class="item-img" style="background-color: ${color};">${emoji}</div>
            <span class="item-name" title="${name}">${name}</span>
        </div>
        <div class="item-actions">
            <select class="variant-select">
                ${variantOptions}
            </select>
            ${levelHtml}
            <button class="btn-remove" onclick="removeItem(this)">Remove</button>
        </div>
    `;

    if (container) {
        container.appendChild(newItem);
    }
    closePopup();
}

function removeItem(buttonElem) {
    const itemGroup = buttonElem.closest('.item-group');
    if (itemGroup) {
        itemGroup.remove();
    }
}

function calculateTrade() {
    const yourItems = document.querySelectorAll('#yourItems .item-group');
    const theirItems = document.querySelectorAll('#theirItems .item-group');

    let yourTotal = 0;
    let theirTotal = 0;

    yourItems.forEach(item => {
        const baseValue = parseFloat(item.getAttribute('data-base-value')) || 0;
        const variantSelect = item.querySelector('.variant-select');
        const variantBonus = variantSelect ? (parseFloat(variantSelect.value) || 0) : 0;
        const levelSelect = item.querySelector('.level-select');
        const level = levelSelect ? (parseFloat(levelSelect.value) || 1) : 0;
        const levelBonus = levelSelect ? (level * 2) : 0;
        yourTotal += (baseValue + variantBonus + levelBonus);
    });

    theirItems.forEach(item => {
        const baseValue = parseFloat(item.getAttribute('data-base-value')) || 0;
        const variantSelect = item.querySelector('.variant-select');
        const variantBonus = variantSelect ? (parseFloat(variantSelect.value) || 0) : 0;
        const levelSelect = item.querySelector('.level-select');
        const level = levelSelect ? (parseFloat(levelSelect.value) || 1) : 0;
        const levelBonus = levelSelect ? (level * 2) : 0;
        theirTotal += (baseValue + variantBonus + levelBonus);
    });

    const difference = Math.abs(yourTotal - theirTotal);
    const maxValue = Math.max(yourTotal, theirTotal);

    let equality = 100;
    if (maxValue > 0) {
        equality = Math.max(0, 100 - ((difference / maxValue) * 100)).toFixed(1);
    }

    let verdictMessage = "";
    if (yourTotal === 0 && theirTotal === 0) {
        verdictMessage = "Please add items to calculate!";
    } else if (yourTotal === theirTotal) {
        verdictMessage = "<span class='fair'>Fair Trade!</span> Both sides are equal in value.";
    } else if (theirTotal > yourTotal) {
        verdictMessage = `<span class='fair'>Win!</span> You get more value out of this trade.`;
    } else {
        verdictMessage = `<span class='unfair'>Loss!</span> They get more value out of this trade.`;
    }

    const fairnessElem = document.getElementById('fairnessPct');
    const verdictElem = document.getElementById('verdict');
    const resultsElem = document.getElementById('results');

    if (fairnessElem) fairnessElem.innerText = equality;
    if (verdictElem) verdictElem.innerHTML = verdictMessage;
    if (resultsElem) resultsElem.style.display = 'block';
}
