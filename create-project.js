// Funktion, um bei Über- oder Unterschreitung der Grenzwerte eines number-inputs
// automatisch den entsprechenden Grenzwert als Wert einzusetzen.
// Bsp: min=5, max=10; Eingegebener Wert: 42 -> 10 wird als neuer Wert des inputs genommen.
const setValue = (target) => {
    if (Number(target.value) < Number(target.min)) {
        target.value = target.min;
        return;
    }

    if (Number(target.value) > Number(target.max)) {
        target.value = target.max;
        return;
    }
};
